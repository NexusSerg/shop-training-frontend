'use client';
// TODO Step 2.6: keyboard navigation, recent searches, product name suggestions
import type { AutocompleteResponse } from '@nexusserg/api-client';

interface AutoCompleteProps {
  data: AutocompleteResponse | undefined;
  onSelect: (value: string) => void;
}

export function AutoComplete({ data, onSelect }: AutoCompleteProps) {
  if (!data?.suggestions.length) return null;
  return (
    <ul className="absolute z-50 bg-white border rounded-lg shadow-lg mt-1 w-full max-h-64 overflow-y-auto">
      {data.suggestions.map((s) => (
        <li key={s.text}>
          <button
            type="button"
            onClick={() => onSelect(s.text)}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
          >
            {s.text}
          </button>
        </li>
      ))}
    </ul>
  );
}
