import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { GCPProject } from '../types';

export function useGCPProjects() {
  return useQuery<GCPProject[]>({
    queryKey: ['gcpProjects'],
    queryFn: async () => {
      const response = await api.get('/gcp/projects');
      return response.data;
    },
  });
}
