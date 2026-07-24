import type { Metadata } from 'next';
import { BRAND } from '@/src/lib/brand';
import { buildBlogListBreadcrumbSchema } from '@/src/lib/seo';

const SITE_URL = `https://${BRAND.domain}`;

export const metadata: Metadata = {
  title: 'Cẩm nang gạo & tin tức thị trường',
  description:
    'Hướng dẫn chọn gạo, bảng giá sỉ, cách bảo quản gạo đúng cách. Tin tức thị trường gạo Đà Nẵng, mẹo nấu cơm ngon từ Gạo Ngọc Anh.',
  keywords: [
    'cẩm nang gạo',
    'hướng dẫn chọn gạo',
    'bảo quản gạo',
    'giá gạo sỉ Đà Nẵng',
    'tin tức gạo',
    'gạo Ngọc Anh',
    BRAND.name,
  ],
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: `${SITE_URL}/blog`,
    siteName: BRAND.name,
    title: 'Cẩm nang gạo & tin tức thị trường | Gạo Ngọc Anh',
    description:
      'Hướng dẫn chọn gạo, bảng giá sỉ, cách bảo quản gạo đúng cách. Tin tức thị trường gạo Đà Nẵng.',
    images: [
      {
        url: `${SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Cẩm nang gạo & tin tức thị trường - Gạo Ngọc Anh',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cẩm nang gạo & tin tức thị trường | Gạo Ngọc Anh',
    description:
      'Hướng dẫn chọn gạo, bảng giá sỉ, cách bảo quản gạo đúng cách.',
    images: [`${SITE_URL}/og-image.jpg`],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const breadcrumbSchema = buildBlogListBreadcrumbSchema();

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {children}
    </>
  );
}
