'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Newspaper } from 'lucide-react';
import { toast } from 'sonner';

export default function BlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Hàm gọi API lấy danh sách bài viết thật từ Google Sheets
  const loadLiveBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/blog', { cache: 'no-store' }); // Hoặc /api/posts tùy cấu trúc route của anh
      const data = await res.json();
      
      const liveList = data.blogs || data.blog || data.posts || [];
      
      // Chuẩn hóa dữ liệu từ Google Sheet sang các trường giao diện Card đang chờ
      const formattedList = liveList.map((post: any) => ({
        id: post.id,
        title: post.title || 'Bài viết chưa có tiêu đề',
        slug: post.slug || '',
        // Nhận diện linh hoạt cả thumbnail hoặc image từ Sheet
        image: post.thumbnail || post.image || 'https://images.unsplash.com/photo-1586201375761-83865001e31c', 
        category: post.category || 'Cẩm nang gạo',
        excerpt: post.summary || post.excerpt || 'Đang cập nhật nội dung tóm tắt...',
        publishedAt: post.created_at ? new Date(post.created_at).toLocaleDateString('vi-VN') : 'Mới cập nhật',
        readingMinutes: post.reading_minutes || post.readingMinutes || 3
      }));

      setPosts(formattedList);
    } catch {
      toast.error('Không thể tải danh sách bài viết thực tế');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLiveBlogs();
  }, [loadLiveBlogs]);

  return (
    <>
      <section className="border-b border-border bg-gradient-to-br from-brand-50 to-white py-8">
        <div className="container-page">
          <nav className="text-xs text-muted-foreground">
            <Link href="/" className="hover:text-brand-700">Trang chủ</Link>
            <span className="mx-1.5">/</span>
            <span className="text-brand-700">Tin tức</span>
          </nav>
          <h1 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">
            Cẩm nang gạo & tin tức thị trường
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Hướng dẫn chọn gạo, bảng giá sỉ, cách bảo quản gạo đúng cách
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page">
          {loading ? (
            <div className="py-20 text-center text-sm text-muted-foreground animate-pulse">
              🔄 Đang cập nhật tin tức mới nhất từ Google Sheets...
            </div>
          ) : posts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-white p-12 text-center">
              <p className="text-base font-medium text-foreground">
                Chưa có bài viết nào
              </p>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Nội dung cẩm nang gạo sẽ sớm được hiển thị từ Google Sheets.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
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
                  <div className="flex flex-1 flex-col p-5">
                    <h2 className="line-clamp-2 text-base font-semibold text-foreground transition-colors group-hover:text-brand-700">
                      {post.title}
                    </h2>
                    <p className="mt-2 line-clamp-3 flex-1 text-sm text-muted-foreground">
                      {post.excerpt}
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
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
