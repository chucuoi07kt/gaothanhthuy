'use client';

import { useState, useCallback } from 'react';
import { BlogContent, type TocItem } from './BlogContent';
import { TableOfContents } from './TableOfContents';

interface BlogArticleProps {
  html: string;
}

export function BlogArticle({ html }: BlogArticleProps) {
  const [toc, setToc] = useState<TocItem[]>([]);

  const handleTocReady = useCallback((items: TocItem[]) => {
    setToc(items);
  }, []);

  return (
    <div className="lg:grid lg:grid-cols-[1fr_220px] lg:gap-10 xl:grid-cols-[1fr_260px] xl:gap-14">
      <div className="min-w-0">
        <BlogContent html={html} onTocReady={handleTocReady} />
      </div>
      <div className="hidden lg:block">
        <TableOfContents items={toc} />
      </div>
      {/* Mobile TOC renders its own floating button */}
      <div className="lg:hidden">
        <TableOfContents items={toc} />
      </div>
    </div>
  );
}
