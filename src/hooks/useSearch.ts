'use client';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { useSearchStateSync } from '@/hooks/useSearchStateSync';

export function useSearch() {
  const { state, updateState, updateFilters, resetPage } = useSearchStateSync();

  const query = useQuery({
    queryKey: ['search', state],
    queryFn: () =>
      apiClient.search({
        q: state.query,
        brands: state.filters.brands.length ? state.filters.brands : undefined,
        priceMin: state.filters.priceRange?.[0],
        priceMax: state.filters.priceRange?.[1],
        rating: state.filters.rating ?? undefined,
        categoryPath: state.filters.categoryPath.length
          ? state.filters.categoryPath
          : undefined,
        attributes: Object.keys(state.filters.attributes).length
          ? state.filters.attributes
          : undefined,
        inStockOnly: state.filters.inStockOnly || undefined,
        sort: state.sort,
        page: state.page,
        perPage: state.perPage,
      }),
    enabled: true,
    staleTime: 10_000,
  });

  return { state, updateState, updateFilters, resetPage, ...query };
}
