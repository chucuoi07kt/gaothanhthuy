'use client';

import Link from 'next/link';
import { Wheat, Phone, MapPin, Clock, Mail, MessageCircle } from 'lucide-react';
import { BRAND } from '@/src/lib/brand';
import { categories } from '@/src/lib/categories';
import { quickZaloConsult } from '@/src/lib/zalo';

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-brand-800 text-brand-50">
      <div className="container-page py-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                <Wheat className="h-5 w-5 text-gold-400" />
              </div>
              <div className="leading-tight">
                <span className="block text-base font-bold text-white">
                  Gạo Thanh Thuỷ
                </span>
                <span className="text-[11px] text-brand-200">
                  {BRAND.yearsExperience} năm uy tín · Đà Nẵng
                </span>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-brand-100">
              Phân phối gạo sỉ & lẻ uy tín tại Đà Nẵng. Giao hỏa tốc nội thành
              1-2 tiếng, phục vụ hàng trăm quán cơm, nhà hàng, tổ chức từ thiện.
            </p>
            <button
              onClick={() => quickZaloConsult()}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-zalo px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-zalo/90"
            >
              <MessageCircle className="h-4 w-4" />
              Tư vấn qua Zalo
            </button>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-gold-400">
              Danh mục gạo
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/products?category=${c.slug}`}
                    className="text-brand-100 transition-colors hover:text-white"
                  >
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-gold-400">
              Liên hệ
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-brand-100">
              <li className="flex gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                <span>{BRAND.address}</span>
              </li>
              <li className="flex gap-2.5">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                <a href={`tel:${BRAND.hotlineRaw}`} className="hover:text-white">
                  {BRAND.hotline}
                </a>
              </li>
              <li className="flex gap-2.5">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                <span>{BRAND.email}</span>
              </li>
              <li className="flex gap-2.5">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                <span>{BRAND.hours}</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-gold-400">
              Cam kết
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm text-brand-100">
              <li>· Gạo chính hãng, nguồn gốc rõ ràng</li>
              <li>· Giá sỉ tốt nhất khu vực Liên Chiểu</li>
              <li>· Giao hỏa tốc nội thành Đà Nẵng 1-2h</li>
              <li>· Phục vụ B2B: nhà hàng, quán cơm, từ thiện</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-brand-200 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {BRAND.name} - {BRAND.domain}. Mọi quyền
            được bảo lưu.
          </p>
          <p>Thiết kế bởi Gạo Thanh Thuỷ · Made in Đà Nẵng</p>
        </div>
      </div>
    </footer>
  );
}
