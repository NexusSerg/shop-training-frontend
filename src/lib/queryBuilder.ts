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

const VALID_SORTS = new Set<SortOption>([
  'relevance', 'price_asc', 'price_desc', 'rating', 'newest', 'popularity',
]);

const VALID_PER_PAGE = new Set<PerPage>([24, 48, 96]);

/**
 * Keys reserved by the search DSL — anything else is treated as an attribute filter.
 * URL format: /search?q=laptop&brands=apple,dell&price_min=500&price_max=2000
 *             &rating=4&category=electronics/laptops&sort=relevance
 *             &page=2&per_page=48&colors=silver,black
 */
const RESERVED_PARAMS = new Set([
  'q', 'sort', 'page', 'per_page',
  'brands', 'price_min', 'price_max',
  'rating', 'category', 'in_stock',
]);

/** Parse URLSearchParams → SearchState */
export function parseSearchParams(params: URLSearchParams): SearchState {
  const sortRaw = params.get('sort') ?? 'relevance';
  const sort: SortOption = VALID_SORTS.has(sortRaw as SortOption)
    ? (sortRaw as SortOption)
    : 'relevance';

  const perPageRaw = Number(params.get('per_page') ?? 24);
  const perPage: PerPage = VALID_PER_PAGE.has(perPageRaw as PerPage)
    ? (perPageRaw as PerPage)
    : 24;

  const pageRaw = parseInt(params.get('page') ?? '1', 10);
  const page = Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1;

  // brands=apple,dell  →  ['apple', 'dell']
  const brandsRaw = params.get('brands') ?? '';
  const brands = brandsRaw ? brandsRaw.split(',').map((s) => s.trim()).filter(Boolean) : [];

  // price_min + price_max  →  [min, max] | null
  const priceMinRaw = params.get('price_min');
  const priceMaxRaw = params.get('price_max');
  const priceMin = priceMinRaw !== null ? parseFloat(priceMinRaw) : null;
  const priceMax = priceMaxRaw !== null ? parseFloat(priceMaxRaw) : null;
  const priceRange: [number, number] | null =
    priceMin !== null && priceMax !== null && !isNaN(priceMin) && !isNaN(priceMax)
      ? [priceMin, priceMax]
      : null;

  // rating=4  →  4 | null
  const ratingRaw = params.get('rating');
  const rating = ratingRaw !== null ? parseFloat(ratingRaw) : null;

  // category=electronics/laptops  →  ['electronics', 'laptops']
  const categoryRaw = params.get('category') ?? '';
  const categoryPath = categoryRaw
    ? categoryRaw.split('/').map((s) => s.trim()).filter(Boolean)
    : [];

  // in_stock=true  →  true | false
  const inStockOnly = params.get('in_stock') === 'true';

  // All remaining (non-reserved) params are attribute filters
  // colors=silver,black  →  { colors: ['silver', 'black'] }
  const attributes: Record<string, string[]> = {};
  for (const [key, value] of params.entries()) {
    if (!RESERVED_PARAMS.has(key)) {
      attributes[key] = value.split(',').map((s) => s.trim()).filter(Boolean);
    }
  }

  return {
    query: params.get('q') ?? '',
    filters: { brands, priceRange, rating, categoryPath, attributes, inStockOnly },
    sort,
    page,
    perPage,
  };
}

/** SearchState → URLSearchParams */
export function buildSearchParams(state: SearchState): URLSearchParams {
  const p = new URLSearchParams();

  if (state.query) p.set('q', state.query);
  if (state.sort !== 'relevance') p.set('sort', state.sort);
  if (state.page > 1) p.set('page', String(state.page));
  if (state.perPage !== 24) p.set('per_page', String(state.perPage));

  const { brands, priceRange, rating, categoryPath, attributes, inStockOnly } = state.filters;

  if (brands.length) p.set('brands', brands.join(','));
  if (priceRange) {
    p.set('price_min', String(priceRange[0]));
    p.set('price_max', String(priceRange[1]));
  }
  if (rating !== null) p.set('rating', String(rating));
  if (categoryPath.length) p.set('category', categoryPath.join('/'));
  if (inStockOnly) p.set('in_stock', 'true');

  for (const [key, values] of Object.entries(attributes)) {
    if (values.length) p.set(key, values.join(','));
  }

  return p;
}
