// TODO Step 2.4: implement full bidirectional URL ↔ SearchState sync

export interface SearchFilters {
  brands: string[];
  priceRange: [number, number] | null;
  rating: number | null;
  categoryPath: string[];
  attributes: Record<string, string[]>;
  inStockOnly: boolean;
}

export type SortOption =
  | 'relevance'
  | 'price_asc'
  | 'price_desc'
  | 'rating'
  | 'newest'
  | 'popularity';

export type PerPage = 24 | 48 | 96;

export interface SearchState {
  query: string;
  filters: SearchFilters;
  sort: SortOption;
  page: number;
  perPage: PerPage;
}

export const DEFAULT_SEARCH_STATE: SearchState = {
  query: '',
  filters: {
    brands: [],
    priceRange: null,
    rating: null,
    categoryPath: [],
    attributes: {},
    inStockOnly: false,
  },
  sort: 'relevance',
  page: 1,
  perPage: 24,
};

/** Parse URLSearchParams → SearchState */
export function parseSearchParams(params: URLSearchParams): SearchState {
  // TODO Step 2.4: full implementation
  return {
    ...DEFAULT_SEARCH_STATE,
    query: params.get('q') ?? '',
    sort: (params.get('sort') as SortOption) ?? 'relevance',
    page: Number(params.get('page') ?? 1),
    perPage: (Number(params.get('per_page') ?? 24) as PerPage),
  };
}

/** SearchState → URLSearchParams */
export function buildSearchParams(state: SearchState): URLSearchParams {
  // TODO Step 2.4: full implementation
  const p = new URLSearchParams();
  if (state.query) p.set('q', state.query);
  if (state.sort !== 'relevance') p.set('sort', state.sort);
  if (state.page > 1) p.set('page', String(state.page));
  if (state.perPage !== 24) p.set('per_page', String(state.perPage));
  return p;
}
