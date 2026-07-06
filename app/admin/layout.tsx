'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Wheat, Package, FileText, LogOut, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth, AuthProvider } from '@/src/lib/auth';

const navItems = [
  { href: '/admin/products', label: 'Sản phẩm', icon: Package },
  { href: '/admin/blog', label: 'Bài viết', icon: FileText },
];

function AdminShell({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthenticated && pathname !== '/admin/login') {
      router.replace('/admin/login');
    }
  }, [isAuthenticated, pathname, router]);

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Đang chuyển hướng...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-brand-50/30">
      <aside className="sticky top-0 flex h-screen w-60 flex-col border-r border-border bg-white">
        <div className="flex items-center gap-2.5 border-b border-border px-5 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl brand-gradient">
            <Wheat className="h-5 w-5 text-white" />
          </div>
          <div className="leading-tight">
            <span className="block text-sm font-bold text-brand-800">Gạo Thanh Thuỷ</span>
            <span className="text-[11px] text-muted-foreground">CMS Dashboard</span>
          </div>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors',
                  active
                    ? 'bg-brand-600 text-white shadow-soft'
                    : 'text-foreground/70 hover:bg-brand-50 hover:text-brand-700'
                )}
              >
                <item.icon className="h-4.5 w-4.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border p-3">
          <Link href="/" target="_blank"
            className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium text-foreground/70 hover:bg-brand-50">
            <ExternalLink className="h-4.5 w-4.5" />
            Xem website
          </Link>
          <button onClick={() => { logout(); router.replace('/admin/login'); }}
            className="flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium text-destructive hover:bg-red-50">
            <LogOut className="h-4.5 w-4.5" />
            Đăng xuất
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminShell>{children}</AdminShell>
    </AuthProvider>
  );
}
