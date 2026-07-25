import { Skeleton } from './Skeleton';
import { BlogCardSkeleton } from './index';

/**
 * Blog Detail page skeleton.
 * Mirrors: gradient hero with breadcrumb/badge/title/excerpt/meta,
 * cover image, article body, share bar, CTA, related posts.
 */
export function BlogDetailSkeleton() {
  return (
    <>
      {/* Hero section (gradient bg is static, only content skeletons) */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-800 via-brand-700 to-brand-900 text-white">
        <div className="container-page relative max-w-3xl py-6 sm:py-12 lg:py-16" aria-hidden="true">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5">
            <Skeleton className="h-3 w-16 bg-white/20" />
            <Skeleton className="h-3 w-3 bg-white/20" />
            <Skeleton className="h-3 w-16 bg-white/20" />
            <Skeleton className="h-3 w-3 bg-white/20" />
            <Skeleton className="h-3 w-48 bg-white/20" />
          </div>
          {/* Badge */}
          <Skeleton className="mt-4 h-6 w-24 rounded-full bg-white/20 sm:mt-5" />
          {/* Title */}
          <Skeleton className="mt-3 h-9 w-full bg-white/20 sm:mt-4 sm:h-10 lg:h-12" />
          <Skeleton className="mt-2 h-9 w-3/4 bg-white/20 sm:h-10 lg:h-12" />
          {/* Excerpt */}
          <Skeleton className="mt-3 h-5 w-full bg-white/20 sm:mt-4 sm:h-6" />
          <Skeleton className="mt-1.5 h-5 w-5/6 bg-white/20 sm:h-6" />
          {/* Meta row */}
          <div className="mt-4 flex flex-wrap gap-4 sm:mt-6">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-4 w-24 bg-white/20" />
            ))}
          </div>
        </div>
      </section>

      {/* Cover image */}
      <section className="relative -mt-4 sm:-mt-8">
        <div className="container-page max-w-4xl" aria-hidden="true">
          <Skeleton className="aspect-video w-full rounded-2xl" />
        </div>
      </section>

      {/* Article body */}
      <article className="section-pad pt-6 sm:pt-8">
        <div className="container-page max-w-5xl" aria-hidden="true">
          <Skeleton className="mb-5 h-5 w-full sm:mb-6 sm:h-7" />
          <div className="space-y-4">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
            <Skeleton className="h-4 w-2/3" />
          </div>

          {/* Share bar */}
          <div className="mt-6 flex items-center justify-between rounded-xl border border-border bg-brand-50/30 px-3 py-3 sm:mt-8 sm:rounded-2xl sm:px-5 sm:py-4">
            <Skeleton className="h-5 w-32" />
            <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="h-8 w-8 rounded-full" />
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 sm:mt-10">
            <Skeleton className="h-40 w-full rounded-2xl" />
          </div>

          {/* Internal links */}
          <div className="mt-6 space-y-2">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-4 w-full max-w-md" />
            ))}
          </div>

          {/* Back button */}
          <Skeleton className="mt-5 h-10 w-48 rounded-xl" />
        </div>
      </article>

      {/* Post navigation */}
      <section className="pb-6 sm:pb-8">
        <div className="container-page max-w-4xl" aria-hidden="true">
          <div className="grid gap-4 sm:grid-cols-2">
            {[0, 1].map((i) => (
              <Skeleton key={i} className="h-24 rounded-2xl" />
            ))}
          </div>
        </div>
      </section>

      {/* Related posts */}
      <section className="section-pad pt-4">
        <div className="container-page max-w-5xl" aria-hidden="true">
          <div className="mb-4 flex items-center gap-2 sm:mb-6">
            <Skeleton className="h-6 w-1 rounded-full" />
            <Skeleton className="h-7 w-40" />
          </div>
          <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <BlogCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
