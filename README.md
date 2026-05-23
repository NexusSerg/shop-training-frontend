# Shop Training Frontend

E-commerce product catalog frontend — Next.js App Router + TypeScript + Tailwind CSS.

## Tech Stack

| Layer | Library | Version |
|-------|---------|---------|
| Framework | Next.js (App Router) | 16.2.6 |
| UI | React | 19.2.4 |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 4.x |
| UI Primitives | shadcn/ui + Base UI React | — |
| Server state | TanStack Query | v5 |
| Client state | Zustand | v5 |
| Icons | Lucide React | — |
| API SDK | @nexusserg/api-client | ^0.1.1 |
| Node.js (CI) | — | 22 |

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | ≥ 20 (22 in CI) |
| npm | ≥ 10 |
| Backend running | `shop-training-backend` API Gateway on port 3000 |

## Quick Start

```bash
# 1. Install (requires NEXUSSERG_PACKAGES_TOKEN — see API Client section)
export NEXUSSERG_PACKAGES_TOKEN=YOUR_GITHUB_TOKEN
npm install

# 2. Configure environment
# Create .env.local with the variables listed in the "Environment Variables" section below

# 3. Start backend (in shop-training-backend repo)
docker compose -f infra/docker-compose.yml up -d
pnpm dev

# 4. Start frontend
npm run dev        # → http://localhost:4000
```

## Environment Variables

Create a `.env.local` file in the project root:

```ini
# URL of the API Gateway (all API calls route through this single host)
# Default fallback: http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000

# Canonical base URL used when building JSON-LD and canonical <link> tags
# Default fallback: http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:4000
```

Both variables are prefixed `NEXT_PUBLIC_` so they are embedded at build time and accessible in browser code.

## Architecture

### Core Principles

- **URL is single source of truth** — every search/filter/sort/pagination state change pushes a new browser history entry via `router.push`. Sharing a URL exactly reproduces the view.
- **Server Components by default** — pages that need SEO (`/products`, `/products/[slug]`, `/search`) are Server Components that fetch data on the server. Add `'use client'` only when interactivity or browser APIs are required.
- **Single API entry point** — all HTTP calls go through the `apiClient` singleton defined in [src/lib/api.ts](src/lib/api.ts). Never construct a `CatalogClient` directly in components.
- **TanStack Query for server state** — cached, deduplicated fetches; `staleTime: 10_000` by default. Zustand stores are used only for client-side preferences that are not part of the shareable URL.

### Rendering Strategy

| Route | Type | Reason |
|-------|------|--------|
| `/products` | Server Component | SEO — product listing |
| `/products/[slug]` | Server Component | SEO — product detail |
| `/search` | Server Component (shell) + `SearchResults` Client | SSR for initial HTML; interactivity handed to client |
| All filter/sort/pagination controls | `'use client'` | Require browser events and URL manipulation |

### State Management Layers

| Layer | Technology | Scope |
|-------|-----------|-------|
| Search query, filters, sort, pagination | URL search params | Shareable, bookmarkable, SSR-readable |
| Server data (products, facets, pricing) | TanStack Query | In-memory cache, auto-revalidated |
| Scroll mode preference | `localStorage` (key: `catalog:scrollMode`) | Persisted client preference |
| Zustand (`searchSlice`, `filterSlice`, `catalogSlice`) | In-memory | Auxiliary; URL/TanStack Query is authoritative |

### Search Data Flow

```
User interaction
      │
      ▼
useSearchStateSync.updateState(partial)
      │  router.push(pathname + "?" + buildSearchParams(next))
      ▼
URL search params  ←── single source of truth
      │  parseSearchParams(params) → SearchState
      ▼
useSearch / TanStack Query
      │  queryKey: ['search', state]
      ▼
apiClient.search(...)      ← src/lib/api.ts singleton
      │
      ▼
@nexusserg/api-client  →  NEXT_PUBLIC_API_URL (API Gateway)
```

### URL Parameter Reference

| Param | Type | Example | Notes |
|-------|------|---------|-------|
| `q` | string | `q=laptop` | Full-text query |
| `sort` | enum | `sort=price_asc` | `relevance` `price_asc` `price_desc` `rating` `newest` `popularity` |
| `page` | number | `page=2` | 1-based |
| `per_page` | 24\|48\|96 | `per_page=48` | |
| `brands` | csv | `brands=apple,dell` | Multi-select |
| `price_min` | number | `price_min=500` | |
| `price_max` | number | `price_max=2000` | |
| `rating` | number | `rating=4` | Minimum rating |
| `category` | path | `category=electronics/laptops` | `/`-delimited hierarchy |
| `in_stock` | `1` | `in_stock=1` | Boolean flag |
| `{attr}` | csv | `colors=silver,black` | Any unknown param treated as attribute filter |

`parseSearchParams` and `buildSearchParams` in [src/lib/queryBuilder.ts](src/lib/queryBuilder.ts) are the canonical serializers for this DSL.

