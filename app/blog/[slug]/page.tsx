import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowLeft, ArrowRight, Calendar, Clock, Newspaper, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getBlogFromSheet } from '@/src/lib/sheets';
import { normalizeBlogPost } from '@/src/lib/products';
import { BRAND } from '@/src/lib/brand';
import { ReadingProgress, BackToTop } from '@/src/components/BlogReadingUX';
import { BlogArticle } from '@/src/components/BlogArticle';
import { BlogImage } from '@/src/components/BlogImage';
import { ShareButtons } from '@/src/components/ShareButtons';
import { PostNavigation } from '@/src/components/PostNavigation';
import { BlogCta } from '@/src/components/BlogCta';
import { InternalLinks } from '@/src/components/InternalLinks';
import {
  buildArticleSchema,
  buildBreadcrumbSchema,
  buildFaqSchema,
} from '@/src/lib/seo';
import type { BlogPost } from '@/src/types';

interface PageProps {
  params: Promise<{ slug: string }>;
}

const SITE_URL = `https://${BRAND.domain}`;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  try {
    const allPosts = await getBlogFromSheet();
    const found = allPosts.find((p) => p.slug === resolvedParams.slug || p.id === resolvedParams.slug);
    if (!found) return {};
    const normalized = normalizeBlogPost(found);
    const url = `${SITE_URL}/blog/${normalized.slug}`;

    return {
      title: normalized.metaTitle || normalized.title,
      description: normalized.metaDescription || normalized.excerpt,
      keywords: [
        normalized.category,
        'gạo Đà Nẵng',
        'gạo sỉ Đà Nẵng',
        BRAND.name,
        'giao gạo hỏa tốc Đà Nẵng',
        'báo giá gạo sỉ',
      ],
      authors: [{ name: normalized.author }],
      creator: normalized.author,
      alternates: {
        canonical: url,
      },
      openGraph: {
        type: 'article',
        locale: 'vi_VN',
        url,
        siteName: BRAND.name,
        title: normalized.title,
        description: normalized.excerpt,
        images: [
          {
            url: normalized.image,
            width: 1200,
            height: 630,
            alt: normalized.title,
          },
        ],
        publishedTime: normalized.publishedAt,
        authors: [normalized.author],
      },
      twitter: {
        card: 'summary_large_image',
        title: normalized.title,
        description: normalized.excerpt,
        images: [normalized.image],
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  } catch {
    return {};
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const resolvedParams = await params;

  let post: BlogPost | null = null;
  let related: BlogPost[] = [];
  let prevPost: BlogPost | null = null;
  let nextPost: BlogPost | null = null;
  let publishedISO = '';

  try {
    const allPosts = await getBlogFromSheet();
    if (!Array.isArray(allPosts) || allPosts.length === 0) {
      notFound();
    }

    const found = allPosts.find(
      (p) => p.slug === resolvedParams.slug || p.id === resolvedParams.slug
    );
    if (!found) {
      notFound();
    }

    post = normalizeBlogPost(found);
    publishedISO = found.created_at || new Date().toISOString();
    if (!isNaN(new Date(publishedISO).getTime())) {
      publishedISO = new Date(publishedISO).toISOString();
    } else {
      publishedISO = new Date().toISOString();
    }

    const relatedRaw = allPosts
      .filter((p) => p.id !== found.id)
      .slice(0, 3);
    related = relatedRaw.map(normalizeBlogPost);

    const currentIndex = allPosts.findIndex((p) => p.id === found.id);
    if (currentIndex > 0) {
      prevPost = normalizeBlogPost(allPosts[currentIndex - 1]);
    }
    if (currentIndex >= 0 && currentIndex < allPosts.length - 1) {
      nextPost = normalizeBlogPost(allPosts[currentIndex + 1]);
    }
  } catch {
    notFound();
  }

  if (!post) {
    notFound();
  }

  const articleSchema = buildArticleSchema(post, publishedISO);
  const breadcrumbSchema = buildBreadcrumbSchema(post);
  const faqSchema = buildFaqSchema(post);

  return (
    <>
      <ReadingProgress />

      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-800 via-brand-700 to-brand-900 text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-gold-400 blur-3xl" />
          <div className="absolute right-0 top-40 h-80 w-80 rounded-full bg-brand-400 blur-3xl" />
        </div>

        <div className="container-page relative max-w-3xl py-8 sm:py-12 lg:py-16">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-brand-100">
            <Link href="/" className="transition-colors hover:text-white">Trang chủ</Link>
            <span>/</span>
            <Link href="/blog" className="transition-colors hover:text-white">Tin tức</Link>
            <span>/</span>
            <span className="line-clamp-1 font-medium text-white">{post.title}</span>
          </nav>

          {/* Category badge */}
          <span className="mt-5 inline-flex items-center rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-medium backdrop-blur-sm">
            {post.category}
          </span>

          {/* Title */}
          <h1 className="mt-4 text-2xl font-bold leading-tight text-balance drop-shadow-sm sm:text-3xl lg:text-4xl">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="mt-4 text-base leading-relaxed text-brand-50 sm:text-lg">
            {post.excerpt}
          </p>

          {/* Meta row */}
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-brand-100">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-gold-300" />
              {post.publishedAt}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-gold-300" />
              {post.readingMinutes} phút đọc
            </span>
            <span className="flex items-center gap-1.5">
              <RefreshCw className="h-3.5 w-3.5 text-gold-300" />
              Cập nhật {post.publishedAt}
            </span>
            <span className="flex items-center gap-1.5">
              <Newspaper className="h-3.5 w-3.5 text-gold-300" />
              {post.author}
            </span>
          </div>
        </div>
      </section>

      {/* Cover image */}
      <section className="relative -mt-6 sm:-mt-8">
        <div className="container-page max-w-4xl">
          <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-card">
            <BlogImage
              src={post.image}
              alt={post.title}
              width={1200}
              height={675}
              priority
              sizes="(max-width: 768px) 100vw, 768px"
              rounded="rounded-none"
              className="w-full"
            />
          </div>
        </div>
      </section>

      {/* Article body */}
      <article className="section-pad pt-8">
        <div className="container-page max-w-5xl">
          <p className="mb-6 text-lg font-medium text-foreground">{post.excerpt}</p>
          <BlogArticle html={post.content} />

          {/* Share buttons */}
          <div className="mt-8 flex items-center justify-between rounded-2xl border border-border bg-brand-50/30 px-5 py-4">
            <ShareButtons title={post.title} slug={post.slug} />
          </div>

          {/* CTA cuối bài: Banner + Products + Cart + Contact */}
          <div className="mt-10 max-w-4xl">
            <BlogCta />
          </div>

          {/* Internal links */}
          <div className="max-w-3xl">
            <InternalLinks />
          </div>

          {/* Back to blog link */}
          <div className="mt-6">
            <Link href="/blog">
              <Button variant="outline" className="gap-2 border-brand-200 text-brand-700 hover:bg-brand-50">
                <ArrowLeft className="h-4 w-4" />
                Quay lại danh sách bài viết
              </Button>
            </Link>
          </div>
        </div>
      </article>

      {/* Previous / Next navigation */}
      {(prevPost || nextPost) && (
        <section className="pb-8">
          <div className="container-page max-w-4xl">
            <PostNavigation prev={prevPost} next={nextPost} />
          </div>
        </section>
      )}

      {/* Related posts */}
      {related.length > 0 && (
        <section className="section-pad pt-4">
          <div className="container-page max-w-5xl">
            <div className="mb-6 flex items-center gap-2">
              <div className="h-6 w-1 rounded-full bg-brand-600" />
              <h2 className="text-xl font-bold text-foreground sm:text-2xl">Bài viết liên quan</h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((b) => (
                <Link
                  key={b.id}
                  href={`/blog/${b.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <BlogImage
                      src={b.image}
                      alt={b.title}
                      width={640}
                      height={400}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      rounded="rounded-none"
                      className="h-full w-full transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-brand-600/95 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                      {b.category}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="line-clamp-2 text-sm font-semibold text-foreground transition-colors group-hover:text-brand-700">
                      {b.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{b.excerpt}</p>
                    <div className="mt-4 flex items-center gap-3 border-t border-border/60 pt-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {b.publishedAt}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {b.readingMinutes} phút
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link href="/blog">
                <Button variant="outline" className="gap-2 border-brand-200 text-brand-700 hover:bg-brand-50">
                  Xem tất cả bài viết
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      <BackToTop />
    </>
  );
}
