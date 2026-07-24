'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Home, RefreshCw, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getFirstImage } from '@/lib/utils';
import type { HomepageItem } from '@/src/lib/homepage.service';

export default function AdminHomepagePage() {
  const [items, setItems] = useState<HomepageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/homepage', { cache: 'no-store' });
      const data = await res.json();
      setItems(Array.isArray(data.items) ? data.items : []);
    } catch {
      toast.error('Không thể tải dữ liệu trang chủ');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchItems();
    setRefreshing(false);
    toast.success('Đã làm mới dữ liệu');
  };

  const sorted = [...items].sort((a, b) => {
    if (a.section !== b.section) return a.section.localeCompare(b.section);
    return a.order - b.order;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-bold text-foreground sm:text-xl">Quản lý trang chủ</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">{items.length} mục</p>
        </div>
        <Button
          variant="outline"
          onClick={handleRefresh}
          disabled={refreshing || loading}
          className="gap-2 border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800 text-xs sm:text-sm"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">{refreshing ? 'Đang tải...' : 'Làm mới'}</span>
          <span className="sm:hidden">{refreshing ? 'Đang...' : 'Refresh'}</span>
        </Button>
      </div>

      {/* Mobile: Card layout */}
      <div className="grid grid-cols-1 gap-3 sm:hidden">
        {loading ? (
          <div className="rounded-xl border border-border bg-white p-8 text-center text-sm text-muted-foreground">Đang tải...</div>
        ) : sorted.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-white p-8 text-center">
            <Home className="mx-auto mb-2 h-8 w-8 text-brand-300" />
            <p className="text-sm text-muted-foreground">Chưa có mục nào</p>
          </div>
        ) : (
          sorted.map((item) => (
            <div key={item.id} className="rounded-xl border border-border bg-white p-4 shadow-soft">
              <div className="flex items-start gap-3">
                {item.image ? (
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                    <Image src={getFirstImage(item.image)} alt={item.title} fill sizes="48px" className="h-full w-full object-cover" />
                  </div>
                ) : (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-400">
                    <Home className="h-5 w-5" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-semibold text-foreground">{item.title || '(Không tiêu đề)'}</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">{item.section}</p>
                  {item.description && (
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{item.description}</p>
                  )}
                  <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[10px] text-muted-foreground">
                    <span>Thứ tự: {item.order}</span>
                    {item.link && (
                      <span className="flex items-center gap-0.5">
                        <ExternalLink className="h-3 w-3" />
                        {item.link}
                      </span>
                    )}
                  </div>
                </div>
                <Badge variant={item.enabled ? 'default' : 'secondary'} className="shrink-0 text-[10px]">
                  {item.enabled ? 'Hiện' : 'Ẩn'}
                </Badge>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop: Table layout */}
      <div className="hidden overflow-hidden rounded-xl border border-border bg-white shadow-soft sm:block">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-brand-50/50 text-left text-xs font-semibold uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Ảnh</th>
                <th className="px-4 py-3">Section</th>
                <th className="px-4 py-3 text-center">Thứ tự</th>
                <th className="px-4 py-3">Tiêu đề</th>
                <th className="px-4 py-3">Mô tả</th>
                <th className="px-4 py-3">Link</th>
                <th className="px-4 py-3 text-center">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">Đang tải...</td></tr>
              ) : sorted.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">
                  <Home className="mx-auto mb-2 h-8 w-8 text-brand-300" />
                  Chưa có mục nào
                </td></tr>
              ) : (
                sorted.map((item) => (
                  <tr key={item.id} className="transition-colors hover:bg-brand-50/30">
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{item.id}</td>
                    <td className="px-4 py-3">
                      {item.image ? (
                        <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg">
                          <Image src={getFirstImage(item.image)} alt={item.title} fill sizes="36px" className="h-full w-full object-cover" />
                        </div>
                      ) : (
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-400">
                          <Home className="h-4 w-4" />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{item.section}</td>
                    <td className="px-4 py-3 text-center text-muted-foreground">{item.order}</td>
                    <td className="px-4 py-3 font-medium text-foreground">{item.title || '(Không tiêu đề)'}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      <span className="line-clamp-2 max-w-xs">{item.description || '—'}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {item.link ? (
                        <span className="flex items-center gap-1">
                          <ExternalLink className="h-3 w-3" />
                          {item.link}
                        </span>
                      ) : '—'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant={item.enabled ? 'default' : 'secondary'} className="text-[10px]">
                        {item.enabled ? 'Hiện' : 'Ẩn'}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
