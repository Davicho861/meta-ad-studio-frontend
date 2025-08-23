import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { Issue } from '../types';

interface IssuesQuery {
  projectId?: string;
  sprintId?: string;
  assigneeId?: string;
  dueThisWeek?: boolean;
}

export function useIssues({ projectId, sprintId, assigneeId, dueThisWeek }: IssuesQuery) {
  return useQuery<Issue[]>({
    queryKey: ['issues', { projectId, sprintId, assigneeId, dueThisWeek }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (projectId) params.append('projectId', projectId);
      if (sprintId) params.append('sprintId', sprintId);
      if (assigneeId) params.append('assigneeId', assigneeId);
      if (dueThisWeek) params.append('dueThisWeek', 'true');
      const response = await api.get('/issues', { params });
      return response.data;
    },
  });
}
