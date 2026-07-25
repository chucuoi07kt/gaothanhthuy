'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, ShoppingCart, X, Phone, MapPin, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/src/store/cartStore';
import { BRAND } from '@/src/lib/brand';
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

  const isAdmin = pathname?.startsWith('/admin');

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

  if (isAdmin) return null;

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full transition-all duration-300 ease-out',
        scrolled
          ? 'border-b border-border/70 bg-white/85 backdrop-blur-lg shadow-[0_8px_30px_-12px_rgba(21,128,61,0.12)]'
          : 'border-b border-transparent bg-white/70 backdrop-blur-sm'
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

      <div
        className={cn(
          'container-page flex items-center gap-6 transition-[height] duration-300 ease-out',
          scrolled ? 'h-14' : 'h-16'
        )}
      >
        {/* Logo + tên thương hiệu */}
        <Link
          href="/"
          className={cn(
            'flex items-center gap-2.5 shrink-0 py-1 group transition-[height] duration-300 ease-out',
            scrolled ? 'h-14' : 'h-16'
          )}
        >
          <div className="flex h-full items-center justify-center">
            <Image
              src="/logo.png"
              alt="Logo Gạo Ngọc Anh"
              width={60}
              height={60}
              priority
              className={cn(
                'h-full w-auto object-contain transition-all duration-300 ease-out group-hover:scale-105',
                scrolled ? 'max-h-[52px]' : 'max-h-[60px]'
              )}
            />
          </div>
          <div className="leading-tight">
            <span className="block font-display text-[15px] font-bold tracking-tight text-brand-800 transition-colors group-hover:text-brand-600">
              Gạo Ngọc Anh
            </span>
            <span className="hidden text-[11px] font-medium text-muted-foreground sm:block">
              {BRAND.yearsExperience} năm uy tín · Đà Nẵng
            </span>
          </div>
        </Link>

        {/* Navigation desktop — căn giữa */}
        <div className="hidden flex-1 justify-center md:flex">
          <nav className="flex items-center gap-1.5">
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
                    'rounded-full px-4 py-2 text-sm font-medium transition-all duration-200',
                    active
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'text-foreground/70 hover:bg-brand-50 hover:text-brand-700'
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* CTA bên phải */}
        <div className="flex items-center gap-2.5 ml-auto">
          <Button
            onClick={() => quickZaloConsult()}
            className="hidden bg-zalo text-white hover:bg-zalo/90 sm:inline-flex"
            size="sm"
          >
            Tư vấn Zalo
          </Button>

          <button
            onClick={() => setOpen(true)}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-white text-brand-700 transition-all hover:bg-brand-50 hover:border-brand-200"
            aria-label="Mở danh sách báo giá"
          >
            <ShoppingCart className="h-5 w-5" />
            {mounted && totalItems > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold-500 px-1 text-[11px] font-bold text-white shadow-soft ring-2 ring-white animate-scale-in">
                {totalItems}
              </span>
            )}
          </button>

          <Link
            href="/admin/login"
            className="hidden sm:flex h-10 px-3.5 items-center gap-1.5 rounded-xl border border-border bg-white text-xs font-medium text-muted-foreground transition-all hover:bg-brand-50 hover:text-brand-700 hover:border-brand-200 shadow-sm"
            title="Hệ thống quản trị nội bộ"
          >
            <ShieldAlert className="h-4 w-4 text-brand-600" />
            <span className="hidden lg:inline">Quản trị</span>
          </Link>

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
          <nav className="container-page flex flex-col py-3 space-y-1">
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
              className="mt-2 bg-zalo text-white hover:bg-zalo/90 w-full"
              size="sm"
            >
              Tư vấn nhanh qua Zalo
            </Button>

            <Link
              href="/admin/login"
              className="flex items-center justify-center gap-2 mt-1 py-2.5 px-3 rounded-lg text-xs font-medium text-muted-foreground bg-gray-50 border border-border active:bg-brand-50 active:text-brand-700"
            >
              <ShieldAlert className="h-4 w-4 text-brand-600" />
              <span>Đăng nhập hệ thống Admin</span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
