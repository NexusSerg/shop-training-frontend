declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

function push(event: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(event);
}

export function trackSearch(query: string, resultCount: number): void {
  push({ event: 'search', search_term: query, result_count: resultCount });
}

export function trackFilterChange(filterKey: string, value: unknown): void {
  push({ event: 'filter_change', filter_key: filterKey, filter_value: value });
}

export function trackProductClick(productId: string, position: number): void {
  push({ event: 'product_click', product_id: productId, position });
}
