import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const FALLBACK_IMAGE = 'https://images.pexels.com/photos/723198/pexels-photo-723198.jpeg?auto=compress&cs=tinysrgb&w=900';

export function getFirstImage(imageStr: string | undefined | null, fallback: string = FALLBACK_IMAGE): string {
  if (!imageStr || typeof imageStr !== 'string') return fallback;
  const urls = imageStr.split(',').map((url) => url.trim()).filter(Boolean);
  return urls[0] || fallback;
}

export function parseImageList(imageStr: string | undefined | null): string[] {
  if (!imageStr || typeof imageStr !== 'string') return [];
  return imageStr.split(',').map((url) => url.trim()).filter(Boolean);
}
