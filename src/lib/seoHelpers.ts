import type { Product, ProductPricing } from '@nexusserg/api-client';

export function buildProductJsonLd(product: Product, pricing?: ProductPricing | null): string {
  const primaryImage = product.images.find((i) => i.isPrimary) ?? product.images[0] ?? null;

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    ...(primaryImage ? { image: primaryImage.url } : {}),
  };

  if (pricing) {
    const availability =
      pricing.sellerCount > 0 && (pricing.bestOffer?.status === 'in_stock' || pricing.bestOffer?.status === 'low_stock')
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock';

    jsonLd.offers = {
      '@type': 'AggregateOffer',
      lowPrice: pricing.priceMin.toFixed(2),
      highPrice: pricing.priceMax.toFixed(2),
      priceCurrency: pricing.currency,
      offerCount: pricing.sellerCount,
      availability,
    };
  }

  return JSON.stringify(jsonLd);
}

export function buildBreadcrumbJsonLd(path: string[]): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

  const itemListElement = path.map((segment, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: segment,
    item: `${base}/search?category=${encodeURIComponent(path.slice(0, index + 1).join('/'))}`,
  }));

  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement,
  });
}

export function buildCanonicalUrl(path: string, baseUrl?: string): string {
  const base = baseUrl ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  return `${base}${path}`;
}
