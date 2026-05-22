'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import type { CreateSavedSearchRequest } from '@nexusserg/api-client';

const USER_ID = 'dev-user'; // stub — auth is out of scope

export function useSavedSearches() {
  const qc = useQueryClient();

  const list = useQuery({
    queryKey: ['saved-searches'],
    queryFn: () => apiClient.getSavedSearches(USER_ID),
  });

  const save = useMutation({
    mutationFn: (payload: CreateSavedSearchRequest) =>
      apiClient.createSavedSearch(USER_ID, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['saved-searches'] }),
  });

  const remove = useMutation({
    mutationFn: (id: string) => apiClient.deleteSavedSearch(USER_ID, id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['saved-searches'] }),
  });

  return { list, save, remove };
}
