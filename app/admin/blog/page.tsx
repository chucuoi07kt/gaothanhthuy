'use client';

import { useState, useEffect, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Plus, Pencil, Trash2, FileText, RefreshCw, Bold, Italic, List, ListOrdered } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ImageUpload } from '@/src/components/admin/ImageUpload';
import type { SheetBlogPost } from '@/src/lib/sheets';

const PER_PAGE = 10;

interface FormData {
  id: string;
  title: string;
  slug: string;
  thumbnail: string;
  summary: string;
  content: string;
  created_at: string;
}

const emptyForm: FormData = {
  id: '', title: '', slug: '', thumbnail: '', summary: '', content: '', created_at: '',
};

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<SheetBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit, Placeholder.configure({ placeholder: 'Viết nội dung bài viết...' })],
    content: '',
    editorProps: { attributes: { class: 'prose prose-sm max-w-none min-h-[120px] sm:min-h-[150px] rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-brand-500' } },
  });

  useEffect(() => () => { editor?.destroy(); }, [editor]);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/blog');
      const data = await res.json();
      setPosts(Array.isArray(data.posts) ? data.posts : []);
    } catch { toast.error('Không thể tải dữ liệu bài viết'); setPosts([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const handleSyncCache = async () => {
    setSyncing(true);
    toast.loading('Đang làm mới dữ liệu từ Google Sheet...', { id: 'sync-cache' });
    try {
      const res = await fetch('/api/revalidate', { method: 'POST' });
      const data = await res.json();
      if (data.success) { toast.success('Đã đồng bộ dữ liệu mới nhất!', { id: 'sync-cache' }); await fetchPosts(); }
      else toast.error(data.message || 'Lỗi đồng bộ cache', { id: 'sync-cache' });
    } catch { toast.error('Không thể kết nối tới API đồng bộ', { id: 'sync-cache' }); }
    finally { setSyncing(false); }
  };

  const totalPages = Math.max(1, Math.ceil(posts.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = posts.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const slugify = (s: string) => s.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');

  const openAdd = () => { setEditing(false); setForm(emptyForm); editor?.commands.setContent(''); setModalOpen(true); };

  const openEdit = (p: SheetBlogPost) => {
    setEditing(true);
    setForm({ id: p.id, title: p.title || '', slug: p.slug || '', thumbnail: p.thumbnail || '', summary: p.summary || '', content: p.content || '', created_at: p.created_at || '' });
    editor?.commands.setContent(p.content || '');
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error('Vui lòng nhập tiêu đề'); return; }
    const content = editor?.getHTML() || '';
    const slug = form.slug || slugify(form.title);
    setSaving(true);
    toast.loading('Đang đồng bộ dữ liệu...', { id: 'sync' });
    const payload = { action: editing ? 'update' : 'insert', id: form.id || undefined, title: form.title, slug, thumbnail: form.thumbnail, summary: form.summary, content, created_at: form.created_at || new Date().toISOString() };
    if (editing) { setPosts((prev) => prev.map((p) => p.id === form.id ? { ...p, title: form.title, slug, thumbnail: form.thumbnail, summary: form.summary, content } : p)); }
    else { const newId = String(Math.max(0, ...posts.map((p) => parseInt(p.id) || 0)) + 1); setPosts((prev) => [{ id: newId, title: form.title, slug, thumbnail: form.thumbnail, summary: form.summary, content, created_at: payload.created_at }, ...prev]); }
    setModalOpen(false);
    try {
      const res = await fetch('/api/blog', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (data.success) toast.success('Đồng bộ Google Sheets thành công!', { id: 'sync' });
      else { toast.error(`Lỗi: ${data.error || 'Không thể đồng bộ'}`, { id: 'sync' }); fetchPosts(); }
    } catch { toast.error('Lỗi kết nối server', { id: 'sync' }); fetchPosts(); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Xoá bài viết này?')) return;
    const prev = posts;
    setPosts((p) => p.filter((item) => item.id !== id));
    toast.loading('Đang đồng bộ...', { id: 'del' });
    try {
      const res = await fetch('/api/blog', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'delete', id }) });
      const data = await res.json();
      if (data.success) toast.success('Đã xoá bài viết', { id: 'del' });
      else { toast.error('Lỗi xoá', { id: 'del' }); setPosts(prev); }
    } catch { toast.error('Lỗi kết nối', { id: 'del' }); setPosts(prev); }
  };

  if (!editor && modalOpen) return null;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-bold text-foreground sm:text-xl">Quản lý bài viết</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">{posts.length} bài viết</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" onClick={handleSyncCache} disabled={syncing || loading} className="gap-2 border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800 text-xs sm:text-sm">
            <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{syncing ? 'Đang đồng bộ...' : 'Đồng bộ Sheet'}</span>
            <span className="sm:hidden">{syncing ? 'Đang...' : 'Sync'}</span>
          </Button>
          <Button onClick={openAdd} className="gap-2 bg-brand-600 text-white hover:bg-brand-700 text-xs sm:text-sm">
            <Plus className="h-4 w-4" /> <span className="hidden sm:inline">Thêm bài viết</span><span className="sm:hidden">Thêm</span>
          </Button>
        </div>
      </div>

      {/* Mobile: Card layout */}
      <div className="grid grid-cols-1 gap-3 sm:hidden">
        {loading ? (
          <div className="rounded-xl border border-border bg-white p-8 text-center text-sm text-muted-foreground">Đang tải...</div>
        ) : pageItems.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-white p-8 text-center">
            <FileText className="mx-auto mb-2 h-8 w-8 text-brand-300" />
            <p className="text-sm text-muted-foreground">Không có bài viết nào</p>
          </div>
        ) : (
          pageItems.map((p) => (
            <div key={p.id} className="rounded-xl border border-border bg-white p-4 shadow-soft">
              <div className="flex items-start gap-3">
                {p.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.thumbnail} alt={p.title} className="h-12 w-12 shrink-0 rounded-lg object-cover" />
                ) : (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-400"><FileText className="h-5 w-5" /></div>
                )}
                <div className="min-w-0 flex-1">
                  <h3 className="line-clamp-2 text-sm font-semibold text-foreground">{p.title}</h3>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">/{p.slug}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{p.created_at ? String(p.created_at).slice(0, 10) : '—'}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                <span className="font-mono text-xs text-muted-foreground">ID: {p.id}</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => openEdit(p)} className="flex h-9 w-9 items-center justify-center rounded-lg border border-brand-200 text-brand-600 active:bg-brand-50"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => handleDelete(p.id)} className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-destructive active:bg-red-50"><Trash2 className="h-4 w-4" /></button>
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
              <tr><th className="px-4 py-3">ID</th><th className="px-4 py-3">Tiêu đề</th><th className="px-4 py-3">Slug</th><th className="px-4 py-3">Ngày tạo</th><th className="px-4 py-3 text-center">Thao tác</th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr><td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">Đang tải...</td></tr>
              ) : pageItems.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-12 text-center text-muted-foreground"><FileText className="mx-auto mb-2 h-8 w-8 text-brand-300" />Không có bài viết nào</td></tr>
              ) : (
                pageItems.map((p) => (
                  <tr key={p.id} className="transition-colors hover:bg-brand-50/30">
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{p.id}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {p.thumbnail ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={p.thumbnail} alt={p.title} className="h-9 w-9 rounded-lg object-cover" />
                        ) : (
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-400"><FileText className="h-4 w-4" /></div>
                        )}
                        <span className="line-clamp-1 font-medium text-foreground">{p.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{p.slug}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{p.created_at ? String(p.created_at).slice(0, 10) : '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1.5">
                        <button onClick={() => openEdit(p)} className="flex h-8 w-8 items-center justify-center rounded-lg text-brand-600 hover:bg-brand-50"><Pencil className="h-4 w-4" /></button>
                        <button onClick={() => handleDelete(p.id)} className="flex h-8 w-8 items-center justify-center rounded-lg text-destructive hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" disabled={currentPage <= 1} onClick={() => setPage((p) => p - 1)}>Trước</Button>
          <span className="text-sm text-muted-foreground">{currentPage} / {totalPages}</span>
          <Button variant="outline" size="sm" disabled={currentPage >= totalPages} onClick={() => setPage((p) => p + 1)}>Sau</Button>
        </div>
      )}

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader><DialogTitle>{editing ? 'Sửa bài viết' : 'Thêm bài viết mới'}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Tiêu đề *</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: form.slug || slugify(e.target.value) })} placeholder="Tiêu đề bài viết" /></div>
            <div><Label>Slug (URL)</Label><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="tu-dong-tao-tu-tieu-de" /></div>
            <ImageUpload value={form.thumbnail} onChange={(url) => setForm({ ...form, thumbnail: url })} label="Thumbnail" />
            <div><Label>Tóm tắt</Label><textarea value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} rows={2} className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-brand-500" placeholder="Tóm tắt ngắn..." /></div>
            <div>
              <Label>Nội dung</Label>
              {editor && (
                <div className="mb-1.5 flex flex-wrap gap-1">
                  <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={cn('flex h-9 w-9 items-center justify-center rounded-lg border', editor.isActive('bold') ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-border text-muted-foreground hover:bg-brand-50')}><Bold className="h-4 w-4" /></button>
                  <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={cn('flex h-9 w-9 items-center justify-center rounded-lg border', editor.isActive('italic') ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-border text-muted-foreground hover:bg-brand-50')}><Italic className="h-4 w-4" /></button>
                  <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={cn('flex h-9 w-9 items-center justify-center rounded-lg border', editor.isActive('bulletList') ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-border text-muted-foreground hover:bg-brand-50')}><List className="h-4 w-4" /></button>
                  <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={cn('flex h-9 w-9 items-center justify-center rounded-lg border', editor.isActive('orderedList') ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-border text-muted-foreground hover:bg-brand-50')}><ListOrdered className="h-4 w-4" /></button>
                </div>
              )}
              <EditorContent editor={editor} />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setModalOpen(false)}>Huỷ</Button>
              <Button onClick={handleSave} disabled={saving} className="bg-brand-600 text-white hover:bg-brand-700">{saving ? 'Đang lưu...' : 'Lưu'}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
