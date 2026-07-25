import { Skeleton } from './Skeleton';
import { ProductCardSkeleton, QuickSearchSkeleton } from './index';

/**
 * Product List page skeleton.
 * Mirrors: breadcrumb header, QuickSearch bar, result count, product grid.
 */
export function ProductListSkeleton() {
  return (
    <>
      <section className="border-b border-border bg-gradient-to-br from-brand-50 to-white py-8">
        <div className="container-page" aria-hidden="true">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="mt-2 h-9 w-80 max-w-full" />
          <Skeleton className="mt-1.5 h-4 w-96 max-w-full" />
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page">
          <div className="mb-6">
            <QuickSearchSkeleton />
          </div>

          <div className="mb-4 flex items-center justify-between" aria-hidden="true">
            <Skeleton className="h-4 w-40" />
          </div>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
