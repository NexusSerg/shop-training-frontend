// TODO Step 2.3 / 2.10: product detail page with SSR, structured data
import type { Metadata } from 'next';
import { apiClient } from '@/lib/api';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await apiClient.getProduct(slug).catch(() => null);
  return {
    title: product?.name ?? 'Product',
    description: product?.description?.slice(0, 160) ?? '',
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await apiClient.getProduct(slug).catch(() => null);

  if (!product) {
    return <div className="container mx-auto px-4 py-6 text-gray-500">Product not found.</div>;
  }

  return (
    <main className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold">{product.name}</h1>
      <p className="text-gray-500 mt-1">{product.brand}</p>
      {/* TODO Step 2.3: fetch pricing from /api/v1/pricing/:id */}
      <p className="mt-4 text-sm text-gray-700">{product.description}</p>
      {/* TODO Step 2.3: full product detail layout */}
    </main>
  );
}
