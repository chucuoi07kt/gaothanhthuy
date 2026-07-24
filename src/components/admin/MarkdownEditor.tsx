'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { createLowlight, common } from 'lowlight';
import {
  Bold, Italic, Strikethrough, Code, Code2,
  Heading1, Heading2, Heading3,
  List, ListOrdered, ListChecks, Quote,
  Undo2, Redo2,
  Link as LinkIcon, Image as ImageIcon,
  Table as TableIcon, Minus, Smile,
  Upload, X, Loader2, Pencil, Trash2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import {
  Popover, PopoverContent, PopoverTrigger,
} from '@/components/ui/popover';
import { uploadToCloudinaryWithProgress } from '@/src/lib/cloudinary';
import { toast } from 'sonner';

const lowlight = createLowlight(common);

const EMOJI_CATEGORIES: Record<string, string[]> = {
  'Biểu cảm': ['😀', '😁', '😂', '🤣', '😊', '😍', '🤩', '😎', '🤔', '🤨', '😐', '😶', '🙄', '😏', '😴', '🤤', '😪', '😵', '🤯', '🥳', '😭', '😱', '🥺', '😅', '😆', '🤗', '🤔', '🙃', '😉', '😋'],
  'Cử chỉ': ['👍', '👎', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '👏', '🙌', '🙏', '🤝', '💪', '✊', '👊', '🤚', '✋', '👋', '🤙', '💪', '🫶', '🫰', '🤜', '🤛'],
  'Đồ ăn': ['🍚', '🍜', '🍞', '🥖', '🥐', '🧀', '🥚', '🍳', '🥞', '🥗', '🍕', '🍔', '🍟', '🌭', '🥪', '🌮', '🍣', '🍱', '🍛', '🍤', '🍦', '🍩', '🍪', '🍫', '🍬', '🍭', '🍯', '🍵', '☕', '🥛'],
  'Thiên nhiên': ['🌿', '🌱', '🌳', '🌴', '🌵', '🌾', '🍀', '🍁', '🍂', '🌸', '🌺', '🌻', '🌹', '🌷', '🌼', '☀️', '🌙', '⭐', '✨', '🌟', '💫', '⚡', '🔥', '💧', '🌊', '🌈', '☁️', '❄️', '☃️', '🌬️'],
  'Đối tượng': ['📦', '📝', '📋', '📄', '📂', '📁', '💡', '🔔', '🎯', '🎁', '🏆', '🥇', '🥈', '🥉', '⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🎨', '📷', '💻', '📱', '🔑', '🔒', '🔧', '🔨', '⚙️', '🧰'],
};

function ToolbarDivider() {
  return <div className="mx-0.5 h-5 w-px bg-border dark:bg-zinc-600" />;
}

function ToolbarButton({
  onClick, isActive, disabled, title, children,
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

interface UploadTask {
  id: string;
  fileName: string;
  progress: number;
  status: 'uploading' | 'done' | 'error';
}

interface ImageNodeInfo {
  src: string;
  alt: string;
  pos: number;
}

interface MarkdownEditorProps {
  content: string;
  onChange: (html: string) => void;
  isDark: boolean;
}

export function MarkdownEditor({ content, onChange, isDark }: MarkdownEditorProps) {
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [emojiCategory, setEmojiCategory] = useState('Biểu cảm');
  const [uploadTasks, setUploadTasks] = useState<UploadTask[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [captionDialogOpen, setCaptionDialogOpen] = useState(false);
  const [captionText, setCaptionText] = useState('');
  const [captionTargetPos, setCaptionTargetPos] = useState<number | null>(null);
  const [replaceDialogOpen, setReplaceDialogOpen] = useState(false);
  const [replaceTargetPos, setReplaceTargetPos] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        horizontalRule: false,
      }),
      HorizontalRule,
      Placeholder.configure({ placeholder: 'Viết nội dung bài viết...' }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'text-brand-600 underline' },
      }),
      Image.configure({
        inline: false,
        HTMLAttributes: { class: 'rounded-lg' },
      }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      CodeBlockLowlight.configure({ lowlight }),
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none min-h-[150px] sm:min-h-[200px] px-4 py-3 text-sm outline-none dark:prose-invert',
      },
    },
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, { emitUpdate: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  useEffect(() => () => { editor?.destroy(); }, [editor]);

  // --- Image upload helpers ---

  const insertImageAtCursor = useCallback((src: string, alt: string) => {
    if (!editor) return;
    editor.chain().focus().setImage({ src, alt }).run();
  }, [editor]);

  const insertImageAfterPos = useCallback((pos: number, src: string, alt: string) => {
    if (!editor) return;
    editor
      .chain()
      .focus()
      .insertContentAt(pos, { type: 'image', attrs: { src, alt } })
      .run();
  }, [editor]);

  const handleFiles = useCallback(async (files: FileList | File[], insertPos?: number) => {
    if (!editor) return;
    const fileArray = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (fileArray.length === 0) return;

    let basePos: number = insertPos ?? editor.state.selection.from;

    for (const file of fileArray) {
      const taskId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      setUploadTasks((prev) => [...prev, {
        id: taskId, fileName: file.name, progress: 0, status: 'uploading',
      }]);

      try {
        const url = await uploadToCloudinaryWithProgress(file, (percent) => {
          setUploadTasks((prev) => prev.map((t) => t.id === taskId ? { ...t, progress: percent } : t));
        });

        setUploadTasks((prev) => prev.map((t) => t.id === taskId ? { ...t, status: 'done', progress: 100 } : t));

        insertImageAfterPos(basePos, url, '');
        basePos = basePos + 1;
      } catch {
        setUploadTasks((prev) => prev.map((t) => t.id === taskId ? { ...t, status: 'error' } : t));
        toast.error(`Lỗi tải ảnh: ${file.name}`);
      }
    }

    setTimeout(() => {
      setUploadTasks((prev) => prev.filter((t) => t.status === 'uploading'));
    }, 2000);
  }, [editor, insertImageAfterPos]);

  // --- Drag & Drop on editor area ---

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.types.includes('Files')) {
      setIsDragging(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current <= 0) {
      dragCounter.current = 0;
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current = 0;
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      if (editor) {
        const coords = { left: e.clientX, top: e.clientY };
        try {
          const pos = editor.view.posAtCoords(coords)?.pos ?? null;
          handleFiles(e.dataTransfer.files, pos ?? undefined);
          return;
        } catch {
          // fall through to cursor position
        }
      }
      handleFiles(e.dataTransfer.files);
    }
  }, [editor, handleFiles]);

  // --- Paste images ---

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    const imageItems: DataTransferItem[] = [];
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith('image/')) {
        imageItems.push(items[i]);
      }
    }
    if (imageItems.length > 0) {
      e.preventDefault();
      const files = imageItems
        .map((item) => item.getAsFile())
        .filter((f): f is File => f !== null);
      if (files.length > 0) {
        handleFiles(files);
      }
    }
  }, [handleFiles]);

  // --- Image node actions (caption, replace, delete) ---

  const getSelectedImageInfo = useCallback((): ImageNodeInfo | null => {
    if (!editor) return null;
    const { state } = editor;
    const { selection } = state;
    const node = 'node' in selection ? (selection as { node: { type: { name: string }; attrs: { src: string; alt?: string } } }).node : null;
    if (node && node.type.name === 'image') {
      return {
        src: node.attrs.src,
        alt: node.attrs.alt || '',
        pos: selection.from,
      };
    }
    const $pos = selection.$from;
    const parent = $pos.parent;
    for (let i = 0; i < parent.childCount; i++) {
      const child = parent.child(i);
      if (child.type.name === 'image') {
        const childPos = $pos.start() + i;
        return {
          src: child.attrs.src,
          alt: child.attrs.alt || '',
          pos: childPos,
        };
      }
    }
    return null;
  }, [editor]);

  const openCaptionDialog = useCallback(() => {
    const info = getSelectedImageInfo();
    if (!info) {
      toast.error('Vui lòng chọn một ảnh trước');
      return;
    }
    setCaptionText(info.alt);
    setCaptionTargetPos(info.pos);
    setCaptionDialogOpen(true);
  }, [getSelectedImageInfo]);

  const confirmCaption = useCallback(() => {
    if (!editor || captionTargetPos === null) return;
    editor
      .chain()
      .focus()
      .setNodeSelection(captionTargetPos)
      .updateAttributes('image', { alt: captionText.trim() })
      .run();
    setCaptionDialogOpen(false);
    setCaptionText('');
    setCaptionTargetPos(null);
  }, [editor, captionTargetPos, captionText]);

  const openReplaceDialog = useCallback(() => {
    const info = getSelectedImageInfo();
    if (!info) {
      toast.error('Vui lòng chọn một ảnh trước');
      return;
    }
    setReplaceTargetPos(info.pos);
    setReplaceDialogOpen(true);
  }, [getSelectedImageInfo]);

  const handleReplaceFile = useCallback(async (files: FileList) => {
    if (!editor || replaceTargetPos === null) return;
    const fileArray = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (fileArray.length === 0) return;

    const file = fileArray[0];
    const taskId = `replace-${Date.now()}`;
    setUploadTasks((prev) => [...prev, {
      id: taskId, fileName: file.name, progress: 0, status: 'uploading',
    }]);

    try {
      const url = await uploadToCloudinaryWithProgress(file, (percent) => {
        setUploadTasks((prev) => prev.map((t) => t.id === taskId ? { ...t, progress: percent } : t));
      });
      setUploadTasks((prev) => prev.map((t) => t.id === taskId ? { ...t, status: 'done', progress: 100 } : t));

      editor
        .chain()
        .focus()
        .setNodeSelection(replaceTargetPos)
        .updateAttributes('image', { src: url })
        .run();
      setReplaceDialogOpen(false);
      setReplaceTargetPos(null);
    } catch {
      setUploadTasks((prev) => prev.map((t) => t.id === taskId ? { ...t, status: 'error' } : t));
      toast.error(`Lỗi tải ảnh: ${file.name}`);
    }

    setTimeout(() => {
      setUploadTasks((prev) => prev.filter((t) => t.status === 'uploading'));
    }, 2000);
  }, [editor, replaceTargetPos]);

  const deleteImage = useCallback(() => {
    if (!editor) return;
    const info = getSelectedImageInfo();
    if (!info) {
      toast.error('Vui lòng chọn một ảnh trước');
      return;
    }
    editor
      .chain()
      .focus()
      .setNodeSelection(info.pos)
      .deleteSelection()
      .run();
  }, [editor, getSelectedImageInfo]);

  // --- Existing toolbar actions ---

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href || '';
    setLinkUrl(previousUrl);
    setLinkDialogOpen(true);
  }, [editor]);

  const confirmLink = useCallback(() => {
    if (!editor) return;
    const url = linkUrl.trim();
    if (!url) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
    setLinkDialogOpen(false);
    setLinkUrl('');
  }, [editor, linkUrl]);

  const setImage = useCallback(() => {
    if (!editor) return;
    setImageDialogOpen(true);
  }, [editor]);

  const confirmImage = useCallback(() => {
    if (!editor) return;
    const url = imageUrl.trim();
    if (url) {
      insertImageAtCursor(url, imageAlt.trim());
    }
    setImageDialogOpen(false);
    setImageUrl('');
    setImageAlt('');
  }, [editor, imageUrl, imageAlt, insertImageAtCursor]);

  const insertTable = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  }, [editor]);

  const insertEmoji = useCallback((emoji: string) => {
    if (!editor) return;
    editor.chain().focus().insertContent(emoji).run();
  }, [editor]);

  if (!editor) return null;

  const isImageSelected = editor.isActive('image');

  return (
    <div className={cn(isDark && 'dark')}>
      <div className="sticky top-0 z-10 flex flex-wrap items-center gap-1 rounded-t-xl border border-b-0 border-border bg-brand-50/90 px-2 py-1.5 backdrop-blur-sm dark:border-zinc-700 dark:bg-zinc-800/90">
        {/* Headings */}
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

        {/* Bold, Italic, Strike, Inline Code */}
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

        {/* Lists */}
        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} title="Danh sách">
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} title="Danh sách số">
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleTaskList().run()} isActive={editor.isActive('taskList')} title="Danh sách kiểm tra">
          <ListChecks className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarDivider />

        {/* Quote, Divider, Code Block */}
        <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} title="Trích dẫn">
          <Quote className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Đường phân cách">
          <Minus className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} isActive={editor.isActive('codeBlock')} title="Khối mã (Syntax Highlight)">
          <Code2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarDivider />

        {/* Table, Link, Image */}
        <ToolbarButton onClick={insertTable} title="Bảng">
          <TableIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={setLink} isActive={editor.isActive('link')} title="Liên kết">
          <LinkIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={setImage} title="Chèn ảnh (URL)">
          <ImageIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => fileInputRef.current?.click()} title="Tải ảnh lên">
          <Upload className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarDivider />

        {/* Image actions (visible when image is selected) */}
        {isImageSelected && (
          <>
            <ToolbarButton onClick={openCaptionDialog} title="Chú thích ảnh">
              <Pencil className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton onClick={openReplaceDialog} title="Thay thế ảnh">
              <Upload className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton onClick={deleteImage} title="Xoá ảnh">
              <Trash2 className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarDivider />
          </>
        )}

        {/* Emoji */}
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              title="Emoji"
              aria-label="Emoji"
              className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-brand-100 hover:text-brand-700 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-100"
            >
              <Smile className="h-4 w-4" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-3" align="start">
            <div className="mb-2 flex flex-wrap gap-1">
              {Object.keys(EMOJI_CATEGORIES).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setEmojiCategory(cat)}
                  className={cn(
                    'rounded-md px-2 py-1 text-xs font-medium transition-colors',
                    emojiCategory === cat
                      ? 'bg-brand-600 text-white'
                      : 'bg-muted text-muted-foreground hover:bg-brand-100',
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="grid max-h-48 grid-cols-8 gap-1 overflow-y-auto">
              {EMOJI_CATEGORIES[emojiCategory]?.map((emoji, idx) => (
                <button
                  key={`${emoji}-${idx}`}
                  type="button"
                  onClick={() => insertEmoji(emoji)}
                  className="flex h-8 w-8 items-center justify-center rounded-md text-lg transition-colors hover:bg-brand-100"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        <ToolbarDivider />

        {/* Undo, Redo */}
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Hoàn tác">
          <Undo2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Làm lại">
          <Redo2 className="h-4 w-4" />
        </ToolbarButton>
      </div>

      {/* Table controls */}
      {editor.isActive('table') && (
        <div className="flex flex-wrap gap-1 border-x border-border bg-brand-50/50 px-2 py-1 dark:border-zinc-700 dark:bg-zinc-800/50">
          <button type="button" onClick={() => editor.chain().focus().addColumnAfter().run()} className="rounded px-2 py-1 text-xs text-muted-foreground hover:bg-brand-100">+ Cột</button>
          <button type="button" onClick={() => editor.chain().focus().deleteColumn().run()} className="rounded px-2 py-1 text-xs text-muted-foreground hover:bg-brand-100">- Cột</button>
          <button type="button" onClick={() => editor.chain().focus().addRowAfter().run()} className="rounded px-2 py-1 text-xs text-muted-foreground hover:bg-brand-100">+ Hàng</button>
          <button type="button" onClick={() => editor.chain().focus().deleteRow().run()} className="rounded px-2 py-1 text-xs text-muted-foreground hover:bg-brand-100">- Hàng</button>
          <button type="button" onClick={() => editor.chain().focus().deleteTable().run()} className="rounded px-2 py-1 text-xs text-destructive hover:bg-red-50">Xoá bảng</button>
        </div>
      )}

      {/* Upload progress bar */}
      {uploadTasks.length > 0 && (
        <div className="border-x border-border bg-brand-50/30 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800/30">
          {uploadTasks.map((task) => (
            <div key={task.id} className="mb-1.5 last:mb-0">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5 truncate">
                  {task.status === 'uploading' && <Loader2 className="h-3 w-3 animate-spin" />}
                  {task.status === 'done' && <span className="text-green-600">✓</span>}
                  {task.status === 'error' && <X className="h-3 w-3 text-red-500" />}
                  <span className="truncate">{task.fileName}</span>
                </span>
                <span className="ml-2 shrink-0">{task.progress}%</span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className={cn(
                    'h-full rounded-full transition-all duration-300',
                    task.status === 'error' ? 'bg-red-500' : task.status === 'done' ? 'bg-green-500' : 'bg-brand-500',
                  )}
                  style={{ width: `${task.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <div
        className={cn(
          'relative rounded-b-xl border border-border bg-white focus-within:ring-2 focus-within:ring-brand-500/20 dark:border-zinc-700 dark:bg-zinc-900',
          isDragging && 'ring-2 ring-brand-500 ring-offset-2',
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onPaste={handlePaste}
      >
        <EditorContent editor={editor} />
        {isDragging && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-b-xl bg-brand-50/80 dark:bg-zinc-800/80">
            <div className="flex flex-col items-center gap-2 text-brand-600 dark:text-brand-400">
              <Upload className="h-8 w-8" />
              <p className="text-sm font-medium">Thả ảnh vào đây</p>
            </div>
          </div>
        )}
      </div>

      {/* Hidden file input for upload button */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleFiles(e.target.files);
            e.target.value = '';
          }
        }}
      />

      {/* Link Dialog */}
      <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Chèn liên kết</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>URL</Label>
              <Input
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); confirmLink(); } }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLinkDialogOpen(false)}>Huỷ</Button>
            <Button onClick={confirmLink}>Chèn</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image URL Dialog */}
      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Chèn ảnh</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>URL ảnh</Label>
              <Input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); confirmImage(); } }}
              />
            </div>
            <div>
              <Label>Mô tả (Alt text)</Label>
              <Input
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
                placeholder="Mô tả ảnh"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setImageDialogOpen(false)}>Huỷ</Button>
            <Button onClick={confirmImage}>Chèn</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Caption Dialog */}
      <Dialog open={captionDialogOpen} onOpenChange={setCaptionDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Chú thích ảnh</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Chú thích (Alt text)</Label>
              <Input
                value={captionText}
                onChange={(e) => setCaptionText(e.target.value)}
                placeholder="Mô tả ảnh..."
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); confirmCaption(); } }}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCaptionDialogOpen(false)}>Huỷ</Button>
            <Button onClick={confirmCaption}>Lưu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Replace Dialog */}
      <Dialog open={replaceDialogOpen} onOpenChange={setReplaceDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Thay thế ảnh</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Chọn ảnh mới để thay thế ảnh hiện tại.</p>
            <div
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = () => {
                  if (input.files && input.files.length > 0) {
                    handleReplaceFile(input.files);
                  }
                };
                input.click();
              }}
              className="flex h-28 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border transition-all hover:border-brand-400"
            >
              <Upload className="h-6 w-6 text-muted-foreground" />
              <p className="mt-1 text-xs text-muted-foreground">Chọn ảnh mới</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReplaceDialogOpen(false)}>Huỷ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
