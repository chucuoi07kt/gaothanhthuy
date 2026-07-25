import { Skeleton } from './Skeleton';

/**
 * QuoteCart modal skeleton.
 * Mirrors: sheet header, empty/cart item rows, footer with total + buttons.
 * Used when cart content is being prepared (e.g. during hydration).
 */
export function QuoteCartSkeleton() {
  return (
    <div className="flex w-full flex-col" aria-hidden="true">
      {/* Header */}
      <div className="border-b border-border bg-brand-50 px-5 py-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded" />
          <Skeleton className="h-5 w-44" />
        </div>
        <Skeleton className="mt-1.5 h-4 w-64" />
      </div>

      {/* Item rows */}
      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="flex gap-3 rounded-xl border border-border bg-white p-3"
          >
            <Skeleton className="h-16 w-16 shrink-0 rounded-lg" />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-24" />
              <div className="mt-auto flex items-center justify-between">
                <Skeleton className="h-7 w-24 rounded-full" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-border bg-white px-4 py-4">
        <div className="mb-3 flex items-center justify-between">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="mt-2 h-12 w-full rounded-xl" />
      </div>
    </div>
  );
}
