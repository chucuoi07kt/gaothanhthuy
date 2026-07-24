'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { Calendar, Clock, Search, Sparkles, ArrowRight, Newspaper } from 'lucide-react';
import { fetchBlogPosts } from '@/src/lib/products';
import { BlogImage } from '@/src/components/BlogImage';
import type { BlogPost } from '@/src/types';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const loadLiveBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const blogList = await fetchBlogPosts();
      setPosts(blogList);
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLiveBlogs();
  }, [loadLiveBlogs]);

  const categories = useMemo(() => {
    const set = new Set(posts.map((p) => p.category));
    return ['all', ...Array.from(set)];
  }, [posts]);

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [posts, search, activeCategory]);

  const featured = filtered[0] ?? null;
  const rest = featured ? filtered.slice(1) : [];

  return (
    <>
      {/* Hero header */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-brand-50 to-white py-8">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-brand-300 blur-3xl" />
          <div className="absolute right-0 top-20 h-64 w-64 rounded-full bg-gold-300 blur-3xl" />
        </div>
        <div className="container-page relative">
          <nav className="text-xs text-muted-foreground">
            <Link href="/" className="hover:text-brand-700">Trang chủ</Link>
            <span className="mx-1.5">/</span>
            <span className="text-brand-700">Tin tức</span>
          </nav>
          <h1 className="mt-2 text-xl font-bold leading-tight text-foreground sm:text-2xl lg:text-3xl">
            Cẩm nang gạo &amp; tin tức thị trường
          </h1>
          <p className="mt-1.5 text-xs text-muted-foreground sm:text-sm">
            Hướng dẫn chọn gạo, bảng giá sỉ, cách bảo quản gạo đúng cách
          </p>
        </div>
      </section>

      {/* Search + filter bar */}
      <section className="border-b border-border bg-white/60 backdrop-blur-sm">
        <div className="container-page py-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Search */}
            <div className="relative w-full lg:max-w-sm">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm kiếm bài viết..."
                className="h-11 w-full rounded-xl border border-border bg-white pl-10 pr-4 text-sm outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
            {/* Category pills */}
            <div className="flex flex-wrap gap-2 overflow-x-auto no-scrollbar pb-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={
                    'shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200 sm:px-4 sm:py-2 ' +
                    (activeCategory === cat
                      ? 'bg-brand-600 text-white shadow-soft'
                      : 'border border-border bg-white text-foreground/70 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700')
                  }
                >
                  {cat === 'all' ? 'Tất cả' : cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section-pad">
        <div className="container-page">
          {loading ? (
            <div className="py-20 text-center text-sm text-muted-foreground animate-pulse">
              Đang cập nhật tin tức mới nhất từ Google Sheets...
            </div>
          ) : posts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-white p-6 text-center sm:p-12">
              <Newspaper className="mx-auto h-10 w-10 text-muted-foreground/40" />
              <p className="mt-3 text-sm font-medium text-foreground sm:text-base">
                Chưa có bài viết nào
              </p>
              <p className="mt-1.5 text-xs text-muted-foreground sm:text-sm">
                Nội dung cẩm nang gạo sẽ sớm được hiển thị từ Google Sheets.
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-white p-6 text-center sm:p-12">
              <Search className="mx-auto h-10 w-10 text-muted-foreground/40" />
              <p className="mt-3 text-sm font-medium text-foreground sm:text-base">
                Không tìm thấy bài viết phù hợp
              </p>
              <p className="mt-1.5 text-xs text-muted-foreground sm:text-sm">
                Thử thay đổi từ khoá hoặc chọn danh mục khác.
              </p>
              <button
                onClick={() => { setSearch(''); setActiveCategory('all'); }}
                className="mt-4 rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700"
              >
                Xoá bộ lọc
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Featured article */}
              {featured && (
                <Link
                  href={`/blog/${featured.slug}`}
                  className="group relative block overflow-hidden rounded-2xl border border-border bg-white shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-card sm:rounded-3xl lg:flex"
                >
                  <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto lg:w-1/2">
                    <BlogImage
                      src={featured.image}
                      alt={featured.title}
                      width={800}
                      height={500}
                      priority
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      rounded="rounded-none"
                      className="h-full w-full transition-transform duration-700 group-hover:scale-105"
                    />
                    <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-gold-500 px-3 py-1.5 text-xs font-semibold text-white shadow-soft sm:left-4 sm:top-4">
                      <Sparkles className="h-3.5 w-3.5" />
                      Nổi bật
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col justify-center p-4 sm:p-6 lg:p-10">
                    <span className="inline-flex w-fit items-center rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
                      {featured.category}
                    </span>
                    <h2 className="mt-3 text-lg font-bold leading-tight text-foreground transition-colors group-hover:text-brand-700 sm:text-xl lg:text-2xl">
                      {featured.title}
                    </h2>
                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                      {featured.excerpt}
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground sm:gap-4">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {featured.publishedAt}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        {featured.readingMinutes} phút đọc
                      </span>
                    </div>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 transition-colors group-hover:text-brand-700">
                      Đọc tiếp
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              )}

              {/* Grid of remaining posts */}
              {rest.length > 0 && (
                <div className="grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map((post) => (
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
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          rounded="rounded-none"
                          className="h-full w-full transition-transform duration-500 group-hover:scale-105"
                        />
                        <span className="absolute left-3 top-3 rounded-full bg-brand-600/95 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm transition-colors group-hover:bg-brand-700">
                          {post.category}
                        </span>
                      </div>
                      <div className="flex flex-1 flex-col p-4 sm:p-5">
                        <h3 className="line-clamp-2 text-sm font-semibold text-foreground transition-colors group-hover:text-brand-700 sm:text-base">
                          {post.title}
                        </h3>
                        <p className="mt-2 line-clamp-3 flex-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                          {post.excerpt}
                        </p>
                        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border/60 pt-3 text-xs text-muted-foreground sm:gap-3">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            {post.publishedAt}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" />
                            {post.readingMinutes} phút đọc
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
