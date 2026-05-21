// TODO Step 2.10: implement JSON-LD builders, canonical URL helpers, OG tags

export function buildProductJsonLd(_product: unknown): string {
  // TODO Step 2.10
  return '';
}

export function buildBreadcrumbJsonLd(_path: string[]): string {
  // TODO Step 2.10
  return '';
}

export function buildCanonicalUrl(path: string, baseUrl?: string): string {
  const base = baseUrl ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  return `${base}${path}`;
}