## Project Structure

```
src/
├── app/
│   ├── (catalog)/
│   │   ├── products/page.tsx          # SSR: product listing (Server Component)
│   │   ├── products/[slug]/page.tsx   # SSR: product detail (Server Component)
│   │   └── search/
│   │       ├── page.tsx               # SSR shell — parses URL, fetches initial data
│   │       └── SearchResults.tsx      # 'use client' — owns all interactivity
│   ├── layout.tsx                     # Root layout + Providers wrapper
│   └── providers.tsx                  # TanStack QueryClient + ReactQueryDevtools
│
├── components/
│   ├── catalog/
│   │   ├── ProductGrid/               # Grid/list layout toggle
│   │   ├── ProductCard/               # Card with quick view trigger
│   │   ├── QuickView/                 # Dialog modal (partial — see Open TODOs)
│   │   ├── Pagination/                # Page numbers with ellipsis
│   │   ├── InfiniteScroll/            # IntersectionObserver sentinel
│   │   └── ProductsPerPage/           # 24/48/96 selector + localStorage pref
│   ├── search/
│   │   ├── SearchBar/                 # Debounced input + keyboard nav
│   │   ├── AutoComplete/              # Suggestions dropdown
│   │   └── SearchHistory/             # Recent searches (localStorage)
│   ├── filters/
│   │   ├── FilterPanel/               # Container — composes all filters
│   │   ├── PriceRangeSlider/          # Dual-handle price range
│   │   ├── BrandFilter/               # Multi-select with search
│   │   ├── RatingFilter/              # Min-rating radio buttons
│   │   ├── CategoryTree/              # Collapsible hierarchy
│   │   ├── AttributeFilter/           # Dynamic size/color/etc from facets
│   │   └── ActiveFilters/             # Active filter chips + clear all
│   ├── sorting/
│   │   └── SortSelect/                # Dropdown — writes &sort= to URL
│   └── ui/                            # shadcn/ui primitives (do not modify directly)
│
├── hooks/
│   ├── useSearchStateSync.ts          # Core hook: URL ↔ SearchState read/write
│   ├── useSearch.ts                   # useSearchStateSync + TanStack Query combined
│   ├── useFilters.ts                  # Filter-scoped wrapper around useSearchStateSync
│   ├── useAutoComplete.ts             # Debounced autocomplete query (150ms)
│   ├── useInfiniteScroll.ts           # IntersectionObserver logic
│   └── useSavedSearches.ts            # CRUD for saved search/filter combos
│
├── store/
│   ├── searchSlice.ts                 # Zustand: query string (auxiliary)
│   ├── filterSlice.ts                 # Zustand: filter state (auxiliary)
│   └── catalogSlice.ts                # Zustand: perPage + scrollMode preferences
│
└── lib/
    ├── api.ts                         # apiClient singleton (CatalogClient from @nexusserg/api-client)
    ├── queryBuilder.ts                # parseSearchParams / buildSearchParams / SearchState types
    ├── seoHelpers.ts                  # JSON-LD builders, canonical URL (partial — see Open TODOs)
    ├── searchAnalytics.ts             # Event tracking stubs (partial — see Open TODOs)
    └── utils.ts                       # Tailwind cn() helper
```

## Key Files Quick Reference

| Task | File |
|------|------|
| Change API base URL | [src/lib/api.ts](src/lib/api.ts) |
| Add/change a URL filter param | [src/lib/queryBuilder.ts](src/lib/queryBuilder.ts) — update `parseSearchParams`, `buildSearchParams`, `SearchState` |
| Add a new sort option | [src/lib/queryBuilder.ts](src/lib/queryBuilder.ts) `SortOption` + [src/components/sorting/SortSelect/index.tsx](src/components/sorting/SortSelect/index.tsx) `SORT_OPTIONS` |
| Add a new filter component | Create under `src/components/filters/`, wire into [src/components/filters/FilterPanel/index.tsx](src/components/filters/FilterPanel/index.tsx), extend `SearchFilters` in `queryBuilder.ts` |
| Modify SSR search page | [src/app/(catalog)/search/page.tsx](src/app/(catalog)/search/page.tsx) (Server Component) |
| Modify interactive search UI | [src/app/(catalog)/search/SearchResults.tsx](src/app/(catalog)/search/SearchResults.tsx) (Client Component) |
| Change product card layout | [src/components/catalog/ProductCard/index.tsx](src/components/catalog/ProductCard/index.tsx) |
| Change global metadata/layout | [src/app/layout.tsx](src/app/layout.tsx) |
| Change TanStack Query defaults | [src/app/providers.tsx](src/app/providers.tsx) |

## Implementation Status

