'use client';
import { PriceRangeSlider } from '@/components/filters/PriceRangeSlider';
import { BrandFilter } from '@/components/filters/BrandFilter';
import { RatingFilter } from '@/components/filters/RatingFilter';
import { CategoryTree } from '@/components/filters/CategoryTree';
import { AttributeFilter } from '@/components/filters/AttributeFilter';
import { ActiveFilters } from '@/components/filters/ActiveFilters';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { useFilters } from '@/hooks/useFilters';
import type { SearchResponse } from '@nexusserg/api-client';

interface FilterPanelProps {
  facets?: SearchResponse['facets'];
}

export function FilterPanel({ facets }: FilterPanelProps) {
  const { filters, setFilters } = useFilters();
  const attributeEntries = Object.entries(facets?.attributes ?? {});

  return (
    <aside className="flex flex-col gap-5 w-64 shrink-0">
      <ActiveFilters />

      <CategoryTree categories={facets?.categories ?? []} />

      {facets?.categories?.length ? <Separator /> : null}

      <PriceRangeSlider facet={facets?.priceRange} />

      <Separator />

      <BrandFilter brands={facets?.brands ?? []} />

      {facets?.brands?.length ? <Separator /> : null}

      <RatingFilter ratings={facets?.ratings} />

      <Separator />

      <div className="flex items-center gap-2">
        <Checkbox
          id="in-stock"
          checked={filters.inStockOnly}
          onCheckedChange={(checked) =>
            setFilters({ inStockOnly: checked === true })
          }
        />
        <label htmlFor="in-stock" className="text-sm cursor-pointer leading-none">
          In stock only
        </label>
      </div>

      {attributeEntries.map(([name, values]) =>
        values.length ? (
          <div key={name}>
            <Separator className="mb-5" />
            <AttributeFilter name={name} values={values} />
          </div>
        ) : null,
      )}
    </aside>
  );
}
