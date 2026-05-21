'use client';
// TODO Step 2.6: wire to URL state, show AutoComplete dropdown
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { buildSearchParams, parseSearchParams, DEFAULT_SEARCH_STATE } from '@/lib/queryBuilder';
import { useSearchParams } from 'next/navigation';

export function SearchBar() {
  const searchParams = useSearchParams();
  const state = parseSearchParams(searchParams);
  const [input, setInput] = useState(state.query);
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next = buildSearchParams({ ...DEFAULT_SEARCH_STATE, query: input });
    router.push(`/search?${next}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full">
      <input
        type="search"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Search products…"
        className="flex-1 border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
        Search
      </button>
      {/* TODO Step 2.6: render <AutoComplete /> dropdown below */}
    </form>
  );
}
