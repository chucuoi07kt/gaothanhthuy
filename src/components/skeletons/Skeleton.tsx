import { cn } from '@/lib/utils';

/**
 * Base skeleton primitive. Uses a lightweight shimmer animation
 * (defined in globals.css as `.skeleton-shimmer`) tuned to the brand
 * palette so placeholders feel on-brand rather than generic gray.
 *
 * Always rendered with aria-hidden — real content replaces it instantly
 * once data is ready, so no extra a11y affordance is needed.
 */
export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={cn('skeleton-shimmer rounded-md', className)}
      {...props}
    />
  );
}
