'use client';

import { useEffect, useState } from 'react';
import { ShoppingBag } from 'lucide-react';
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
        'fixed bottom-5 right-5 z-30 flex items-center gap-2 rounded-full bg-brand-600 px-4 py-3 text-white shadow-card transition-all duration-300 hover:bg-brand-700 md:hidden',
        show ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
      )}
      aria-label="Mở danh sách báo giá"
    >
      <div className="relative">
        <ShoppingBag className="h-5 w-5" />
        <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold-500 px-1 text-[10px] font-bold">
          {totalItems}
        </span>
      </div>
      <span className="text-sm font-semibold">Báo giá</span>
    </button>
  );
}
