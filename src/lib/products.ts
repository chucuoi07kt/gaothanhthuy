import type { Product, ProductMetrics, WeightOption, BlogPost } from '@/src/types';
import { convertCategoryToSlug, getCategoryLabel } from './categories';
import { parseImageList, slugifyVietnamese } from '@/lib/utils';

const FALLBACK_IMAGE = 'https://images.pexels.com/photos/723198/pexels-photo-723198.jpeg?auto=compress&cs=tinysrgb&w=900';

function safeSplit(val: unknown, fallback: string[] = []): string[] {
  if (!val) return fallback;
  if (typeof val === 'string') {
    const parts = val.split(',').map((s) => s.trim()).filter(Boolean);
    return parts.length > 0 ? parts : fallback;
  }
  if (typeof val === 'number') return [`${val}kg`];
  if (Array.isArray(val)) return val.length > 0 ? val.map(String) : fallback;
  return fallback;
}

function safeParseInt(val: unknown, fallback = 0): number {
  if (typeof val === 'number' && !isNaN(val)) return val;
  if (typeof val === 'string') {
    const n = parseInt(val.replace(/[^\d-]/g, ''), 10);
    return isNaN(n) ? fallback : n;
  }
  return fallback;
}

function safeString(val: unknown, fallback = ''): string {
  if (!val) return fallback;
  return String(val).trim() || fallback;
}

function safeNumber(val: unknown, fallback = 0): number {
  if (typeof val === 'number' && !isNaN(val)) return val;
  if (typeof val === 'string') {
    const n = parseFloat(val.replace(/[^\d.]/g, ''));
    return isNaN(n) ? fallback : n;
  }
  return fallback;
}

export interface SheetProductRaw {
  id?: string;
  name?: string;
  category?: string;
  price?: string | number;
  weight_options?: string;
  image?: string;
  description?: string;
  deo?: string | number;
  dẻo?: string | number;
  no?: string | number;
  nở?: string | number;
  mem?: string | number;
  mềm?: string | number;
  slug?: string;
  origin?: string;
  shortDescription?: string;
  longDescription?: string;
  bestSeller?: string | boolean;
  tags?: string;
  usage?: string;
  gallery?: string;
  fragrance?: string | number;
  thom?: string | number;
  thơm?: string | number;
}

export function normalizeProduct(raw: SheetProductRaw): Product {
  const id = safeString(raw.id, String(Math.random()));
  const name = safeString(raw.name, 'Gạo Chưa Đặt Tên');
  const categorySlug = convertCategoryToSlug(safeString(raw.category));
  const categoryLabel = getCategoryLabel(categorySlug);

  const weights = safeSplit(raw.weight_options, ['5kg'] as string[]) as WeightOption[];

  const stickiness = safeParseInt(raw.deo ?? raw.dẻo);
  const fluffiness = safeParseInt(raw.no ?? raw.nở);
  const softness = safeParseInt(raw.mem ?? raw.mềm);
  const fragrance = safeParseInt(raw.thom ?? raw.thơm ?? raw.fragrance);

  const metrics: ProductMetrics = {
    stickiness: Math.max(0, Math.min(5, stickiness)),
    fluffiness: Math.max(0, Math.min(5, fluffiness)),
    softness: Math.max(0, Math.min(5, softness)),
    fragrance: Math.max(0, Math.min(5, fragrance)),
  };

  const tags = safeSplit(raw.tags, []);
  const usage = safeSplit(raw.usage, []);

  const allImages = parseImageList(raw.image);
  const primaryImage = allImages[0] || FALLBACK_IMAGE;
  const galleryFromImage = allImages.length > 1 ? allImages : [];
  const galleryRaw = safeSplit(raw.gallery, []);
  const gallery = galleryRaw.length > 0 ? galleryRaw : galleryFromImage;

  const bestSeller =
    raw.bestSeller === true ||
    raw.bestSeller === 'true' ||
    raw.bestSeller === '1' ||
    raw.bestSeller === 'yes';

  const rawSlug = safeString(raw.slug, '');
  const slug = rawSlug || slugifyVietnamese(name) || id;

  return {
    id,
    slug,
    name,
    shortDescription: safeString(raw.shortDescription, safeString(raw.description, 'Đang cập nhật mô tả...')),
    longDescription: safeString(raw.longDescription, safeString(raw.description, 'Đang cập nhật mô tả...')),
    category: categorySlug as Product['category'],
    categoryLabel,
    origin: safeString(raw.origin, 'Việt Nam'),
    pricePerKg: safeNumber(raw.price),
    weights,
    image: primaryImage,
    gallery: gallery.length > 0 ? gallery : undefined,
    metrics,
    bestSeller,
    tags,
    usage,
  };
}

export interface SheetBlogRaw {
  id?: string;
  title?: string;
  slug?: string;
  thumbnail?: string;
  image?: string;
  summary?: string;
  excerpt?: string;
  content?: string;
  category?: string;
  author?: string;
  created_at?: string;
  publishedAt?: string;
  reading_minutes?: string | number;
  readingMinutes?: string | number;
  meta_title?: string;
  meta_description?: string;
}

export function normalizeBlogPost(raw: SheetBlogRaw): BlogPost {
  const id = safeString(raw.id, String(Math.random()));
  const title = safeString(raw.title, 'Bài viết chưa có tiêu đề');
  const rawSlug = safeString(raw.slug, '');
  const slug = rawSlug || slugifyVietnamese(title) || id;
  const content = safeString(raw.content, '');
  const created = safeString(raw.created_at, safeString(raw.publishedAt, new Date().toISOString()));

  let publishedAt = created;
  try {
    publishedAt = new Date(created).toLocaleDateString('vi-VN');
    if (publishedAt === 'Invalid Date') publishedAt = created;
  } catch {
    publishedAt = created;
  }

  return {
    id,
    slug,
    title,
    excerpt: safeString(raw.summary, safeString(raw.excerpt, 'Đang cập nhật nội dung tóm tắt...')),
    content,
    category: safeString(raw.category, 'Cẩm nang gạo'),
    author: safeString(raw.author, 'Gạo Ngọc Anh'),
    publishedAt,
    readingMinutes: Math.max(1, safeParseInt(raw.reading_minutes ?? raw.readingMinutes, 3)),
    image: safeString(raw.thumbnail, safeString(raw.image, FALLBACK_IMAGE)),
    metaTitle: safeString(raw.meta_title, ''),
    metaDescription: safeString(raw.meta_description, ''),
  };
}

export async function fetchProducts(): Promise<Product[]> {
  try {
    const res = await fetch('/api/products', { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    const rawList: SheetProductRaw[] = data.products || data.sp || data.data || [];
    if (!Array.isArray(rawList)) return [];
    return rawList.map(normalizeProduct);
  } catch {
    return [];
  }
}

export async function fetchBlogPosts(): Promise<BlogPost[]> {
  try {
    const res = await fetch('/api/blog', { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    const rawList: SheetBlogRaw[] = data.posts || data.blogs || data.blog || [];
    if (!Array.isArray(rawList)) return [];
    return rawList.map(normalizeBlogPost);
  } catch {
    return [];
  }
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  try {
    const products = await fetchProducts();
    return products.find((p) => p.slug === slug) || null;
  } catch {
    return null;
  }
}

export async function fetchBlogBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const posts = await fetchBlogPosts();
    return posts.find((p) => p.slug === slug || p.id === slug) || null;
  } catch {
    return null;
  }
}
