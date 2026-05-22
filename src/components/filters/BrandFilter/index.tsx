'use client';
import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import type { FacetBucket } from '@nexusserg/api-client';
import { useFilters } from '@/hooks/useFilters';

const INITIAL_VISIBLE = 8;

interface BrandFilterProps {
  brands: FacetBucket[];
}

export function BrandFilter({ brands }: BrandFilterProps) {
  const { filters, setFilters } = useFilters();
  const [search, setSearch] = useState('');
  const [showAll, setShowAll] = useState(false);

  const selectedBrands = new Set(filters.brands);

  const filtered = search
    ? brands.filter((b) => b.value.toLowerCase().includes(search.toLowerCase()))
    : brands;

  const visible = showAll ? filtered : filtered.slice(0, INITIAL_VISIBLE);
  const hasMore = filtered.length > INITIAL_VISIBLE;

  function toggle(brand: string) {
    const next = selectedBrands.has(brand)
      ? filters.brands.filter((b) => b !== brand)
      : [...filters.brands, brand];
    setFilters({ brands: next });
  }

  if (!brands.length) return null;

  return (
    <div>
      <h3 className="text-sm font-semibold mb-3">Brand</h3>

      {brands.length > INITIAL_VISIBLE && (
        <input
          type="text"
          placeholder="Search brands…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-sm border border-gray-200 rounded px-2 py-1 mb-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      )}

      <ul className="flex flex-col gap-2">
        {visible.map((b) => (
          <li key={b.value} className="flex items-center gap-2">
            <Checkbox
              id={`brand-${b.value}`}
              checked={selectedBrands.has(b.value)}
              onCheckedChange={() => toggle(b.value)}
            />
            <label htmlFor={`brand-${b.value}`} className="text-sm cursor-pointer leading-none">
              {b.value}
              <span className="text-gray-400 ml-1">({b.count})</span>
            </label>
          </li>
        ))}
      </ul>

      {hasMore && !search && (
        <button
          onClick={() => setShowAll((s) => !s)}
          className="mt-2 text-xs text-blue-600 hover:underline"
        >
          {showAll ? 'Show less' : `Show ${filtered.length - INITIAL_VISIBLE} more`}
        </button>
      )}
    </div>
  );
}
