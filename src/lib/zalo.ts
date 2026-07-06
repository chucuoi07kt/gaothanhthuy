'use client';

import { toast } from 'sonner';
import { BRAND } from '@/src/lib/brand';
import { formatQuoteMessage } from '@/src/store/cartStore';
import type { CartItem } from '@/src/types';

export function isDesktop(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  const isMobile = /Android|iPhone|iPad|iPod|Mobile|Windows Phone/i.test(ua);
  return !isMobile;
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

export async function sendQuoteViaZalo(
  items: CartItem[],
  opts?: { onDesktopFallback?: () => void }
): Promise<void> {
  if (items.length === 0) {
    toast.error('Vui lòng thêm ít nhất một sản phẩm vào danh sách báo giá.');
    return;
  }

  const message = formatQuoteMessage(items);

  await copyToClipboard(message);

  toast.success('Đã sao chép danh sách! Đang chuyển hướng đến Zalo...');

  setTimeout(() => {
    window.open(BRAND.zaloUrl, '_blank', 'noopener,noreferrer');
  }, 800);

  if (isDesktop() && opts?.onDesktopFallback) {
    opts.onDesktopFallback();
  }
}

export async function quickZaloConsult(message?: string): Promise<void> {
  const text =
    message ?? 'Kính gửi Gạo Thanh Thuỷ, tôi muốn được tư vấn về sản phẩm gạo.';
  const copied = await copyToClipboard(text);
  if (copied) {
    toast.success('Đã sao chép nội dung! Đang chuyển đến Zalo...');
  } else {
    toast.info('Đang chuyển đến Zalo...');
  }
  window.open(BRAND.zaloUrl, '_blank', 'noopener,noreferrer');
}
