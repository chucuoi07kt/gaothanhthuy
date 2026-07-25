import { Skeleton } from './Skeleton';
import { BlogCardSkeleton } from './index';

/**
 * Blog List page skeleton.
 * Mirrors: hero header, search + category pills bar,
 * featured article (horizontal), grid of remaining posts.
 */
export function BlogListSkeleton() {
  return (
    <>
      {/* Hero header */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-brand-50 to-white py-8">
        <div className="container-page relative" aria-hidden="true">
          <div className="flex items-center gap-1.5">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-3" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="mt-2 h-8 w-80 max-w-full" />
          <Skeleton className="mt-1.5 h-4 w-96 max-w-full" />
        </div>
      </section>

      {/* Search + filter bar */}
      <section className="border-b border-border bg-white/60 backdrop-blur-sm">
        <div className="container-page py-5" aria-hidden="true">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <Skeleton className="h-11 w-full rounded-xl lg:max-w-sm" />
            <div className="flex flex-wrap gap-2">
              {[0, 1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-8 w-20 rounded-full" />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section-pad">
        <div className="container-page">
          <div className="space-y-8">
            {/* Featured article */}
            <div
              className="overflow-hidden rounded-2xl border border-border bg-white shadow-soft sm:rounded-3xl lg:flex"
              aria-hidden="true"
            >
              <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto lg:w-1/2">
                <Skeleton className="h-full w-full rounded-none" />
              </div>
              <div className="flex flex-1 flex-col justify-center p-4 sm:p-6 lg:p-10">
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="mt-3 h-7 w-full" />
                <Skeleton className="mt-2 h-7 w-3/4" />
                <Skeleton className="mt-3 h-4 w-full" />
                <Skeleton className="mt-1.5 h-4 w-5/6" />
                <Skeleton className="mt-1.5 h-4 w-2/3" />
                <div className="mt-4 flex gap-4">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="mt-5 h-5 w-28" />
              </div>
            </div>

            {/* Grid of posts */}
            <div className="grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <BlogCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
