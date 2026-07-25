'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, Check, MapPin, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { cn, getFirstImage } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProductImage } from './ProductImage';
import { VisualMeters } from './VisualMeters';
import { useCartStore } from '@/src/store/cartStore';
import type { Product, WeightOption } from '@/src/types';

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);

  const [selectedWeight, setSelectedWeight] = useState<WeightOption>(
    product.weights[0]
  );
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(product, selectedWeight, 1);
    setAdded(true);
    toast.success(
      `Đã thêm "${product.name} - ${selectedWeight}" vào danh sách báo giá`
    );
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
      {/* Toàn bộ card là vùng bấm mở trang chi tiết */}
      <Link
        href={`/san-pham/${product.slug}`}
        className="absolute inset-0 z-10 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        aria-label={`Xem chi tiết sản phẩm ${product.name}`}
      >
        <span className="sr-only">Xem chi tiết sản phẩm {product.name}</span>
      </Link>

      {/* Ảnh sản phẩm */}
      <div className="relative block aspect-[4/3] overflow-hidden">
        <ProductImage
          src={getFirstImage(product.image)}
          alt={product.name}
          rounded="rounded-none"
          className="h-full w-full transition-transform duration-500 group-hover:scale-105"
        />

        {product.bestSeller && (
          <Badge className="absolute left-3 top-3 z-10 bg-gold-500 text-white shadow-soft">
            Bán chạy
          </Badge>
        )}

        <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-brand-700 backdrop-blur">
          <MapPin className="h-3 w-3" />
          {product.origin}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 text-[15px] font-semibold text-foreground transition-colors group-hover:text-brand-700">
            {product.name}
          </h3>
          <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-brand-400 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-brand-600" />
        </div>

        <div className="mt-2">
          <VisualMeters
            metrics={product.metrics}
            variant="compact"
          />
        </div>

        {/* Chọn khối lượng — nằm trên vùng link, ngắt sự kiện click */}
        <div
          className="relative z-20 mt-2 grid grid-cols-4 gap-1.5"
          onClick={(e) => e.stopPropagation()}
        >
          {product.weights.map((w) => (
            <button
              key={w}
              type="button"
              onClick={() => setSelectedWeight(w)}
              className={cn(
                'w-full rounded-full border py-1 text-center text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
                selectedWeight === w
                  ? 'border-brand-600 bg-brand-600 text-white'
                  : 'border-border bg-white text-muted-foreground hover:border-brand-400 hover:text-brand-700'
              )}
            >
              {w}
            </button>
          ))}
        </div>

        <div className="mt-2">
          <span className="text-xs text-muted-foreground">
            Giá tham khảo
          </span>

          <p className="text-lg font-bold leading-none text-brand-700">
            {product.pricePerKg.toLocaleString('vi-VN')}đ
            <span className="text-xs font-normal text-muted-foreground">
              /kg
            </span>
          </p>
        </div>

        {/* CTA báo giá — nằm trên vùng link, ngắt sự kiện click */}
        <div
          className="relative z-20 mt-3"
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            onClick={handleAdd}
            size="sm"
            className={cn(
              'h-9 w-full gap-1 text-xs transition-all',
              added
                ? 'bg-brand-700 text-white'
                : 'bg-brand-600 text-white hover:bg-brand-700'
            )}
          >
            {added ? (
              <>
                <Check className="h-3.5 w-3.5" />
                Đã thêm
              </>
            ) : (
              <>
                <Plus className="h-3.5 w-3.5" />
                Báo Giá
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
