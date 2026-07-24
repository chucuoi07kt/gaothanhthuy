import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getProductsFromSheet } from '@/src/lib/sheets';
import { normalizeProduct } from '@/src/lib/products';
import { BRAND } from '@/src/lib/brand';
import {
  buildProductSchema,
  buildProductBreadcrumbSchema,
  buildProductFaqSchema,
} from '@/src/lib/seo';
import ProductDetailClient from './ProductDetailClient';
import type { Product } from '@/src/types';

interface PageProps {
  params: Promise<{ slug: string }>;
}

const SITE_URL = `https://${BRAND.domain}`;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  try {
    const allProducts = await getProductsFromSheet();
    const found = allProducts.find((p) => p.slug === resolvedParams.slug);
    if (!found) return {};
    const product = normalizeProduct(found);
    const url = `${SITE_URL}/san-pham/${product.slug}`;

    return {
      title: `${product.name} - ${product.categoryLabel} | Giao hỏa tốc Đà Nẵng`,
      description: product.shortDescription || product.longDescription || `${product.name} - ${product.categoryLabel} chính hãng, giá sỉ tốt nhất tại Đà Nẵng. Giao hỏa tốc 1-2 giờ.`,
      keywords: [
        product.name,
        product.categoryLabel,
        'gạo Đà Nẵng',
        'gạo sỉ Đà Nẵng',
        BRAND.name,
        'giao gạo hỏa tốc Đà Nẵng',
        'báo giá gạo sỉ',
        product.origin,
      ],
      alternates: {
        canonical: url,
      },
      openGraph: {
        type: 'website',
        locale: 'vi_VN',
        url,
        siteName: BRAND.name,
        title: `${product.name} - ${product.categoryLabel} | ${BRAND.name}`,
        description: product.shortDescription || product.longDescription || `${product.name} chính hãng, giá sỉ tốt nhất tại Đà Nẵng.`,
        images: [
          {
            url: product.image,
            width: 1200,
            height: 630,
            alt: product.name,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${product.name} - ${product.categoryLabel} | ${BRAND.name}`,
        description: product.shortDescription || product.longDescription || `${product.name} chính hãng, giá sỉ tốt nhất tại Đà Nẵng.`,
        images: [
          {
            url: product.image,
            alt: product.name,
          },
        ],
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

export default async function ProductDetailPage({ params }: PageProps) {
  const resolvedParams = await params;

  let product: Product | null = null;
  let related: Product[] = [];

  try {
    const allProducts = await getProductsFromSheet();
    if (!Array.isArray(allProducts) || allProducts.length === 0) {
      notFound();
    }

    const found = allProducts.find((p) => p.slug === resolvedParams.slug);
    if (!found) {
      notFound();
    }

    product = normalizeProduct(found);

    const relatedRaw = allProducts
      .filter((p) => p.slug !== product!.slug && p.category === product!.category)
      .slice(0, 4);
    related = relatedRaw.map(normalizeProduct);
  } catch {
    notFound();
  }

  if (!product) {
    notFound();
  }

  const productSchema = buildProductSchema(product);
  const breadcrumbSchema = buildProductBreadcrumbSchema(product);
  const faqSchema = buildProductFaqSchema(product);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <ProductDetailClient slug={resolvedParams.slug} initialProduct={product} related={related} />
    </>
  );
}
