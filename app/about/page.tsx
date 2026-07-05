import Link from 'next/link';
import { Award, Building2, HandHeart, MapPin, Phone, Truck, Users, Wheat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BRAND, categories } from '@/src/data/mockData';

export const metadata = {
  title: 'Về chúng tôi',
  description:
    'Gạo Thanh Thuỷ - 30 năm uy tín phân phối gạo sỉ & lẻ tại Đà Nẵng. Kho chính tại 126 Nguyễn Lương Bằng, Hòa Khánh Bắc, Liên Chiểu.',
};

const milestones = [
  { year: '1996', title: 'Khởi nghiệp', desc: 'Bắt đầu kinh doanh gạo lẻ tại Đà Nẵng.' },
  { year: '2005', title: 'Mở rộng sỉ', desc: 'Phân phối sỉ cho quán cơm, nhà hàng.' },
  { year: '2015', title: 'Kho mới', desc: 'Kho chính 126 Nguyễn Lương Bằng, Liên Chiểu.' },
  { year: '2020', title: 'Giao hỏa tốc', desc: 'Ra mắt dịch vụ giao hỏa tốc nội thành 1-2h.' },
  { year: '2026', title: '30 năm uy tín', desc: '15 tấn/ngày, đối tác của Sun Group, Grand Tourane.' },
];

const values = [
  { icon: Award, title: 'Uy tín 30 năm', desc: 'Cam kết gạo chính hãng, nguồn gốc rõ ràng.' },
  { icon: Truck, title: 'Giao hỏa tốc', desc: 'Nội thành Đà Nẵng nhận trong 1-2 tiếng.' },
  { icon: HandHeart, title: 'Phục vụ từ thiện', desc: 'Giá sỉ tốt nhất cho chương trình từ thiện.' },
  { icon: Users, title: 'Đối tác B2B', desc: 'Phục vụ nhà hàng, quán cơm, tổ chức lớn.' },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800 py-14 text-white sm:py-20">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-gold-400 blur-3xl" />
        </div>
        <div className="container-page relative">
          <nav className="text-xs text-brand-100">
            <Link href="/" className="hover:text-white">Trang chủ</Link>
            <span className="mx-1.5">/</span>
            <span className="text-white">Về chúng tôi</span>
          </nav>
          <div className="mt-4 max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-medium backdrop-blur-sm">
              <Wheat className="h-3.5 w-3.5 text-gold-300" />
              {BRAND.yearsExperience} năm phân phối gạo tại Đà Nẵng
            </span>
            <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              Gạo Thanh Thuỷ - <span className="text-gold-300">30 năm gạo sạch Đà Nẵng</span>
            </h1>
            <p className="mt-4 text-base leading-relaxed text-brand-50 sm:text-lg">
              Từ năm 1996, chúng tôi đã trở thành đối tác tin cậy của hàng trăm gia
              đình, quán cơm, nhà hàng và tổ chức từ thiện tại Đà Nẵng và miền Trung.
              Với công suất 15 tấn mỗi ngày, Gạo Thanh Thuỷ cam kết gạo chính hãng,
              giá sỉ tốt nhất và giao hỏa tốc nội thành 1-2 tiếng.
            </p>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <div
              key={v.title}
              className="rounded-2xl border border-border bg-white p-5 shadow-soft transition-all hover:-translate-y-1 hover:shadow-card"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                <v.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-foreground">{v.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-brand-50 py-12 sm:py-16">
        <div className="container-page">
          <div className="mb-8 text-center">
            <span className="text-sm font-semibold uppercase tracking-wide text-brand-600">
              Hành trình phát triển
            </span>
            <h2 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">
              30 năm xây dựng uy tín
            </h2>
          </div>
          <div className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {milestones.map((m, idx) => (
              <div
                key={m.year}
                className="relative rounded-2xl border border-border bg-white p-5 shadow-soft"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full brand-gradient text-sm font-bold text-white">
                  {idx + 1}
                </div>
                <p className="mt-3 text-xs font-semibold text-gold-600">{m.year}</p>
                <h3 className="mt-1 text-sm font-semibold text-foreground">{m.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-white p-6 shadow-soft">
            <div className="flex items-center gap-2 text-brand-700">
              <Building2 className="h-5 w-5" />
              <h2 className="text-lg font-semibold">Thông tin liên hệ</h2>
            </div>
            <ul className="mt-4 space-y-4 text-sm">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
                <div>
                  <p className="font-medium text-foreground">Kho chính</p>
                  <p className="text-muted-foreground">{BRAND.address}</p>
                </div>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
                <div>
                  <p className="font-medium text-foreground">Hotline / Zalo</p>
                  <a href={`tel:${BRAND.hotlineRaw}`} className="text-muted-foreground hover:text-brand-700">
                    {BRAND.hotline}
                  </a>
                </div>
              </li>
              <li className="flex gap-3">
                <Wheat className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
                <div>
                  <p className="font-medium text-foreground">Danh mục chính</p>
                  <p className="text-muted-foreground">
                    {categories.map((c) => c.label).join(' · ')}
                  </p>
                </div>
              </li>
            </ul>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <Link href="/products" className="flex-1">
                <Button className="w-full bg-brand-600 text-white hover:bg-brand-700">
                  Xem catalogue gạo
                </Button>
              </Link>
              <a href={`tel:${BRAND.hotlineRaw}`} className="flex-1">
                <Button variant="outline" className="w-full border-brand-200 text-brand-700 hover:bg-brand-50">
                  <Phone className="mr-2 h-4 w-4" />
                  Gọi hotline
                </Button>
              </a>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-soft">
            <div className="aspect-[4/3] w-full bg-brand-50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.pexels.com/photos/1393382/pexels-photo-1393382.jpeg?auto=compress&cs=tinysrgb&w=900"
                alt="Kho gạo Thanh Thuỷ Đà Nẵng"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-5">
              <h3 className="text-base font-semibold text-foreground">
                Kho & showroom Đà Nẵng
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {BRAND.address}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Giờ làm việc: {BRAND.hours}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
