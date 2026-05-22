'use client';
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
    enabled: debouncedInput.length > 1,
    staleTime: 60_000,
  });
}
