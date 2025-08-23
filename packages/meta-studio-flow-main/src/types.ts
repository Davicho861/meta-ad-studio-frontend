export interface Issue {
  id: string;
  title: string;
  description?: string;
  status: 'To Do' | 'In Progress' | 'In Review' | 'Done';
  priority: 'Low' | 'Medium' | 'High' | 'Highest';
  assigneeId?: string;
  sprintId?: string;
  projectId: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Sprint {
  id: string;
  name: string;
  startDate?: string;
  endDate?: string;
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

export interface GCPProject {
  projectId: string;
  name: string;
  lifecycleState: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

export interface Team {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface KanbanColumn {
  id: string;
  title: string;
  issues: Issue[];
}
