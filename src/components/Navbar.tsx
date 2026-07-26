'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, ShoppingCart, X, Phone, ShieldAlert, Home, Wheat, Newspaper, Store, MessageCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/src/store/cartStore';
import { BRAND } from '@/src/lib/brand';
import { quickZaloConsult } from '@/src/lib/zalo';
import { categories } from '@/src/lib/categories';

const navLinks: { href: string; label: string; icon: LucideIcon }[] = [
  { href: '/', label: 'Trang chủ', icon: Home },
  { href: '/products', label: 'Catalogue gạo', icon: Wheat },
  { href: '/blog', label: 'Tin tức', icon: Newspaper },
  { href: '/about', label: 'Về chúng tôi', icon: Store },
];

export function Navbar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeCategory = searchParams?.get('category') ?? 'all';
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
      <div
        className={cn(
          'container-page flex items-center gap-4 transition-[height] duration-300 ease-out',
          scrolled ? 'h-14' : 'h-16'
        )}
      >
        {/* Logo + tên thương hiệu */}
        <Link
          href="/"
          className={cn(
            'flex items-center gap-2.5 shrink-0 group transition-[height] duration-300 ease-out',
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




              
            </span>
            <span className="hidden text-[11px] font-medium text-muted-foreground sm:block">
              {BRAND.yearsExperience} năm uy tín · Đà Nẵng
            </span>
          </div>
        </Link>

        {/* Navigation desktop — căn giữa */}
        <div className="hidden flex-1 justify-center md:flex">
          <nav className="flex items-center gap-1" aria-label="Điều hướng chính">
            {navLinks.map((link) => {
              const active =
                link.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
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
        <div className="flex items-center gap-2 ml-auto">
          <Button
            onClick={() => quickZaloConsult()}
            className="hidden gap-1.5 bg-zalo text-white hover:bg-zalo/90 sm:inline-flex"
            size="sm"
          >
            <MessageCircle className="h-4 w-4" />
            Tư vấn Zalo
          </Button>

          <button
            onClick={() => setOpen(true)}
            className="relative hidden h-10 w-10 items-center justify-center rounded-xl border border-border bg-white text-brand-700 transition-all hover:bg-brand-50 hover:border-brand-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background md:flex"
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
            className="hidden sm:flex h-10 px-3.5 items-center gap-1.5 rounded-xl border border-border bg-white text-xs font-medium text-muted-foreground transition-all hover:bg-brand-50 hover:text-brand-700 hover:border-brand-200 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            title="Hệ thống quản trị nội bộ"
          >
            <ShieldAlert className="h-4 w-4 text-brand-600" />
            <span className="hidden lg:inline">Quản trị</span>
          </Link>

          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-white text-foreground transition-colors hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background md:hidden"
            aria-label="Menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-panel"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div
          id="mobile-nav-panel"
          role="dialog"
          aria-modal="true"
          aria-label="Menu điều hướng di động"
          className="border-t border-border bg-white md:hidden animate-fade-in"
        >
          <nav className="container-page flex flex-col py-4" aria-label="Điều hướng di động">
            {/* Nhóm điều hướng chính */}
            <div className="space-y-1">
              {navLinks.map((link) => {
                const active =
                  link.href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(link.href);
                const Icon = link.icon;
                const isCatalogue = link.href === '/products';
                return (
                  <div key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                        active
                          ? 'bg-brand-50 text-brand-700'
                          : 'text-foreground/80 hover:bg-brand-50'
                      )}
                    >
                      <span
                        className={cn(
                          'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors',
                          active
                            ? 'bg-brand-600 text-white'
                            : 'bg-brand-50 text-brand-600'
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      {link.label}
                    </Link>

                    {/* Danh mục con cho Catalogue gạo */}
                    {isCatalogue && (
                      <div className="mt-1 ml-12 space-y-0.5">
                        {categories.map((cat) => {
                          const catActive =
                            pathname === '/products' &&
                            activeCategory === cat.slug;
                          return (
                            <Link
                              key={cat.slug}
                              href={`/products?category=${cat.slug}`}
                              aria-current={catActive ? 'page' : undefined}
                              className={cn(
                                'flex items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                                catActive
                                  ? 'bg-brand-100 text-brand-700'
                                  : 'text-muted-foreground hover:bg-brand-50 hover:text-brand-700'
                              )}
                            >
                              <span
                                className={cn(
                                  'h-1.5 w-1.5 shrink-0 rounded-full transition-colors',
                                  catActive
                                    ? 'bg-brand-600'
                                    : 'bg-brand-300'
                                )}
                              />
                              {cat.label}
                            </Link>
                          );
                        })}
                        <Link
                          href="/products"
                          aria-current={pathname === '/products' && activeCategory === 'all' ? 'page' : undefined}
                          className={cn(
                            'flex items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                            pathname === '/products' && activeCategory === 'all'
                              ? 'bg-brand-100 text-brand-700'
                              : 'text-brand-600 hover:bg-brand-50 hover:text-brand-700'
                          )}
                        >
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                          Xem tất cả sản phẩm
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="my-3 h-px bg-border" />

            {/* Nhóm CTA liên hệ */}
            <div className="space-y-2">
              <Button
                onClick={() => quickZaloConsult()}
                className="w-full gap-2 bg-zalo text-white hover:bg-zalo/90"
                size="sm"
              >
                <MessageCircle className="h-4 w-4" />
                Tư vấn nhanh qua Zalo
              </Button>
              <a
                href={`tel:${BRAND.hotlineRaw}`}
                className="flex items-center justify-center gap-2 rounded-xl border border-brand-200 bg-white px-4 py-2.5 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <Phone className="h-4 w-4" />
                Hotline: {BRAND.hotline}
              </a>
            </div>

            <div className="my-3 h-px bg-border" />

            {/* Nhóm quản trị — đặt cuối */}
            <Link
              href="/admin/login"
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-medium text-muted-foreground bg-muted border border-border transition-colors hover:bg-brand-50 hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
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
