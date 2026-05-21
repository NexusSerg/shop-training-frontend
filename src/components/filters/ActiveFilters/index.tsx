'use client';
// TODO Step 2.5: build active filter chips from URL state, clear individual or all
import { Badge } from '@/components/ui/badge';

export function ActiveFilters() {
  // TODO Step 2.5: read active filters from URL
  const activeFilters: { key: string; label: string }[] = [];
  if (!activeFilters.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {activeFilters.map((f) => (
        <Badge key={f.key} variant="secondary" className="cursor-pointer">
          {f.label} ×
        </Badge>
      ))}
      <button className="text-xs text-blue-600 hover:underline">Clear all</button>
    </div>
  );
}
