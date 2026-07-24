'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { cn } from '@/lib/utils';
import { quickZaloConsult } from '@/src/lib/zalo';
import type { HomepageItem } from '@/src/lib/homepage.service';
import { DEFAULT_HERO_BANNERS } from '@/src/lib/homepage-defaults';

type Banner = {
  id: string;
  image: string;
  title: string;
  description: string;
  cta: string;
  href: string;
  external?: boolean;
};

const FALLBACK_BANNERS: Banner[] = DEFAULT_HERO_BANNERS.map((b) => {
  const isExternal = b.link.startsWith('http');
  return {
    id: b.id,
    image: b.image,
    title: b.title,
    description: b.description,
    cta: isExternal ? 'Nhận báo giá' : b.link ? 'Xem sản phẩm' : 'Liên hệ',
    href: b.link,
    external: isExternal,
  };
});

function mapHeroItemsToBanners(items: HomepageItem[]): Banner[] {
  return items.map((item) => {
    const isExternal = item.link.startsWith('http');
    const cta = isExternal ? 'Xem ngay' : item.link ? 'Xem thêm' : 'Liên hệ';
    return {
      id: item.id,
      image: item.image,
      title: item.title,
      description: item.description,
      cta,
      href: item.link || '',
      external: isExternal,
    };
  });
}

const AUTOPLAY_DELAY = 5000;

export function PromoSlider() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, dragFree: false },
    [Autoplay({ delay: AUTOPLAY_DELAY, stopOnInteraction: false })]
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [banners, setBanners] = useState<Banner[]>(FALLBACK_BANNERS);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/homepage?t=${Date.now()}`, { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        const allItems: HomepageItem[] = data.items || [];
        const heroItems = allItems
          .filter((it) => it.section === 'hero' && it.enabled)
          .sort((a, b) => a.order - b.order);
        if (heroItems.length > 0) {
          setBanners(mapHeroItemsToBanners(heroItems));
        } else {
          setBanners(FALLBACK_BANNERS);
        }
      } catch {
        // FALLBACK_BANNERS already set as initial state
      }
    })();
  }, []);

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
        <div className="flex touch-pan-y [will-change:transform]">
          {banners.map((banner, idx) => (
            <div key={banner.id} className="relative min-w-0 flex-[0_0_100%]">
              <div className="relative aspect-[16/9] w-full sm:aspect-[21/9] lg:aspect-[24/8]">
                <Image
                  src={banner.image}
                  alt={banner.title}
                  fill
                  priority={idx === 0}
                  loading={idx === 0 ? 'eager' : 'lazy'}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1280px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />
              </div>

              <div className="absolute inset-0 flex items-center">
                <div className="px-6 sm:px-10 lg:px-14">
                  <div className="max-w-md">
                    <h2 className="text-xl font-bold leading-tight text-white drop-shadow-lg sm:text-3xl lg:text-4xl">
                      {banner.title}
                    </h2>
                    <p className="mt-2 max-w-sm text-xs text-white/90 drop-shadow sm:mt-3 sm:text-sm lg:text-base">
                      {banner.description}
                    </p>
                    {banner.external ? (
                      <button
                        onClick={() => handleCta(banner)}
                        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gold-500 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-gold-500/30 ring-1 ring-gold-400/40 transition-all hover:scale-105 hover:bg-gold-600 hover:shadow-xl hover:shadow-gold-500/40 sm:mt-5 sm:px-6 sm:py-3 sm:text-sm lg:px-7 lg:py-3.5 lg:text-base"
                      >
                        {banner.cta}
                        <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </button>
                    ) : (
                      <Link
                        href={banner.href}
                        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gold-500 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-gold-500/30 ring-1 ring-gold-400/40 transition-all hover:scale-105 hover:bg-gold-600 hover:shadow-xl hover:shadow-gold-500/40 sm:mt-5 sm:px-6 sm:py-3 sm:text-sm lg:px-7 lg:py-3.5 lg:text-base"
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
        className="absolute left-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/25 text-white backdrop-blur-md transition-all hover:bg-white/40 md:flex"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        onClick={scrollNext}
        aria-label="Banner sau"
        className="absolute right-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/25 text-white backdrop-blur-md transition-all hover:bg-white/40 md:flex"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
        {banners.map((banner, idx) => (
          <button
            key={banner.id}
            onClick={() => emblaApi?.scrollTo(idx)}
            aria-label={`Đến banner ${idx + 1}`}
            className={cn(
              'h-1.5 rounded-full transition-all duration-300',
              idx === selectedIndex
                ? 'w-5 bg-white'
                : 'w-1.5 bg-white/40 hover:bg-white/60'
            )}
          />
        ))}
      </div>
    </div>
  );
}
