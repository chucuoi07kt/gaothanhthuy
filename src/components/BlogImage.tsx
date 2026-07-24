'use client';

import Image from 'next/image';
import { useState } from 'react';
import { cn, getFirstImage } from '@/lib/utils';
import { BRAND } from '@/src/lib/brand';

interface BlogImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
  className?: string;
  rounded?: string;
}

const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f0f5f0"/>
      <stop offset="50%" stop-color="#e6f0e6"/>
      <stop offset="100%" stop-color="#f0f5f0"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g)"/>
</svg>`;

const toBase64 = (str: string) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : btoa(str);

export function BlogImage({
  src,
  alt,
  width = 1200,
  height = 675,
  priority = false,
  sizes,
  className,
  rounded = 'rounded-xl',
}: BlogImageProps) {
  const [error, setError] = useState(false);
  const safeSrc = getFirstImage(src);
  const blurDataUrl = `data:image/svg+xml;base64,${toBase64(shimmer(width, height))}`;

  if (error || !safeSrc) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-gradient-to-br from-brand-50 to-gold-50',
          rounded,
          className
        )}
        style={{ aspectRatio: `${width} / ${height}` }}
      >
        <div className="text-center px-4">
          <div className="text-2xl font-bold text-brand-700">
            {BRAND.shortName}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            {BRAND.name}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Image
      src={safeSrc}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      loading={priority ? 'eager' : 'lazy'}
      placeholder="blur"
      blurDataURL={blurDataUrl}
      sizes={sizes}
      onError={() => setError(true)}
      className={cn('object-cover', rounded, className)}
    />
  );
}
