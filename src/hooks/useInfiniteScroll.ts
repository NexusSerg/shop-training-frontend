'use client';
// TODO Step 2.7: implement IntersectionObserver-based infinite scroll
import { useEffect, useRef, useCallback } from 'react';

export function useInfiniteScroll(onLoadMore: () => void, enabled = true) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (enabled && entries[0]?.isIntersecting) onLoadMore();
    },
    [onLoadMore, enabled],
  );

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(handleIntersect, { threshold: 0.1 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleIntersect]);

  return { sentinelRef };
}
