'use client';

import { useEffect, useLayoutEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Phone, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/src/store/cartStore';
import { BRAND } from '@/src/lib/brand';

const useIsoLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export function FloatingActionBar() {
  const pathname = usePathname();
  const totalItems = useCartStore((s) => s.totalItems());
  const cartOpen = useCartStore((s) => s.isOpen);
  const setOpen = useCartStore((s) => s.setOpen);

  const [mounted, setMounted] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);

  const isAdmin = pathname?.startsWith('/admin') ?? false;

  useEffect(() => setMounted(true), []);

  // Detect any open overlay (Radix dialog/sheet/alert-dialog or the mobile
  // nav panel) so the bar can hide to avoid UI overlap. Done via DOM
  // observation so no existing component logic needs to change.
  useEffect(() => {
    if (isAdmin) return;

    const check = () => {
      const radixOverlay = document.querySelector(
        '[role="dialog"][data-state="open"]'
      );
      const mobileMenu = document.querySelector(
        'header > div.md\\:hidden.animate-fade-in'
      );
      setOverlayOpen(Boolean(radixOverlay || mobileMenu));
    };

    check();
    const observer = new MutationObserver(check);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['data-state'],
    });
    return () => observer.disconnect();
  }, [isAdmin]);

  // Reserve space at the bottom of the page so the bar never covers the
  // footer or final content. Applied before paint to avoid layout shift.
  useIsoLayoutEffect(() => {
    if (isAdmin) return;
    document.body.classList.add('fab-visible');
    return () => document.body.classList.remove('fab-visible');
  }, [isAdmin]);

  if (isAdmin) return null;

  const hidden = cartOpen || overlayOpen;

  return (
    <div
      className={cn(
        'fixed inset-x-0 bottom-0 z-30 md:hidden will-change-transform transition-transform duration-300 ease-out',
        hidden ? 'pointer-events-none translate-y-full' : 'translate-y-0'
      )}
      aria-hidden={hidden}
      {...(hidden ? { inert: true } : {})}
    >
      <div className="mx-auto w-full max-w-md rounded-t-2xl border-t border-border bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_30px_-8px_rgba(21,128,61,0.12)] animate-fade-in-up">
        <div className="grid h-[58px] grid-cols-3">
          {/* Gọi ngay */}
          <a
            href={`tel:${BRAND.hotlineRaw}`}
            className="group flex min-h-[44px] flex-col items-center justify-center gap-1 rounded-tl-2xl text-brand-600 transition-colors hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring active:bg-brand-100"
            aria-label={`Gọi ngay ${BRAND.hotline}`}
            tabIndex={hidden ? -1 : undefined}
          >
            <Phone className="h-5 w-5 transition-transform group-active:scale-90" />
            <span className="text-[11px] font-semibold leading-none text-foreground/80">
              Gọi ngay
            </span>
          </a>

          {/* Zalo */}
          <a
            href={BRAND.zaloUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex min-h-[44px] flex-col items-center justify-center gap-1 border-x border-border/60 text-zalo transition-colors hover:bg-zalo/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring active:bg-zalo/10"
            aria-label="Chat qua Zalo"
            tabIndex={hidden ? -1 : undefined}
          >
            <img
              src="/zalo.svg"
              alt=""
              className="h-5 w-5 transition-transform group-active:scale-90"
            />
            <span className="text-[11px] font-semibold leading-none text-foreground/80">
              Zalo
            </span>
          </a>

          {/* Giỏ hàng */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="group relative flex min-h-[44px] flex-col items-center justify-center gap-1 rounded-tr-2xl text-brand-600 transition-colors hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring active:bg-brand-100"
            aria-label="Mở danh sách báo giá"
            tabIndex={hidden ? -1 : undefined}
          >
            <span className="relative">
              <ShoppingCart className="h-5 w-5 transition-transform group-active:scale-90" />
              {mounted && totalItems > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold-500 px-1 text-[11px] font-bold text-white shadow-soft ring-2 ring-white animate-scale-in">
                  {totalItems}
                </span>
              )}
            </span>
            <span className="text-[11px] font-semibold leading-none text-foreground/80">
              Báo Giá
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
