import Link from 'next/link';
import { ArrowRight, Building2, HandHeart, Utensils, Home, Wheat } from 'lucide-react';
import { categories } from '@/src/lib/categories';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ElementType> = {
  home: Home,
  utensils: Utensils,
  heart: HandHeart,
  wheat: Wheat,
};

export function CategoryShowcase() {
  return (
    <section className="section-pad">
      <div className="container-page">
        <div className="mb-8 text-center">
          <span className="text-sm font-semibold uppercase tracking-wide text-brand-600">
            Danh mục sản phẩm
          </span>
          <h2 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">
            4 dòng gạo phục vụ mọi nhu cầu
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Từ gạo gia đình đến gạo quán cơm, từ thiện, nấu bún phở
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c, idx) => {
            const Icon = iconMap[c.icon] ?? Wheat;
            return (
              <Link
                key={c.slug}
                href={`/products?category=${c.slug}`}
                className="group relative overflow-hidden rounded-2xl border border-border bg-white p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-foreground">
                  {c.label}
                </h3>
                <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
                  {c.description}
                </p>
                <div className="mt-3 flex items-center gap-1 text-sm font-medium text-brand-600 opacity-0 transition-opacity group-hover:opacity-100">
                  Xem sản phẩm
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function BrandStory() {
  const partners = ['Sun Group', 'Grand Tourane Resort', 'FPT City Đà Nẵng', 'Vinpearl'];
  return (
    <section className="bg-brand-50 py-12 sm:py-16 lg:py-20">
      <div className="container-page grid items-center gap-10 lg:grid-cols-2">
        <div>
          <span className="text-sm font-semibold uppercase tracking-wide text-brand-600">
            Về Gạo Thanh Thuỷ
          </span>
          <h2 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">
            Gần 30 năm uy tín phân phối gạo tại Đà Nẵng
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Từ năm 1996, Gạo Thanh Thuỷ đã trở thành đối tác tin cậy của hàng
            trăm gia đình, quán cơm, nhà hàng và tổ chức từ thiện tại Đà Nẵng và
            miền Trung. Với công suất phân phối 15 tấn mỗi ngày, chúng tôi cam
            kết gạo chính hãng, giá sỉ tốt nhất và giao hỏa tốc nội thành trong
            1-2 tiếng.
          </p>
          <ul className="mt-5 space-y-2.5">
            {[
              'Kho chính: 126 Nguyễn Lương Bằng, Hòa Khánh Bắc, Liên Chiểu',
              'Giao hỏa tốc nội thành Đà Nẵng - nhận trong 1-2 tiếng',
              'Phục vụ B2B: nhà hàng, quán cơm, chương trình từ thiện',
              'Gạo chính hãng, nguồn gốc rõ ràng, không tẩm ướp',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-foreground/80">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="rounded-2xl border border-border bg-white p-6 shadow-soft">
            <div className="flex items-center gap-2 text-brand-700">
              <Building2 className="h-5 w-5" />
              <h3 className="text-base font-semibold">Đối tác chiến lược</h3>
            </div>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Được tin dùng bởi các thương hiệu lớn tại Đà Nẵng và miền Trung
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {partners.map((p) => (
                <div
                  key={p}
                  className={cn(
                    'flex items-center justify-center rounded-xl border border-border bg-brand-50/50 px-4 py-4 text-center text-sm font-semibold text-brand-800'
                  )}
                >
                  {p}
                </div>
              ))}
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3 border-t border-border pt-5">
              <Stat value="30+" label="Năm kinh nghiệm" />
              <Stat value="15T" label="Phân phối/ngày" />
              <Stat value="500+" label="Khách hàng B2B" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="text-xl font-bold text-brand-700">{value}</p>
      <p className="text-[11px] text-muted-foreground">{label}</p>
    </div>
  );
}
