import { create } from 'zustand';
import type { SearchFilters } from '@/lib/queryBuilder';
import { DEFAULT_SEARCH_STATE } from '@/lib/queryBuilder';

interface FilterSlice {
  filters: SearchFilters;
  setFilters: (filters: Partial<SearchFilters>) => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterSlice>((set) => ({
  filters: DEFAULT_SEARCH_STATE.filters,
  setFilters: (partial) =>
    set((state) => ({ filters: { ...state.filters, ...partial } })),
  resetFilters: () => set({ filters: DEFAULT_SEARCH_STATE.filters }),
}));
