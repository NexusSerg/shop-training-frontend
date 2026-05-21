'use client';
// TODO Step 2.5: full filter state sync with URL
import { useFilterStore } from '@/store/filterSlice';

export function useFilters() {
  const { filters, setFilters, resetFilters } = useFilterStore();
  return { filters, setFilters, resetFilters };
}
