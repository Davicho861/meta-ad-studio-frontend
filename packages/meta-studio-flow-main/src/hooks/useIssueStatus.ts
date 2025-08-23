import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';

export function useIssueStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ issueId, status }: { issueId: string; status: string }) => {
      const response = await api.patch(`/issues/${issueId}/status`, { status });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issues'] });
    },
  });
}
