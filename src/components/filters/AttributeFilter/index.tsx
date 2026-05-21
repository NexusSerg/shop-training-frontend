'use client';
// TODO Step 2.5: dynamic attribute filter driven by facets response
import { Checkbox } from '@/components/ui/checkbox';

interface AttributeFilterProps {
  name: string;
  values: { value: string; count: number }[];
}

export function AttributeFilter({ name, values }: AttributeFilterProps) {
  return (
    <div>
      <h3 className="text-sm font-semibold mb-3 capitalize">{name}</h3>
      <ul className="flex flex-col gap-2">
        {values.map((v) => (
          <li key={v.value} className="flex items-center gap-2">
            <Checkbox id={`attr-${name}-${v.value}`} />
            <label htmlFor={`attr-${name}-${v.value}`} className="text-sm cursor-pointer">
              {v.value}
              <span className="text-gray-400 ml-1">({v.count})</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
