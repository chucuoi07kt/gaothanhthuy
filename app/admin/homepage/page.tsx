'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
  Home, RefreshCw, Plus, Pencil, Trash2, Eye,
  ExternalLink, ArrowUp, ArrowDown, Save, X,
  Image as ImageIcon, LayoutDashboard,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import {
  Tabs, TabsContent, TabsList, TabsTrigger,
} from '@/components/ui/tabs';
import { getFirstImage } from '@/lib/utils';
import { ImageUpload } from '@/src/components/admin/ImageUpload';
import { WarehouseManager } from '@/src/components/admin/WarehouseManager';
import type { HomepageItem } from '@/src/lib/homepage.service';

interface HeroForm {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  order: number;
  enabled: boolean;
}

const emptyForm: HeroForm = {
  id: '', title: '', description: '', image: '', link: '', order: 0, enabled: true,
};

const DEFAULT_BANNERS = [
  {
    id: 'family',
    image: 'https://images.pexels.com/photos/723198/pexels-photo-723198.jpeg?auto=compress&cs=tinysrgb&w=1600',
    title: 'Gạo ngon cho mọi gia đình',
    description: 'Gạo chính hãng dẻo thơm, sạch an toàn cho bữa cơm gia đình.',
    link: '/products',
  },
  {
    id: 'restaurant',
    image: 'https://images.pexels.com/photos/1393382/pexels-photo-1393382.jpeg?auto=compress&cs=tinysrgb&w=1600',
    title: 'Giá sỉ cho quán ăn – nhà hàng',
    description: 'Chiết khấu hấp dẫn khi nhập sỉ cho quán cơm, nhà hàng tại Đà Nẵng.',
    link: '',
  },
  {
    id: 'delivery',
    image: 'https://images.pexels.com/photos/4393474/pexels-photo-4393474.jpeg?auto=compress&cs=tinysrgb&w=1600',
    title: 'Giao nhanh toàn Đà Nẵng',
    description: 'Giao hỏa tốc nội thành 1-2 giờ, không lo gián đoạn nguồn cung.',
    link: '/products',
  },
];

