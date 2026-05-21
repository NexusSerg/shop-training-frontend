// Step 2.3: SSR search page — Server Component
// Fetches initial results server-side for SEO; client components handle interactivity
import type { Metadata } from 'next';
import { apiClient } from '@/lib/api';
import { parseSearchParams } from '@/lib/queryBuilder';
import { SearchResults } from './SearchResults';

interface SearchPageProps {
  searchParams: Promise<Record<string, string>>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const params = new URLSearchParams(await searchParams);
  const q = params.get('q') ?? '';
  return {
    title: q ? `"${q}" — Search Results` : 'Search Products',
    description: `Browse products${q ? ` matching "${q}"` : ''} with advanced filtering and sorting.`,
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = new URLSearchParams(await searchParams);
  const state = parseSearchParams(params);

  // SSR: fetch initial results on the server
  const initialData = await apiClient
    .search({
      q: state.query,
      sort: state.sort,
      page: state.page,
      perPage: state.perPage,
    })
    .catch(() => null);

  return (
    <main className="container mx-auto px-4 py-6">
      <SearchResults initialData={initialData} initialState={state} />
    </main>
  );
}
