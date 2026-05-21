'use client';
// TODO Step 2.5: mobile drawer (Sheet), desktop sidebar
import { PriceRangeSlider } from '@/components/filters/PriceRangeSlider';
import { BrandFilter } from '@/components/filters/BrandFilter';
import { RatingFilter } from '@/components/filters/RatingFilter';
import { CategoryTree } from '@/components/filters/CategoryTree';
import { ActiveFilters } from '@/components/filters/ActiveFilters';
import type { SearchResponse } from '@nexusserg/api-client';

interface FilterPanelProps {
  facets?: SearchResponse['facets'];
}

export function FilterPanel({ facets }: FilterPanelProps) {
  return (
    <aside className="flex flex-col gap-6 w-64 shrink-0">
      <ActiveFilters />
      <CategoryTree categories={facets?.categories ?? []} />
      <PriceRangeSlider />
      <BrandFilter brands={facets?.brands ?? []} />
      <RatingFilter />
    </aside>
  );
}
