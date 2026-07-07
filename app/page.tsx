'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Newspaper } from 'lucide-react';
import { HeroBanner } from '@/src/components/HeroBanner';
import { ProductCard } from '@/src/components/ProductCard';
import { QuickSearch, defaultFilters, type FilterState } from '@/src/components/QuickSearch';
import { CategoryShowcase, BrandStory } from '@/src/components/Sections';
import { WarehouseGallery } from '@/src/components/WarehouseGallery';
import { categories } from '@/src/lib/categories';
import { applyFilters } from '@/src/lib/filters';
import { fetchProducts, fetchBlogPosts } from '@/src/lib/products';
import type { Product, BlogPost } from '@/src/types';

export default function HomePage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  useEffect(() => {
    (async () => {
      const [prods, blogList] = await Promise.all([fetchProducts(), fetchBlogPosts()]);
      setAllProducts(prods);
      setPosts(blogList);
      setLoading(false);
    })();
  }, []);

  const bestSellers = useMemo(() => {
    if (!Array.isArray(allProducts)) return [];

    const filteredBests = allProducts.filter((p) => {
      if (!p) return false;
      const val = String(p.bestSeller || '').toLowerCase().trim();
      return val === 'true' || val === 'yes' || val === '1' || p.bestSeller === true;
    });

    return filteredBests.length > 0 ? filteredBests.slice(0, 8) : allProducts.slice(0, 8);
  }, [allProducts]);

  const filteredBestSellers = useMemo(() => {
    try {
      return applyFilters(bestSellers, filters);
    } catch {
      return bestSellers;
    }
  }, [bestSellers, filters]);

  return (
    <>
      <HeroBanner />

      <section className="relative -mt-8 pb-4">
        <div className="container-page">
          {/* KHỐI 3 CAM KẾT VÀNG - PHIÊN BẢN CHỮ TO, RESPONSIVE CHO ĐIỆN THOẠI */}
<div className="my-6 px-4">
  {/* Thay đổi từ flex-col (dọc trên mobile) sang md:flex-row (ngang trên máy tính) */}
  <div className="flex flex-col md:flex-row bg-white rounded-2xl border border-gray-100 shadow-sm p-5 gap-5 md:gap-4 md:justify-between">
    
    {/* Cột 1: Giao hàng nhanh */}
    <div className="flex items-center md:flex-col md:text-center md:flex-1 gap-4 md:gap-2">
      {/* Icon bự, rõ nét trên điện thoại */}
      <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center text-brand-600 bg-green-50 rounded-2xl">
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
        </svg>
      </div>
      <div className="flex flex-col md:items-center">
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">GIAO NHANH TẬN NƠI</h3>
        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">Giao nhanh tại vựa Liên Chiểu & toàn Đà Nẵng</p>
      </div>
    </div>

    {/* Đường gạch ngang phân cách trên mobile, biến thành đường dọc trên PC */}
    <div className="h-[1px] w-full bg-gray-100 md:hidden" />

    {/* Cột 2: Chất lượng tận gốc */}
    <div className="flex items-center md:flex-col md:text-center md:flex-1 gap-4 md:gap-2 md:border-x md:border-gray-100 md:px-4">
      <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center text-brand-600 bg-green-50 rounded-2xl">
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
        </svg>
      </div>
      <div className="flex flex-col md:items-center">
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">CHẤT LƯỢNG TẬN GỐC</h3>
        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">Gạo sạch nguyên bản, cam kết không pha trộn</p>
      </div>
    </div>

    {/* Đường gạch ngang phân cách trên mobile */}
    <div className="h-[1px] w-full bg-gray-100 md:hidden" />

    {/* Cột 3: Giá tốt nhất */}
    <div className="flex items-center md:flex-col md:text-center md:flex-1 gap-4 md:gap-2">
      <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center text-brand-600 bg-green-50 rounded-2xl">
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>
      <div className="flex flex-col md:items-center">
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">GIÁ TẬN VỰA CỰC TỐT</h3>
        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">Giá sỉ tốt nhất cho đại lý, quán cơm, từ thiện</p>
      </div>
    </div>

  </div>
</div>
  </div>
      </section>

      <CategoryShowcase />

      <section className="section-pad pt-4">
        <div className="container-page">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <span className="text-sm font-semibold uppercase tracking-wide text-brand-600">
                Bán chạy nhất
              </span>
              <h2 className="mt-1 text-2xl font-bold text-foreground sm:text-3xl">
                Gạo được đặt sỉ nhiều nhất
              </h2>
            </div>
            <Link
              href="/products"
              className="hidden items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700 sm:flex"
            >
              Xem tất cả
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <div className="py-20 text-center text-sm text-muted-foreground">
              Đang tải sản phẩm từ Google Sheets...
            </div>
          ) : filteredBestSellers.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-white p-10 text-center">
              <p className="text-sm text-muted-foreground">
                {allProducts.length === 0
                  ? 'Chưa có sản phẩm nào trong Google Sheet.'
                  : 'Không tìm thấy sản phẩm phù hợp với bộ lọc.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {filteredBestSellers.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      <BrandStory />

      <WarehouseGallery />

      <section className="section-pad pt-4">
        <div className="container-page">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <span className="text-sm font-semibold uppercase tracking-wide text-brand-600">
                Cẩm nang gạo
              </span>
              <h2 className="mt-1 text-2xl font-bold text-foreground sm:text-3xl">
                Tin tức & hướng dẫn chọn gạo
              </h2>
            </div>
            <Link
              href="/blog"
              className="hidden items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700 sm:flex"
            >
              Tất cả bài viết
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {posts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-white p-10 text-center">
              <p className="text-sm text-muted-foreground">
                Chưa có bài viết nào trong Google Sheet.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {posts.slice(0, 3).map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.image}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-brand-600 px-2.5 py-1 text-xs font-medium text-white">
                      {post.category}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="line-clamp-2 text-base font-semibold text-foreground transition-colors group-hover:text-brand-700">
                      {post.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                      {post.excerpt}
                    </p>
                    <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                      <Newspaper className="h-3.5 w-3.5" />
                      {post.publishedAt} · {post.readingMinutes} phút đọc
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
