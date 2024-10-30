import express from 'express';
import { json } from 'body-parser';
import cors from 'cors';
import authRoutes from './routes/auth';
import workflowRoutes from './routes/workflows';
import { prisma } from './lib/prisma';
import bcrypt from 'bcryptjs';

const app = express();

// Middleware
app.use(cors());
app.use(json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/workflows', workflowRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({ message: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 3000;

// Initialize the server
const startServer = async () => {
  try {
    // Create admin user if it doesn't exist
    const adminEmail = 'admin@flowforge.com';
    const adminPassword = 'adminPassword123!';

    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail }
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await prisma.user.create({
        data: {
          email: adminEmail,
          password: hashedPassword,
          isAdmin: true
        }
      });
      console.log('Admin user created successfully');
    }

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();