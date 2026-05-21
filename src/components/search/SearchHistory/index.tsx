'use client';
// TODO Step 2.6: read/write recent queries from localStorage
interface SearchHistoryProps {
  onSelect: (query: string) => void;
}

export function SearchHistory({ onSelect }: SearchHistoryProps) {
  // TODO Step 2.6: read from localStorage
  const recent: string[] = [];
  if (!recent.length) return null;
  return (
    <ul className="flex flex-wrap gap-2 mt-2">
      {recent.map((q) => (
        <li key={q}>
          <button
            type="button"
            onClick={() => onSelect(q)}
            className="text-xs border rounded-full px-3 py-1 hover:bg-gray-50"
          >
            {q}
          </button>
        </li>
      ))}
    </ul>
  );
}
