'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Star, ExternalLink } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api';

interface QuickViewProps {
  productId: string | null;
  onClose: () => void;
}

export function QuickView({ productId, onClose }: QuickViewProps) {
  const { data: product, isLoading: productLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => apiClient.getProduct(productId!),
    enabled: !!productId,
  });

  const { data: pricing, isLoading: pricingLoading } = useQuery({
    queryKey: ['pricing', productId],
    queryFn: () => apiClient.getPricing(productId!),
    enabled: !!productId,
    staleTime: 2_000,
  });

  const isLoading = productLoading || pricingLoading;
  const primaryImage = product?.images.find((i) => i.isPrimary) ?? product?.images[0] ?? null;
  const hasDiscount = pricing ? pricing.discountPercentage > 0 : false;

  return (
    <Dialog open={!!productId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isLoading ? <Skeleton className="h-6 w-48" /> : product?.name}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex gap-6">
            <Skeleton className="w-48 h-48 rounded-lg shrink-0" />
            <div className="flex flex-col gap-3 flex-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        ) : product ? (
          <div className="flex gap-6">
            {/* Image */}
            <div className="relative w-48 h-48 bg-gray-100 rounded-lg overflow-hidden shrink-0">
              {primaryImage ? (
                <Image
                  src={primaryImage.url}
                  alt={primaryImage.altText || product.name}
                  fill
                  sizes="192px"
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                  No image
                </div>
              )}
              {hasDiscount && pricing && (
                <Badge className="absolute top-2 left-2 bg-red-500 text-white text-xs">
                  -{pricing.discountPercentage}% OFF
                </Badge>
              )}
            </div>

            {/* Details */}
            <div className="flex flex-col gap-3 flex-1 min-w-0">
              <p className="text-xs text-gray-500">{product.brand}</p>

              {/* Pricing */}
              {pricingLoading ? (
                <Skeleton className="h-8 w-32" />
              ) : pricing ? (
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-2xl font-bold">${pricing.priceMin.toFixed(2)}</span>
                  {hasDiscount && (
                    <span className="text-sm text-gray-400 line-through">
                      ${pricing.originalPrice.toFixed(2)}
                    </span>
                  )}
                  <span className="text-xs text-gray-500">
                    from {pricing.sellerCount} seller{pricing.sellerCount !== 1 ? 's' : ''}
                  </span>
                </div>
              ) : (
                <p className="text-gray-400 text-sm">Price unavailable</p>
              )}

              {/* Rating placeholder — reviews out of scope */}
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={12} className="text-gray-300" />
                ))}
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 leading-relaxed line-clamp-4">
                {product.description}
              </p>

              {/* Key attributes */}
              {product.attributes.filter((a) => a.filterable || a.searchable).length > 0 && (
                <dl className="grid grid-cols-2 gap-x-4 gap-y-1 border-t pt-3">
                  {product.attributes
                    .filter((a) => a.filterable || a.searchable)
                    .slice(0, 6)
                    .map((attr) => (
                      <div key={attr.key} className="contents">
                        <dt className="text-xs text-gray-500">{attr.label}</dt>
                        <dd className="text-xs font-medium truncate">
                          {Array.isArray(attr.value) ? attr.value.join(', ') : String(attr.value)}
                        </dd>
                      </div>
                    ))}
                </dl>
              )}

              {/* Link to full product page */}
              <Link
                href={`/products/${product.slug}`}
                className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline mt-auto"
                onClick={onClose}
              >
                View full details <ExternalLink size={12} />
              </Link>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
