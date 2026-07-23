'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Plus, Pencil, Trash2, FileText, RefreshCw,
  Bold, Italic, Strikethrough, Code, Code2,
  Heading1, Heading2, Heading3,
  List, ListOrdered, Quote,
  Undo2, Redo2,
  Search, Eye, Clock, Type,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ImageUpload } from '@/src/components/admin/ImageUpload';
import type { SheetBlogPost } from '@/src/lib/sheets';
import { BRAND } from '@/src/lib/brand';

const PER_PAGE = 10;
const WORDS_PER_MINUTE = 200;

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
}

const emptyForm: FormData = {
  id: '', title: '', slug: '', thumbnail: '', summary: '', content: '', created_at: '',
  meta_title: '', meta_description: '',
};

function ToolbarDivider() {
  return <div className="mx-0.5 h-5 w-px bg-border dark:bg-zinc-600" />;
}

function ToolbarButton({
  onClick,
  isActive,
  disabled,
  title,
  children,
}: {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={title}
      className={cn(
        'flex h-8 w-8 items-center justify-center rounded-md transition-colors',
        isActive
          ? 'bg-brand-600 text-white shadow-sm'
          : 'text-muted-foreground hover:bg-brand-100 hover:text-brand-700 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-100',
        disabled && 'cursor-not-allowed opacity-40',
      )}
    >
      {children}
    </button>
  );
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

  const editor = useEditor({
    extensions: [StarterKit, Placeholder.configure({ placeholder: 'Viết nội dung bài viết...' })],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none min-h-[150px] sm:min-h-[200px] px-4 py-3 text-sm outline-none dark:prose-invert',
      },
    },
    onUpdate: () => setContentTick((t) => t + 1),
  });

  useEffect(() => () => { editor?.destroy(); }, [editor]);

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

  const slugify = (s: string) =>
    s.toLowerCase().trim()
      .replace(/đ/g, 'd')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

  const wordCount = useMemo(() => {
    void contentTick;
    const text = stripHtml(editor?.getHTML() || '');
    return countWords(text);
  }, [editor, contentTick]);

  const readMins = readingTime(wordCount);

  const openAdd = () => {
    setEditing(false);
    setForm(emptyForm);
    setSlugEdited(false);
    editor?.commands.setContent('');
    setModalOpen(true);
  };

  const openEdit = (p: SheetBlogPost) => {
    setEditing(true);
    setForm({
      id: p.id,
      title: p.title || '',
      slug: p.slug || '',
      thumbnail: p.thumbnail || '',
      summary: p.summary || '',
      content: p.content || '',
      created_at: p.created_at || '',
      meta_title: p.meta_title || '',
      meta_description: p.meta_description || '',
    });
    setSlugEdited(true);
    editor?.commands.setContent(p.content || '');
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

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error('Vui lòng nhập tiêu đề'); return; }
    const content = editor?.getHTML() || '';
    const slug = form.slug || slugify(form.title);
    setSaving(true);
    toast.loading('Đang đồng bộ dữ liệu...', { id: 'sync' });
    const payload = {
      action: editing ? 'update' : 'insert',
      id: form.id || undefined,
      title: form.title,
      slug,
      thumbnail: form.thumbnail,
      summary: form.summary,
      content,
      created_at: form.created_at || new Date().toISOString(),
      meta_title: form.meta_title,
      meta_description: form.meta_description,
    };
    if (editing) {
      setPosts((prev) => prev.map((p) => p.id === form.id ? {
        ...p, title: form.title, slug, thumbnail: form.thumbnail, summary: form.summary, content,
        meta_title: form.meta_title, meta_description: form.meta_description,
      } : p));
    } else {
      const newId = String(Math.max(0, ...posts.map((p) => parseInt(p.id) || 0)) + 1);
      setPosts((prev) => [{
        id: newId, title: form.title, slug, thumbnail: form.thumbnail, summary: form.summary, content,
        created_at: payload.created_at, meta_title: form.meta_title, meta_description: form.meta_description,
      }, ...prev]);
    }
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

            <ImageUpload value={form.thumbnail} onChange={(url) => setForm({ ...form, thumbnail: url })} label="Thumbnail" />

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
              {editor && (
                <div className={cn('mt-1.5', isDark && 'dark')}>
                  <div className="sticky top-0 z-10 flex flex-wrap items-center gap-1 rounded-t-xl border border-b-0 border-border bg-brand-50/90 px-2 py-1.5 backdrop-blur-sm dark:border-zinc-700 dark:bg-zinc-800/90">
                    <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive('heading', { level: 1 })} title="Tiêu đề 1">
                      <Heading1 className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })} title="Tiêu đề 2">
                      <Heading2 className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive('heading', { level: 3 })} title="Tiêu đề 3">
                      <Heading3 className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarDivider />
                    <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} title="Đậm">
                      <Bold className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} title="Nghiêng">
                      <Italic className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')} title="Gạch ngang">
                      <Strikethrough className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton onClick={() => editor.chain().focus().toggleCode().run()} isActive={editor.isActive('code')} title="Mã inline">
                      <Code className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarDivider />
                    <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} title="Danh sách">
                      <List className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} title="Danh sách số">
                      <ListOrdered className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} title="Trích dẫn">
                      <Quote className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} isActive={editor.isActive('codeBlock')} title="Khối mã">
                      <Code2 className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarDivider />
                    <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Hoàn tác">
                      <Undo2 className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Làm lại">
                      <Redo2 className="h-4 w-4" />
                    </ToolbarButton>
                  </div>
                  <div className="rounded-b-xl border border-border bg-white focus-within:ring-2 focus-within:ring-brand-500/20 dark:border-zinc-700 dark:bg-zinc-900">
                    <EditorContent editor={editor} />
                  </div>
                </div>
              )}
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
