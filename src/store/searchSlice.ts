import { create } from 'zustand';

interface SearchSlice {
  query: string;
  setQuery: (q: string) => void;
}

export const useSearchStore = create<SearchSlice>((set) => ({
  query: '',
  setQuery: (query) => set({ query }),
}));
