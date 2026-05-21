'use client';
// TODO Step 2.5: multi-select with search input and "show more" toggle, sync URL brands=
import { Checkbox } from '@/components/ui/checkbox';

interface BrandFilterProps {
  brands: { value: string; count: number }[];
}

export function BrandFilter({ brands }: BrandFilterProps) {
  return (
    <div>
      <h3 className="text-sm font-semibold mb-3">Brand</h3>
      <ul className="flex flex-col gap-2">
        {brands.slice(0, 8).map((b) => (
          <li key={b.value} className="flex items-center gap-2">
            <Checkbox id={`brand-${b.value}`} />
            <label htmlFor={`brand-${b.value}`} className="text-sm cursor-pointer">
              {b.value}
              <span className="text-gray-400 ml-1">({b.count})</span>
            </label>
          </li>
        ))}
      </ul>
      {/* TODO Step 2.5: show-more + search input */}
    </div>
  );
}
