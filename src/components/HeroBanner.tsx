'use client';

import Link from 'next/link';
import { ArrowRight, MessageCircle, Truck, Award, TrendingUp, Wheat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BRAND } from '@/src/lib/brand';
import { quickZaloConsult } from '@/src/lib/zalo';

const trustBadges = [
  { icon: Award, value: '30 Năm', label: 'Uy tín phân phối' },
  { icon: TrendingUp, value: '15 Tấn/Ngày', label: 'Công suất giao' },
  { icon: Truck, value: '1-2 giờ', label: 'Giao hỏa tốc Đà Nẵng' },
];

export function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-800 via-brand-700 to-brand-900">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-gold-400 blur-3xl" />
        <div className="absolute right-0 top-40 h-80 w-80 rounded-full bg-brand-400 blur-3xl" />
      </div>

      <div className="container-page relative grid items-center gap-8 py-12 sm:py-16 lg:grid-cols-2 lg:py-20">
        <div className="text-white animate-fade-in-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium backdrop-blur-md">
            <Wheat className="h-3.5 w-3.5 text-gold-300" />
            Phân phối gạo sỉ uy tín tại Đà Nẵng từ 1996
          </div>

          <h1 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight text-balance drop-shadow-md sm:text-4xl lg:text-5xl">
            Gạo sạch sỉ &amp; lẻ -{' '}
            <span className="text-gold-300 drop-shadow">Giao hỏa tốc Đà Nẵng 1-2 giờ</span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/90 drop-shadow-sm sm:text-lg">
            {BRAND.name} - {BRAND.yearsExperience} năm phân phối gạo chính hãng.
            Phục vụ gia đình, quán cơm, nhà hàng, chương trình từ thiện với giá
            sỉ tốt nhất khu vực.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link href="/products">
              <Button
                size="lg"
                className="w-full gap-2 bg-gold-500 text-white shadow-lg shadow-gold-500/20 transition-all hover:bg-gold-600 hover:shadow-xl hover:shadow-gold-500/30 sm:w-auto"
              >
                Xem catalogue gạo
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Button
              onClick={() => quickZaloConsult()}
              size="lg"
              variant="outline"
              className="w-full gap-2 border-white/30 bg-white/10 text-white backdrop-blur-md transition-all hover:bg-white/20 hover:text-white sm:w-auto"
            >
              <MessageCircle className="h-4 w-4" />
              Tư vấn nhận báo giá sỉ
            </Button>
          </div>

          <div className="mt-9 grid grid-cols-3 gap-3">
            {trustBadges.map((b) => (
              <div
                key={b.label}
                className="flex h-full flex-col items-center rounded-xl border border-white/15 bg-white/10 p-3 text-center backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/15 hover:shadow-lg hover:shadow-black/10"
              >
                <b.icon className="h-5 w-5 text-gold-300" />
                <p className="mt-2 text-sm font-bold text-white drop-shadow-sm">{b.value}</p>
                <p className="mt-0.5 text-[11px] leading-tight text-brand-100">{b.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative hidden lg:block">
          <div className="relative mx-auto aspect-square max-w-md overflow-hidden rounded-3xl border-4 border-white/20 shadow-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.pexels.com/photos/723198/pexels-photo-723198.jpeg?auto=compress&cs=tinysrgb&w=900"
              alt="Gạo Ngọc Anh - gạo sạch Đà Nẵng"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-4 -left-4 rounded-2xl bg-white p-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl brand-gradient">
                <Truck className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">
                  Giao hỏa tốc
                </p>
                <p className="text-xs text-muted-foreground">
                  Nội thành Đà Nẵng 1-2 giờ
                </p>
              </div>
            </div>
          </div>
          <div className="absolute -right-2 top-8 rounded-2xl bg-gold-500 px-4 py-3 text-white shadow-xl">
            <p className="text-2xl font-bold leading-none">15T</p>
            <p className="text-[11px]">mỗi ngày</p>
          </div>
        </div>
      </div>
    </section>
  );
}
