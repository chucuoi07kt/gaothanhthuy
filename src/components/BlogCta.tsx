'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ArrowRight, Check, MapPin, MessageCircle, Phone, Plus, ShoppingBag, Truck } from 'lucide-react';
import { toast } from 'sonner';
import { cn, getFirstImage } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProductImage } from '@/src/components/ProductImage';
import { BRAND } from '@/src/lib/brand';
import { fetchProducts } from '@/src/lib/products';
import { quickZaloConsult } from '@/src/lib/zalo';
import { useCartStore } from '@/src/store/cartStore';
import type { Product } from '@/src/types';

export function BlogCta() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedWeights, setSelectedWeights] = useState<Record<string, string>>({});
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  const addItem = useCartStore((s) => s.addItem);
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

  const getWeight = (p: Product) =>
    selectedWeights[p.id] ?? p.weights[0] ?? '5kg';

  const handleAdd = (p: Product) => {
    const weight = getWeight(p) as Product['weights'][number];
    addItem(p, weight, 1);
    setAddedIds((prev) => ({ ...prev, [p.id]: true }));
    toast.success(`Đã thêm "${p.name} - ${weight}" vào danh sách báo giá`);
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [p.id]: false }));
    }, 1600);
  };

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

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {products.map((p) => {
            const weight = getWeight(p);
            const added = !!addedIds[p.id];
            return (
              <div
                key={p.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
              >
                <Link
                  href={`/products/${p.slug}`}
                  className="relative block aspect-[4/3] overflow-hidden"
                >
                  <ProductImage
                    src={getFirstImage(p.image)}
                    alt={p.name}
                    rounded="rounded-none"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {p.bestSeller && (
                    <Badge className="absolute left-3 top-3 bg-gold-500 text-white shadow-soft">
                      Bán chạy
                    </Badge>
                  )}
                  <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-brand-700 backdrop-blur">
                    <MapPin className="h-3 w-3" />
                    {p.origin}
                  </div>
                </Link>

                <div className="flex flex-1 flex-col p-3 sm:p-4">
                  <Link href={`/products/${p.slug}`}>
                    <h4 className="line-clamp-1 text-sm font-semibold text-foreground transition-colors group-hover:text-brand-700">
                      {p.name}
                    </h4>
                  </Link>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                    {p.shortDescription}
                  </p>

                  <div className="mt-2 flex flex-wrap gap-1.5 sm:mt-2.5">
                    {p.weights.slice(0, 3).map((w) => (
                      <button
                        key={w}
                        onClick={() =>
                          setSelectedWeights((prev) => ({ ...prev, [p.id]: w }))
                        }
                        className={cn(
                          'rounded-full border px-2.5 py-0.5 text-xs font-medium transition-all',
                          weight === w
                            ? 'border-brand-600 bg-brand-600 text-white'
                            : 'border-border bg-white text-muted-foreground hover:border-brand-400 hover:text-brand-700'
                        )}
                      >
                        {w}
                      </button>
                    ))}
                  </div>

                  <div className="mt-2 flex items-end justify-between sm:mt-2.5">
                    <div>
                      <span className="text-xs text-muted-foreground">Giá tham khảo</span>
                      <p className="text-base font-bold text-brand-700">
                        {p.pricePerKg.toLocaleString('vi-VN')}đ
                        <span className="text-xs font-normal text-muted-foreground">/kg</span>
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <Button
                      onClick={() => handleAdd(p)}
                      size="sm"
                      className={cn(
                        'flex-1 gap-1.5 text-xs transition-all',
                        added
                          ? 'bg-brand-700 text-white'
                          : 'bg-brand-600 text-white hover:bg-brand-700'
                      )}
                    >
                      {added ? (
                        <>
                          <Check className="h-3.5 w-3.5" /> Đã thêm
                        </>
                      ) : (
                        <>
                          <Plus className="h-3.5 w-3.5" /> Báo giá
                        </>
                      )}
                    </Button>
                    <Link href={`/products/${p.slug}`}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-brand-200 px-3 text-xs text-brand-700 hover:bg-brand-50"
                      >
                        Xem
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
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
