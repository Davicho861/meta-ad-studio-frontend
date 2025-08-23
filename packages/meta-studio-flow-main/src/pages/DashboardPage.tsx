import { useState } from 'react';

export default function DashboardPage() {
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_TOKEN_HERE',
        },
        body: JSON.stringify({ name: projectName, description: projectDescription }),
      });

      if (response.ok) {
        alert('Project created successfully!');
      } else {
        alert('Failed to create project');
      }
    } catch (error) {
      console.error(error);
      alert('Failed to create project');
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Project Name:
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
        </label>
        <label>
          Project Description:
          <input
            type="text"
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
          />
        </label>
        <button type="submit">Create Project</button>
      </form>
    </div>
  );
}
