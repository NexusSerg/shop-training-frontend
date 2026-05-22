'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { LayoutList, GalleryVertical } from 'lucide-react';
import type { SearchResponse, ProductSummary } from '@nexusserg/api-client';
import type { SearchState } from '@/lib/queryBuilder';
import { apiClient } from '@/lib/api';
import { useSearchStateSync } from '@/hooks/useSearchStateSync';
import { ProductGrid } from '@/components/catalog/ProductGrid';
import { FilterPanel } from '@/components/filters/FilterPanel';
import { SortSelect } from '@/components/sorting/SortSelect';
import { Pagination } from '@/components/catalog/Pagination';
import { InfiniteScroll } from '@/components/catalog/InfiniteScroll';
import { ProductsPerPage, getPerPagePreference } from '@/components/catalog/ProductsPerPage';
import { SearchBar } from '@/components/search/SearchBar';
import { QuickView } from '@/components/catalog/QuickView';

const SCROLL_MODE_KEY = 'catalog:scrollMode';
type ScrollMode = 'pagination' | 'infinite';

interface SearchResultsProps {
  initialData: SearchResponse | null;
  /** Passed from the server component for TanStack Query hydration only. */
  initialState: SearchState;
}

export function SearchResults({ initialData }: SearchResultsProps) {
  // URL is single source of truth — all state changes push a new history entry
  const { state, updateState } = useSearchStateSync();
  const [quickViewId, setQuickViewId] = useState<string | null>(null);

  // ── Scroll mode preference (localStorage) ──────────────────────────────
  const [scrollMode, setScrollMode] = useState<ScrollMode>('pagination');

  useEffect(() => {
    const stored = (typeof window !== 'undefined' &&
      window.localStorage.getItem(SCROLL_MODE_KEY)) as ScrollMode | null;
    if (stored === 'infinite' || stored === 'pagination') setScrollMode(stored);

    // Apply persisted perPage preference on first load (only if URL has default)
    const pref = getPerPagePreference();
    if (pref && state.perPage !== pref) updateState({ perPage: pref, page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toggleScrollMode() {
    const next: ScrollMode = scrollMode === 'pagination' ? 'infinite' : 'pagination';
    setScrollMode(next);
    try { window.localStorage.setItem(SCROLL_MODE_KEY, next); } catch { /* ignore */ }
    // Reset accumulated state and go back to page 1 when switching modes
    setAccumulatedProducts([]);
    setInfinitePage(1);
    updateState({ page: 1 });
  }

  // ── Regular paginated query ─────────────────────────────────────────────
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

  // ── Infinite scroll accumulation ───────────────────────────────────────
  const [accumulatedProducts, setAccumulatedProducts] = useState<ProductSummary[]>(
    initialData?.products ?? [],
  );
  const [infinitePage, setInfinitePage] = useState(1);
  // Track the "stable" search key (query + filters + sort + perPage) so we can
  // detect when the search itself changes and reset the accumulation.
  const searchKeyRef = useRef('');
  const stableKey = JSON.stringify({
    q: state.query,
    f: state.filters,
    s: state.sort,
    pp: state.perPage,
  });

  useEffect(() => {
    if (scrollMode !== 'infinite') return;

    // If the search params changed, reset accumulation
    if (searchKeyRef.current && searchKeyRef.current !== stableKey) {
      setAccumulatedProducts([]);
      setInfinitePage(1);
      searchKeyRef.current = stableKey;
      return;
    }
    searchKeyRef.current = stableKey;

    if (data?.products) {
      if (infinitePage === 1) {
        // Fresh start
        setAccumulatedProducts(data.products);
      } else {
        // Append only when we're receiving a page we haven't appended yet
        setAccumulatedProducts((prev) => {
          const existingIds = new Set(prev.map((p) => p.id));
          const newItems = data.products.filter((p) => !existingIds.has(p.id));
          return newItems.length > 0 ? [...prev, ...newItems] : prev;
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, scrollMode, stableKey]);

  const loadMore = useCallback(() => {
    if (isFetching || !data || infinitePage >= totalPages) return;
    const next = infinitePage + 1;
    setInfinitePage(next);
    updateState({ page: next });
  }, [isFetching, data, infinitePage, totalPages, updateState]);

  // Displayed products depend on mode
  const displayedProducts =
    scrollMode === 'infinite' ? accumulatedProducts : (data?.products ?? []);

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
              {/* Scroll mode toggle */}
              <button
                onClick={toggleScrollMode}
                title={scrollMode === 'pagination' ? 'Switch to infinite scroll' : 'Switch to pagination'}
                className="flex items-center gap-1.5 px-2 py-1.5 text-xs border rounded hover:bg-gray-50 transition-colors"
              >
                {scrollMode === 'pagination' ? (
                  <><GalleryVertical size={14} /> Paginate</>
                ) : (
                  <><LayoutList size={14} /> Infinite</>
                )}
              </button>

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
            products={displayedProducts}
            isLoading={isFetching && displayedProducts.length === 0}
            onQuickView={setQuickViewId}
          />

          {scrollMode === 'pagination' ? (
            <Pagination
              page={state.page}
              totalPages={totalPages}
              onPageChange={(page) => updateState({ page })}
            />
          ) : (
            <InfiniteScroll
              onLoadMore={loadMore}
              hasMore={infinitePage < totalPages}
              isLoading={isFetching}
            />
          )}
        </div>
      </div>

      <QuickView productId={quickViewId} onClose={() => setQuickViewId(null)} />
    </div>
  );
}
