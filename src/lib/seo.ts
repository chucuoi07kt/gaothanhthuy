import { BRAND } from '@/src/lib/brand';
import type { BlogPost } from '@/src/types';

export function buildArticleSchema(post: BlogPost, publishedISO: string) {
  const url = `https://${BRAND.domain}/blog/${post.slug}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${url}#article`,
    headline: post.title,
    description: post.excerpt,
    image: [post.image],
    datePublished: publishedISO,
    dateModified: publishedISO,
    author: {
      '@type': 'Organization',
      name: post.author,
      url: `https://${BRAND.domain}`,
    },
    publisher: {
      '@type': 'Organization',
      name: BRAND.name,
      logo: {
        '@type': 'ImageObject',
        url: `https://${BRAND.domain}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    articleSection: post.category,
  };
}

export function buildBreadcrumbSchema(post: BlogPost) {
  const url = `https://${BRAND.domain}/blog/${post.slug}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Trang chủ',
        item: `https://${BRAND.domain}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Tin tức',
        item: `https://${BRAND.domain}/blog`,
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
          text: `Có, Gạo ${BRAND.shortName} cung cấp đa dạng dòng gạo chất lượng tại Đà Nẵng. Quý khách có thể xem toàn bộ catalogue tại https://${BRAND.domain}/products hoặc liên hệ ${BRAND.hotline} để được tư vấn chi tiết.`,
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
