import React from 'react';

const BacklogComponent: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold">Backlog</h1>
      <p>This is the backlog page. Tasks will be listed here with sorting and filtering options.</p>
      {/* Placeholder for task list */}
    </div>
  );
};

export const Backlog = BacklogComponent;
export default BacklogComponent;
