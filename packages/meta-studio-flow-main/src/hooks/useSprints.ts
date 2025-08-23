import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { Sprint } from '../types';

export function useSprints(projectId?: string) {
  return useQuery<Sprint[]>({
    queryKey: ['sprints', projectId],
    queryFn: async () => {
      const response = await api.get('/sprints', { params: { projectId } });
      return response.data;
    },
  });
}
