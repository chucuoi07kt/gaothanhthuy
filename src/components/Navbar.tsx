'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, ShoppingBag, X, Phone, MapPin, Wheat } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/src/store/cartStore';
import { BRAND } from '@/src/data/mockData';
import { quickZaloConsult } from '@/src/lib/zalo';

const navLinks = [
  { href: '/', label: 'Trang chủ' },
  { href: '/products', label: 'Catalogue gạo' },
  { href: '/blog', label: 'Tin tức' },
  { href: '/about', label: 'Về chúng tôi' },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const totalItems = useCartStore((s) => s.totalItems());
  const setOpen = useCartStore((s) => s.setOpen);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full transition-all duration-300',
        scrolled
          ? 'border-b border-border bg-white/90 backdrop-blur-md shadow-soft'
          : 'bg-white/70 backdrop-blur-sm'
      )}
    >
      <div className="hidden bg-brand-700 text-white">
        <div className="container-page flex h-9 items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              {BRAND.address}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href={`tel:${BRAND.hotlineRaw}`}
              className="flex items-center gap-1.5 font-medium transition-colors hover:text-gold-300"
            >
              <Phone className="h-3.5 w-3.5" />
              Hotline: {BRAND.hotline}
            </a>
            <span className="hidden sm:inline text-brand-100">
              {BRAND.hours}
            </span>
          </div>
        </div>
      </div>

      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl brand-gradient text-white shadow-soft">
            <Wheat className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <span className="block text-base font-bold text-brand-800">
              Gạo Thanh Thuỷ
            </span>
            <span className="hidden text-[11px] text-muted-foreground sm:block">
              {BRAND.yearsExperience} năm uy tín · Đà Nẵng
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const active =
              link.href === '/'
                ? pathname === '/'
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'rounded-lg px-3.5 py-2 text-sm font-medium transition-colors',
                  active
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-foreground/70 hover:bg-brand-50 hover:text-brand-700'
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => quickZaloConsult()}
            className="hidden bg-zalo text-white hover:bg-zalo/90 sm:inline-flex"
            size="sm"
          >
            Tư vấn Zalo
          </Button>

          <button
            onClick={() => setOpen(true)}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-white text-brand-700 transition-all hover:bg-brand-50"
            aria-label="Mở danh sách báo giá"
          >
            <ShoppingBag className="h-5 w-5" />
            {mounted && totalItems > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold-500 px-1 text-[11px] font-bold text-white shadow-soft animate-scale-in">
                {totalItems}
              </span>
            )}
          </button>

          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-white text-foreground md:hidden"
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-white md:hidden animate-fade-in">
          <nav className="container-page flex flex-col py-3">
            {navLinks.map((link) => {
              const active =
                link.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    active
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-foreground/80 hover:bg-brand-50'
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            <Button
              onClick={() => quickZaloConsult()}
              className="mt-2 bg-zalo text-white hover:bg-zalo/90"
              size="sm"
            >
              Tư vấn nhanh qua Zalo
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
