'use client';

import { BlogContent } from '@/src/components/BlogContent';

interface BlogPreviewProps {
  html: string;
}

export function BlogPreview({ html }: BlogPreviewProps) {
  return (
    <div className="rounded-xl border border-border bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900">
      <BlogContent html={html} />
    </div>
  );
}
