import { Sprint } from './sprint';

// Basic user representation
export interface User {
  id: string;
  name?: string | null;
  email: string;
}

// Basic project representation
export interface Project {
  id: string;
  name: string;
}

export interface Issue {
  id: string;
  title: string;
  description?: string | null;
  status: 'To Do' | 'In Progress' | 'In Review' | 'Done';
  priority: 'Low' | 'Medium' | 'High' | 'Highest';
  assigneeId?: string | null;
  sprintId?: string | null;
  projectId: string;
  createdById: string;
  dueDate?: Date | null;
  createdAt: Date;
  updatedAt: Date;

  // Relational fields
  createdBy?: User;
  assignee?: User | null;
  project?: Project;
  sprint?: Sprint | null;
}
