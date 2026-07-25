import { Skeleton } from './Skeleton';
import { ProductCardSkeleton } from './index';

/**
 * Product Detail page skeleton.
 * Mirrors: breadcrumb, 2-col layout (image gallery + product info),
 * characteristics + description sections, related products grid.
 */
export function ProductDetailSkeleton() {
  return (
    <>
      {/* Breadcrumb */}
      <section className="border-b border-border bg-gradient-to-br from-brand-50 to-white py-6">
        <div className="container-page" aria-hidden="true">
          <div className="flex items-center gap-1.5">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-3" />
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-3" />
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-3" />
            <Skeleton className="h-3 w-40" />
          </div>
        </div>
      </section>

      {/* Main 2-col layout */}
      <section className="section-pad pt-8">
        <div className="container-page grid gap-8 lg:grid-cols-2">
          {/* Image gallery */}
          <div className="space-y-3" aria-hidden="true">
            <Skeleton className="aspect-square rounded-2xl" />
            <div className="grid grid-cols-5 gap-2.5">
              {[0, 1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="aspect-square rounded-xl" />
              ))}
            </div>
          </div>

          {/* Product info */}
          <div aria-hidden="true">
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="mt-3 h-9 w-3/4" />
            <Skeleton className="mt-2 h-4 w-full" />
            <Skeleton className="mt-1 h-4 w-5/6" />
            <Skeleton className="mt-1 h-4 w-2/3" />

            {/* Price box */}
            <div className="mt-5 rounded-2xl border border-border bg-brand-50/40 p-4">
              <div className="flex items-end justify-between">
                <div className="space-y-1">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-9 w-28" />
                </div>
                <Skeleton className="h-7 w-36 rounded-full" />
              </div>
            </div>

            {/* Weight selection */}
            <div className="mt-5 space-y-2">
              <Skeleton className="h-4 w-44" />
              <div className="flex flex-wrap gap-2">
                {[0, 1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-11 w-20 rounded-xl" />
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mt-5 space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-32 rounded-xl" />
            </div>

            {/* CTA buttons */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Skeleton className="h-12 flex-1 rounded-xl" />
              <Skeleton className="h-12 flex-1 rounded-xl" />
            </div>
            <Skeleton className="mt-3 mx-auto h-4 w-40" />
          </div>
        </div>
      </section>

      {/* Characteristics + Description */}
      <section className="section-pad pt-4">
        <div className="container-page grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-white p-6 shadow-soft" aria-hidden="true">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="mt-1 h-4 w-72" />
            <div className="mt-5 space-y-3">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-3 w-8" />
                  </div>
                  <div className="flex gap-1">
                    {[0, 1, 2, 3, 4].map((j) => (
                      <Skeleton key={j} className="h-2 flex-1 rounded-full" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="h-6 w-16 rounded-full" />
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-white p-6 shadow-soft" aria-hidden="true">
            <Skeleton className="h-6 w-36" />
            <div className="mt-3 space-y-2">
              {[0, 1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
            <Skeleton className="mt-5 h-4 w-32" />
            <div className="mt-2 flex flex-wrap gap-2">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="h-7 w-20 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Related products */}
      <section className="section-pad pt-4">
        <div className="container-page">
          <div className="mb-6 flex items-center gap-2" aria-hidden="true">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-7 w-56" />
          </div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="pb-12">
        <div className="container-page">
          <div className="rounded-2xl brand-gradient p-6 sm:p-8" aria-hidden="true">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div className="space-y-2">
                <Skeleton className="h-7 w-56 bg-white/20" />
                <Skeleton className="h-4 w-80 max-w-full bg-white/20" />
              </div>
              <Skeleton className="h-12 w-44 rounded-xl bg-white/20" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
