import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'zvgdprbd';
const PLACEHOLDER_IMAGE = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_webp,q_auto,w_600,h_400,c_fill,bo_2px_solid_rgb:16a34a,l_text:Arial_30_bold:G%E1%BA%A1o%20Thanh%20Thu%E1%BB%A7/placeholder_gao`;

export function getFirstImage(imageStr: string | null | undefined): string {
  if (!imageStr || typeof imageStr !== 'string') return PLACEHOLDER_IMAGE;
  const cleaned = imageStr.replace(/[\[\]"']/g, '').trim();
  const urls = cleaned
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length >= 5);
  return urls[0] || PLACEHOLDER_IMAGE;
}

export function parseImageList(imageStr: string | null | undefined): string[] {
  if (!imageStr || typeof imageStr !== 'string') return [];
  const cleaned = imageStr.replace(/[\[\]"']/g, '').trim();
  return cleaned
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length >= 5)
    .filter((item, index, arr) => arr.indexOf(item) === index);
}
