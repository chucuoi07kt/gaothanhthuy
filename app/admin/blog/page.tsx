'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  Plus, Pencil, Trash2, FileText, RefreshCw,
  Search, Eye, Clock, Type,
  Save, RotateCcw, Send, Image as ImageIcon, X, Tag as TagIcon, FolderTree, CalendarDays,
} from 'lucide-react';
import { MarkdownEditor } from '@/src/components/admin/MarkdownEditor';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ImageUpload } from '@/src/components/admin/ImageUpload';
import { BlogPreview } from '@/src/components/admin/BlogPreview';
import type { SheetBlogPost } from '@/src/lib/sheets';
import { BRAND } from '@/src/lib/brand';

const PER_PAGE = 10;
const WORDS_PER_MINUTE = 200;
const AUTOSAVE_INTERVAL = 30000;
const DRAFT_KEY = 'blog_editor_draft';
const DRAFT_META_KEY = 'blog_editor_draft_meta';

const BLOG_CATEGORIES = [
  'Cẩm nang gạo',
  'Kiến thức gạo',
  'Mẹo nấu ăn',
  'Sức khỏe',
  'Tin tức',
  'Khuyến mãi',
];

interface FormData {
  id: string;
  title: string;
  slug: string;
  thumbnail: string;
  summary: string;
  content: string;
  created_at: string;
  meta_title: string;
  meta_description: string;
  category: string;
  tags: string;
  publish_date: string;
}

const emptyForm: FormData = {
  id: '', title: '', slug: '', thumbnail: '', summary: '', content: '', created_at: '',
  meta_title: '', meta_description: '', category: 'Cẩm nang gạo', tags: '', publish_date: '',
};

interface DraftSnapshot {
  form: FormData;
  content: string;
  savedAt: string;
}

function stripHtml(html: string): string {
  if (typeof document !== 'undefined') {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }
  return html.replace(/<[^>]*>/g, ' ');
}

function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

function readingTime(wordCount: number): number {
  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
}

function formatDateForInput(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const mi = String(d.getMinutes()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
  } catch {
    return '';
  }
}

