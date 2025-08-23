import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { Issue } from '../types';

interface BacklogQuery {
  projectId?: string;
  assigneeId?: string;
  dueThisWeek?: boolean;
}

export function useBacklog({ projectId, assigneeId, dueThisWeek }: BacklogQuery) {
  return useQuery<Issue[]>({
    queryKey: ['backlog', { projectId, assigneeId, dueThisWeek }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (projectId) params.append('projectId', projectId);
      if (assigneeId) params.append('assigneeId', assigneeId);
      if (dueThisWeek) params.append('dueThisWeek', 'true');
      const response = await api.get('/issues/backlog', { params });
      return response.data;
    },
  });
}
