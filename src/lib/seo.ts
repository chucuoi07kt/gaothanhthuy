import { BRAND } from '@/src/lib/brand';
import type { BlogPost, Product } from '@/src/types';

const SITE_URL = `https://${BRAND.domain}`;

export function buildArticleSchema(post: BlogPost, publishedISO: string) {
  const url = `${SITE_URL}/blog/${post.slug}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${url}#article`,
    headline: post.title,
    description: post.excerpt,
    image: [
      {
        '@type': 'ImageObject',
        url: post.image,
        width: 1200,
        height: 675,
      },
    ],
    datePublished: publishedISO,
    dateModified: publishedISO,
    author: {
      '@type': 'Organization',
      name: post.author,
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: BRAND.name,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
        width: 512,
        height: 512,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    articleSection: post.category,
    wordCount: post.content
      ? post.content.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length
      : 0,
    keywords: [
      post.category,
      'gạo Đà Nẵng',
      'gạo sỉ Đà Nẵng',
      BRAND.name,
    ].join(', '),
    inLanguage: 'vi-VN',
  };
}

export function buildBreadcrumbSchema(post: BlogPost) {
  const url = `${SITE_URL}/blog/${post.slug}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Trang chủ',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Tin tức',
        item: `${SITE_URL}/blog`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: url,
      },
    ],
  };
}

export function buildBlogListBreadcrumbSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Trang chủ',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Tin tức',
        item: `${SITE_URL}/blog`,
      },
    ],
  };
}

export function buildBlogListSchema(posts: BlogPost[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Cẩm nang gạo & tin tức thị trường',
    description:
      'Hướng dẫn chọn gạo, bảng giá sỉ, cách bảo quản gạo đúng cách. Tin tức thị trường gạo Đà Nẵng.',
    url: `${SITE_URL}/blog`,
    publisher: {
      '@type': 'Organization',
      name: BRAND.name,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
      },
    },
    blogPost: posts.slice(0, 10).map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt,
      url: `${SITE_URL}/blog/${post.slug}`,
      datePublished: post.publishedAt,
      image: post.image,
      author: {
        '@type': 'Organization',
        name: post.author,
      },
    })),
  };
}

export function buildFaqSchema(post: BlogPost) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `${post.title} — Gạo ${BRAND.shortName} có cung cấp không?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Có, Gạo ${BRAND.shortName} cung cấp đa dạng dòng gạo chất lượng tại Đà Nẵng. Quý khách có thể xem toàn bộ catalogue tại ${SITE_URL}/products hoặc liên hệ ${BRAND.hotline} để được tư vấn chi tiết.`,
        },
      },
      {
        '@type': 'Question',
        name: 'Làm thế nào để đặt mua gạo sỉ tại Đà Nẵng?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Quý khách thêm sản phẩm vào danh sách báo giá trên website, sau đó gửi yêu cầu qua Zalo ${BRAND.zalo} hoặc gọi hotline ${BRAND.hotline}. Nhân viên Gạo ${BRAND.shortName} sẽ phản hồi báo giá sỉ nhanh chóng.`,
        },
      },
      {
        '@type': 'Question',
        name: `Gạo ${BRAND.shortName} có giao hỏa tốc tại Đà Nẵng không?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Có, Gạo ${BRAND.shortName} giao hỏa tốc nội thành Đà Nẵng trong 1-2 giờ. Vui lòng liên hệ ${BRAND.hotline} để đặt giao nhanh.`,
        },
      },
      {
        '@type': 'Question',
        name: 'Giá sỉ gạo tại Gạo Thanh Thủy như thế nào?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Giá sỉ tuỳ thuộc vào loại gạo và số lượng đặt mua. Quý khách vui lòng gửi danh sách báo giá qua Zalo hoặc gọi ${BRAND.hotline} để nhận báo giá sỉ tốt nhất.`,
        },
      },
    ],
  };
}

export function buildJsonLdScripts(
  post: BlogPost,
  publishedISO: string
): { type: string; data: Record<string, unknown> }[] {
  return [
    { type: 'article', data: buildArticleSchema(post, publishedISO) },
    { type: 'breadcrumb', data: buildBreadcrumbSchema(post) },
    { type: 'faq', data: buildFaqSchema(post) },
  ];
}

export function buildProductSchema(product: Product) {
  const url = `${SITE_URL}/san-pham/${product.slug}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${url}#product`,
    name: product.name,
    description: product.shortDescription || product.longDescription || '',
    image: product.image,
    category: product.categoryLabel,
    brand: {
      '@type': 'Brand',
      name: BRAND.name,
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'VND',
      price: product.pricePerKg || 0,
      availability: 'https://schema.org/InStock',
      url,
      seller: {
        '@type': 'Organization',
        name: BRAND.name,
      },
    },
    url,
    inLanguage: 'vi-VN',
  };
}

export function buildProductBreadcrumbSchema(product: Product) {
  const url = `${SITE_URL}/san-pham/${product.slug}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Trang chủ',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Catalogue',
        item: `${SITE_URL}/products`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.categoryLabel,
        item: `${SITE_URL}/products?category=${product.category}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: product.name,
        item: url,
      },
    ],
  };
}

export function buildProductFaqSchema(product: Product) {
  const url = `${SITE_URL}/san-pham/${product.slug}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `${product.name} có giá bao nhiêu?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Giá tham khảo cho ${product.name} là ${(product.pricePerKg || 0).toLocaleString('vi-VN')}đ/kg. Để nhận báo giá sỉ tốt nhất, vui lòng liên hệ ${BRAND.hotline} hoặc gửi yêu cầu qua Zalo ${BRAND.zalo}.`,
        },
      },
      {
        '@type': 'Question',
        name: `${product.name} có giao hỏa tốc tại Đà Nẵng không?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Có, ${BRAND.name} giao hỏa tốc nội thành Đà Nẵng trong 1-2 giờ. Vui lòng liên hệ ${BRAND.hotline} để đặt giao nhanh.`,
        },
      },
      {
        '@type': 'Question',
        name: `Tôi có thể mua ${product.name} với số lượng sỉ không?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Có, ${BRAND.name} chuyên phân phối gạo sỉ cho quán cơm, nhà hàng, đại lý. Quý khách thêm sản phẩm vào danh sách báo giá tại ${url} hoặc liên hệ ${BRAND.hotline} để nhận báo giá sỉ.`,
        },
      },
    ],
  };
}
