'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { cn } from '@/lib/utils';
import { quickZaloConsult } from '@/src/lib/zalo';

type Banner = {
  id: string;
  image: string;
  title: string;
  description: string;
  cta: string;
  href: string;
  external?: boolean;
};

const banners: Banner[] = [
  {
    id: 'family',
    image:
      'https://images.pexels.com/photos/723198/pexels-photo-723198.jpeg?auto=compress&cs=tinysrgb&w=1600',
    title: 'Gạo ngon cho mọi gia đình',
    description: 'Gạo chính hãng dẻo thơm, sạch an toàn cho bữa cơm gia đình.',
    cta: 'Xem sản phẩm',
    href: '/products',
  },
  {
    id: 'restaurant',
    image:
      'https://images.pexels.com/photos/3026808/pexels-photo-3026808.jpeg?auto=compress&cs=tinysrgb&w=1600',
    title: 'Giá sỉ cho quán ăn – nhà hàng',
    description: 'Chiết khấu hấp dẫn khi nhập sỉ cho quán cơm, nhà hàng tại Đà Nẵng.',
    cta: 'Nhận báo giá',
    href: '',
    external: true,
  },
  {
    id: 'delivery',
    image:
      'https://images.pexels.com/photos/4226796/pexels-photo-4226796.jpeg?auto=compress&cs=tinysrgb&w=1600',
    title: 'Giao nhanh toàn Đà Nẵng',
    description: 'Giao hỏa tốc nội thành 1-2 giờ, không lo gián đoạn nguồn cung.',
    cta: 'Đặt ngay',
    href: '/products',
  },
  {
    id: 'agency',
    image:
      'https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg?auto=compress&cs=tinysrgb&w=1600',
    title: 'Chiết khấu cao cho đại lý',
    description: 'Hợp tác phân phối dài hạn với mức chiết khấu ưu đãi nhất.',
    cta: 'Liên hệ',
    href: '',
    external: true,
  },
];

const AUTOPLAY_DELAY = 5000;

export function PromoSlider() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: AUTOPLAY_DELAY, stopOnInteraction: false }),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (!emblaApi) return;
    const autoplay = emblaApi.plugins().autoplay;
    if (isPaused) {
      autoplay.stop();
    } else {
      autoplay.play();
    }
  }, [emblaApi, isPaused]);

  const handleCta = (banner: Banner) => {
    if (banner.external) {
      quickZaloConsult();
    }
  };

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-border bg-white shadow-soft"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex touch-pan-y">
          {banners.map((banner) => (
            <div key={banner.id} className="relative min-w-0 flex-[0_0_100%]">
              <div className="relative aspect-[16/9] w-full sm:aspect-[21/9] lg:aspect-[24/8]">
                <Image
                  src={banner.image}
                  alt={banner.title}
                  fill
                  priority={banner.id === 'family'}
                  loading={banner.id === 'family' ? 'eager' : 'lazy'}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1280px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-black/10" />
              </div>

              <div className="absolute inset-0 flex items-center">
                <div className="px-6 sm:px-10 lg:px-14">
                  <div className="max-w-md">
                    <h2 className="text-xl font-bold leading-tight text-white text-shadow-soft sm:text-3xl lg:text-4xl">
                      {banner.title}
                    </h2>
                    <p className="mt-2 max-w-sm text-xs text-white/90 sm:mt-3 sm:text-sm lg:text-base">
                      {banner.description}
                    </p>
                    {banner.external ? (
                      <button
                        onClick={() => handleCta(banner)}
                        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gold-500 px-4 py-2.5 text-xs font-semibold text-white shadow-lg transition-all hover:bg-gold-600 sm:mt-5 sm:px-5 sm:py-3 sm:text-sm lg:px-6 lg:py-3.5 lg:text-base"
                      >
                        {banner.cta}
                        <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </button>
                    ) : (
                      <Link
                        href={banner.href}
                        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gold-500 px-4 py-2.5 text-xs font-semibold text-white shadow-lg transition-all hover:bg-gold-600 sm:mt-5 sm:px-5 sm:py-3 sm:text-sm lg:px-6 lg:py-3.5 lg:text-base"
                      >
                        {banner.cta}
                        <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={scrollPrev}
        aria-label="Banner trước"
        className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/30 text-white backdrop-blur-sm transition-all hover:bg-white/50 sm:h-11 sm:w-11"
      >
        <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
      </button>
      <button
        onClick={scrollNext}
        aria-label="Banner sau"
        className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/30 text-white backdrop-blur-sm transition-all hover:bg-white/50 sm:h-11 sm:w-11"
      >
        <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
      </button>

      <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {banners.map((banner, idx) => (
          <button
            key={banner.id}
            onClick={() => emblaApi?.scrollTo(idx)}
            aria-label={`Đến banner ${idx + 1}`}
            className={cn(
              'h-2 rounded-full transition-all',
              idx === selectedIndex
                ? 'w-5 bg-white'
                : 'w-2 bg-white/50 hover:bg-white/70'
            )}
          />
        ))}
      </div>
    </div>
  );
}
