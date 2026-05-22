'use client';
import { Slider } from '@/components/ui/slider';
import { useState, useEffect, useRef } from 'react';
import type { PriceRangeFacet } from '@nexusserg/api-client';
import { useFilters } from '@/hooks/useFilters';

interface PriceRangeSliderProps {
  facet?: PriceRangeFacet;
}

const DEBOUNCE_MS = 400;

export function PriceRangeSlider({ facet }: PriceRangeSliderProps) {
  const { filters, setFilters } = useFilters();

  const globalMin = facet?.min ?? 0;
  const globalMax = facet?.max ?? 5000;

  // Local display state — committed to URL after debounce
  const [range, setRange] = useState<[number, number]>([
    filters.priceRange?.[0] ?? globalMin,
    filters.priceRange?.[1] ?? globalMax,
  ]);

  // Sync local state when URL changes externally (e.g. clear-all)
  useEffect(() => {
    setRange([
      filters.priceRange?.[0] ?? globalMin,
      filters.priceRange?.[1] ?? globalMax,
    ]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.priceRange?.[0], filters.priceRange?.[1], globalMin, globalMax]);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleChange(val: number | readonly number[]) {
    const arr = Array.isArray(val) ? (val as readonly number[]) : [val as number, val as number];
    const next: [number, number] = [arr[0], arr[1]];
    setRange(next);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      // Only write to URL if range differs from full span
      const isFullRange = next[0] === globalMin && next[1] === globalMax;
      setFilters({ priceRange: isFullRange ? null : next });
    }, DEBOUNCE_MS);
  }

  return (
    <div>
      <h3 className="text-sm font-semibold mb-3">Price</h3>
      <Slider
        min={globalMin}
        max={globalMax}
        step={10}
        value={range}
        onValueChange={handleChange}
        className="mb-3"
      />
      <div className="flex justify-between text-xs text-gray-500">
        <span>${range[0].toLocaleString()}</span>
        <span>${range[1].toLocaleString()}</span>
      </div>
    </div>
  );
}
