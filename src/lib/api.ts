import { CatalogClient } from '@nexusserg/api-client';

// Singleton — all services talk to API Gateway only.
// Set NEXT_PUBLIC_API_URL in .env.local for different environments.
export const apiClient = new CatalogClient({
  baseUrl: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000',
  timeout: 10_000,
});
