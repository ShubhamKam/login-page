import express from 'express';
import { body, validationResult } from 'express-validator';
import { auth, AuthRequest } from '../middleware/auth';
import { prisma } from '../lib/prisma';

const router = express.Router();

router.post(
  '/',
  [
    auth,
    body('name').notEmpty(),
    body('description').optional(),
    body('nodes').isArray(),
    body('edges').isArray(),
  ],
  async (req: AuthRequest, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, description, nodes, edges } = req.body;
      const workflow = await prisma.workflow.create({
        data: {
          name,
          description,
          nodes,
          edges,
          userId: req.user!.id,
        },
      });
      res.json(workflow);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  }
);

router.get('/', auth, async (req: AuthRequest, res) => {
  try {
    const workflows = await prisma.workflow.findMany({
      where: { userId: req.user!.id },
    });
    res.json(workflows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

router.get('/:id', auth, async (req: AuthRequest, res) => {
  try {
    const workflow = await prisma.workflow.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.id,
      },
    });
    if (!workflow) {
      return res.status(404).json({ msg: 'Workflow not found' });
    }
    res.json(workflow);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

router.put(
  '/:id',
  [
    auth,
    body('name').optional(),
    body('description').optional(),
    body('nodes').optional().isArray(),
    body('edges').optional().isArray(),
  ],
  async (req: AuthRequest, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, description, nodes, edges } = req.body;
      const workflow = await prisma.workflow.findFirst({
        where: {
          id: req.params.id,
          userId: req.user!.id,
        },
      });

      if (!workflow) {
        return res.status(404).json({ msg: 'Workflow not found' });
      }

      const updatedWorkflow = await prisma.workflow.update({
        where: { id: req.params.id },
        data: {
          name: name || workflow.name,
          description: description || workflow.description,
          nodes: nodes || workflow.nodes,
          edges: edges || workflow.edges,
          version: { increment: 1 },
        },
      });

      res.json(updatedWorkflow);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  }
);

router.delete('/:id', auth, async (req: AuthRequest, res) => {
  try {
    const workflow = await prisma.workflow.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.id,
      },
    });

    if (!workflow) {
      return res.status(404).json({ msg: 'Workflow not found' });
    }

    await prisma.workflow.delete({
      where: { id: req.params.id },
    });

    res.json({ msg: 'Workflow removed' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

export default router;