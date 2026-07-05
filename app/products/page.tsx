'use client';

import { Suspense, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductCard } from '@/src/components/ProductCard';
import { QuickSearch, defaultFilters, type FilterState } from '@/src/components/QuickSearch';
import { products, categories } from '@/src/data/mockData';
import { applyFilters } from '@/src/lib/filters';

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') ?? 'all';

  const [filters, setFilters] = useState<FilterState>({
    ...defaultFilters,
    category: categories.some((c) => c.slug === initialCategory)
      ? initialCategory
      : 'all',
  });

  const filtered = useMemo(() => applyFilters(products, filters), [filters]);

  const activeCategory = categories.find((c) => c.slug === filters.category);

  return (
    <>
      <section className="border-b border-border bg-gradient-to-br from-brand-50 to-white py-8">
        <div className="container-page">
          <nav className="text-xs text-muted-foreground">
            <span>Trang chủ</span>
            <span className="mx-1.5">/</span>
            <span className="text-brand-700">Catalogue gạo</span>
          </nav>
          <h1 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">
            {activeCategory ? activeCategory.label : 'Toàn bộ catalogue gạo'}
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {activeCategory
              ? activeCategory.description
              : 'Tất cả dòng gạo phân phối sỉ & lẻ tại Gạo Thanh Thuỷ Đà Nẵng.'}
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page">
          <div className="mb-6">
            <QuickSearch
              filters={filters}
              onChange={setFilters}
              categories={categories}
            />
          </div>

          <div className="mb-4 flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Tìm thấy <strong className="text-brand-700">{filtered.length}</strong> sản phẩm
            </span>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-white p-12 text-center">
              <p className="text-base font-medium text-foreground">
                Không tìm thấy sản phẩm phù hợp
              </p>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Thử thay đổi từ khoá hoặc giảm bớt bộ lọc đặc tính gạo.
              </p>
              <button
                onClick={() => setFilters(defaultFilters)}
                className="mt-4 rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
              >
                Xoá bộ lọc
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="container-page py-20 text-center text-sm text-muted-foreground">
          Đang tải catalogue...
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
