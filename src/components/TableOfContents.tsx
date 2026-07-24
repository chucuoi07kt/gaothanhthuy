'use client';

import { useState, useEffect, useCallback } from 'react';
import { List, X, ChevronRight } from 'lucide-react';
import type { TocItem } from './BlogContent';

interface TableOfContentsProps {
  items: TocItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');
  const [mobileOpen, setMobileOpen] = useState(false);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
    setMobileOpen(false);
  }, []);

  useEffect(() => {
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-80px 0px -70% 0px', threshold: 0 }
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  const TocList = ({ onNavigate }: { onNavigate?: (id: string) => void }) => (
    <nav className="space-y-1">
      {items.map((item, idx) => (
        <button
          key={`${item.id}-${idx}`}
          onClick={() => onNavigate?.(item.id)}
          className={`block w-full rounded-lg text-left text-sm transition-colors duration-150 ${
            activeId === item.id
              ? 'bg-brand-50 font-medium text-brand-700'
              : 'text-muted-foreground hover:bg-brand-50/50 hover:text-brand-600'
          }`}
          style={{ paddingLeft: `${(item.level - 1) * 12 + 12}px`, paddingRight: '12px', paddingTop: '6px', paddingBottom: '6px' }}
        >
          <span className="line-clamp-2">{item.text}</span>
        </button>
      ))}
    </nav>
  );

  return (
    <>
      {/* Desktop sticky TOC */}
      <aside className="hidden lg:block">
        <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-brand-700">
            <List className="h-4 w-4" />
            Mục lục
          </div>
          <TocList onNavigate={scrollTo} />
        </div>
      </aside>

      {/* Mobile TOC - floating button + drawer */}
      <div className="lg:hidden">
        {/* Floating button */}
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Mở mục lục"
          className="fixed bottom-20 left-4 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-brand-600 text-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:bg-brand-700 hover:shadow-lg sm:bottom-6 sm:left-6 sm:h-12 sm:w-12"
        >
          <List className="h-5 w-5" />
        </button>

        {/* Drawer overlay */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
              onClick={() => setMobileOpen(false)}
            />
            <div className="absolute bottom-0 left-0 right-0 max-h-[70vh] overflow-y-auto rounded-t-2xl bg-white p-5 shadow-card animate-slide-in-bottom">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-brand-700">
                  <List className="h-4 w-4" />
                  Mục lục bài viết
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Đóng mục lục"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-brand-50"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <TocList onNavigate={scrollTo} />
              <div className="mt-4 flex items-center gap-1.5 border-t border-border pt-3 text-xs text-muted-foreground">
                <ChevronRight className="h-3 w-3" />
                Chạm vào tiêu đề để nhảy đến mục đó
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
