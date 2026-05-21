// SSR product listing page
import type { Metadata } from 'next';
import { apiClient } from '@/lib/api';
import { ProductGrid } from '@/components/catalog/ProductGrid';
import { SearchBar } from '@/components/search/SearchBar';

export const metadata: Metadata = {
  title: 'Products — Shop',
  description: 'Browse our full product catalog with advanced search and filtering.',
};

export default async function ProductsPage() {
  const data = await apiClient.search({ perPage: 24 }).catch(() => null);

  return (
    <main className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <SearchBar />
      </div>
      <h1 className="text-2xl font-bold mb-4">All Products</h1>
      {data && (
        <p className="text-sm text-gray-500 mb-4">
          {data.pagination.total.toLocaleString()} products
        </p>
      )}
      <ProductGrid products={data?.products ?? []} isLoading={!data} />
    </main>
  );
}
