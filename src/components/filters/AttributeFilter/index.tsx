'use client';
import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import type { FacetBucket } from '@nexusserg/api-client';
import { useFilters } from '@/hooks/useFilters';

const INITIAL_VISIBLE = 6;

interface AttributeFilterProps {
  name: string;
  values: FacetBucket[];
}

export function AttributeFilter({ name, values }: AttributeFilterProps) {
  const { filters, setFilters } = useFilters();
  const [showAll, setShowAll] = useState(false);

  const selected = new Set(filters.attributes[name] ?? []);
  const visible = showAll ? values : values.slice(0, INITIAL_VISIBLE);
  const hasMore = values.length > INITIAL_VISIBLE;

  function toggle(value: string) {
    const next = selected.has(value)
      ? (filters.attributes[name] ?? []).filter((v) => v !== value)
      : [...(filters.attributes[name] ?? []), value];

    const updatedAttributes = { ...filters.attributes };
    if (next.length === 0) {
      delete updatedAttributes[name];
    } else {
      updatedAttributes[name] = next;
    }
    setFilters({ attributes: updatedAttributes });
  }

  return (
    <div>
      <h3 className="text-sm font-semibold mb-3 capitalize">{name}</h3>
      <ul className="flex flex-col gap-2">
        {visible.map((v) => (
          <li key={v.value} className="flex items-center gap-2">
            <Checkbox
              id={`attr-${name}-${v.value}`}
              checked={selected.has(v.value)}
              onCheckedChange={() => toggle(v.value)}
            />
            <label htmlFor={`attr-${name}-${v.value}`} className="text-sm cursor-pointer leading-none">
              {v.value}
              <span className="text-gray-400 ml-1">({v.count})</span>
            </label>
          </li>
        ))}
      </ul>

      {hasMore && (
        <button
          onClick={() => setShowAll((s) => !s)}
          className="mt-2 text-xs text-blue-600 hover:underline"
        >
          {showAll ? 'Show less' : `Show ${values.length - INITIAL_VISIBLE} more`}
        </button>
      )}
    </div>
  );
}
