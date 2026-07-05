'use client';

import { Search, SlidersHorizontal, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FilterState {
  query: string;
  category: string;
  minStickiness: number;
  minFluffiness: number;
  minSoftness: number;
  minFragrance: number;
}

export const defaultFilters: FilterState = {
  query: '',
  category: 'all',
  minStickiness: 0,
  minFluffiness: 0,
  minSoftness: 0,
  minFragrance: 0,
};

const metricFilters: {
  key: keyof Omit<FilterState, 'query' | 'category'>;
  label: string;
}[] = [
  { key: 'minStickiness', label: 'Độ dẻo' },
  { key: 'minFluffiness', label: 'Độ nở' },
  { key: 'minSoftness', label: 'Độ mềm' },
  { key: 'minFragrance', label: 'Độ thơm' },
];

export function QuickSearch({
  filters,
  onChange,
  categories,
  showCategory = true,
  compact = false,
}: {
  filters: FilterState;
  onChange: (next: FilterState) => void;
  categories: { slug: string; label: string }[];
  showCategory?: boolean;
  compact?: boolean;
}) {
  const update = (patch: Partial<FilterState>) =>
    onChange({ ...filters, ...patch });

  return (
    <div
      className={cn(
        'rounded-2xl border border-border bg-white p-4 shadow-soft sm:p-5',
        compact && 'p-3 sm:p-4'
      )}
    >
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={filters.query}
          onChange={(e) => update({ query: e.target.value })}
          placeholder="Tìm theo tên gạo (ST25, Lài Miên, Hàm Châu...)"
          className="h-11 w-full rounded-xl border border-border bg-brand-50/40 pl-10 pr-10 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20"
        />
        {filters.query && (
          <button
            onClick={() => update({ query: '' })}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {showCategory && (
        <div className="mt-3 flex flex-wrap gap-2">
          <CategoryPill
            active={filters.category === 'all'}
            onClick={() => update({ category: 'all' })}
          >
            Tất cả
          </CategoryPill>
          {categories.map((c) => (
            <CategoryPill
              key={c.slug}
              active={filters.category === c.slug}
              onClick={() => update({ category: c.slug })}
            >
              {c.label}
            </CategoryPill>
          ))}
        </div>
      )}

      <div className="mt-3 border-t border-border pt-3">
        <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Lọc theo đặc tính gạo
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {metricFilters.map((m) => (
            <div key={m.key}>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs font-medium text-foreground/70">
                  {m.label}
                </span>
                <span className="text-xs font-semibold text-brand-700">
                  {filters[m.key] === 0 ? 'Tất cả' : `≥${filters[m.key]}`}
                </span>
              </div>
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4, 5].map((v) => (
                  <button
                    key={v}
                    onClick={() => update({ [m.key]: v } as Partial<FilterState>)}
                    className={cn(
                      'h-5 flex-1 rounded-sm transition-all',
                      v === 0
                        ? filters[m.key] === 0
                          ? 'bg-brand-600'
                          : 'bg-muted'
                        : v <= filters[m.key]
                        ? 'bg-gradient-to-r from-brand-500 to-gold-500'
                        : 'bg-muted hover:bg-brand-100'
                    )}
                    aria-label={`${m.label} ${v}`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CategoryPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all',
        active
          ? 'border-brand-600 bg-brand-600 text-white shadow-soft'
          : 'border-border bg-white text-foreground/70 hover:border-brand-400 hover:text-brand-700'
      )}
    >
      {children}
    </button>
  );
}
