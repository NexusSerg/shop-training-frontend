'use client';
import { useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import {
  parseSearchParams,
  buildSearchParams,
  type SearchState,
  type SearchFilters,
} from '@/lib/queryBuilder';

/**
 * Step 2.4 — URL is single source of truth for search state.
 *
 * Reading: URL params are parsed into SearchState on every render.
 * Writing: state updates are pushed as a new history entry so that
 *          browser back/forward and link sharing work out of the box.
 *
 * Usage:
 *   const { state, updateState, updateFilters, resetPage } = useSearchStateSync();
 */
export function useSearchStateSync() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  // URL is single source of truth — parse on every render
  const state = parseSearchParams(params);

  /** Push a shallow-merged SearchState update to the URL. */
  const updateState = useCallback(
    (partial: Partial<SearchState>) => {
      const next: SearchState = {
        ...state,
        ...partial,
        // Deep-merge filters if provided
        filters: partial.filters
          ? { ...state.filters, ...partial.filters }
          : state.filters,
      };
      const newParams = buildSearchParams(next);
      router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [params.toString(), pathname, router],
  );

  /** Convenience: update only the filters sub-object and reset to page 1. */
  const updateFilters = useCallback(
    (partial: Partial<SearchFilters>) => {
      updateState({ filters: { ...state.filters, ...partial }, page: 1 });
    },
    [updateState, state.filters],
  );

  /** Reset pagination to page 1 (used after query/sort changes). */
  const resetPage = useCallback(() => updateState({ page: 1 }), [updateState]);

  return { state, updateState, updateFilters, resetPage };
}
