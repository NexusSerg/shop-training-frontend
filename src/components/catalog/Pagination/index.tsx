'use client';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/**
 * Builds a page window: always shows first, last, and up to `window` pages
 * around the current page, with '…' ellipsis gaps.
 * e.g. [1, '…', 4, 5, 6, '…', 20]
 */
function buildPageList(current: number, total: number, window = 2): (number | '…')[] {
  const pages: (number | '…')[] = [];
  const lo = Math.max(2, current - window);
  const hi = Math.min(total - 1, current + window);

  pages.push(1);
  if (lo > 2) pages.push('…');
  for (let p = lo; p <= hi; p++) pages.push(p);
  if (hi < total - 1) pages.push('…');
  if (total > 1) pages.push(total);

  return pages;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pageList = buildPageList(page, totalPages);

  const btnBase =
    'min-w-[2rem] px-2 py-1 text-sm border rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1';
  const activeClass = 'bg-gray-900 text-white border-gray-900';
  const inactiveClass = 'bg-white text-gray-700 hover:bg-gray-50';
  const disabledClass = 'opacity-40 cursor-not-allowed';

  return (
    <nav aria-label="Pagination" className="flex gap-1 items-center justify-center flex-wrap">
      <button
        aria-label="Previous page"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className={`${btnBase} ${page <= 1 ? disabledClass : inactiveClass}`}
      >
        ←
      </button>

      {pageList.map((entry, i) =>
        entry === '…' ? (
          <span key={`ellipsis-${i}`} className="px-2 py-1 text-sm text-gray-400 select-none">
            …
          </span>
        ) : (
          <button
            key={entry}
            aria-label={`Page ${entry}`}
            aria-current={entry === page ? 'page' : undefined}
            onClick={() => onPageChange(entry)}
            className={`${btnBase} ${entry === page ? activeClass : inactiveClass}`}
          >
            {entry}
          </button>
        ),
      )}

      <button
        aria-label="Next page"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className={`${btnBase} ${page >= totalPages ? disabledClass : inactiveClass}`}
      >
        →
      </button>
    </nav>
  );
}
