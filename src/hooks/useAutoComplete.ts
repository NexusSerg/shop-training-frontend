'use client';
// TODO Step 2.6: debounced autocomplete with keyboard navigation
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';

export function useAutoComplete(input: string, debounceMs = 150) {
  const [debouncedInput, setDebouncedInput] = useState(input);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedInput(input), debounceMs);
    return () => clearTimeout(t);
  }, [input, debounceMs]);

  return useQuery({
    queryKey: ['autocomplete', debouncedInput],
    queryFn: () => apiClient.getAutocomplete(debouncedInput),
    enabled: debouncedInput.length > 0,
    staleTime: 60_000,
  });
}
