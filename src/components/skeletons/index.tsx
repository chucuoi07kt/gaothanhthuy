import { Skeleton } from './Skeleton';
import { cn } from '@/lib/utils';

export { HomePageSkeleton } from './HomePageSkeleton';
export { ProductListSkeleton } from './ProductListSkeleton';
export { ProductDetailSkeleton } from './ProductDetailSkeleton';
export { BlogListSkeleton } from './BlogListSkeleton';
export { BlogDetailSkeleton } from './BlogDetailSkeleton';


/**
 * Skeleton for a single ProductCard.
 * Mirrors the real card: aspect-[4/3] image, 1-line title,
 * 3 compact metric rows, 4 weight pills, price line, CTA button.
 */
export function ProductCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-soft',
        className
      )}
      aria-hidden="true"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Skeleton className="h-full w-full rounded-none" />
      </div>
      <div className="flex flex-1 flex-col p-3">
        <div className="flex items-start justify-between gap-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-4 rounded-full" />
        </div>
        <div className="mt-2 space-y-1.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center justify-between gap-1">
              <Skeleton className="h-3 w-8" />
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4].map((j) => (
                  <Skeleton key={j} className="h-1.5 w-4 rounded-full" />
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-2 grid grid-cols-4 gap-1.5">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-7 rounded-full" />
          ))}
        </div>
        <div className="mt-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="mt-1 h-5 w-24" />
        </div>
        <Skeleton className="mt-3 h-9 w-full rounded-lg" />
      </div>
    </div>
  );
}

/**
 * Skeleton for a single BlogCard (grid item).
 * Mirrors: aspect-[16/10] image, category badge, 2-line title,
 * 2-line excerpt, meta row.
 */
export function BlogCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-soft',
        className
      )}
      aria-hidden="true"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Skeleton className="h-full w-full rounded-none" />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="mt-2 h-4 w-2/3" />
        <Skeleton className="mt-2 h-3 w-full" />
        <Skeleton className="mt-1.5 h-3 w-4/5" />
        <div className="mt-3 flex items-center gap-2 border-t border-border/60 pt-3">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton for the QuickSearch filter bar.
 * Mirrors: search input, category pills row, 4 metric filter sliders.
 */
export function QuickSearchSkeleton() {
  return (
    <div
      className="rounded-2xl border border-border bg-white p-4 shadow-soft sm:p-5"
      aria-hidden="true"
    >
      <Skeleton className="h-11 w-full rounded-xl" />
      <div className="mt-3 flex flex-wrap gap-2">
        {[0, 1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-7 w-16 rounded-full" />
        ))}
      </div>
      <div className="mt-3 border-t border-border pt-3">
        <Skeleton className="mb-2 h-3 w-32" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i}>
              <div className="mb-1 flex items-center justify-between">
                <Skeleton className="h-3 w-10" />
                <Skeleton className="h-3 w-6" />
              </div>
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4, 5].map((j) => (
                  <Skeleton key={j} className="h-5 flex-1 rounded-sm" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton for the PromoSlider hero banner.
 * Mirrors: full-width aspect-[16/9] image + overlay text block.
 */
export function PromoSliderSkeleton() {
  return (
    <div
      className="relative overflow-hidden"
      aria-hidden="true"
    >
      <div className="relative aspect-[16/9] w-full sm:aspect-[21/9] lg:aspect-[24/8]">
        <Skeleton className="h-full w-full rounded-none" />
        <div className="absolute inset-0 flex items-center">
          <div className="container-page">
            <div className="max-w-md space-y-3">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="mt-2 h-10 w-36 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton for the WarehouseGallery bento grid + stats row.
 * Mirrors: section header, bento grid, 4 stat cards.
 */
export function WarehouseGallerySkeleton() {
  return (
    <section className="section-pad bg-brand-50/60" aria-hidden="true">
      <div className="container-page">
        <div className="mb-8 text-center">
          <Skeleton className="mx-auto h-6 w-48 rounded-full" />
          <Skeleton className="mx-auto mt-3 h-8 w-80" />
          <Skeleton className="mx-auto mt-2 h-4 w-96 max-w-full" />
        </div>
        <div className="grid auto-rows-[180px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="rounded-2xl" />
          ))}
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-2xl border border-border bg-white p-4 shadow-soft"
            >
              <Skeleton className="h-11 w-11 rounded-xl" />
              <div className="space-y-1.5">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Skeleton for the Navbar (used as Suspense fallback).
 * Mirrors: logo + brand name, 4 nav links, 2 CTA buttons.
 * Fixed height h-16 to prevent CLS.
 */
export function NavbarSkeleton() {
  return (
    <header
      className="sticky top-0 z-40 w-full border-b border-transparent bg-white/70 backdrop-blur-sm"
      aria-hidden="true"
    >
      <div className="container-page flex h-16 items-center gap-4">
        <div className="flex items-center gap-2.5 shrink-0">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="hidden h-3 w-32 sm:block" />
          </div>
        </div>
        <div className="hidden flex-1 justify-center md:flex">
          <div className="flex items-center gap-1">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-9 w-24 rounded-full" />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <Skeleton className="hidden h-9 w-28 rounded-xl sm:block" />
          <Skeleton className="hidden h-10 w-10 rounded-xl md:block" />
          <Skeleton className="h-10 w-10 rounded-xl md:hidden" />
        </div>
      </div>
    </header>
  );
}
