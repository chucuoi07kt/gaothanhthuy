'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, X, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { uploadToCloudinary } from '@/src/lib/cloudinary';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  multiple?: boolean;
}

function parseImages(value: string): string[] {
  if (!value) return [];
  const seen = new Set<string>();
  const result: string[] = [];
  for (const s of value.split(',')) {
    const trimmed = s.trim();
    if (trimmed && !seen.has(trimmed)) {
      seen.add(trimmed);
      result.push(trimmed);
    }
  }
  return result;
}

function joinImages(images: string[]): string {
  return images.join(',');
}

export function ImageUpload({ value, onChange, label = 'Hình ảnh', multiple = false }: ImageUploadProps) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const images = multiple ? parseImages(value) : [];
  const singleImage = !multiple ? (value || '').trim() : '';

  const handleFiles = useCallback(async (files: FileList) => {
    const fileArray = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (fileArray.length === 0) {
      toast.error('Vui lòng chọn file hình ảnh');
      return;
    }
    setUploading(true);
    try {
      const uploadedUrls: string[] = [];
      for (const file of fileArray) {
        const url = await uploadToCloudinary(file);
        if (url) uploadedUrls.push(url);
      }

      if (multiple) {
        const current = parseImages(value);
        const merged: string[] = [];
        const seen = new Set<string>();
        for (const url of [...current, ...uploadedUrls]) {
          if (url && !seen.has(url)) { seen.add(url); merged.push(url); }
        }
        onChange(joinImages(merged));
      } else {
        onChange(uploadedUrls[0] || '');
      }
      toast.success(`Đã tải ${uploadedUrls.length} ảnh lên Cloudinary!`);
    } catch (err) {
      toast.error(`Lỗi tải ảnh: ${String(err)}`);
    } finally {
      setUploading(false);
    }
  }, [onChange, value, multiple]);

  const removeImage = useCallback((index: number) => {
    const current = parseImages(value);
    current.splice(index, 1);
    onChange(joinImages(current));
  }, [onChange, value]);

  // --- Multi-image mode ---
  if (multiple) {
    return (
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">{label}</label>

        {images.length > 0 && (
          <div className="mb-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {images.map((img, idx) => (
              <div key={`${img}-${idx}`} className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-brand-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt={`Ảnh ${idx + 1}`} className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-destructive shadow-soft transition-colors hover:bg-white"
                  aria-label="Xoá ảnh"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div
          onDrop={(e) => { e.preventDefault(); setDragging(false); const files = e.dataTransfer.files; if (files.length > 0) handleFiles(files); }}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={(e) => { e.preventDefault(); setDragging(false); }}
          onClick={() => inputRef.current?.click()}
          className={cn(
            'flex h-28 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed transition-colors',
            dragging ? 'border-brand-500 bg-brand-50' : 'border-border bg-brand-50/30 hover:border-brand-400 hover:bg-brand-50/50'
          )}
        >
          {uploading ? (
            <>
              <div className="h-7 w-7 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
              <p className="text-xs text-muted-foreground">Đang tải lên...</p>
            </>
          ) : (
            <>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-brand-600">
                <Plus className="h-5 w-5" />
              </div>
              <p className="text-sm font-medium text-foreground">Thêm ảnh (chọn nhiều)</p>
              <p className="text-xs text-muted-foreground">Kéo thả hoặc click · WebP tự động</p>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => { const files = e.target.files; if (files && files.length > 0) handleFiles(files); e.currentTarget.value = ''; }}
          />
        </div>

        {images.length > 0 && (
          <p className="mt-1.5 text-xs text-muted-foreground">{images.length} ảnh đã tải lên</p>
        )}
      </div>
    );
  }

  // --- Single-image mode ---
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-foreground">{label}</label>
      {singleImage ? (
        <div className="relative group">
          <div className="relative h-40 overflow-hidden rounded-xl border border-border bg-brand-50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={singleImage} alt="Preview" className="h-full w-full object-cover" />
          </div>
          <button type="button" onClick={() => onChange('')}
            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-destructive shadow-soft hover:bg-white">
            <X className="h-4 w-4" />
          </button>
          <input type="text" value={singleImage} onChange={(e) => onChange(e.target.value)}
            className="mt-1.5 h-9 w-full rounded-lg border border-border bg-white px-3 text-xs outline-none focus:border-brand-500" />
        </div>
      ) : (
        <div
          onDrop={(e) => { e.preventDefault(); setDragging(false); if (e.dataTransfer.files.length > 0) handleFiles(e.dataTransfer.files); }}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={(e) => { e.preventDefault(); setDragging(false); }}
          onClick={() => inputRef.current?.click()}
          className={cn(
            'flex h-40 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed transition-colors',
            dragging ? 'border-brand-500 bg-brand-50' : 'border-border bg-brand-50/30 hover:border-brand-400 hover:bg-brand-50/50'
          )}
        >
          {uploading ? (
            <>
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
              <p className="text-sm text-muted-foreground">Đang tải lên Cloudinary...</p>
            </>
          ) : (
            <>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-brand-600">
                <Upload className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium text-foreground">Kéo thả ảnh vào đây</p>
              <p className="text-xs text-muted-foreground">hoặc click để chọn (WebP tự động)</p>
            </>
          )}
          <input ref={inputRef} type="file" accept="image/*" className="hidden"
            onChange={(e) => { const f = e.target.files; if (f && f.length > 0) handleFiles(f); e.currentTarget.value = ''; }} />
        </div>
      )}
    </div>
  );
}
