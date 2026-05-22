'use client';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@radix-ui/react-label';
import type { FacetBucket } from '@nexusserg/api-client';
import { useFilters } from '@/hooks/useFilters';

const OPTIONS = [4, 3, 2, 1];

interface RatingFilterProps {
  ratings?: FacetBucket[];
}

function StarDisplay({ count }: { count: number }) {
  return (
    <span aria-label={`${count} stars and up`}>
      {'★'.repeat(count)}
      <span className="text-gray-300">{'★'.repeat(5 - count)}</span>
    </span>
  );
}

export function RatingFilter({ ratings }: RatingFilterProps) {
  const { filters, setFilters } = useFilters();
  const selected = filters.rating ? String(filters.rating) : '';

  function handleChange(value: string) {
    const next = value === selected ? null : Number(value);
    setFilters({ rating: next });
  }

  function getCount(stars: number): number | undefined {
    return ratings?.find((r) => Number(r.value) === stars)?.count;
  }

  return (
    <div>
      <h3 className="text-sm font-semibold mb-3">Rating</h3>
      <RadioGroup value={selected} onValueChange={handleChange}>
        {OPTIONS.map((r) => {
          const count = getCount(r);
          return (
            <div key={r} className="flex items-center gap-2">
              <RadioGroupItem value={String(r)} id={`rating-${r}`} />
              <Label htmlFor={`rating-${r}`} className="text-sm cursor-pointer flex items-center gap-1">
                <StarDisplay count={r} />
                <span>&amp; up</span>
                {count !== undefined && (
                  <span className="text-gray-400">({count})</span>
                )}
              </Label>
            </div>
          );
        })}
      </RadioGroup>
    </div>
  );
}
