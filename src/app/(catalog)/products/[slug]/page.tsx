// SSR product detail page
import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Star } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { Badge } from '@/components/ui/badge';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await apiClient.getProduct(slug).catch(() => null);
  return {
    title: product?.metaTitle || product?.name || 'Product',
    description: product?.metaDescription || product?.description?.slice(0, 160) || '',
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const [product, pricing] = await Promise.all([
    apiClient.getProduct(slug).catch(() => null),
    apiClient.getPricing(slug).catch(() => null),
  ]);

  if (!product) notFound();

  const primaryImage = product.images.find((i) => i.isPrimary) ?? product.images[0] ?? null;
  const hasDiscount = pricing ? pricing.discountPercentage > 0 : false;

  return (
    <main className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Image */}
        <div className="relative w-full md:w-96 aspect-square bg-gray-100 rounded-lg overflow-hidden shrink-0">
          {primaryImage ? (
            <Image
              src={primaryImage.url}
              alt={primaryImage.altText || product.name}
              fill
              sizes="(max-width: 768px) 100vw, 384px"
              className="object-cover"
              priority
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
          )}
          {hasDiscount && pricing && (
            <Badge className="absolute top-3 left-3 bg-red-500 text-white">
              -{pricing.discountPercentage}% OFF
            </Badge>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">{product.brand}</p>
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <p className="text-xs text-gray-400 mt-1">SKU: {product.sku}</p>
          </div>

          {/* Pricing */}
          {pricing ? (
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold">${pricing.priceMin.toFixed(2)}</span>
              {hasDiscount && (
                <span className="text-lg text-gray-400 line-through">
                  ${pricing.originalPrice.toFixed(2)}
                </span>
              )}
              <span className="text-sm text-gray-500">
                from {pricing.sellerCount} seller{pricing.sellerCount !== 1 ? 's' : ''}
              </span>
            </div>
          ) : (
            <p className="text-gray-400 text-sm">Price unavailable</p>
          )}

          {/* Rating placeholder — reviews out of scope */}
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={14} className="text-gray-300" />
            ))}
          </div>

          {/* Category breadcrumb */}
          {product.categoryPath.length > 0 && (
            <p className="text-xs text-gray-500">{product.categoryPath.join(' › ')}</p>
          )}

          {/* Description */}
          <p className="text-sm text-gray-700 leading-relaxed max-w-xl">{product.description}</p>

          {/* Attributes */}
          {product.attributes.length > 0 && (
            <div className="border-t pt-4">
              <h2 className="text-sm font-semibold mb-2">Specifications</h2>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-1">
                {product.attributes
                  .filter((a) => a.searchable || a.filterable)
                  .map((attr) => (
                    <div key={attr.key} className="contents">
                      <dt className="text-xs text-gray-500">{attr.label}</dt>
                      <dd className="text-xs font-medium">
                        {Array.isArray(attr.value) ? attr.value.join(', ') : String(attr.value)}
                      </dd>
                    </div>
                  ))}
              </dl>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
