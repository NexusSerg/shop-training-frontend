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
npm run dev        # → http://localhost:4000
```

## Phase 2 — Step-by-Step Implementation

Each step fills in the stubs scaffolded in this repo:

| Step | File(s) | Goal |
|------|---------|------|
| **2.1** ✅ | This scaffold | Next.js app + all stubs |
| **2.2** ✅ | `src/lib/api.ts` | API Client wiring (already done) |
| **2.3** ✅ | `app/(catalog)/search/`, `components/catalog/` | SSR search page + ProductGrid/Card |
| **2.4** ✅| `src/lib/queryBuilder.ts`, `hooks/useSearch.ts` | Full URL state sync |
| **2.5** ✅| `src/components/filters/` | All filter components |
| **2.6** ✅| `src/components/search/` | Debounced autocomplete |
| **2.7** ✅| `src/components/catalog/Pagination/` | Pagination + infinite scroll |
| **2.8** ✅| `src/components/catalog/QuickView/` | Quick view modal |
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

This app consumes @nexusserg/api-client from GitHub Packages.

1. Ensure .npmrc exists in the repo root:

```ini
@nexusserg:registry=https://npm.pkg.github.com
always-auth=true
//npm.pkg.github.com/:_authToken=${NEXUSSERG_PACKAGES_TOKEN}
```

2. Ensure dependency in package.json points to a published version:

```json
"@nexusserg/api-client": "^0.1.0"
```

3. Install with a token that has read:packages access:

```bash
export NEXUSSERG_PACKAGES_TOKEN=YOUR_GITHUB_TOKEN
npm install
```

### GitHub Actions CI

This repo includes [ci.yml](.github/workflows/ci.yml) to run install + build on push/PR.

Required repository secret:

1. `NEXUSSERG_PACKAGES_TOKEN`: GitHub token with `read:packages` (and repo read access if required by package visibility settings).

CI maps this secret to `NEXUSSERG_PACKAGES_TOKEN` during `npm ci` so npm can install @nexusserg scoped packages from GitHub Packages.
