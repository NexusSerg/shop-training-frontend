'use client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { PerPage } from '@/lib/queryBuilder';

interface ProductsPerPageProps {
  value: PerPage;
  onChange: (value: PerPage) => void;
}

const OPTIONS: PerPage[] = [24, 48, 96];
const LS_KEY = 'catalog:perPage';

/** Read the persisted preference; returns null when unavailable (SSR / no value). */
export function getPerPagePreference(): PerPage | null {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(LS_KEY);
  const n = Number(raw);
  return OPTIONS.includes(n as PerPage) ? (n as PerPage) : null;
}

export function ProductsPerPage({ value, onChange }: ProductsPerPageProps) {
  function handleChange(v: string | null) {
    if (!v) return;
    const next = Number(v) as PerPage;
    try {
      window.localStorage.setItem(LS_KEY, String(next));
    } catch {
      // Ignore storage errors (private browsing, quota, etc.)
    }
    onChange(next);
  }

  return (
    <Select value={String(value)} onValueChange={handleChange}>
      <SelectTrigger className="w-24">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {OPTIONS.map((n) => (
          <SelectItem key={n} value={String(n)}>
            {n} / page
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
