'use client';
import type { FacetBucket } from '@nexusserg/api-client';
import { useFilters } from '@/hooks/useFilters';

interface CategoryTreeProps {
  categories: FacetBucket[];
}

export function CategoryTree({ categories }: CategoryTreeProps) {
  const { filters, setFilters } = useFilters();
  const activePath = filters.categoryPath;

  function handleSelect(value: string) {
    // value is a slash-separated path like "electronics/phones"
    const next = value.split('/').filter(Boolean);
    // Toggle off if already selected
    const isSame =
      next.length === activePath.length &&
      next.every((seg, i) => seg === activePath[i]);
    setFilters({ categoryPath: isSame ? [] : next });
  }

  if (!categories.length) return null;

  return (
    <div>
      <h3 className="text-sm font-semibold mb-3">Category</h3>
      <ul className="flex flex-col gap-1">
        {categories.map((c) => {
          const segments = c.value.split('/').filter(Boolean);
          const isActive =
            activePath.length > 0 &&
            segments.every((seg, i) => seg === activePath[i]);
          const depth = segments.length - 1;

          return (
            <li key={c.value} style={{ paddingLeft: `${depth * 12}px` }}>
              <button
                onClick={() => handleSelect(c.value)}
                className={`text-sm text-left w-full py-0.5 hover:text-blue-600 transition-colors ${
                  isActive ? 'text-blue-600 font-medium' : 'text-gray-700'
                }`}
              >
                {segments[segments.length - 1]}
                <span className="text-gray-400 ml-1">({c.count})</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
