'use client';
import { Badge } from '@/components/ui/badge';
import { useFilters } from '@/hooks/useFilters';

export function ActiveFilters() {
  const { filters, setFilters, resetFilters } = useFilters();

  type Chip = { key: string; label: string; onRemove: () => void };
  const chips: Chip[] = [];

  if (filters.priceRange) {
    chips.push({
      key: 'price',
      label: `$${filters.priceRange[0].toLocaleString()} – $${filters.priceRange[1].toLocaleString()}`,
      onRemove: () => setFilters({ priceRange: null }),
    });
  }

  filters.brands.forEach((brand) => {
    chips.push({
      key: `brand:${brand}`,
      label: brand,
      onRemove: () =>
        setFilters({ brands: filters.brands.filter((b) => b !== brand) }),
    });
  });

  if (filters.rating) {
    chips.push({
      key: 'rating',
      label: `${filters.rating}★ & up`,
      onRemove: () => setFilters({ rating: null }),
    });
  }

  if (filters.categoryPath.length) {
    chips.push({
      key: 'category',
      label: filters.categoryPath.join(' / '),
      onRemove: () => setFilters({ categoryPath: [] }),
    });
  }

  if (filters.inStockOnly) {
    chips.push({
      key: 'inStock',
      label: 'In stock only',
      onRemove: () => setFilters({ inStockOnly: false }),
    });
  }

  Object.entries(filters.attributes).forEach(([attr, values]) => {
    values.forEach((val) => {
      chips.push({
        key: `attr:${attr}:${val}`,
        label: `${attr}: ${val}`,
        onRemove: () => {
          const next = { ...filters.attributes };
          next[attr] = next[attr].filter((v) => v !== val);
          if (!next[attr].length) delete next[attr];
          setFilters({ attributes: next });
        },
      });
    });
  });

  if (!chips.length) return null;

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {chips.map((chip) => (
        <Badge
          key={chip.key}
          variant="secondary"
          className="cursor-pointer flex items-center gap-1 pr-1"
          onClick={chip.onRemove}
        >
          {chip.label}
          <span className="ml-1 text-gray-500 hover:text-gray-800" aria-hidden>×</span>
        </Badge>
      ))}
      <button
        onClick={resetFilters}
        className="text-xs text-blue-600 hover:underline ml-1"
      >
        Clear all
      </button>
    </div>
  );
}
