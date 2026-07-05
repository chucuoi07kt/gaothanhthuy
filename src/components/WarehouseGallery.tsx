'use client';

import { Warehouse, Truck, PackageCheck, Boxes } from 'lucide-react';

const galleryImages = [
  {
    src: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=compress&cs=tinysrgb&w=900&q=80',
    alt: 'Kho gạo quy mô lớn tại Đà Nẵng',
    label: 'Kho chính 126 Nguyễn Lương Bằng',
    span: 'lg:row-span-2',
  },
  {
    src: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=compress&cs=tinysrgb&w=900&q=80',
    alt: 'Đóng bao gạo sỉ sẵn sàng giao',
    label: 'Đóng gói sỉ - 5/10/25/50kg',
    span: '',
  },
  {
    src: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=compress&cs=tinysrgb&w=900&q=80',
    alt: 'Xe tải giao gạo hỏa tốc',
    label: 'Đội xe giao hỏa tốc 1-2h',
    span: '',
  },
  {
    src: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=compress&cs=tinysrgb&w=900&q=80',
    alt: 'Hàng trăm bao gạo trong kho',
    label: 'Năng lực 15 tấn/ngày',
    span: 'lg:col-span-2',
  },
];

const stats = [
  { icon: Warehouse, value: '500m²', label: 'Diện tích kho' },
  { icon: Boxes, value: '15 tấn', label: 'Năng lực mỗi ngày' },
  { icon: Truck, value: '1-2 giờ', label: 'Giao hỏa tốc nội thành' },
  { icon: PackageCheck, value: '500+', label: 'Đối tác B2B' },
];

export function WarehouseGallery() {
  return (
    <section className="section-pad bg-brand-50/60">
      <div className="container-page">
        <div className="mb-8 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-3.5 py-1.5 text-xs font-semibold text-brand-700">
            <Warehouse className="h-3.5 w-3.5" />
            Kho bãi & năng lực phân phối
          </span>
          <h2 className="mt-3 text-2xl font-bold text-foreground sm:text-3xl">
            Hệ thống Kho Bãi & Phân Phối Trực Tiếp
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Quy mô lớn tại 126 Nguyễn Lương Bằng, Đà Nẵng - Đảm bảo nguồn cung
            15 tấn/ngày, sẵn sàng giao hỏa tốc 1-2h cho mọi đối tác.
          </p>
        </div>

        <div className="grid auto-rows-[180px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {galleryImages.map((img, idx) => (
            <div
              key={idx}
              className={`group relative cursor-pointer overflow-hidden rounded-2xl shadow-md transition-transform duration-300 hover:scale-105 ${img.span}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 p-4">
                <span className="rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-brand-700 backdrop-blur">
                  {img.label}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="flex items-center gap-3 rounded-2xl border border-border bg-white p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-card"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-lg font-bold text-brand-700">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
