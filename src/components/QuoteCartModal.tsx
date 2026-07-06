'use client';

import { useState } from 'react';
import { Minus, Plus, ShoppingBag, Trash2, X, MessageCircle, Phone, QrCode } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useCartStore, formatQuoteMessage } from '@/src/store/cartStore';
import { sendQuoteViaZalo, copyToClipboard } from '@/src/lib/zalo';
import { BRAND } from '@/src/lib/brand';
import { ProductImage } from './ProductImage';

export function QuoteCartModal() {
  const { items, isOpen, setOpen, removeItem, updateQuantity, clear } = useCartStore();
  const [showDesktopFallback, setShowDesktopFallback] = useState(false);

  const handleSendZalo = async () => {
    await sendQuoteViaZalo(items, {
      onDesktopFallback: () => setShowDesktopFallback(true),
    });
  };

  const handleCopyText = async () => {
    const text = formatQuoteMessage(items);
    const ok = await copyToClipboard(text);
    if (ok) toast.success('Đã sao chép danh sách báo giá vào clipboard!');
    else toast.error('Không thể sao chép. Vui lòng thử lại.');
  };

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent
        side="right"
        className="flex w-full flex-col p-0 sm:max-w-md"
      >
        <SheetHeader className="border-b border-border bg-brand-50 px-5 py-4">
          <SheetTitle className="flex items-center gap-2 text-brand-800">
            <ShoppingBag className="h-5 w-5" />
            Danh sách nhận báo giá
          </SheetTitle>
          <SheetDescription className="text-muted-foreground">
            Chọn sản phẩm và gửi yêu cầu báo giá sỉ qua Zalo
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-50">
              <ShoppingBag className="h-9 w-9 text-brand-400" />
            </div>
            <p className="text-base font-medium text-foreground">
              Danh sách báo giá đang trống
            </p>
            <p className="text-sm text-muted-foreground">
              Thêm các sản phẩm gạo bạn quan tâm để nhận báo giá sỉ tốt nhất.
            </p>
            <Button
              onClick={() => setOpen(false)}
              className="mt-2 bg-brand-600 text-white hover:bg-brand-700"
            >
              Khám phá catalogue
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 rounded-xl border border-border bg-white p-3"
                >
                  <ProductImage
                    src={item.image}
                    alt={item.name}
                    rounded="rounded-lg"
                    className="h-16 w-16 shrink-0"
                  />
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <p className="line-clamp-1 text-sm font-semibold text-foreground">
                        {item.name}
                      </p>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-muted-foreground transition-colors hover:text-destructive"
                        aria-label="Xoá"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Quy cách: {item.weight}
                    </p>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center gap-1 rounded-full border border-border">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-full text-brand-700 transition-colors hover:bg-brand-50"
                          aria-label="Giảm"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-full text-brand-700 transition-colors hover:bg-brand-50"
                          aria-label="Tăng"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {item.pricePerKg.toLocaleString('vi-VN')}đ/kg
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border bg-white px-4 py-4">
              <div className="mb-3 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Tổng {items.reduce((s, i) => s + i.quantity, 0)} sản phẩm
                </span>
                <button
                  onClick={clear}
                  className="text-xs text-muted-foreground underline-offset-2 hover:text-destructive hover:underline"
                >
                  Xoá tất cả
                </button>
              </div>
              <Button
                onClick={handleSendZalo}
                className="w-full gap-2 bg-zalo text-white hover:bg-zalo/90"
                size="lg"
              >
                <MessageCircle className="h-5 w-5" />
                Yêu cầu báo giá qua Zalo
              </Button>
              <Button
                onClick={handleCopyText}
                variant="outline"
                className="mt-2 w-full border-brand-200 text-brand-700 hover:bg-brand-50"
              >
                Sao chép danh sách
              </Button>
            </div>
          </>
        )}
      </SheetContent>

      {showDesktopFallback && (
        <DesktopZaloFallback onClose={() => setShowDesktopFallback(false)} />
      )}
    </Sheet>
  );
}

function DesktopZaloFallback({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 animate-fade-in">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl animate-scale-in">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">
            Liên hệ Zalo
          </h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="text-sm text-muted-foreground">
          Danh sách báo giá đã được sao chép. Quét mã QR hoặc gọi hotline để gửi
          yêu cầu:
        </p>
        <div className="my-4 flex flex-col items-center gap-3 rounded-xl bg-brand-50 p-4">
          <div className="flex h-40 w-40 items-center justify-center rounded-xl border-2 border-dashed border-brand-300 bg-white">
            <QrCode className="h-20 w-20 text-brand-400" />
          </div>
          <p className="text-xs text-muted-foreground">Quét QR để mở Zalo</p>
        </div>
        <div className="space-y-2">
          <a
            href={`tel:${BRAND.hotlineRaw}`}
            className="flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
          >
            <Phone className="h-4 w-4" />
            Gọi hotline: {BRAND.hotline}
          </a>
          <a
            href={BRAND.zaloUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl bg-zalo px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-zalo/90"
          >
            <MessageCircle className="h-4 w-4" />
            Mở Zalo trên web
          </a>
        </div>
      </div>
    </div>
  );
}
