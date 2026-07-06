'use client';

import { Suspense, useMemo, useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductCard } from '@/src/components/ProductCard';
import { QuickSearch, defaultFilters, type FilterState } from '@/src/components/QuickSearch';
import { categories } from '@/src/data/mockData'; 
import { applyFilters } from '@/src/lib/filters';
import { toast } from 'sonner';

// Hàm phụ trợ tự động chuyển đổi danh mục Tiếng Việt có dấu thành slug chuẩn
function convertCategoryToSlug(categoryStr: string): string {
  if (!categoryStr) return 'gao-an-gia-dinh';
  const lower = categoryStr.toLowerCase().trim();
  if (lower.includes('gia đình') || lower.includes('gao-an-gia-dinh')) return 'gao-an-gia-dinh';
  if (lower.includes('quán') || lower.includes('nhà hàng') || lower.includes('gao-quan-com')) return 'gao-quan-com';
  if (lower.includes('từ thiện') || lower.includes('gao-tu-thien')) return 'gao-tu-thien';
  if (lower.includes('bún') || lower.includes('mì') || lower.includes('phở') || lower.includes('gao-nau-bun')) return 'gao-nau-bun-mi-pho';
  return 'gao-an-gia-dinh';
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') ?? 'all';

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState<FilterState>({
    ...defaultFilters,
    category: categories.some((c) => c.slug === initialCategory)
      ? initialCategory
      : 'all',
  });

  const loadLiveProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products', { cache: 'no-store' });
      const data = await res.json();
      
      const liveList = data.products || data.sp || [];
      
      const formattedList = liveList.map((p: any) => {
        // 1. Kiểm tra an toàn cho cột weight_options tránh lỗi .split()
        let weightArray = ['5kg']; 
        if (p.weight_options && typeof p.weight_options === 'string') {
          weightArray = p.weight_options.split(',').map((w: string) => w.trim());
        } else if (p.weight_options && typeof p.weight_options === 'number') {
          weightArray = [p.weight_options + 'kg'];
        }

        const deoVal = parseInt(p.deo || p.dẻo) || 0;
        const noVal = parseInt(p.no || p.nở) || 0;
        const memVal = parseInt(p.mem || p.mềm) || 0;

        return {
          id: p.id ? String(p.id) : String(Math.random()),
          name: p.name || 'Gạo Chưa Đặt Tên',
          // TỰ ĐỘNG CHUYỂN DANH MỤC SANG SLUG ĐỂ PHỤC VỤ HÀM LỌC ĐỠ SẬP TRANG
          category: convertCategoryToSlug(p.category), 
          price: parseInt(p.price) || 0,
          image: p.image || 'https://images.unsplash.com/photo-1586201375761-83865001e31c',
          description: p.description || 'Đang cập nhật mô tả...',
          weight_options: p.weight_options || '5kg',
          weights: weightArray, 
          features: {
            aroma: deoVal >= 4 ? 'Thơm nhiều' : 'Thơm nhẹ',
            texture: memVal >= 4 ? 'Mềm dẻo' : 'Nở xốp cơm'
          },
          dẻo: deoVal,
          nở: noVal,
          mềm: memVal
        };
      });

      setProducts(formattedList);
    } catch (error) {
      console.error('Live products load error:', error);
      toast.error('Không thể tải danh sách gạo thực tế');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLiveProducts();
  }, [loadLiveProducts]);

  // BỌC CHỐNG SẬP CHO BỘ LỌC KIỂU DỮ LIỆU CŨ CỦA BOLT
  const filtered = useMemo(() => {
    try {
      const dataArray = Array.isArray(products) ? products : [];
      return applyFilters(dataArray, filters);
    } catch (err) {
      console.error('Apply filters failed:', err);
      return Array.isArray(products) ? products : []; // Nếu bộ lọc sập, trả về mảng gốc không lọc chứ không làm sập cả trang web
    }
  }, [products, filters]);

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

          {loading ? (
            <div className="py-20 text-center text-sm text-muted-foreground">
              🔄 Đang quét kho gạo thực tế từ hệ thống...
            </div>
          ) : filtered.length === 0 ? (
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
