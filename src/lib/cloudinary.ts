const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'zvgdprbd';
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'gaothanhthuy';
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

export async function uploadToCloudinary(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);

  const res = await fetch(UPLOAD_URL, { method: 'POST', body: formData });
  if (!res.ok) throw new Error(`Cloudinary upload failed: ${await res.text()}`);
  const data = await res.json();
  return optimizeWebP(data.secure_url);
}

export function optimizeWebP(url: string): string {
  if (!url || !url.includes('res.cloudinary.com')) return url;
  return url.replace('/upload/', '/upload/f_webp,q_auto/');
}

export const PLACEHOLDER_IMAGE = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_webp,q_auto,w_600,h_400,c_fill,bo_2px_solid_rgb:16a34a,l_text:Arial_30_bold:G%E1%BA%A1o%20Thanh%20Thu%E1%BB%A7/placeholder_gao`;
