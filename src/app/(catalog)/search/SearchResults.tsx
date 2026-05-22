'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { SearchResponse } from '@nexusserg/api-client';
import type { SearchState } from '@/lib/queryBuilder';
import { apiClient } from '@/lib/api';
import { useSearchStateSync } from '@/hooks/useSearchStateSync';
import { ProductGrid } from '@/components/catalog/ProductGrid';
import { FilterPanel } from '@/components/filters/FilterPanel';
import { SortSelect } from '@/components/sorting/SortSelect';
import { Pagination } from '@/components/catalog/Pagination';
import { ProductsPerPage } from '@/components/catalog/ProductsPerPage';
import { SearchBar } from '@/components/search/SearchBar';
import { QuickView } from '@/components/catalog/QuickView';

interface SearchResultsProps {
  initialData: SearchResponse | null;
  /** Passed from the server component for TanStack Query hydration only. */
  initialState: SearchState;
}

export function SearchResults({ initialData }: SearchResultsProps) {
  // URL is single source of truth — all state changes push a new history entry
  const { state, updateState } = useSearchStateSync();
  const [quickViewId, setQuickViewId] = useState<string | null>(null);

  const { data, isFetching } = useQuery({
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
    initialData: initialData ?? undefined,
    staleTime: 10_000,
  });

  const totalPages = data?.pagination.totalPages ?? 0;

  return (
    <div className="flex flex-col gap-6">
      <SearchBar />

      <div className="flex gap-8">
        {/* Sidebar filters */}
        <FilterPanel facets={data?.facets} />

        {/* Results area */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Toolbar */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {data ? `${data.pagination.total.toLocaleString()} results` : ''}
            </p>
            <div className="flex items-center gap-3">
              <SortSelect
                value={state.sort}
                onChange={(sort) => updateState({ sort, page: 1 })}
              />
              <ProductsPerPage
                value={state.perPage}
                onChange={(perPage) => updateState({ perPage, page: 1 })}
              />
            </div>
          </div>

          <ProductGrid
            products={data?.products ?? []}
            isLoading={isFetching && !data}
            onQuickView={setQuickViewId}
          />

          <Pagination
            page={state.page}
            totalPages={totalPages}
            onPageChange={(page) => updateState({ page })}
          />
        </div>
      </div>

      <QuickView productId={quickViewId} onClose={() => setQuickViewId(null)} />
    </div>
  );
}
