'use client';

import { useEffect, useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/src/store/cartStore';

export function FloatingCartButton() {
  const totalItems = useCartStore((s) => s.totalItems());
  const setOpen = useCartStore((s) => s.setOpen);
  const [mounted, setMounted] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!mounted || totalItems === 0) return null;

  return (
    <button
      onClick={() => setOpen(true)}
      className={cn(
        'fixed bottom-5 right-5 z-30 hidden items-center gap-2 rounded-full bg-brand-600 px-4 py-3 text-white shadow-card will-change-transform transition-all duration-300 hover:bg-brand-700 hover:shadow-[0_8px_30px_-4px_rgba(21,128,61,0.30)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background md:flex',
        show ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
      )}
      aria-label="Mở danh sách báo giá"
    >
      <div className="relative">
        <ShoppingCart className="h-5 w-5" />
        <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold-500 px-1 text-[11px] font-bold text-white shadow-soft ring-2 ring-white animate-scale-in">
          {totalItems}
        </span>
      </div>
      <span className="text-sm font-semibold">Báo giá</span>
    </button>
  );
}
