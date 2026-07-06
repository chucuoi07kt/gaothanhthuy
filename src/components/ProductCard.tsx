'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Check, MapPin, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProductImage } from './ProductImage';
import { VisualMeters } from './VisualMeters';
import { useCartStore } from '@/src/store/cartStore';
import type { Product, WeightOption } from '@/src/types';

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const setOpen = useCartStore((s) => s.setOpen);
  const [selectedWeight, setSelectedWeight] = useState<WeightOption>(
    product.weights[0]
  );
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(product, selectedWeight, 1);
    setAdded(true);
    toast.success(`Đã thêm "${product.name} - ${selectedWeight}" vào danh sách báo giá`);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
      <Link href={`/products/${product.slug}`} className="relative block aspect-[4/3] overflow-hidden">
        <ProductImage
          src={product.image}
          alt={product.name}
          rounded="rounded-none"
          className="h-full w-full transition-transform duration-500 group-hover:scale-105"
        />
        {product.bestSeller && (
          <Badge className="absolute left-3 top-3 bg-gold-500 text-white shadow-soft">
            Bán chạy
          </Badge>
        )}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-brand-700 backdrop-blur">
          <MapPin className="h-3 w-3" />
          {product.origin}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link href={`/products/${product.slug}`}>
          <h3 className="line-clamp-1 text-base font-semibold text-foreground transition-colors group-hover:text-brand-700">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
          {product.shortDescription}
        </p>

        <div className="mt-3">
          <VisualMeters metrics={product.metrics} variant="compact" />
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {product.weights.map((w) => (
            <button
              key={w}
              onClick={() => setSelectedWeight(w)}
              className={cn(
                'rounded-full border px-2.5 py-0.5 text-xs font-medium transition-all',
                selectedWeight === w
                  ? 'border-brand-600 bg-brand-600 text-white'
                  : 'border-border bg-white text-muted-foreground hover:border-brand-400 hover:text-brand-700'
              )}
            >
              {w}
            </button>
          ))}
        </div>

        <div className="mt-3 flex items-end justify-between">
          <div>
            <span className="text-xs text-muted-foreground">Giá tham khảo</span>
            <p className="text-lg font-bold text-brand-700">
              {product.pricePerKg.toLocaleString('vi-VN')}đ
              <span className="text-xs font-normal text-muted-foreground">/kg</span>
            </p>
          </div>
        </div>

        {/* Khu vực nút bấm đã loại bỏ nút Zalo trùng lặp, giao diện dàn hàng ngang cân đối hơn */}
        <div className="mt-4 flex gap-2">
          <Button
            onClick={handleAdd}
            size="sm"
            className={cn(
              'flex-1 gap-1.5 transition-all text-xs',
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
                <Plus className="h-3.5 w-3.5" /> Thêm báo giá
              </>
            )}
          </Button>
          <Button
            onClick={() => setOpen(true)}
            size="sm"
            variant="outline"
            className="border-brand-200 text-brand-700 hover:bg-brand-50 text-xs px-3"
          >
            Xem giỏ
          </Button>
        </div>
      </div>
    </div>
  );
}
