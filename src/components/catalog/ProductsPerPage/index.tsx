'use client';
// TODO Step 2.7: persist preference to localStorage
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { PerPage } from '@/lib/queryBuilder';

interface ProductsPerPageProps {
  value: PerPage;
  onChange: (value: PerPage) => void;
}

const OPTIONS: PerPage[] = [24, 48, 96];

export function ProductsPerPage({ value, onChange }: ProductsPerPageProps) {
  return (
    <Select value={String(value)} onValueChange={(v) => onChange(Number(v) as PerPage)}>
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
