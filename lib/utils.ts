export function getFirstImage(imageStr: string | null | undefined): string {
  if (!imageStr || typeof imageStr !== 'string') return PLACEHOLDER_IMAGE;
  
  // Giải pháp: Tách chuỗi theo dấu phẩy có chữ "http" liền sau để không làm gãy link Cloudinary
  const urls = imageStr
    .split(/,\s*(?=http)/)
    .map((url) => url.trim())
    .filter(Boolean);
    
  return urls[0] || PLACEHOLDER_IMAGE;
}

export function parseImageList(imageStr: string | null | undefined): string[] {
  if (!imageStr || typeof imageStr !== 'string') return [];
  
  // Tương tự cho hàm lấy danh sách ảnh
  return imageStr
    .split(/,\s*(?=http)/)
    .map((url) => url.trim())
    .filter(Boolean);
}
