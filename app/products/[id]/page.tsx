'use client';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useState } from 'react';
import { ArrowLeft, Check, MapPin, MessageCircle, Plus, ShoppingBag, Truck, Wheat } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProductImage } from '@/src/components/ProductImage';
import { VisualMeters } from '@/src/components/VisualMeters';
import { ProductCard } from '@/src/components/ProductCard';
import { getProductBySlug, products, BRAND } from '@/src/data/mockData';
import { useCartStore } from '@/src/store/cartStore';
import { quickZaloConsult } from '@/src/lib/zalo';
import type { WeightOption } from '@/src/types';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = getProductBySlug(params.id);
  if (!product) notFound();

  const [selectedWeight, setSelectedWeight] = useState<WeightOption>(
    product.weights[0]
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const setOpen = useCartStore((s) => s.setOpen);

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAdd = () => {
    addItem(product, selectedWeight, quantity);
    setAdded(true);
    toast.success(
      `Đã thêm ${quantity}x "${product.name} - ${selectedWeight}" vào danh sách báo giá`
    );
    setTimeout(() => setAdded(false), 1800);
  };

  const handleZalo = () => {
    const msg = `Kính gửi Gạo Thanh Thuỷ, tôi muốn tư vấn báo giá sỉ cho: ${product.name} - quy cách ${selectedWeight} - số lượng ${quantity}. Xin cảm ơn!`;
    quickZaloConsult(msg);
  };

  return (
    <>
      <section className="border-b border-border bg-gradient-to-br from-brand-50 to-white py-6">
        <div className="container-page">
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-brand-700">Trang chủ</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-brand-700">Catalogue</Link>
            <span>/</span>
            <Link
              href={`/products?category=${product.category}`}
              className="hover:text-brand-700"
            >
              {product.categoryLabel}
            </Link>
            <span>/</span>
            <span className="line-clamp-1 text-brand-700">{product.name}</span>
          </nav>
        </div>
      </section>

      <section className="section-pad pt-8">
        <div className="container-page grid gap-8 lg:grid-cols-2">
          <div className="space-y-3">
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-white shadow-soft">
              <ProductImage
                src={product.image}
                alt={product.name}
                rounded="rounded-none"
                className="h-full w-full"
              />
              {product.bestSeller && (
                <Badge className="absolute left-4 top-4 bg-gold-500 text-white">
                  Bán chạy
                </Badge>
              )}
            </div>
            {product.gallery && product.gallery.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.gallery.slice(0, 4).map((g, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square overflow-hidden rounded-lg border border-border bg-white"
                  >
                    <ProductImage src={g} alt={`${product.name} ${idx + 1}`} rounded="rounded-none" className="h-full w-full" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-brand-200 text-brand-700">
                {product.categoryLabel}
              </Badge>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                Xuất xứ: {product.origin}
              </span>
            </div>
            <h1 className="mt-3 text-2xl font-bold text-foreground sm:text-3xl">
              {product.name}
            </h1>
            <p className="mt-2 text-base text-muted-foreground">
              {product.shortDescription}
            </p>

            <div className="mt-5 rounded-2xl border border-border bg-brand-50/40 p-4">
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-xs text-muted-foreground">Giá tham khảo</span>
                  <p className="text-3xl font-bold text-brand-700">
                    {product.pricePerKg.toLocaleString('vi-VN')}đ
                    <span className="text-base font-normal text-muted-foreground">/kg</span>
                  </p>
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-gold-100 px-3 py-1.5 text-xs font-medium text-gold-700">
                  <Truck className="h-3.5 w-3.5" />
                  Giao hỏa tốc 1-2h
                </div>
              </div>
            </div>

            <div className="mt-5">
              <h3 className="mb-2 text-sm font-semibold text-foreground">
                Chọn quy cách đóng gói
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.weights.map((w) => (
                  <button
                    key={w}
                    onClick={() => setSelectedWeight(w)}
                    className={cn(
                      'rounded-xl border px-4 py-2.5 text-sm font-medium transition-all',
                      selectedWeight === w
                        ? 'border-brand-600 bg-brand-600 text-white shadow-soft'
                        : 'border-border bg-white text-foreground/70 hover:border-brand-400 hover:text-brand-700'
                    )}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <h3 className="mb-2 text-sm font-semibold text-foreground">
                Số lượng
              </h3>
              <div className="inline-flex items-center gap-1 rounded-xl border border-border bg-white">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-l-xl text-brand-700 transition-colors hover:bg-brand-50"
                >
                  −
                </button>
                <input
                  type="number"
                  value={quantity}
                  min={1}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                  className="h-10 w-14 border-x border-border bg-transparent text-center text-sm font-medium outline-none"
                />
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="flex h-10 w-10 items-center justify-center rounded-r-xl text-brand-700 transition-colors hover:bg-brand-50"
                >
                  +
                </button>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button
                onClick={handleAdd}
                size="lg"
                className={cn(
                  'flex-1 gap-2',
                  added
                    ? 'bg-brand-700 text-white'
                    : 'bg-brand-600 text-white hover:bg-brand-700'
                )}
              >
                {added ? (
                  <>
                    <Check className="h-5 w-5" /> Đã thêm vào danh sách
                  </>
                ) : (
                  <>
                    <Plus className="h-5 w-5" /> Thêm vào danh sách báo giá
                  </>
                )}
              </Button>
              <Button
                onClick={handleZalo}
                size="lg"
                className="flex-1 gap-2 bg-zalo text-white hover:bg-zalo/90"
              >
                <MessageCircle className="h-5 w-5" />
                Tư vấn nhanh qua Zalo
              </Button>
            </div>

            <button
              onClick={() => setOpen(true)}
              className="mt-3 flex w-full items-center justify-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-700"
            >
              <ShoppingBag className="h-4 w-4" />
              Xem danh sách báo giá
            </button>
          </div>
        </div>
      </section>

      <section className="section-pad pt-4">
        <div className="container-page grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-white p-6 shadow-soft">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <Wheat className="h-5 w-5 text-brand-600" />
              Đặc tính gạo
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Thang điểm 1-5 dựa trên đánh giá thực tế khi nấu cơm
            </p>
            <div className="mt-5">
              <VisualMeters metrics={product.metrics} variant="bar" />
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {product.tags.map((t) => (
                <Badge key={t} variant="outline" className="border-brand-200 text-brand-700">
                  {t}
                </Badge>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-white p-6 shadow-soft">
            <h2 className="text-lg font-semibold text-foreground">
              Mô tả sản phẩm
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {product.longDescription}
            </p>
            <h3 className="mt-5 text-sm font-semibold text-foreground">
              Ứng dụng phù hợp
            </h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.usage.map((u) => (
                <span
                  key={u}
                  className="rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-medium text-brand-700"
                >
                  {u}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section-pad pt-4">
          <div className="container-page">
            <div className="mb-6 flex items-center gap-2">
              <ArrowLeft className="h-5 w-5 rotate-180 text-brand-600" />
              <h2 className="text-xl font-bold text-foreground sm:text-2xl">
                Sản phẩm cùng danh mục
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="pb-12">
        <div className="container-page">
          <div className="rounded-2xl brand-gradient p-6 text-white sm:p-8">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-xl font-bold sm:text-2xl">
                  Cần tư vấn báo giá sỉ?
                </h2>
                <p className="mt-1 text-sm text-brand-50">
                  Liên hệ ngay {BRAND.name} - {BRAND.hotline} · Giao hỏa tốc Đà Nẵng 1-2h
                </p>
              </div>
              <Button
                onClick={() => quickZaloConsult()}
                size="lg"
                className="gap-2 bg-white text-brand-700 hover:bg-brand-50"
              >
                <MessageCircle className="h-5 w-5" />
                Tư vấn qua Zalo
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
