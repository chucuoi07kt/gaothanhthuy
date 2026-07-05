import type { Product } from '@/src/types';
import type { FilterState } from '@/src/components/QuickSearch';

export function applyFilters(
  products: Product[],
  filters: FilterState
): Product[] {
  return products.filter((p) => {
    if (filters.category !== 'all' && p.category !== filters.category)
      return false;
    if (filters.query.trim()) {
      const q = filters.query.toLowerCase().trim();
      const haystack = [p.name, p.shortDescription, ...p.tags]
        .join(' ')
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    if (p.metrics.stickiness < filters.minStickiness) return false;
    if (p.metrics.fluffiness < filters.minFluffiness) return false;
    if (p.metrics.softness < filters.minSoftness) return false;
    if (p.metrics.fragrance < filters.minFragrance) return false;
    return true;
  });
}
