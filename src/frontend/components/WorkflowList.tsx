import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Workflow {
  _id: string;
  name: string;
  description: string;
}

const WorkflowList: React.FC = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkflows = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No authentication token found. Please log in.');
          setLoading(false);
          return;
        }

        const res = await axios.get('/api/workflows', {
          headers: { 'x-auth-token': token }
        });
        setWorkflows(res.data);
        setLoading(false);
      } catch (err: any) {
        console.error('Error fetching workflows:', err);
        if (err.response) {
          setError(`Error ${err.response.status}: ${err.response.data.msg || 'An error occurred while fetching workflows'}`);
        } else if (err.request) {
          setError('No response received from the server. Please try again.');
        } else {
          setError(`Error: ${err.message}`);
        }
        setLoading(false);
      }
    };

    fetchWorkflows();
  }, []);

  if (loading) {
    return <div>Loading workflows...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>My Workflows</h2>
      {workflows.length === 0 ? (
        <p>No workflows found. Create a new one!</p>
      ) : (
        <ul>
          {workflows.map((workflow) => (
            <li key={workflow._id}>
              <h3>{workflow.name}</h3>
              <p>{workflow.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default WorkflowList;