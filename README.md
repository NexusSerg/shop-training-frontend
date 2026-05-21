# Shop Training Frontend

E-commerce product catalog frontend — Next.js 14 App Router + TypeScript + Tailwind CSS.

## Architecture

- **SSR** (Server Components) — search page, product detail, product listing → SEO critical
- **CSR** (Client Components) — filters, autocomplete, infinite scroll, quick view → interactive
- **Single API entry point** — all HTTP calls go through `NEXT_PUBLIC_API_URL` (the API Gateway)
- **URL is source of truth** — all search/filter/sort/pagination state lives in the URL

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | ≥ 20 |
| npm | ≥ 10 |
| Backend running | `shop-training-backend` on port 3000 |

## Quick Start

```bash
# 1. Install
npm install

# 2. Copy env
cp .env.local.example .env.local   # or edit .env.local directly

# 3. Start backend (in shop-training-backend)
docker compose -f infra/docker-compose.yml up -d
pnpm dev

# 4. Start frontend
npm run dev        # → http://localhost:3001
```

## Phase 2 — Step-by-Step Implementation

Each step fills in the stubs scaffolded in this repo:

| Step | File(s) | Goal |
|------|---------|------|
| **2.1** ✅ | This scaffold | Next.js app + all stubs |
| **2.2** | `src/lib/api.ts` | API Client wiring (already done) |
| **2.3** | `app/(catalog)/search/`, `components/catalog/` | SSR search page + ProductGrid/Card |
| **2.4** | `src/lib/queryBuilder.ts`, `hooks/useSearch.ts` | Full URL state sync |
| **2.5** | `src/components/filters/` | All filter components |
| **2.6** | `src/components/search/` | Debounced autocomplete |
| **2.7** | `src/components/catalog/Pagination/` | Pagination + infinite scroll |
| **2.8** | `src/components/catalog/QuickView/` | Quick view modal |
| **2.9** | `src/components/sorting/SortSelect/` | Sort dropdown → URL |
| **2.10** | `src/lib/seoHelpers.ts`, page metadata | JSON-LD, robots, OG tags |

## Project Structure

```
src/
├── app/
│   ├── (catalog)/
│   │   ├── products/page.tsx          # SSR: product listing
│   │   ├── products/[slug]/page.tsx   # SSR: product detail
│   │   └── search/page.tsx            # SSR: search results
│   ├── layout.tsx                     # root layout + Providers
│   └── providers.tsx                  # QueryClient + Zustand
│
├── components/
│   ├── catalog/   ProductGrid, ProductCard, QuickView, Pagination, ProductsPerPage
│   ├── search/    SearchBar, AutoComplete, SearchHistory
│   ├── filters/   FilterPanel, PriceRangeSlider, BrandFilter, RatingFilter,
│   │              CategoryTree, AttributeFilter, ActiveFilters
│   ├── sorting/   SortSelect
│   └── ui/        shadcn/ui primitives
│
├── hooks/         useSearch, useFilters, useInfiniteScroll, useAutoComplete, useSavedSearches
├── store/         searchSlice, filterSlice, catalogSlice  (Zustand)
└── lib/           api.ts, queryBuilder.ts, seoHelpers.ts, searchAnalytics.ts
```

## API Client

The `@nexusserg/api-client` package is linked locally from `../shop-training-backend/packages/api-client`.
Once the backend publishes `api-client/v0.1.0` to GitHub Packages, update `package.json`:

```json
"@nexusserg/api-client": "^0.1.0"
```

And add to `.npmrc`:
```
@nexusserg:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
```
