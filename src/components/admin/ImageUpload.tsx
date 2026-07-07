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

// Hàm dọn rác triệt để: Loại bỏ mọi chuỗi trống, khoảng trắng
function parseImages(value: string): string[] {
  if (!value) return [];
  
  let cleanValue = value.replace(/[\[\]"']/g, '');
  
  return cleanValue
    .split(',')
    .map(s => s.trim())
    .filter(s => s.length > 5);
}

export function ImageUpload({ value, onChange, label = 'Hình ảnh', multiple = false }: ImageUploadProps) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const images = multiple ? parseImages(value) : [];
  const singleImage = !multiple ? (value || '').trim() : '';

  const handleFiles = useCallback(async (files: FileList) => {
    const fileArray = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (fileArray.length === 0) return;

    setUploading(true);
    try {
      const uploadedUrls: string[] = [];
      for (const file of fileArray) {
        const url = await uploadToCloudinary(file);
        if (url) uploadedUrls.push(url);
      }

      if (multiple) {
        const currentImages = parseImages(value);
        // LỌC TRÙNG BẰNG CÁCH THỦ CÔNG (Không dùng Set để tránh lỗi Build của Vercel)
        const combined = [...currentImages, ...uploadedUrls];
        const merged = combined.filter((item, index) => combined.indexOf(item) === index && item.length > 5);
        onChange(merged.join(','));
      } else {
        onChange(uploadedUrls[0] || '');
      }
      toast.success(`Đã tải lên ${uploadedUrls.length} ảnh thành công!`);
    } catch (err) {
      toast.error('Lỗi tải ảnh');
    } finally {
      setUploading(false);
    }
  }, [onChange, value, multiple]);

  const removeImage = useCallback((index: number) => {
    const current = parseImages(value);
    current.splice(index, 1);
    onChange(current.join(','));
  }, [onChange, value]);

  if (multiple) {
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">{label}</label>
        
        {images.length > 0 && (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {images.map((img, idx) => (
              <div key={idx} className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-gray-100">
                <img src={img} alt={`Ảnh ${idx}`} className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); removeImage(idx); }}
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-red-600 shadow-sm hover:bg-white z-10"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
          className={cn(
            "flex h-28 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all",
            dragging ? "border-brand-500 bg-brand-50" : "border-border hover:border-brand-400"
          )}
        >
          {uploading ? (
            <p className="text-xs text-muted-foreground animate-pulse">Đang tải lên...</p>
          ) : (
            <>
              <Plus className="h-6 w-6 text-muted-foreground" />
              <p className="text-xs text-muted-foreground mt-1">Chọn hoặc kéo thả ảnh</p>
            </>
          )}
          <input ref={inputRef} type="file" multiple accept="image/*" className="hidden" 
                 onChange={(e) => e.target.files && handleFiles(e.target.files)} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      {singleImage ? (
        <div className="relative h-40 rounded-xl overflow-hidden border border-border">
          <img src={singleImage} className="h-full w-full object-cover" alt="Preview" />
          <button type="button" onClick={() => onChange('')} className="absolute top-2 right-2 p-1 bg-white rounded-full text-red-600 shadow-md">
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div onClick={() => inputRef.current?.click()} className="flex h-40 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-border">
          <Upload className="h-6 w-6 text-muted-foreground" />
          <input ref={inputRef} type="file" accept="image/*" className="hidden" 
                 onChange={(e) => e.target.files && handleFiles(e.target.files)} />
        </div>
      )}
    </div>
  );
}
