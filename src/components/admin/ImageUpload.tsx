'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { uploadToCloudinary } from '@/src/lib/cloudinary';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export function ImageUpload({ value, onChange, label = 'Hình ảnh' }: ImageUploadProps) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) { toast.error('Vui lòng chọn file hình ảnh'); return; }
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      onChange(url);
      toast.success('Tải ảnh lên Cloudinary thành công!');
    } catch (err) {
      toast.error(`Lỗi tải ảnh: ${String(err)}`);
    } finally {
      setUploading(false);
    }
  }, [onChange]);

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-foreground">{label}</label>
      {value ? (
        <div className="relative group">
          <div className="relative h-40 overflow-hidden rounded-xl border border-border bg-brand-50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="Preview" className="h-full w-full object-cover" />
          </div>
          <button type="button" onClick={() => onChange('')}
            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-destructive shadow-soft hover:bg-white">
            <X className="h-4 w-4" />
          </button>
          <input type="text" value={value} onChange={(e) => onChange(e.target.value)}
            className="mt-1.5 h-9 w-full rounded-lg border border-border bg-white px-3 text-xs outline-none focus:border-brand-500" />
        </div>
      ) : (
        <div
          onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
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
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
        </div>
      )}
    </div>
  );
}
