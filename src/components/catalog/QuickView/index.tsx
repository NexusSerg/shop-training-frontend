'use client';
import { useQueries } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Package, Truck, ExternalLink } from 'lucide-react';
import type { Product, ProductPricing } from '@nexusserg/api-client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api';

interface QuickViewProps {
  productId: string | null;
  onClose: () => void;
}

function SkeletonContent() {
  return (
    <div className="flex gap-6 mt-2">
      <Skeleton className="w-64 h-64 rounded-lg shrink-0" />
      <div className="flex-1 flex flex-col gap-3">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-3/5" />
      </div>
    </div>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
        />
      ))}
      <span className="text-sm text-gray-500 ml-1">{rating.toFixed(1)}</span>
    </div>
  );
}

function StockBadge({ status }: { status: ProductPricing['bestOffer'] extends null | undefined ? never : NonNullable<ProductPricing['bestOffer']>['status'] }) {
  if (status === 'in_stock') {
    return <span className="text-green-600 font-medium flex items-center gap-1"><Package size={13} /> In Stock</span>;
  }
  if (status === 'low_stock') {
    return <span className="text-orange-500 font-medium flex items-center gap-1"><Package size={13} /> Low Stock</span>;
  }
  if (status === 'backorder') {
    return <span className="text-yellow-600 font-medium flex items-center gap-1"><Package size={13} /> Backorder</span>;
  }
  return <span className="text-red-500 font-medium flex items-center gap-1"><Package size={13} /> Out of Stock</span>;
}

export function QuickView({ productId, onClose }: QuickViewProps) {
  const [productQuery, pricingQuery] = useQueries({
    queries: [
      {
        queryKey: ['product', productId],
        queryFn: () => apiClient.getProduct(productId!),
        enabled: !!productId,
      },
      {
        queryKey: ['pricing', productId],
        queryFn: () => apiClient.getPricing(productId!),
        enabled: !!productId,
        retry: 1,
      },
    ],
  });

  const isLoading = productQuery.isLoading || pricingQuery.isLoading;
  const product = productQuery.data as Product | undefined;
  const pricing = pricingQuery.data as ProductPricing | undefined;

  const primaryImage = product?.images.find((i) => i.isPrimary) ?? product?.images[0] ?? null;
  const otherImages = product?.images.filter((i) => !i.isPrimary).slice(0, 3) ?? [];

  const displayPrice = pricing?.priceMin ?? null;
  const originalPrice = pricing?.originalPrice ?? null;
  const discount = pricing?.discountPercentage ?? 0;
  const currency = pricing?.currency ?? 'USD';
  const bestOffer = pricing?.bestOffer;
  const keyAttributes = product?.attributes.filter((a) => a.filterable).slice(0, 6) ?? [];

  return (
    <Dialog open={!!productId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl w-full">
        <DialogHeader>
          <DialogTitle className="sr-only">
            {isLoading ? 'Product quick view' : (product?.name ?? 'Product quick view')}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <SkeletonContent />
        ) : product ? (
          <div className="flex gap-6">
            {/* Image column */}
            <div className="flex flex-col gap-2 shrink-0 w-56">
              <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                {primaryImage ? (
                  <Image
                    src={primaryImage.url}
                    alt={primaryImage.altText}
                    fill
                    sizes="224px"
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                    No image
                  </div>
                )}
                {discount > 0 && (
                  <Badge className="absolute top-2 left-2 bg-red-500 text-white text-xs">
                    -{discount}%
                  </Badge>
                )}
              </div>
              {otherImages.length > 0 && (
                <div className="flex gap-1.5">
                  {otherImages.map((img, i) => (
                    <div
                      key={i}
                      className="relative w-16 h-16 rounded border overflow-hidden bg-gray-100"
                    >
                      <Image
                        src={img.url}
                        alt={img.altText}
                        fill
                        sizes="64px"
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Details column */}
            <div className="flex-1 flex flex-col gap-3 min-w-0">
              {/* Brand + category breadcrumb */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs text-gray-500">
                <span className="font-semibold text-gray-700">{product.brand}</span>
                {product.categoryPath.length > 0 && (
                  <>
                    <span>·</span>
                    <span>{product.categoryPath.join(' › ')}</span>
                  </>
                )}
              </div>

              {/* Product name */}
              <h2 className="text-base font-semibold leading-snug">{product.name}</h2>

              {/* Price */}
              {displayPrice !== null && (
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">
                    {currency === 'USD' ? '$' : currency}{displayPrice.toFixed(2)}
                  </span>
                  {originalPrice !== null && originalPrice > displayPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      {currency === 'USD' ? '$' : currency}{originalPrice.toFixed(2)}
                    </span>
                  )}
                  {discount > 0 && (
                    <span className="text-sm font-medium text-green-600">Save {discount}%</span>
                  )}
                </div>
              )}

              {/* Stock + delivery */}
              {bestOffer && (
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <StockBadge status={bestOffer.status} />
                  {bestOffer.deliveryDays !== null && (
                    <span className="text-gray-500 flex items-center gap-1">
                      <Truck size={13} /> Delivery in {bestOffer.deliveryDays}d
                    </span>
                  )}
                  {pricing && pricing.sellerCount > 1 && (
                    <span className="text-gray-400">
                      {pricing.sellerCount} sellers
                    </span>
                  )}
                </div>
              )}

              {/* Best seller name */}
              {bestOffer && (
                <p className="text-xs text-gray-500">
                  Sold by <span className="font-medium text-gray-700">{bestOffer.sellerName}</span>
                </p>
              )}

              {/* Description */}
              {product.description && (
                <p className="text-sm text-gray-600 line-clamp-3 border-t pt-3">
                  {product.description}
                </p>
              )}

              {/* Key attributes */}
              {keyAttributes.length > 0 && (
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs border-t pt-3">
                  {keyAttributes.map((attr) => (
                    <div key={attr.key} className="flex gap-1">
                      <span className="text-gray-500 shrink-0">{attr.label}:</span>
                      <span className="font-medium truncate">
                        {Array.isArray(attr.value) ? attr.value.join(', ') : String(attr.value)}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* View full details */}
              <div className="mt-auto pt-3 border-t">
                <Link
                  href={`/products/${product.slug}`}
                  className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:underline font-medium"
                  onClick={onClose}
                >
                  View full details <ExternalLink size={13} />
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500 py-8 text-center">Product not found.</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
