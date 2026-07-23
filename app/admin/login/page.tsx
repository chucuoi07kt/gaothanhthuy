'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Wheat, Lock, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/src/lib/auth';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (login(password)) {
        toast.success('Đăng nhập thành công!');
        router.push('/admin/products');
      } else {
        toast.error('Mật khẩu không đúng');
        setLoading(false);
      }
    }, 400);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
            <Wheat className="h-8 w-8 text-gold-300" />
          </div>
          <h1 className="text-2xl font-bold text-white">Gạo Ngọc Anh</h1>
          <p className="mt-1 text-sm text-brand-100">CMS Admin Dashboard</p>
        </div>
        <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-6 shadow-xl">
          <label className="mb-1.5 block text-sm font-medium text-foreground">Mật khẩu quản trị</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu..."
              autoFocus
              className="h-11 w-full rounded-xl border border-border bg-brand-50/40 pl-10 pr-4 text-sm outline-none focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !password}
            className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-600 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-50"
          >
            {loading ? 'Đang xác thực...' : (
              <>Đăng nhập <ArrowRight className="h-4 w-4" /></>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
