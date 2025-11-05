'use client';

import * as React from 'react';
import Image from 'next/image';
import SaveButton from '@/components/ui/SaveButton';

type Media = { url: string; alt?: string | null };

/** Lightweight hero carousel focused on fast LCP. */
export default function HeroCarousel({
  images,
  fallback,
  height = 520,
  fullBleed = false,
  showFavorite = true,
  venueId,
}: {
  images?: Media[] | null;
  fallback: Media;
  height?: number;
  fullBleed?: boolean;
  showFavorite?: boolean;
  venueId: string;
}) {
  const slides = images && images.length ? images : [fallback];
  const [i, setI] = React.useState(0);
  const len = slides.length;

  const prev = () => setI((n) => (n - 1 + len) % len);
  const next = () => setI((n) => (n + 1) % len);

  // simple swipe
  const touch = React.useRef<{ x: number | null }>({ x: null });
  const onTouchStart = (e: React.TouchEvent) =>
    (touch.current.x = e.touches[0].clientX);
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touch.current.x == null) return;
    const dx = e.changedTouches[0].clientX - touch.current.x;
    if (dx > 40) prev();
    if (dx < -40) next();
    touch.current.x = null;
  };

  const wrapperClass = fullBleed
    ? 'relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen'
    : 'relative w-full rounded-app shadow-elev overflow-hidden';

  // Matcha din containerbredd (max ~1152px på desktop)
  const sizesAttr = fullBleed ? '100vw' : '(min-width:1280px) 1152px, 100vw';

  // Liten hjälpare: generera blurDataURL för Unsplash
  const blurFor = (url: string) =>
    url.includes('images.unsplash.com')
      ? `${url}&w=32&q=10&auto=format`
      : undefined;

  // För LCP: bara första bilden får priority/eager
  const isFirstSlide = i === 0;
  const slide = slides[i];

  return (
    <div
      className={wrapperClass}
      style={{ height }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <Image
        key={slide.url}
        src={slide.url}
        alt={slide.alt ?? ''}
        fill
        className="object-cover"
        sizes={sizesAttr}
        priority={isFirstSlide}
        fetchPriority={isFirstSlide ? 'high' : 'auto'}
        loading={isFirstSlide ? 'eager' : 'lazy'}
        placeholder={blurFor(slide.url) ? 'blur' : undefined}
        blurDataURL={blurFor(slide.url)}
      />

      {showFavorite && (
        <div className="absolute right-4 top-4 z-20">
          <SaveButton venueId={venueId} variant="overlay" size="md" />
        </div>
      )}

      {len > 1 && (
        <>
          <Arrow onClick={prev} position="left" />
          <Arrow onClick={next} position="right" />

          <Dots count={len} active={i} />
        </>
      )}
    </div>
  );
}

function Arrow({
  onClick,
  position,
}: {
  onClick: () => void;
  position: 'left' | 'right';
}) {
  const side = position === 'left' ? 'left-4' : 'right-4';
  const flip = position === 'left' ? 'rotate-180' : '';

  return (
    <button
      type="button"
      aria-label={position === 'left' ? 'Previous image' : 'Next image'}
      onClick={onClick}
      className={`absolute top-1/2 -translate-y-1/2 ${side}
        z-20 grid place-items-center h-10 w-10 rounded-full
        bg-sand/90 text-aegean shadow-elev hover:bg-sand
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aegean/30
      `}
    >
      <svg viewBox="0 0 24 24" className={`h-5 w-5 ${flip}`}>
        <path
          d="M8 4l8 8-8 8"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

function Dots({ count, active }: { count: number; active: number }) {
  return (
    <div className="absolute inset-x-0 bottom-12 md:bottom-16 lg:bottom-19 flex justify-center gap-2 z-10">
      {Array.from({ length: count }).map((_, idx) => (
        <span
          key={idx}
          className={`h-2 w-2 rounded-app ${
            idx === active ? 'bg-white' : 'bg-white/60'
          }`}
        />
      ))}
    </div>
  );
}
