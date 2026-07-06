import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, Clock, MessageCircle, Newspaper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { blogPosts, getBlogBySlug, BRAND } from '@/src/data/mockData';
import { ZaloCta } from '@/src/components/ZaloCta';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return blogPosts.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params;
  const post = getBlogBySlug(resolvedParams.slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const resolvedParams = await params;
  const post = getBlogBySlug(resolvedParams.slug);
  if (!post) notFound();

  const related = blogPosts.filter((b) => b.id !== post.id).slice(0, 3);

  return (
    <>
      <section className="border-b border-border bg-gradient-to-br from-brand-50 to-white py-6">
        <div className="container-page">
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-brand-700">Trang chủ</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-brand-700">Tin tức</Link>
            <span>/</span>
            <span className="line-clamp-1 text-brand-700">{post.title}</span>
          </nav>
        </div>
      </section>

      <article className="section-pad pt-8">
        <div className="container-page max-w-3xl">
          <span className="inline-block rounded-full bg-brand-600 px-3 py-1 text-xs font-medium text-white">
            {post.category}
          </span>
          <h1 className="mt-3 text-2xl font-bold leading-tight text-foreground sm:text-3xl">
            {post.title}
          </h1>
          <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {post.publishedAt}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {post.readingMinutes} phút đọc
            </span>
            <span className="flex items-center gap-1.5">
              <Newspaper className="h-3.5 w-3.5" />
              {post.author}
            </span>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-border shadow-soft">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.image}
              alt={post.title}
              className="aspect-[16/9] w-full object-cover"
            />
          </div>

          <div className="mt-6 space-y-4 text-base leading-relaxed text-foreground/80">
            <p className="text-lg font-medium text-foreground">{post.excerpt}</p>
            {post.content.split('\n').map((para, idx) =>
              para.trim() ? (
                <p key={idx}>{para}</p>
              ) : null
            )}
          </div>

          <div className="mt-8 rounded-2xl brand-gradient p-6 text-white">
            <h2 className="text-lg font-bold">Cần tư vấn thêm?</h2>
            <p className="mt-1 text-sm text-brand-50">
              Liên hệ {BRAND.name} - {BRAND.hotline} để được tư vấn chọn gạo phù hợp.
            </p>
            <ZaloCta />
          </div>
        </div>
      </article>

      <section className="section-pad pt-4">
        <div className="container-page max-w-3xl">
          <div className="mb-4 flex items-center gap-2">
            <ArrowLeft className="h-5 w-5 text-brand-600" />
            <h2 className="text-xl font-bold text-foreground">Bài viết khác</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {related.map((b) => (
              <Link
                key={b.id}
                href={`/blog/${b.slug}`}
                className="group flex flex-col overflow-hidden rounded-xl border border-border bg-white shadow-soft transition-all hover:-translate-y-1 hover:shadow-card"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={b.image}
                    alt={b.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-3">
                  <h3 className="line-clamp-2 text-sm font-semibold text-foreground group-hover:text-brand-700">
                    {b.title}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {b.publishedAt} · {b.readingMinutes} phút
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