function SeoPreview({
  slug,
  metaTitle,
  metaDescription,
  title,
  excerpt,
}: {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  title: string;
  excerpt: string;
}) {
  const previewTitle = metaTitle || title || 'Tiêu đề bài viết';
  const previewDesc = metaDescription || excerpt || 'Mô tả bài viết sẽ hiển thị ở đây...';

  const titleColor = previewTitle.length > 60 ? 'text-red-600' : 'text-[#1a0dab]';
  const descColor = previewDesc.length > 160 ? 'text-red-600' : 'text-[#4d5156]';

  return (
    <div className="rounded-xl border border-border bg-white p-4 shadow-soft dark:border-zinc-700 dark:bg-zinc-900">
      <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase text-muted-foreground">
        <Eye className="h-3.5 w-3.5" /> Xem trước Google
      </p>
      <div className="space-y-1">
        <p className="truncate text-xs text-[#202124] dark:text-zinc-400">{BRAND.domain} › blog › {slug || 'slug-bai-viet'}</p>
        <p className={cn('line-clamp-1 text-lg font-medium leading-tight', titleColor)}>{previewTitle}</p>
        <p className={cn('line-clamp-2 text-sm leading-snug', descColor)}>{previewDesc}</p>
      </div>
      <div className="mt-3 flex flex-wrap gap-3 border-t border-border pt-2 text-xs text-muted-foreground dark:border-zinc-700">
        <span className={cn(metaTitle.length > 60 ? 'text-red-600 font-medium' : '')}>Tiêu đề: {metaTitle.length}/60</span>
        <span className={cn(metaDescription.length > 160 ? 'text-red-600 font-medium' : '')}>Mô tả: {metaDescription.length}/160</span>
      </div>
    </div>
  );
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<SheetBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [slugEdited, setSlugEdited] = useState(false);
  const [contentTick, setContentTick] = useState(0);
  const [tagInput, setTagInput] = useState('');
  const [tagList, setTagList] = useState<string[]>([]);
  const [draftSavedAt, setDraftSavedAt] = useState<string | null>(null);
  const [hasDraft, setHasDraft] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewHtml, setPreviewHtml] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [editorContent, setEditorContent] = useState('');
  const autoSaveTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

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

  useEffect(() => {
    try {
      const meta = localStorage.getItem(DRAFT_META_KEY);
      if (meta) setHasDraft(true);
    } catch { /* ignore */ }
  }, []);

  const slugify = (s: string) =>
    s.toLowerCase().trim()
      .replace(/đ/g, 'd')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

  const wordCount = useMemo(() => {
    void contentTick;
    const text = stripHtml(editorContent);
    return countWords(text);
  }, [editorContent, contentTick]);

  const readMins = readingTime(wordCount);

  const saveDraft = useCallback(() => {
    if (!modalOpen) return;
    const content = editorContent;
    if (!form.title.trim() && !content.trim()) return;
    const snapshot: DraftSnapshot = {
      form,
      content,
      savedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(snapshot));
      localStorage.setItem(DRAFT_META_KEY, snapshot.savedAt);
      setDraftSavedAt(snapshot.savedAt);
      setHasDraft(true);
    } catch { /* ignore */ }
  }, [modalOpen, form, editorContent]);

  useEffect(() => {
    if (!modalOpen) return;
    autoSaveTimer.current = setInterval(saveDraft, AUTOSAVE_INTERVAL);
    return () => {
      if (autoSaveTimer.current) clearInterval(autoSaveTimer.current);
    };
  }, [modalOpen, saveDraft]);

  const restoreDraft = () => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) { toast.error('Không tìm thấy bản nháp'); return; }
      const snapshot: DraftSnapshot = JSON.parse(raw);
      setForm(snapshot.form);
      setTagList(snapshot.form.tags ? snapshot.form.tags.split(',').map((t) => t.trim()).filter(Boolean) : []);
      setSlugEdited(true);
      setEditorContent(snapshot.content);
      setModalOpen(true);
      toast.success(`Đã khôi phục bản nháp (lúc ${new Date(snapshot.savedAt).toLocaleString('vi-VN')})`);
    } catch {
      toast.error('Không thể khôi phục bản nháp');
    }
  };

  const clearDraft = () => {
    try {
      localStorage.removeItem(DRAFT_KEY);
      localStorage.removeItem(DRAFT_META_KEY);
      setDraftSavedAt(null);
      setHasDraft(false);
    } catch { /* ignore */ }
  };

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tagList.includes(trimmed)) {
      const newList = [...tagList, trimmed];
      setTagList(newList);
      setForm((prev) => ({ ...prev, tags: newList.join(', ') }));
    }
    setTagInput('');
  };

  const handleRemoveTag = (tag: string) => {
    const newList = tagList.filter((t) => t !== tag);
    setTagList(newList);
    setForm((prev) => ({ ...prev, tags: newList.join(', ') }));
  };

  const openAdd = () => {
    setEditing(false);
    setForm(emptyForm);
    setTagList([]);
    setSlugEdited(false);
    setDraftSavedAt(null);
    setEditorContent('');
    setModalOpen(true);
  };

  const openEdit = (p: SheetBlogPost) => {
    setEditing(true);
    const formData: FormData = {
      id: p.id,
      title: p.title || '',
      slug: p.slug || '',
      thumbnail: p.thumbnail || '',
      summary: p.summary || '',
      content: p.content || '',
      created_at: p.created_at || '',
      meta_title: p.meta_title || '',
      meta_description: p.meta_description || '',
      category: 'Cẩm nang gạo',
      tags: '',
      publish_date: p.created_at ? formatDateForInput(p.created_at) : '',
    };
    setForm(formData);
    setTagList([]);
    setSlugEdited(true);
    setDraftSavedAt(null);
    setEditorContent(p.content || '');
    setModalOpen(true);
  };

  const handleTitleChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      title: value,
      slug: slugEdited ? prev.slug : slugify(value),
    }));
  };

  const handleSlugChange = (value: string) => {
    setSlugEdited(true);
    setForm((prev) => ({ ...prev, slug: slugify(value) }));
  };

  const handlePreview = () => {
    setPreviewHtml(editorContent);
    setPreviewTitle(form.title || 'Xem trước bài viết');
    setPreviewOpen(true);
  };

  const handleSaveDraft = () => {
    saveDraft();
    toast.success('Đã lưu bản nháp');
  };

  const handlePublish = async () => {
    if (!form.title.trim()) { toast.error('Vui lòng nhập tiêu đề'); return; }
    const content = editorContent;
    const slug = form.slug || slugify(form.title);
    const publishDate = form.publish_date
      ? new Date(form.publish_date).toISOString()
      : (form.created_at || new Date().toISOString());
    setSaving(true);
    toast.loading('Đang xuất bản...', { id: 'sync' });
    const payload = {
      action: editing ? 'update' : 'insert',
      id: form.id || undefined,
      title: form.title,
      slug,
      thumbnail: form.thumbnail,
      summary: form.summary,
      content,
      created_at: publishDate,
      meta_title: form.meta_title,
      meta_description: form.meta_description,
    };
    if (editing) {
      setPosts((prev) => prev.map((p) => p.id === form.id ? {
        ...p, title: form.title, slug, thumbnail: form.thumbnail, summary: form.summary, content,
        meta_title: form.meta_title, meta_description: form.meta_description, created_at: publishDate,
      } : p));
    } else {
      const newId = String(Math.max(0, ...posts.map((p) => parseInt(p.id) || 0)) + 1);
      setPosts((prev) => [{
        id: newId, title: form.title, slug, thumbnail: form.thumbnail, summary: form.summary, content,
        created_at: publishDate, meta_title: form.meta_title, meta_description: form.meta_description,
      }, ...prev]);
    }
    setModalOpen(false);
    clearDraft();
    try {
      const res = await fetch('/api/blog', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (data.success) toast.success('Xuất bản thành công!', { id: 'sync' });
      else { toast.error(`Lỗi: ${data.error || 'Không thể xuất bản'}`, { id: 'sync' }); fetchPosts(); }
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

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-bold text-foreground sm:text-xl">Quản lý bài viết</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">{posts.length} bài viết</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {hasDraft && (
            <Button variant="outline" onClick={restoreDraft} className="gap-2 border-amber-300 text-amber-700 hover:bg-amber-50 text-xs sm:text-sm">
              <RotateCcw className="h-4 w-4" />
              <span className="hidden sm:inline">Khôi phục nháp</span>
              <span className="sm:hidden">Nháp</span>
            </Button>
          )}
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
        <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader><DialogTitle>{editing ? 'Sửa bài viết' : 'Thêm bài viết mới'}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Tiêu đề *</Label>
              <Input
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Tiêu đề bài viết"
              />
            </div>

            <div>
              <Label>Slug (URL)</Label>
              <div className="flex items-center gap-2">
                <Input
                  value={form.slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  placeholder="tu-dong-tao-tu-tieu-de"
                  className="flex-1"
                />
                {!slugEdited && form.slug && (
                  <span className="shrink-0 rounded-md bg-brand-50 px-2 py-1 text-xs text-brand-600 dark:bg-zinc-800 dark:text-brand-400">
                    Tự động
                  </span>
                )}
              </div>
            </div>

            {/* Featured Image */}
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5">
                <ImageIcon className="h-3.5 w-3.5" />
                Ảnh đại diện (Featured Image)
              </Label>
              <ImageUpload value={form.thumbnail} onChange={(url) => setForm({ ...form, thumbnail: url })} label="Featured Image" />
            </div>

            {/* Category & Publish Date */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label className="flex items-center gap-1.5">
                  <FolderTree className="h-3.5 w-3.5" />
                  Danh mục (Category)
                </Label>
                <Select
                  value={form.category}
                  onValueChange={(val) => setForm({ ...form, category: val })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    {BLOG_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5" />
                  Ngày xuất bản (Publish Date)
                </Label>
                <Input
                  type="datetime-local"
                  value={form.publish_date}
                  onChange={(e) => setForm({ ...form, publish_date: e.target.value })}
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <Label className="flex items-center gap-1.5">
                <TagIcon className="h-3.5 w-3.5" />
                Thẻ (Tags)
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="Nhập thẻ rồi Enter..."
                  className="flex-1"
                />
                <Button type="button" variant="outline" size="sm" onClick={handleAddTag} className="shrink-0">Thêm</Button>
              </div>
              {tagList.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {tagList.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-0.5 rounded-full p-0.5 hover:bg-muted-foreground/20"
                        aria-label={`Xoá thẻ ${tag}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div>
              <Label>Tóm tắt</Label>
              <textarea
                value={form.summary}
                onChange={(e) => setForm({ ...form, summary: e.target.value })}
                rows={2}
                className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-brand-500 dark:border-zinc-700 dark:bg-zinc-900"
                placeholder="Tóm tắt ngắn..."
              />
            </div>

            <div>
              <Label>Nội dung</Label>
              <div className="mt-1.5">
                <MarkdownEditor
                  content={editorContent}
                  onChange={(html) => { setEditorContent(html); setContentTick((t) => t + 1); }}
                  isDark={isDark}
                />
              </div>
            </div>

            {/* Word Count & Reading Time */}
            <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-brand-50/50 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800/50">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Type className="h-3.5 w-3.5" />
                <span className="font-medium text-foreground">{wordCount}</span> từ
              </span>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                <span className="font-medium text-foreground">{readMins}</span> phút đọc
              </span>
              {draftSavedAt && (
                <span className="flex items-center gap-1.5 text-xs text-amber-600">
                  <Save className="h-3.5 w-3.5" />
                  Nháp: {new Date(draftSavedAt).toLocaleTimeString('vi-VN')}
                </span>
              )}
            </div>

            {/* SEO Section */}
            <div className="space-y-3 rounded-xl border border-border bg-gray-50/50 p-4 dark:border-zinc-700 dark:bg-zinc-800/30">
              <p className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                <Search className="h-4 w-4 text-brand-600" />
                Tối ưu SEO
              </p>

              <div>
                <Label>Meta Title</Label>
                <Input
                  value={form.meta_title}
                  onChange={(e) => setForm({ ...form, meta_title: e.target.value })}
                  placeholder="Tiêu đề SEO (tối đa 60 ký tự)"
                  maxLength={70}
                />
                <p className={cn('mt-1 text-xs', form.meta_title.length > 60 ? 'text-red-600' : 'text-muted-foreground')}>
                  {form.meta_title.length}/60 ký tự
                  {form.meta_title.length > 60 && ' - quá giới hạn khuyến nghị'}
                </p>
              </div>

              <div>
                <Label>Meta Description</Label>
                <textarea
                  value={form.meta_description}
                  onChange={(e) => setForm({ ...form, meta_description: e.target.value })}
                  rows={2}
                  maxLength={200}
                  className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-brand-500 dark:border-zinc-700 dark:bg-zinc-900"
                  placeholder="Mô tả SEO (tối đa 160 ký tự)"
                />
                <p className={cn('mt-1 text-xs', form.meta_description.length > 160 ? 'text-red-600' : 'text-muted-foreground')}>
                  {form.meta_description.length}/160 ký tự
                  {form.meta_description.length > 160 && ' - quá giới hạn khuyến nghị'}
                </p>
              </div>

              <SeoPreview
                slug={form.slug}
                metaTitle={form.meta_title}
                metaDescription={form.meta_description}
                title={form.title}
                excerpt={form.summary}
              />
            </div>

            {/* Publish Actions */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={handleSaveDraft} className="gap-1.5">
                  <Save className="h-4 w-4" />
                  Lưu nháp
                </Button>
                <Button variant="outline" size="sm" onClick={handlePreview} className="gap-1.5">
                  <Eye className="h-4 w-4" />
                  Xem trước
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setModalOpen(false)}>Huỷ</Button>
                <Button onClick={handlePublish} disabled={saving} className="gap-1.5 bg-brand-600 text-white hover:bg-brand-700">
                  <Send className="h-4 w-4" />
                  {saving ? 'Đang xuất bản...' : 'Xuất bản'}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader><DialogTitle>Xem trước: {previewTitle}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            {form.thumbnail && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.thumbnail} alt={previewTitle} className="aspect-[16/9] w-full rounded-xl object-cover" />
            )}
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              {form.category && <span className="rounded-full bg-brand-50 px-2.5 py-1 font-medium text-brand-700">{form.category}</span>}
              {form.publish_date && <span>{new Date(form.publish_date).toLocaleDateString('vi-VN')}</span>}
              <span>{readMins} phút đọc</span>
            </div>
            {tagList.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {tagList.map((tag) => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
            )}
            <BlogPreview html={previewHtml} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
