'use client';
import { Loader2 } from 'lucide-react';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';

interface InfiniteScrollProps {
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
}

/**
 * Renders an invisible sentinel element at the bottom of the product list.
 * When the sentinel enters the viewport the `onLoadMore` callback fires.
 */
export function InfiniteScroll({ onLoadMore, hasMore, isLoading }: InfiniteScrollProps) {
  const { sentinelRef } = useInfiniteScroll(onLoadMore, hasMore && !isLoading);

  return (
    <div ref={sentinelRef} className="flex justify-center py-6" aria-live="polite">
      {isLoading && (
        <span className="flex items-center gap-2 text-sm text-gray-500">
          <Loader2 size={16} className="animate-spin" />
          Loading more…
        </span>
      )}
      {!hasMore && !isLoading && (
        <span className="text-sm text-gray-400">You&apos;ve reached the end</span>
      )}
    </div>
  );
}
