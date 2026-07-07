'use client';

import { useState } from 'react';
import { cn, getFirstImage } from '@/lib/utils';
import { BRAND } from '@/src/lib/brand';

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
  rounded?: string;
}

export function ProductImage({ src, alt, className, rounded = 'rounded-xl' }: ProductImageProps) {
  const [error, setError] = useState(false);
  const safeSrc = getFirstImage(src);

  if (error || !safeSrc) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-gradient-to-br from-brand-50 to-gold-50',
          rounded,
          className
        )}
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
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={safeSrc}
      alt={alt}
      loading="lazy"
      onError={() => setError(true)}
      className={cn('object-cover', rounded, className)}
    />
  );
}
