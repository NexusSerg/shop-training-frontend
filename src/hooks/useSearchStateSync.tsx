'use client';
import {
  useState,
  useCallback,
  useEffect,
  createContext,
  useContext,
  type ReactNode,
  type JSX,
} from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import {
  parseSearchParams,
  buildSearchParams,
  type SearchState,
  type SearchFilters,
} from '@/lib/queryBuilder';

interface SearchStateContextValue {
  state: SearchState;
  updateState: (partial: Partial<SearchState>) => void;
  updateFilters: (partial: Partial<SearchFilters>) => void;
  resetPage: () => void;
}

const SearchStateContext = createContext<SearchStateContextValue | null>(null);

/**
 * Single owner of the search state.
 *
 * Why a Provider instead of a plain hook with useState?
 * Every call to useSearchStateSync() used to create a separate React hook
 * instance with its own useState. Updating filters in BrandFilter's instance
 * never re-rendered SearchResults's instance, so useQuery never saw a new
 * queryKey. The fix: one Provider holds ONE useState; all consumers read the
 * same value from context and re-render together when it changes.
 *
 * router.push() still keeps the URL in sync for sharing and back/forward.
 * The useEffect re-syncs local state from the URL when the user navigates
 * with the browser back/forward buttons.
 */
export function SearchStateProvider({ children }: { children: ReactNode }): JSX.Element {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const [state, setState] = useState<SearchState>(() => parseSearchParams(params));

  // Re-sync from URL on back/forward navigation or direct link changes.
  const paramsString = params.toString();
  useEffect(() => {
    setState((current) => {
      // Skip re-render if the URL matches what we already have in state.
      if (buildSearchParams(current).toString() === paramsString) return current;
      return parseSearchParams(new URLSearchParams(paramsString));
    });
  }, [paramsString]);

  const updateState = useCallback(
    (partial: Partial<SearchState>) => {
      const next: SearchState = {
        ...state,
        ...partial,
        filters: partial.filters
          ? { ...state.filters, ...partial.filters }
          : state.filters,
      };
      // Immediate: all context consumers re-render before the URL settles.
      setState(next);
      router.push(`${pathname}?${buildSearchParams(next).toString()}`, { scroll: false });
    },
    [state, pathname, router],
  );

  const updateFilters = useCallback(
    (partial: Partial<SearchFilters>) => {
      updateState({ filters: { ...state.filters, ...partial }, page: 1 });
    },
    [updateState, state.filters],
  );

  const resetPage = useCallback(() => updateState({ page: 1 }), [updateState]);

  return (
    <SearchStateContext.Provider value={{ state, updateState, updateFilters, resetPage }}>
      {children}
    </SearchStateContext.Provider>
  );
}

/**
 * Read/write shared search state.
 * Must be called inside a <SearchStateProvider> in the component tree.
 */
export function useSearchStateSync() {
  const ctx = useContext(SearchStateContext);
  if (!ctx) throw new Error('useSearchStateSync must be used within <SearchStateProvider>');
  return ctx;
}
