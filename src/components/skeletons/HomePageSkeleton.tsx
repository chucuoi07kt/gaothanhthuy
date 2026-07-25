import { Skeleton } from './Skeleton';
import {
  ProductCardSkeleton,
  BlogCardSkeleton,
  PromoSliderSkeleton,
  WarehouseGallerySkeleton,
} from './index';

/**
 * Full homepage skeleton.
 * Mirrors: HeroBanner, PromoSlider, CategoryShowcase, Best Sellers grid,
 * BrandStory, WarehouseGallery, Blog section.
 */
export function HomePageSkeleton() {
  return (
    <>
      {/* HeroBanner placeholder (static gradient, no skeleton needed for bg) */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-800 via-brand-700 to-brand-900">
        <div className="container-page relative grid items-center gap-8 py-12 sm:py-16 lg:grid-cols-2 lg:py-20">
          <div className="space-y-5" aria-hidden="true">
            <Skeleton className="h-7 w-64 rounded-full bg-white/20" />
            <div className="space-y-3">
              <Skeleton className="h-10 w-full bg-white/20" />
              <Skeleton className="h-10 w-3/4 bg-white/20" />
            </div>
            <Skeleton className="h-5 w-full max-w-xl bg-white/20" />
            <Skeleton className="h-5 w-2/3 max-w-xl bg-white/20" />
            <div className="flex gap-3 pt-2">
              <Skeleton className="h-11 w-40 rounded-xl bg-white/20" />
              <Skeleton className="h-11 w-48 rounded-xl bg-white/20" />
            </div>
            <div className="grid grid-cols-3 gap-3 pt-4">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="h-20 rounded-xl bg-white/20" />
              ))}
            </div>
          </div>
          <div className="relative hidden lg:block" aria-hidden="true">
            <Skeleton className="aspect-square max-w-md rounded-3xl bg-white/20" />
          </div>
        </div>
      </section>

      {/* PromoSlider */}
      <section className="relative -mt-8 pb-4 overflow-hidden">
        <PromoSliderSkeleton />
      </section>

      {/* CategoryShowcase */}
      <section className="section-pad">
        <div className="container-page">
          <div className="mb-6 text-center" aria-hidden="true">
            <Skeleton className="mx-auto h-5 w-36" />
            <Skeleton className="mx-auto mt-1.5 h-8 w-72" />
            <Skeleton className="mx-auto mt-1.5 h-4 w-64" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-hidden="true">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex flex-row items-stretch rounded-3xl border border-border/60 bg-white p-4 shadow-soft"
              >
                <div className="flex shrink-0 items-center pr-4">
                  <Skeleton className="h-11 w-11 rounded-2xl" />
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-center space-y-2">
                  <Skeleton className="h-5 w-28" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-4/5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="section-pad pt-4">
        <div className="container-page">
          <div className="mb-6 flex items-end justify-between" aria-hidden="true">
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-8 w-72" />
            </div>
            <Skeleton className="hidden h-5 w-28 sm:block" />
          </div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>

      {/* BrandStory */}
      <section className="bg-brand-50 py-12 sm:py-16 lg:py-20" aria-hidden="true">
        <div className="container-page grid items-center gap-10 lg:grid-cols-2">
          <div className="space-y-4">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-9 w-80 max-w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="space-y-2.5 pt-2">
              {[0, 1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-4 w-full max-w-lg" />
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-white p-6 shadow-soft">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5 rounded" />
              <Skeleton className="h-5 w-40" />
            </div>
            <Skeleton className="mt-1.5 h-4 w-64" />
            <div className="mt-5 grid grid-cols-2 gap-3">
              {[0, 1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 rounded-xl" />
              ))}
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3 border-t border-border pt-5">
              {[0, 1, 2].map((i) => (
                <div key={i} className="text-center space-y-1.5">
                  <Skeleton className="mx-auto h-7 w-12" />
                  <Skeleton className="mx-auto h-3 w-20" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* WarehouseGallery */}
      <WarehouseGallerySkeleton />

      {/* Blog section */}
      <section className="section-pad pt-4">
        <div className="container-page">
          <div className="mb-5 flex items-end justify-between sm:mb-6" aria-hidden="true">
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-72" />
            </div>
            <Skeleton className="hidden h-5 w-28 sm:block" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <BlogCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
