'use client';
import { useState } from 'react';
import { LayoutGrid, List } from 'lucide-react';
import type { ProductSummary } from '@nexusserg/api-client';
import { ProductCard } from '@/components/catalog/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';

interface ProductGridProps {
  products: ProductSummary[];
  isLoading?: boolean;
  onQuickView?: (productId: string) => void;
}

export function ProductGrid({ products, isLoading, onQuickView }: ProductGridProps) {
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-64 rounded-lg" />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        No products found. Try adjusting your search or filters.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* View toggle */}
      <div className="flex justify-end gap-1">
        <button
          onClick={() => setLayout('grid')}
          aria-label="Grid view"
          className={`p-1.5 rounded ${layout === 'grid' ? 'bg-gray-200 text-gray-800' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <LayoutGrid size={18} />
        </button>
        <button
          onClick={() => setLayout('list')}
          aria-label="List view"
          className={`p-1.5 rounded ${layout === 'list' ? 'bg-gray-200 text-gray-800' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <List size={18} />
        </button>
      </div>

      {layout === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} layout="grid" onQuickView={onQuickView} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} layout="list" onQuickView={onQuickView} />
          ))}
        </div>
      )}
    </div>
  );
}
