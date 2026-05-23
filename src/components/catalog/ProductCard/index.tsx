'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';
import type { ProductSummary } from '@nexusserg/api-client';
import { Badge } from '@/components/ui/badge';
import { trackProductClick } from '@/lib/searchAnalytics';

interface ProductCardProps {
  product: ProductSummary;
  onQuickView?: (productId: string) => void;
  layout?: 'grid' | 'list';
  position?: number;
}

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={12}
          className={i < Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
        />
      ))}
      <span className="text-xs text-gray-500 ml-1">({count.toLocaleString()})</span>
    </div>
  );
}

export function ProductCard({ product, onQuickView, layout = 'grid', position = 0 }: ProductCardProps) {
  const hasDiscount = product.discountPercentage > 0;
  const imgSrc = product.primaryImage?.url ?? null;

  const imageEl = (
    <div className="relative bg-gray-100 rounded overflow-hidden shrink-0" style={{ aspectRatio: '1', minWidth: layout === 'list' ? 160 : undefined }}>
      {imgSrc ? (
        <Image
          src={imgSrc}
          alt={product.primaryImage?.altText ?? product.name}
          fill
          sizes={layout === 'list' ? '160px' : '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw'}
          className="object-cover"
          unoptimized
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No image</div>
      )}
      {hasDiscount && (
        <Badge className="absolute top-2 left-2 bg-red-500 text-white text-xs">
          -{product.discountPercentage}%
        </Badge>
      )}
    </div>
  );

  const infoEl = (
    <div className={`flex flex-col gap-1.5 ${layout === 'list' ? 'flex-1 py-1' : ''}`}>
      <p className="text-xs text-gray-500">{product.brand}</p>
      <Link
        href={`/products/${product.slug}`}
        className="font-medium text-sm line-clamp-2 hover:text-blue-600 transition-colors"
        onClick={() => trackProductClick(product.id, position)}
      >
        {product.name}
      </Link>
      <StarRating rating={product.ratingAvg} count={product.reviewCount} />
      <div className="flex items-baseline gap-2">
        <span className="font-bold text-base">${product.priceMin.toFixed(2)}</span>
        {hasDiscount && (
          <span className="text-xs text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
        )}
      </div>
      {!product.inStock && (
        <span className="text-xs text-red-500 font-medium">Out of stock</span>
      )}
      {onQuickView && (
        <button
          onClick={() => onQuickView(product.id)}
          className={`text-xs text-blue-600 hover:underline ${layout === 'grid' ? 'mt-auto' : ''}`}
        >
          Quick view
        </button>
      )}
    </div>
  );

  if (layout === 'list') {
    return (
      <div className="border rounded-lg p-3 flex gap-4 hover:shadow-sm transition-shadow">
        <div style={{ width: 160, height: 160 }} className="shrink-0">
          {imageEl}
        </div>
        {infoEl}
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-3 flex flex-col gap-2 hover:shadow-sm transition-shadow">
      {imageEl}
      {infoEl}
    </div>
  );
}
