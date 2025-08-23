export interface Sprint {
  id: string;
  name: string;
  startDate?: Date | null;
  endDate?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  createdById: string;
  projectId: string;
}
