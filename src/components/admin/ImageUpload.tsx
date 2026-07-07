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

// HÀM LỌC RÁC SIÊU CẤP: Dùng để làm sạch dữ liệu từ Google Sheets đổ về
function parseImages(value: string): string[] {
  if (!value) return [];
  // 1. Loại bỏ các ký tự rác JSON thô [ ] " '
  const cleanValue = value.replace(/[\[\]"']/g, '');
  
  // 2. Cắt theo dấu phẩy, dọn dẹp khoảng trắng, và filter bỏ mọi phần tử rỗng
  return cleanValue
    .split(',')
    .map(s => s.trim())
    .filter(s => s.length > 5); // Chỉ lấy chuỗi dài hơn 5 ký tự (loại bỏ chuỗi rỗng)
}

export function ImageUpload({ value, onChange, label = 'Hình ảnh', multiple = false }: ImageUploadProps) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const images = parseImages(value);

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
        // Gộp ảnh cũ + ảnh mới, lọc trùng và dọn rác
        const current = parseImages(value);
        const merged = [...new Set([...current, ...uploadedUrls])].filter(s => s.length > 5);
        onChange(merged.join(','));
      } else {
        onChange(uploadedUrls[0] || '');
      }
      toast.success('Đã tải ảnh lên!');
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

  // UI CHUNG: hiển thị ảnh đã được làm sạch
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">{label}</label>

      {/* Grid hiển thị ảnh - Đã lọc sạch rác nên chỉ hiện ảnh thật */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {images.map((img, idx) => (
            <div key={`${img}-${idx}`} className="relative aspect-square overflow-hidden rounded-lg border border-border bg-gray-100">
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

      {/* Nút Upload - Dùng chung cho đơn & đa ảnh */}
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
          <p className="text-xs text-muted-foreground animate-pulse">Đang xử lý...</p>
        ) : (
          <>
            <Plus className="h-6 w-6 text-muted-foreground" />
            <p className="text-xs text-muted-foreground mt-1">
              {multiple ? 'Thêm ảnh' : 'Chọn ảnh'}
            </p>
          </>
        )}
        <input ref={inputRef} type="file" multiple={multiple} accept="image/*" className="hidden" 
               onChange={(e) => e.target.files && handleFiles(e.target.files)} />
      </div>
    </div>
  );
}
