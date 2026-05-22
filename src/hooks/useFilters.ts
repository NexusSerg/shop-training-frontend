'use client';
import { useSearchStateSync } from '@/hooks/useSearchStateSync';
import type { SearchFilters } from '@/lib/queryBuilder';

/**
 * Read/write filter state via URL.
 * Changing any filter resets pagination to page 1.
 */
export function useFilters() {
  const { state, updateFilters } = useSearchStateSync();

  function setFilters(partial: Partial<SearchFilters>) {
    updateFilters(partial);
  }

  function resetFilters() {
    updateFilters({
      brands: [],
      priceRange: null,
      rating: null,
      categoryPath: [],
      attributes: {},
      inStockOnly: false,
    });
  }

  return { filters: state.filters, setFilters, resetFilters };
}