| Step | Status | File(s) | Notes |
|------|--------|---------|-------|
| 2.1 Project scaffold | ✅ Done | whole repo | |
| 2.2 API client wiring | ✅ Done | `src/lib/api.ts` | |
| 2.3 SSR search + ProductGrid/Card | ✅ Done | `app/(catalog)/search/`, `components/catalog/` | |
| 2.4 URL state sync | ✅ Done | `src/lib/queryBuilder.ts`, `src/hooks/useSearchStateSync.ts` | |
| 2.5 Filter panel | ✅ Done | `src/components/filters/` | All filter components wired |
| 2.6 Debounced autocomplete | ✅ Done | `src/components/search/` | 150ms debounce, keyboard nav |
| 2.7 Pagination + infinite scroll | ✅ Done | `src/components/catalog/Pagination/`, `InfiniteScroll/` | Mode toggle + localStorage |
| 2.8 Quick view modal | ⚠️ Partial | `src/components/catalog/QuickView/index.tsx` | Dialog opens, product name/description shown; full detail layout and pricing display pending |
| 2.9 Sort dropdown | ⚠️ Partial | `src/components/sorting/SortSelect/index.tsx` | Component built; TODO comment remains but sort is already wired via URL in SearchResults |
| 2.10 SEO / JSON-LD / analytics | ⚠️ Partial | `src/lib/seoHelpers.ts`, `src/lib/searchAnalytics.ts` | `buildCanonicalUrl` works; JSON-LD builders and analytics tracking are stubs |

## Open TODOs

These are the remaining `// TODO Step X.Y:` markers that need implementation:

| File | Step | What to implement |
|------|------|-------------------|
| [src/components/catalog/QuickView/index.tsx](src/components/catalog/QuickView/index.tsx) | 2.8 | Full product detail layout inside the dialog (images, attributes, seller offers); fetch and display pricing via `apiClient.getPricing()`; sync `?quickview=id` into the URL |
| [src/lib/seoHelpers.ts](src/lib/seoHelpers.ts) | 2.10 | Implement `buildProductJsonLd` (Product schema) and `buildBreadcrumbJsonLd` (BreadcrumbList schema); inject `<script type="application/ld+json">` in product and search pages |
| [src/lib/searchAnalytics.ts](src/lib/searchAnalytics.ts) | 2.10 | Implement `trackSearch`, `trackFilterChange`, `trackProductClick` (send to analytics endpoint or data layer) |

## Coding Conventions

- **Path alias** — `@/*` maps to `./src/*`. Always use `@/` imports, never relative `../` across directories.
- **Component files** — `src/components/{domain}/ComponentName/index.tsx`. Named export matches the folder name.
- **`'use client'`** — first line of any component that uses hooks, browser APIs, or event handlers. Server Components have no directive.
- **Hooks** — `src/hooks/use{Name}.ts`. All hooks that touch the URL must use `useSearchStateSync` as their base — do not call `useRouter` / `useSearchParams` directly.
- **State updates** — filter changes always reset `page` to 1. Use `updateFilters()` from `useSearchStateSync`, not `updateState()`, to enforce this.
- **TODO comments** — step references belong only in `// TODO Step X.Y: description` comments for unfinished work. Remove them when the step is complete; do not convert to regular comments.
- **API calls** — always use the `apiClient` singleton from `src/lib/api.ts`. Never instantiate `CatalogClient` elsewhere.
- **`staleTime`** — default is `10_000` ms (set in `providers.tsx`). Override per-query when the data changes faster (e.g., pricing) or slower (e.g., autocomplete: `60_000`).

## API Client

This app consumes `@nexusserg/api-client` from GitHub Packages.

### Setup

1. Ensure `.npmrc` exists in the repo root:

```ini
@nexusserg:registry=https://npm.pkg.github.com
always-auth=true
//npm.pkg.github.com/:_authToken=${NEXUSSERG_PACKAGES_TOKEN}
```

2. Install with a token that has `read:packages` access:

```bash
export NEXUSSERG_PACKAGES_TOKEN=YOUR_GITHUB_TOKEN
npm install
```

### Key `CatalogClient` Methods

| Method | Used in |
|--------|---------|
| `search(params)` | `useSearch.ts`, `SearchResults.tsx`, `products/page.tsx` |
| `getProduct(slugOrId)` | `products/[slug]/page.tsx`, `QuickView/index.tsx` |
| `getPricing(slugOrId)` | `products/[slug]/page.tsx` |
| `getAutocomplete(q)` | `useAutoComplete.ts` |
| `getSavedSearches(userId)` | `useSavedSearches.ts` |
| `createSavedSearch(userId, payload)` | `useSavedSearches.ts` |
| `deleteSavedSearch(userId, id)` | `useSavedSearches.ts` |

`userId` is currently stubbed as `'dev-user'` in `useSavedSearches.ts` — authentication is out of scope.

### GitHub Actions CI

[.github/workflows/ci.yml](.github/workflows/ci.yml) runs `npm ci` + `npm run build` on every push/PR.

Required repository secret: `NEXUSSERG_PACKAGES_TOKEN` — a GitHub token with `read:packages` scope.
