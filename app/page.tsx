'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Newspaper } from 'lucide-react';
import { HeroBanner } from '@/src/components/HeroBanner';
import { PromoSlider } from '@/src/components/PromoSlider';
import { ProductCard } from '@/src/components/ProductCard';
import { CategoryShowcase, BrandStory } from '@/src/components/Sections';
import { WarehouseGallery } from '@/src/components/WarehouseGallery';
import { BlogImage } from '@/src/components/BlogImage';
import { fetchProducts, fetchBlogPosts } from '@/src/lib/products';
import type { Product, BlogPost } from '@/src/types';

export default function HomePage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <>
      <HeroBanner />

      <section className="relative -mt-8 sm:-mt-12 lg:-mt-16 px-4 sm:px-6 lg:px-8 pb-4">
        <div className="mx-auto max-w-7xl">
          <PromoSlider />
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
          ) : bestSellers.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-white p-10 text-center">
              <p className="text-sm text-muted-foreground">
                Chưa có sản phẩm nào trong Google Sheet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {bestSellers.map((p) => (
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
          <div className="mb-5 flex items-end justify-between sm:mb-6">
            <div className="min-w-0">
              <span className="text-xs font-semibold uppercase tracking-wide text-brand-600 sm:text-sm">
                Cẩm nang gạo
              </span>
              <h2 className="mt-1 text-xl font-bold text-foreground sm:text-2xl lg:text-3xl">
                Tin tức & hướng dẫn chọn gạo
              </h2>
            </div>
            <Link
              href="/blog"
              className="hidden shrink-0 items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700 sm:flex"
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
                    <BlogImage
                      src={post.image}
                      alt={post.title}
                      width={640}
                      height={400}
                      sizes="(max-width: 640px) 100vw, 33vw"
                      rounded="rounded-none"
                      className="h-full w-full transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-brand-600 px-2.5 py-1 text-xs font-medium text-white">
                      {post.category}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-3 sm:p-4">
                    <h3 className="line-clamp-2 text-sm font-semibold text-foreground transition-colors group-hover:text-brand-700 sm:text-base">
                      {post.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-xs text-muted-foreground sm:text-sm">
                      {post.excerpt}
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground sm:mt-3 sm:text-xs">
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
