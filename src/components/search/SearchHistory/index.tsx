'use client';

const STORAGE_KEY = 'search_history';
const MAX_HISTORY = 10;

export function getSearchHistory(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function addToSearchHistory(query: string): void {
  if (typeof window === 'undefined' || !query.trim()) return;
  try {
    const current = getSearchHistory().filter((q) => q !== query);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([query, ...current].slice(0, MAX_HISTORY)),
    );
  } catch {
    // storage quota exceeded — ignore
  }
}

interface SearchHistoryProps {
  history: string[];
  onSelect: (query: string) => void;
  onClear: () => void;
}

export function SearchHistory({ history, onSelect, onClear }: SearchHistoryProps) {
  if (!history.length) return null;

  return (
    <div className="px-4 py-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
          Recent searches
        </span>
        <button
          type="button"
          onClick={onClear}
          className="text-xs text-gray-400 hover:text-gray-600"
        >
          Clear
        </button>
      </div>
      <ul className="flex flex-wrap gap-2">
        {history.map((q) => (
          <li key={q}>
            <button
              type="button"
              onClick={() => onSelect(q)}
              className="flex items-center gap-1 text-xs border rounded-full px-3 py-1 hover:bg-gray-50 transition-colors"
            >
              <span aria-hidden="true" className="text-gray-400">🕐</span>
              {q}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
