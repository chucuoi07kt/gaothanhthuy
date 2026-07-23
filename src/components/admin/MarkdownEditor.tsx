'use client';

import { useCallback, useEffect, useState } from 'react';
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
      editor.chain().focus().setImage({ src: url, alt: imageAlt.trim() || undefined }).run();
    }
    setImageDialogOpen(false);
    setImageUrl('');
    setImageAlt('');
  }, [editor, imageUrl, imageAlt]);

  const insertTable = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  }, [editor]);

  const insertEmoji = useCallback((emoji: string) => {
    if (!editor) return;
    editor.chain().focus().insertContent(emoji).run();
  }, [editor]);

  if (!editor) return null;

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
        <ToolbarButton onClick={setImage} title="Ảnh">
          <ImageIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarDivider />

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

      <div className="rounded-b-xl border border-border bg-white focus-within:ring-2 focus-within:ring-brand-500/20 dark:border-zinc-700 dark:bg-zinc-900">
        <EditorContent editor={editor} />
      </div>

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

      {/* Image Dialog */}
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
    </div>
  );
}
