import { create } from 'zustand';
import type { PerPage } from '@/lib/queryBuilder';

interface CatalogSlice {
  perPage: PerPage;
  useInfiniteScroll: boolean;
  setPerPage: (n: PerPage) => void;
  toggleScrollMode: () => void;
}

export const useCatalogStore = create<CatalogSlice>((set) => ({
  perPage: 24,
  useInfiniteScroll: false,
  setPerPage: (perPage) => set({ perPage }),
  toggleScrollMode: () =>
    set((state) => ({ useInfiniteScroll: !state.useInfiniteScroll })),
}));
