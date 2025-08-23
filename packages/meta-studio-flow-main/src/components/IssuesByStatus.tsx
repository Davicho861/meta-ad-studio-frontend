import React from 'react';

const IssuesByStatus = () => {
  return (
    <div className="bg-white shadow rounded-lg p-4" data-testid="issues-by-status">
      <h3 className="text-lg font-semibold mb-2">Issues by Status</h3>
      <div data-testid="issues-to-do">To Do: 0</div>
      <div data-testid="issues-in-progress">In Progress: 0</div>
      <div data-testid="issues-in-review">In Review: 0</div>
      <div data-testid="issues-done">Done: 0</div>
    </div>
  );
};

export default IssuesByStatus;