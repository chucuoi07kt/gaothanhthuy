'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ArrowRight, MessageCircle, Phone, ShoppingBag, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BRAND } from '@/src/lib/brand';
import { fetchProducts } from '@/src/lib/products';
import { ProductCard } from '@/src/components/ProductCard';
import { quickZaloConsult } from '@/src/lib/zalo';
import { useCartStore } from '@/src/store/cartStore';
import type { Product } from '@/src/types';

export function BlogCta() {
  const [products, setProducts] = useState<Product[]>([]);

  const setOpen = useCartStore((s) => s.setOpen);

  useEffect(() => {
    (async () => {
      try {
        const all = await fetchProducts();
        const bestSellers = all.filter((p) => p.bestSeller);
        const chosen = bestSellers.length >= 2 ? bestSellers : all;
        setProducts(chosen.slice(0, 4));
      } catch {
        setProducts([]);
      }
    })();
  }, []);

  return (
    <>
      {/* Banner Gạo Thanh Thủy */}
      <div className="overflow-hidden rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-700 via-brand-800 to-brand-900 p-4 text-white shadow-card sm:rounded-3xl sm:p-6 lg:p-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:gap-6 lg:flex-row">
          <div className="flex items-center gap-3 sm:gap-4">
            <Image
              src="/logo.png"
              alt={`Logo ${BRAND.name}`}
              width={48}
              height={48}
              className="h-12 w-auto object-contain sm:h-16"
            />
            <div className="min-w-0">
              <h3 className="text-base font-bold sm:text-lg lg:text-xl">{BRAND.name}</h3>
              <p className="mt-0.5 text-xs text-brand-100 sm:text-sm">
                {BRAND.yearsExperience} năm uy tín · Giao hỏa tốc Đà Nẵng 1-2h
              </p>
            </div>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <a href={`tel:${BRAND.hotlineRaw}`} className="inline-flex flex-1 sm:flex-none">
              <Button
                size="sm"
                className="w-full gap-2 bg-white text-brand-700 hover:bg-brand-50 sm:size-lg sm:w-auto"
              >
                <Phone className="h-4 w-4 sm:h-5 sm:w-5" /> <span className="text-xs sm:text-sm">{BRAND.hotline}</span>
              </Button>
            </a>
            <Button
              onClick={() => quickZaloConsult()}
              size="sm"
              className="flex-1 gap-2 bg-zalo text-white hover:bg-zalo/90 sm:size-lg sm:flex-none"
            >
              <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" /> <span className="text-xs sm:text-sm">Tư vấn Zalo</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Products section */}
      <div className="mt-6 sm:mt-8">
        <div className="mb-4 flex items-center justify-between sm:mb-5">
          <div className="flex items-center gap-2">
            <div className="h-6 w-1 rounded-full bg-brand-600" />
            <h3 className="text-lg font-bold text-foreground sm:text-xl lg:text-2xl">
              Sản phẩm nổi bật
            </h3>
          </div>
          <Link
            href="/products"
            className="hidden items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700 sm:flex"
          >
            Xem tất cả sản phẩm
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:mt-6 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/products">
            <Button
              variant="outline"
              className="gap-2 border-brand-200 text-brand-700 hover:bg-brand-50"
            >
              <ShoppingBag className="h-4 w-4" />
              Xem tất cả sản phẩm
            </Button>
          </Link>
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center justify-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-700"
          >
            <ShoppingBag className="h-4 w-4" /> Xem danh sách báo giá
          </button>
        </div>
      </div>

      {/* Contact strip */}
      <div className="mt-5 flex flex-col items-center gap-3 rounded-2xl border border-border bg-brand-50/40 p-4 sm:mt-6 sm:flex-row sm:justify-between sm:p-5 sm:gap-4">
        <div className="flex items-center gap-3">
          <Truck className="h-7 w-7 shrink-0 text-brand-600 sm:h-8 sm:w-8" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">
              Cần tư vấn báo giá sỉ gạo tại Đà Nẵng?
            </p>
            <p className="text-xs text-muted-foreground">
              Giao hỏa tốc nội thành 1-2h · {BRAND.address}
            </p>
          </div>
        </div>
        <div className="flex w-full gap-2 sm:w-auto">
          <a href={`tel:${BRAND.hotlineRaw}`} className="inline-flex flex-1 sm:flex-none">
            <Button className="flex-1 gap-2 bg-brand-600 text-white hover:bg-brand-700 sm:flex-none">
              <Phone className="h-4 w-4" /> <span className="sm:hidden">Gọi</span><span className="hidden sm:inline">Gọi {BRAND.hotline}</span>
            </Button>
          </a>
          <Button
            onClick={() => quickZaloConsult()}
            className="flex-1 gap-2 bg-zalo text-white hover:bg-zalo/90 sm:flex-none"
          >
            <MessageCircle className="h-4 w-4" /> Zalo
          </Button>
        </div>
      </div>
    </>
  );
}
