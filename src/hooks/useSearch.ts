'use client';
// TODO Step 2.3 / 2.4: implement search query management with URL sync
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { parseSearchParams } from '@/lib/queryBuilder';
import { useSearchParams } from 'next/navigation';

export function useSearch() {
  const params = useSearchParams();
  const state = parseSearchParams(params);

  const query = useQuery({
    queryKey: ['search', state],
    queryFn: () =>
      apiClient.search({
        q: state.query,
        sort: state.sort,
        page: state.page,
        perPage: state.perPage,
      }),
    enabled: true,
    staleTime: 10_000,
  });

  return { state, ...query };
}
