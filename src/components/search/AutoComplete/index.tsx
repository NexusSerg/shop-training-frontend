'use client';
import type { Suggestion } from '@nexusserg/api-client';

const TYPE_LABEL: Record<Suggestion['type'], string> = {
  query: '',
  product: 'Product',
  brand: 'Brand',
  category: 'Category',
};

const TYPE_ICON: Record<Suggestion['type'], string> = {
  query: '🔍',
  product: '📦',
  brand: '🏷️',
  category: '📂',
};

interface AutoCompleteProps {
  suggestions: Suggestion[];
  activeIndex: number;
  idPrefix: string;
  onSelect: (text: string) => void;
  onActiveChange: (index: number) => void;
}

export function AutoComplete({
  suggestions,
  activeIndex,
  idPrefix,
  onSelect,
  onActiveChange,
}: AutoCompleteProps) {
  if (!suggestions.length) return null;

  return (
    <>
      {suggestions.map((s, i) => (
        <div
          key={`${s.type}-${s.text}`}
          id={`${idPrefix}-${i}`}
          role="option"
          aria-selected={i === activeIndex}
          onMouseEnter={() => onActiveChange(i)}
          onMouseLeave={() => onActiveChange(-1)}
        >
          <button
            type="button"
            onClick={() => onSelect(s.text)}
            className={`w-full text-left flex items-center gap-2 px-4 py-2 text-sm transition-colors ${
              i === activeIndex ? 'bg-blue-50' : 'hover:bg-gray-50'
            }`}
          >
            <span aria-hidden="true" className="text-gray-400 text-xs w-4 text-center">
              {TYPE_ICON[s.type]}
            </span>
            <span className="flex-1 truncate">{s.text}</span>
            {TYPE_LABEL[s.type] && (
              <span className="text-xs text-gray-400 shrink-0">{TYPE_LABEL[s.type]}</span>
            )}
          </button>
        </div>
      ))}
    </>
  );
}