export default function AdminHomepagePage() {
  const [items, setItems] = useState<HomepageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<HeroForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewItem, setPreviewItem] = useState<HomepageItem | null>(null);
  const [activeTab, setActiveTab] = useState<string>('hero');

  const heroItems = items
    .filter((item) => item.section === 'hero')
    .sort((a, b) => a.order - b.order);

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

  const handleSyncCache = async () => {
    setRefreshing(true);
    toast.loading('Đang đồng bộ cache...', { id: 'sync-cache' });
    try {
      const res = await fetch('/api/revalidate', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        toast.success('Đã đồng bộ!', { id: 'sync-cache' });
        await fetchItems();
      } else {
        toast.error(data.message || 'Lỗi đồng bộ', { id: 'sync-cache' });
      }
    } catch {
      toast.error('Không thể kết nối', { id: 'sync-cache' });
    } finally {
      setRefreshing(false);
    }
  };

  const openAdd = () => {
    setEditing(false);
    const nextOrder = heroItems.length > 0
      ? Math.max(...heroItems.map((h) => h.order)) + 1
      : 1;
    setForm({ ...emptyForm, order: nextOrder });
    setModalOpen(true);
  };

  const openEdit = (item: HomepageItem) => {
    setEditing(true);
    setForm({
      id: item.id,
      title: item.title || '',
      description: item.description || '',
      image: item.image || '',
      link: item.link || '',
      order: item.order,
      enabled: item.enabled,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.image.trim()) { toast.error('Vui lòng tải lên ảnh banner'); return; }
    if (!form.title.trim()) { toast.error('Vui lòng nhập tiêu đề'); return; }
    setSaving(true);
    toast.loading('Đang lưu...', { id: 'save' });

    const payload = {
      action: editing ? 'update' : 'insert',
      id: form.id || undefined,
      title: form.title.trim(),
      description: form.description.trim(),
      image: form.image.trim(),
      link: form.link.trim(),
      order: form.order,
      enabled: form.enabled,
    };

    if (editing) {
      setItems((prev) => prev.map((it) =>
        it.id === form.id
          ? { ...it, title: payload.title, description: payload.description, image: payload.image, link: payload.link, order: payload.order, enabled: payload.enabled, section: 'hero' }
          : it
      ));
    } else {
      const newId = String(Math.max(0, ...items.map((it) => parseInt(it.id) || 0)) + 1);
      setItems((prev) => [...prev, {
        id: newId,
        section: 'hero',
        order: form.order,
        title: payload.title,
        description: payload.description,
        image: payload.image,
        link: payload.link,
        enabled: form.enabled,
      }]);
    }
    setModalOpen(false);

    try {
      const res = await fetch('/api/homepage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Đã lưu banner thành công!', { id: 'save' });
      } else {
        toast.error(`Lỗi: ${data.error || 'Không thể lưu'}`, { id: 'save' });
        fetchItems();
      }
    } catch {
      toast.error('Lỗi kết nối server', { id: 'save' });
      fetchItems();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Xoá banner này?')) return;
    const prev = items;
    setItems((p) => p.filter((it) => it.id !== id));
    toast.loading('Đang xoá...', { id: 'del' });
    try {
      const res = await fetch('/api/homepage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id }),
      });
      const data = await res.json();
      if (data.success) toast.success('Đã xoá banner', { id: 'del' });
      else { toast.error('Lỗi xoá', { id: 'del' }); setItems(prev); }
    } catch {
      toast.error('Lỗi kết nối', { id: 'del' });
      setItems(prev);
    }
  };

  const handleToggleEnabled = async (item: HomepageItem) => {
    const newEnabled = !item.enabled;
    setItems((prev) => prev.map((it) =>
      it.id === item.id ? { ...it, enabled: newEnabled } : it
    ));
    toast.loading(newEnabled ? 'Đang bật...' : 'Đang tắt...', { id: 'toggle' });
    try {
      const res = await fetch('/api/homepage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update',
          id: item.id,
          title: item.title,
          description: item.description,
          image: item.image,
          link: item.link,
          order: item.order,
          enabled: newEnabled,
        }),
      });
      const data = await res.json();
      if (data.success) toast.success(newEnabled ? 'Đã bật banner' : 'Đã tắt banner', { id: 'toggle' });
      else { toast.error('Lỗi', { id: 'toggle' }); fetchItems(); }
    } catch {
      toast.error('Lỗi kết nối', { id: 'toggle' });
      fetchItems();
    }
  };

  const moveOrder = async (item: HomepageItem, direction: 'up' | 'down') => {
    const sorted = [...heroItems];
    const idx = sorted.findIndex((h) => h.id === item.id);
    if (idx < 0) return;
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;

    const swapItem = sorted[swapIdx];
    const newOrder = swapItem.order;
    const swapNewOrder = item.order;

    setItems((prev) => prev.map((it) => {
      if (it.id === item.id) return { ...it, order: newOrder };
      if (it.id === swapItem.id) return { ...it, order: swapNewOrder };
      return it;
    }));

    toast.loading('Đang cập nhật thứ tự...', { id: 'order' });
    try {
      await Promise.all([
        fetch('/api/homepage', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'update', id: item.id, title: item.title, description: item.description,
            image: item.image, link: item.link, order: newOrder, enabled: item.enabled,
          }),
        }),
        fetch('/api/homepage', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'update', id: swapItem.id, title: swapItem.title, description: swapItem.description,
            image: swapItem.image, link: swapItem.link, order: swapNewOrder, enabled: swapItem.enabled,
          }),
        }),
      ]);
      toast.success('Đã cập nhật thứ tự', { id: 'order' });
    } catch {
      toast.error('Lỗi kết nối', { id: 'order' });
      fetchItems();
    }
  };

  const openPreview = (item: HomepageItem) => {
    setPreviewItem(item);
    setPreviewOpen(true);
  };

  const handleSeedDefaults = async () => {
    if (!confirm('Thêm 3 banner mẫu vào Google Sheet?')) return;
    setSaving(true);
    toast.loading('Đang thêm banner mẫu...', { id: 'seed' });
    try {
      let nextId = Math.max(0, ...items.map((it) => parseInt(it.id) || 0));
      for (let i = 0; i < DEFAULT_BANNERS.length; i++) {
        const b = DEFAULT_BANNERS[i];
        nextId += 1;
        await fetch('/api/homepage', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'insert',
            title: b.title,
            description: b.description,
            image: b.image,
            link: b.link,
            order: i + 1,
            enabled: true,
          }),
        });
      }
      toast.success('Đã thêm banner mẫu!', { id: 'seed' });
      await fetchItems();
    } catch {
      toast.error('Lỗi kết nối', { id: 'seed' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Page header */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-bold text-foreground sm:text-xl">Nội dung trang chủ</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Quản lý Hero Slider và Kho bãi
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            onClick={handleSyncCache}
            disabled={refreshing || loading}
            className="gap-2 border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800 text-xs sm:text-sm"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{refreshing ? 'Đang...' : 'Đồng bộ'}</span>
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-5 grid w-full grid-cols-2 sm:w-auto sm:inline-flex">
          <TabsTrigger value="hero" className="gap-2 text-xs sm:text-sm">
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden sm:inline">Hero Slider</span>
            <span className="sm:hidden">Hero</span>
          </TabsTrigger>
          <TabsTrigger value="warehouse" className="gap-2 text-xs sm:text-sm">
            <ImageIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Kho bãi</span>
            <span className="sm:hidden">Kho</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="hero">
      {/* Hero section header */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground sm:text-xl">Hero Slider</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {heroItems.length} banner{heroItems.length !== 1 ? 's' : ''} · section: hero
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing || loading}
            className="gap-2 text-xs sm:text-sm"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{refreshing ? 'Đang tải...' : 'Làm mới'}</span>
            <span className="sm:hidden">{refreshing ? 'Đang...' : 'Refresh'}</span>
          </Button>
          {heroItems.length === 0 && !loading && (
            <Button
              variant="outline"
              onClick={handleSeedDefaults}
              disabled={saving}
              className="gap-2 border-amber-300 text-amber-700 hover:bg-amber-50 text-xs sm:text-sm"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Banner mẫu</span>
              <span className="sm:hidden">Mẫu</span>
            </Button>
          )}
          <Button onClick={openAdd} className="gap-2 bg-brand-600 text-white hover:bg-brand-700 text-xs sm:text-sm">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Thêm banner</span>
            <span className="sm:hidden">Thêm</span>
          </Button>
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="rounded-xl border border-border bg-white p-12 text-center text-sm text-muted-foreground">
          Đang tải...
        </div>
      ) : heroItems.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-white p-12 text-center">
          <Home className="mx-auto mb-3 h-10 w-10 text-brand-300" />
          <p className="text-sm font-medium text-foreground">Chưa có banner Hero nào</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Nhấn &quot;Banner mẫu&quot; để thêm nhanh 3 banner, hoặc &quot;Thêm banner&quot; để tạo mới.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop: Table */}
          <div className="hidden overflow-hidden rounded-xl border border-border bg-white shadow-soft sm:block">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-brand-50/50 text-left text-xs font-semibold uppercase text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Ảnh</th>
                    <th className="px-4 py-3">Tiêu đề</th>
                    <th className="px-4 py-3">Mô tả</th>
                    <th className="px-4 py-3">Link</th>
                    <th className="px-4 py-3 text-center">Thứ tự</th>
                    <th className="px-4 py-3 text-center">Trạng thái</th>
                    <th className="px-4 py-3 text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {heroItems.map((item, idx) => (
                    <tr key={item.id} className="transition-colors hover:bg-brand-50/30">
                      <td className="px-4 py-3">
                        {item.image ? (
                          <div className="relative h-12 w-20 shrink-0 overflow-hidden rounded-lg">
                            <Image
                              src={getFirstImage(item.image)}
                              alt={item.title}
                              fill
                              sizes="80px"
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="flex h-12 w-20 items-center justify-center rounded-lg bg-brand-50 text-brand-400">
                            <Home className="h-5 w-5" />
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 font-medium text-foreground">
                        {item.title || '(Không tiêu đề)'}
                      </td>
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
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => moveOrder(item, 'up')}
                            disabled={idx === 0}
                            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-brand-50 disabled:opacity-30"
                            aria-label="Lên"
                          >
                            <ArrowUp className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-6 text-center text-xs font-medium text-foreground">{item.order}</span>
                          <button
                            onClick={() => moveOrder(item, 'down')}
                            disabled={idx === heroItems.length - 1}
                            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-brand-50 disabled:opacity-30"
                            aria-label="Xuống"
                          >
                            <ArrowDown className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Switch
                          checked={item.enabled}
                          onCheckedChange={() => handleToggleEnabled(item)}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => openPreview(item)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-brand-600 hover:bg-brand-50"
                            title="Xem trước"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => openEdit(item)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-brand-600 hover:bg-brand-50"
                            title="Sửa"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-destructive hover:bg-red-50"
                            title="Xoá"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile: Cards */}
          <div className="grid grid-cols-1 gap-3 sm:hidden">
            {heroItems.map((item, idx) => (
              <div key={item.id} className="rounded-xl border border-border bg-white p-4 shadow-soft">
                <div className="flex items-start gap-3">
                  {item.image ? (
                    <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg">
                      <Image
                        src={getFirstImage(item.image)}
                        alt={item.title}
                        fill
                        sizes="64px"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex h-12 w-16 items-center justify-center rounded-lg bg-brand-50 text-brand-400">
                      <Home className="h-5 w-5" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-semibold text-foreground">{item.title || '(Không tiêu đề)'}</h3>
                    {item.description && (
                      <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{item.description}</p>
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
                <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => moveOrder(item, 'up')}
                      disabled={idx === 0}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground disabled:opacity-30"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => moveOrder(item, 'down')}
                      disabled={idx === heroItems.length - 1}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground disabled:opacity-30"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => openPreview(item)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-brand-200 text-brand-600 active:bg-brand-50">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button onClick={() => openEdit(item)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-brand-200 text-brand-600 active:bg-brand-50">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(item.id)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-destructive active:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? 'Sửa banner Hero' : 'Thêm banner Hero mới'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Upload ảnh */}
            <div>
              <Label>Ảnh banner *</Label>
              <p className="mb-2 text-xs text-muted-foreground">
                Khuyến nghị ảnh ngang, tỉ lệ 16:9 hoặc 21:9, dung lượng cao.
              </p>
              <ImageUpload
                value={form.image}
                onChange={(url) => setForm({ ...form, image: url })}
                label="Ảnh banner"
              />
            </div>

            {/* Preview ảnh ngay trong form */}
            {form.image && (
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-border">
                <Image
                  src={getFirstImage(form.image)}
                  alt="Preview"
                  fill
                  sizes="(max-width: 768px) 100vw, 500px"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />
                <div className="absolute inset-0 flex items-center">
                  <div className="p-4 sm:p-6">
                    <div className="max-w-xs">
                      <h3 className="text-base font-bold leading-tight text-white drop-shadow sm:text-lg">
                        {form.title || 'Tiêu đề banner'}
                      </h3>
                      {form.description && (
                        <p className="mt-1.5 line-clamp-2 text-xs text-white/90 drop-shadow sm:text-sm">
                          {form.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div>
              <Label>Tiêu đề *</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="VD: Gạo ngon cho mọi gia đình"
              />
            </div>

            <div>
              <Label>Mô tả</Label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-brand-500"
                placeholder="Mô tả ngắn hiển thị trên banner..."
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <Label>Link (nút bấm)</Label>
                <Input
                  value={form.link}
                  onChange={(e) => setForm({ ...form, link: e.target.value })}
                  placeholder="/products hoặc https://..."
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Để trống nếu không cần nút link.
                </p>
              </div>
              <div>
                <Label>Thứ tự</Label>
                <Input
                  type="number"
                  min={0}
                  value={form.order}
                  onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border bg-brand-50/50 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-foreground">Hiển thị banner</p>
                <p className="text-xs text-muted-foreground">Bật/tắt xuất hiện trên trang chủ</p>
              </div>
              <Switch
                checked={form.enabled}
                onCheckedChange={(checked) => setForm({ ...form, enabled: checked })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Huỷ</Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="gap-2 bg-brand-600 text-white hover:bg-brand-700"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Đang lưu...' : 'Lưu'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Xem trước banner</DialogTitle>
          </DialogHeader>
          {previewItem && (
            <div className="space-y-3">
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl">
                <Image
                  src={getFirstImage(previewItem.image)}
                  alt={previewItem.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 600px"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />
                <div className="absolute inset-0 flex items-center">
                  <div className="p-6 sm:p-10">
                    <div className="max-w-md">
                      <h2 className="text-xl font-bold leading-tight text-white drop-shadow-lg sm:text-2xl lg:text-3xl">
                        {previewItem.title || '(Không tiêu đề)'}
                      </h2>
                      {previewItem.description && (
                        <p className="mt-2 max-w-sm text-xs text-white/90 drop-shadow sm:text-sm lg:text-base">
                          {previewItem.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 rounded-lg border border-border bg-brand-50/50 px-4 py-3 text-xs">
                <span className="text-muted-foreground">
                  Trạng thái:{' '}
                  <Badge variant={previewItem.enabled ? 'default' : 'secondary'} className="text-[10px]">
                    {previewItem.enabled ? 'Hiện' : 'Ẩn'}
                  </Badge>
                </span>
                <span className="text-muted-foreground">Thứ tự: {previewItem.order}</span>
                {previewItem.link && (
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <ExternalLink className="h-3 w-3" />
                    {previewItem.link}
                  </span>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewOpen(false)}>
              <X className="h-4 w-4" />
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
        </TabsContent>

        <TabsContent value="warehouse">
          <WarehouseManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}
