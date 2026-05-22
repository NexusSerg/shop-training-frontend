'use client';
import { useState, useRef, useCallback, useEffect, useId } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { buildSearchParams, parseSearchParams, DEFAULT_SEARCH_STATE } from '@/lib/queryBuilder';
import { useAutoComplete } from '@/hooks/useAutoComplete';
import { AutoComplete } from '@/components/search/AutoComplete';
import {
  SearchHistory,
  getSearchHistory,
  addToSearchHistory,
} from '@/components/search/SearchHistory';

export function SearchBar() {
  const searchParams = useSearchParams();
  const initialQuery = parseSearchParams(searchParams).query;

  const [input, setInput] = useState(initialQuery);
  const [isFocused, setIsFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [history, setHistory] = useState<string[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const listboxId = useId();
  const suggestionIdPrefix = `${listboxId}-suggestion`;

  const { data: autocompleteData } = useAutoComplete(input);
  const suggestions = autocompleteData?.suggestions ?? [];

  const showSuggestions = isFocused && suggestions.length > 0;
  const showHistory = isFocused && input.trim() === '' && history.length > 0;
  const showDropdown = showSuggestions || showHistory;

  // Load history when input gains focus
  function handleFocus() {
    setHistory(getSearchHistory());
    setIsFocused(true);
  }

  // Close dropdown on outside click
  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
        setActiveIndex(-1);
      }
    }
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, []);

  const navigate = useCallback(
    (query: string) => {
      const trimmed = query.trim();
      if (!trimmed) return;
      addToSearchHistory(trimmed);
      setHistory(getSearchHistory());
      const params = buildSearchParams({ ...DEFAULT_SEARCH_STATE, query: trimmed });
      router.push(`/search?${params}`);
      setIsFocused(false);
      setActiveIndex(-1);
    },
    [router],
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const selected =
      activeIndex >= 0 && suggestions[activeIndex]
        ? suggestions[activeIndex].text
        : input;
    navigate(selected);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown') {
      if (!showDropdown) return;
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      if (!showDropdown) return;
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === 'Escape') {
      setIsFocused(false);
      setActiveIndex(-1);
      inputRef.current?.blur();
    }
  }

  function handleSelect(text: string) {
    setInput(text);
    navigate(text);
  }

  function handleClearHistory() {
    localStorage.removeItem('search_history');
    setHistory([]);
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSubmit} role="search">
        <div className="flex gap-2 w-full">
          <input
            ref={inputRef}
            type="search"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={showDropdown}
            aria-controls={showDropdown ? listboxId : undefined}
            aria-activedescendant={
              activeIndex >= 0 ? `${suggestionIdPrefix}-${activeIndex}` : undefined
            }
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setActiveIndex(-1);
            }}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
            placeholder="Search products…"
            className="flex-1 border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoComplete="off"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      {showDropdown && (
        <div
          id={listboxId}
          role="listbox"
          className="absolute z-50 bg-white border rounded-lg shadow-lg mt-1 w-full max-h-72 overflow-y-auto"
        >
          {showSuggestions ? (
            <AutoComplete
              suggestions={suggestions}
              activeIndex={activeIndex}
              idPrefix={suggestionIdPrefix}
              onSelect={handleSelect}
              onActiveChange={setActiveIndex}
            />
          ) : (
            <SearchHistory
              history={history}
              onSelect={handleSelect}
              onClear={handleClearHistory}
            />
          )}
        </div>
      )}
    </div>
  );
}
