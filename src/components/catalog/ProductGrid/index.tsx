'use client';
// TODO Step 2.3: add grid/list view toggle
import type { ProductSummary } from '@nexusserg/api-client';
import { ProductCard } from '@/components/catalog/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';

interface ProductGridProps {
  products: ProductSummary[];
  isLoading?: boolean;
  onQuickView?: (productId: string) => void;
}

export function ProductGrid({ products, isLoading, onQuickView }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-64 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} onQuickView={onQuickView} />
      ))}
    </div>
  );
}
