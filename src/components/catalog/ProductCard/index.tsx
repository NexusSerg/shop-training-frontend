'use client';
// TODO Step 2.3: render full product card with image, price, rating, quick-view trigger
import type { ProductSummary } from '@nexusserg/api-client';

interface ProductCardProps {
  product: ProductSummary;
  onQuickView?: (productId: string) => void;
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  return (
    <div className="border rounded-lg p-4 flex flex-col gap-2">
      <div className="bg-gray-100 h-48 rounded flex items-center justify-center text-gray-400 text-sm">
        image
      </div>
      <p className="font-medium text-sm line-clamp-2">{product.name}</p>
      <p className="text-xs text-gray-500">{product.brand}</p>
      <p className="font-bold">${product.priceMin.toFixed(2)}</p>
      {onQuickView && (
        <button
          onClick={() => onQuickView(product.id)}
          className="text-xs text-blue-600 hover:underline mt-auto"
        >
          Quick view
        </button>
      )}
    </div>
  );
}
