import React from 'react';
import ReactFlow from 'react-flow-renderer';

const WorkflowDesigner: React.FC = () => {
  const elements = [
    { id: '1', data: { label: 'Node 1' }, position: { x: 250, y: 5 } },
    { id: '2', data: { label: 'Node 2' }, position: { x: 100, y: 100 } },
    { id: 'e1-2', source: '1', target: '2', animated: true },
  ];

  return (
    <div style={{ height: '500px', width: '100%' }}>
      <ReactFlow elements={elements} />
    </div>
  );
};

export default WorkflowDesigner;