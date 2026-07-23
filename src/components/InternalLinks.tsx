import Link from 'next/link';

interface InternalLink {
  href: string;
  label: string;
}

const INTERNAL_LINKS: InternalLink[] = [
  { href: '/products', label: 'Catalogue gạo sỉ Đà Nẵng' },
  { href: '/products?category=gao-an-gia-dinh', label: 'Gạo ăn gia đình' },
  { href: '/products?category=gao-quan-com-nha-hang', label: 'Gạo quán cơm - nhà hàng' },
  { href: '/products?category=gao-tu-thien', label: 'Gạo từ thiện' },
  { href: '/products?category=gao-nau-bun-mi-pho', label: 'Gạo nấu bún - mì - phở' },
  { href: '/blog', label: 'Cẩm nang gạo & tin tức' },
  { href: '/about', label: 'Về Gạo Thanh Thủy' },
];

export function InternalLinks() {
  return (
    <div className="mt-8 rounded-2xl border border-border bg-white p-5 shadow-soft">
      <h3 className="text-sm font-semibold text-foreground">Liên kết nội bộ</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {INTERNAL_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-full border border-border bg-brand-50/40 px-3 py-1.5 text-xs font-medium text-brand-700 transition-all hover:border-brand-300 hover:bg-brand-50"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
