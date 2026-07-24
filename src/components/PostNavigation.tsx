import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { BlogPost } from '@/src/types';

interface PostNavigationProps {
  prev: BlogPost | null;
  next: BlogPost | null;
}

export function PostNavigation({ prev, next }: PostNavigationProps) {
  if (!prev && !next) return null;

  return (
    <nav className="grid gap-3 sm:gap-4 sm:grid-cols-2">
      {prev ? (
        <Link
          href={`/blog/${prev.slug}`}
          className="group flex items-center gap-3 rounded-2xl border border-border bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-card sm:gap-4 sm:p-5"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white sm:h-12 sm:w-12">
            <ChevronLeft className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground sm:text-xs">Bài trước</span>
            <p className="mt-0.5 line-clamp-2 text-sm font-semibold text-foreground transition-colors group-hover:text-brand-700">
              {prev.title}
            </p>
          </div>
        </Link>
      ) : (
        <div className="hidden sm:block" />
      )}

      {next ? (
        <Link
          href={`/blog/${next.slug}`}
          className="group flex items-center gap-3 rounded-2xl border border-border bg-white p-4 text-right transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-card sm:gap-4 sm:p-5 sm:col-start-2"
        >
          <div className="min-w-0 flex-1">
            <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground sm:text-xs">Bài sau</span>
            <p className="mt-0.5 line-clamp-2 text-sm font-semibold text-foreground transition-colors group-hover:text-brand-700">
              {next.title}
            </p>
          </div>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white sm:h-12 sm:w-12">
            <ChevronRight className="h-5 w-5" />
          </div>
        </Link>
      ) : (
        <div className="hidden sm:block" />
      )}
    </nav>
  );
}
