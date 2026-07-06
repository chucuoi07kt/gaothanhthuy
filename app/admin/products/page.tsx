'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Plus, Search, Pencil, Trash2, Package, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ImageUpload } from '@/src/components/admin/ImageUpload';
import type { SheetProduct } from '@/src/lib/sheets';

const CATEGORIES = [
  'Gạo ăn gia đình',
  'Gạo quán cơm - nhà hàng',
  'Gạo từ thiện',
  'Gạo nấu bún - mì - phở',
];

const PER_PAGE = 10;

interface FormData {
  id: string;
  name: string;
  category: string;
  price: string;
  weight_options: string;
  image: string;
  description: string;
  deo: string;
  no: string;
  mem: string;
  thom: string;
}

const emptyForm: FormData = {
  id: '', name: '', category: CATEGORIES[0], price: '', weight_options: '5kg, 10kg, 25kg, 50kg',
  image: '', description: '', deo: '0', no: '0', mem: '0', thom: '0',
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<SheetProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(Array.isArray(data.products) ? data.products : []);
    } catch {
      toast.error('Không thể tải dữ liệu sản phẩm');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleSyncCache = async () => {
    setSyncing(true);
    toast.loading('Đang làm mới dữ liệu từ Google Sheet...', { id: 'sync-cache' });
    try {
      const res = await fetch('/api/revalidate', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        toast.success('Đã đồng bộ dữ liệu mới nhất!', { id: 'sync-cache' });
        await fetchProducts();
      } else {
        toast.error(data.message || 'Lỗi đồng bộ cache', { id: 'sync-cache' });
      }
    } catch {
      toast.error('Không thể kết nối tới API đồng bộ', { id: 'sync-cache' });
    } finally {
      setSyncing(false);
    }
  };

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (filterCategory !== 'all' && p.category !== filterCategory) return false;
      if (search.trim() && !(p.name || '').toLowerCase().includes(search.toLowerCase().trim())) return false;
      return true;
    });
  }, [products, search, filterCategory]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const openAdd = () => {
    setEditing(false);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (p: SheetProduct) => {
    setEditing(true);
    setForm({
      id: p.id, name: p.name || '', category: p.category || CATEGORIES[0], price: String(p.price || 0),
      weight_options: p.weight_options || '', image: p.image || '', description: p.description || '',
      deo: String(p.dẻo || 0), no: String(p.nở || 0), mem: String(p.mềm || 0), thom: String(p.thơm || 0),
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('Vui lòng nhập tên sản phẩm'); return; }
    setSaving(true);
    toast.loading('Đang đồng bộ dữ liệu...', { id: 'sync' });

    const payload = {
      action: editing ? 'update' : 'insert',
      id: form.id || undefined,
      name: form.name,
      category: form.category,
      price: form.price,
      weight_options: form.weight_options,
      image: form.image,
      description: form.description,
      deo: parseInt(form.deo) || 0,
      no: parseInt(form.no) || 0,
      mem: parseInt(form.mem) || 0,
      thom: parseInt(form.thom) || 0,
    };

    if (editing) {
      setProducts((prev) => prev.map((p) => p.id === form.id ? {
        ...p, name: form.name, category: form.category,
        price: parseInt(form.price.replace(/[^\d]/g, '')) || 0,
        weight_options: form.weight_options, image: form.image, description: form.description,
        dẻo: parseInt(form.deo) || 0, nở: parseInt(form.no) || 0, mềm: parseInt(form.mem) || 0, thơm: parseInt(form.thom) || 0,
      } : p));
    } else {
      const newId = String(Math.max(0, ...products.map((p) => parseInt(p.id) || 0)) + 1);
      const newProduct: SheetProduct = {
        id: newId, name: form.name, category: form.category,
        price: parseInt(form.price.replace(/[^\d]/g, '')) || 0,
        weight_options: form.weight_options, image: form.image, description: form.description,
        dẻo: parseInt(form.deo) || 0, nở: parseInt(form.no) || 0, mềm: parseInt(form.mem) || 0, thơm: parseInt(form.thom) || 0,
      };
      setProducts((prev) => [newProduct, ...prev]);
    }
    setModalOpen(false);

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Đồng bộ Google Sheets thành công!', { id: 'sync' });
      } else {
        toast.error(`Lỗi: ${data.error || 'Không thể đồng bộ'}`, { id: 'sync' });
        fetchProducts();
      }
    } catch {
      toast.error('Lỗi kết nối server', { id: 'sync' });
      fetchProducts();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Xoá sản phẩm này?')) return;
    const prev = products;
    setProducts((p) => p.filter((item) => item.id !== id));
    toast.loading('Đang đồng bộ...', { id: 'del' });
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id }),
      });
      const data = await res.json();
      if (data.success) toast.success('Đã xoá sản phẩm', { id: 'del' });
      else { toast.error('Lỗi xoá', { id: 'del' }); setProducts(prev); }
    } catch {
      toast.error('Lỗi kết nối', { id: 'del' });
      setProducts(prev);
    }
  };

  const formatPrice = (val: string) => val.replace(/[^\d]/g, '');

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-bold text-foreground sm:text-xl">Quản lý sản phẩm</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">{products.length} sản phẩm</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            onClick={handleSyncCache}
            disabled={syncing || loading}
            className="gap-2 border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800 text-xs sm:text-sm"
          >
            <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{syncing ? 'Đang đồng bộ...' : 'Đồng bộ Sheet'}</span>
            <span className="sm:hidden">{syncing ? 'Đang...' : 'Sync'}</span>
          </Button>
          <Button onClick={openAdd} className="gap-2 bg-brand-600 text-white hover:bg-brand-700 text-xs sm:text-sm">
            <Plus className="h-4 w-4" /> <span className="hidden sm:inline">Thêm sản phẩm</span>
            <span className="sm:hidden">Thêm</span>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Tìm theo tên sản phẩm..."
            className="pl-10"
          />
        </div>
        <Select value={filterCategory} onValueChange={(v) => { setFilterCategory(v); setPage(1); }}>
          <SelectTrigger className="w-full sm:w-56">
            <SelectValue placeholder="Lọc theo danh mục" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả danh mục</SelectItem>
            {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Mobile: Card layout */}
      <div className="grid grid-cols-1 gap-3 sm:hidden">
        {loading ? (
          <div className="rounded-xl border border-border bg-white p-8 text-center text-sm text-muted-foreground">Đang tải...</div>
        ) : pageItems.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-white p-8 text-center">
            <Package className="mx-auto mb-2 h-8 w-8 text-brand-300" />
            <p className="text-sm text-muted-foreground">Không có sản phẩm nào</p>
          </div>
        ) : (
          pageItems.map((p) => (
            <div key={p.id} className="rounded-xl border border-border bg-white p-4 shadow-soft">
              <div className="flex items-start gap-3">
                {p.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.image.split(',')[0] || ''} alt={p.name} className="h-12 w-12 shrink-0 rounded-lg object-cover" />
                ) : (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-400">
                    <Package className="h-5 w-5" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-semibold text-foreground">{p.name}</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">{p.category}</p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <span className="text-sm font-bold text-brand-700">
                      {(p.price || 0).toLocaleString('vi-VN')}đ/kg
                    </span>
                    <span className="text-xs text-muted-foreground">· {p.weight_options || 'Chưa set'}</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                <span className="font-mono text-xs text-muted-foreground">ID: {p.id}</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => openEdit(p)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-brand-200 text-brand-600 active:bg-brand-50">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(p.id)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-destructive active:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
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
                <th className="px-4 py-3">Tên sản phẩm</th>
                <th className="px-4 py-3">Danh mục</th>
                <th className="px-4 py-3 text-right">Giá (đ/kg)</th>
                <th className="px-4 py-3">Quy cách</th>
                <th className="px-4 py-3 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">Đang tải...</td></tr>
              ) : pageItems.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                  <Package className="mx-auto mb-2 h-8 w-8 text-brand-300" />
                  Không có sản phẩm nào
                </td></tr>
              ) : (
                pageItems.map((p) => (
                  <tr key={p.id} className="transition-colors hover:bg-brand-50/30">
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{p.id}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {p.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={p.image.split(',')[0] || ''} alt={p.name} className="h-9 w-9 rounded-lg object-cover" />
                        ) : (
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-400">
                            <Package className="h-4 w-4" />
                          </div>
                        )}
                        <span className="font-medium text-foreground">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{p.category}</td>
                    <td className="px-4 py-3 text-right font-medium text-brand-700">
                      {(p.price || 0).toLocaleString('vi-VN')}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{p.weight_options}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1.5">
                        <button onClick={() => openEdit(p)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-brand-600 hover:bg-brand-50">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(p.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-destructive hover:bg-red-50">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" disabled={currentPage <= 1}
            onClick={() => setPage((p) => p - 1)}>Trước</Button>
          <span className="text-sm text-muted-foreground">{currentPage} / {totalPages}</span>
          <Button variant="outline" size="sm" disabled={currentPage >= totalPages}
            onClick={() => setPage((p) => p + 1)}>Sau</Button>
        </div>
      )}

      {/* Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Tên sản phẩm *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="VD: Gạo ST25 Lúa Tôm" />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <Label>Danh mục</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Giá (đ/kg)</Label>
                <Input value={form.price}
                  onChange={(e) => setForm({ ...form, price: formatPrice(e.target.value) })}
                  placeholder="280000" inputMode="numeric" />
              </div>
            </div>
            <div>
              <Label>Quy cách đóng gói</Label>
              <Input value={form.weight_options}
                onChange={(e) => setForm({ ...form, weight_options: e.target.value })}
                placeholder="5kg, 10kg, 25kg, 50kg" />
            </div>
            <ImageUpload value={form.image} onChange={(url) => setForm({ ...form, image: url })} multiple />
            <div>
              <Label>Mô tả</Label>
              <textarea value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-brand-500"
                placeholder="Mô tả sản phẩm..." />
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div>
                <Label>Độ dẻo (1-5)</Label>
                <Input type="number" min={0} max={5} value={form.deo}
                  onChange={(e) => setForm({ ...form, deo: e.target.value })} />
              </div>
              <div>
                <Label>Độ nở (1-5)</Label>
                <Input type="number" min={0} max={5} value={form.no}
                  onChange={(e) => setForm({ ...form, no: e.target.value })} />
              </div>
              <div>
                <Label>Độ mềm (1-5)</Label>
                <Input type="number" min={0} max={5} value={form.mem}
                  onChange={(e) => setForm({ ...form, mem: e.target.value })} />
              </div>
              <div>
                <Label>Độ thơm (1-5)</Label>
                <Input type="number" min={0} max={5} value={form.thom}
                  onChange={(e) => setForm({ ...form, thom: e.target.value })} />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setModalOpen(false)}>Huỷ</Button>
              <Button onClick={handleSave} disabled={saving}
                className="bg-brand-600 text-white hover:bg-brand-700">
                {saving ? 'Đang lưu...' : 'Lưu'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
