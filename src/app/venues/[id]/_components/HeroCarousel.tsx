'use client';

import * as React from 'react';
import Image from 'next/image';

type Media = { url: string; alt?: string | null };

export default function HeroCarousel({
  images,
  fallback,
  height = 520,
  fullBleed = false,
  showFavorite = true,
  onToggleFavorite,
  isFavorite: favoriteProp,
}: {
  images?: Media[] | null;
  fallback: Media;
  height?: number;
  fullBleed?: boolean;
  showFavorite?: boolean;
  onToggleFavorite?: (next: boolean) => void;
  isFavorite?: boolean;
}) {
  const slides = images && images.length ? images : [fallback];
  const [i, setI] = React.useState(0);
  const len = slides.length;

  const [liked, setLiked] = React.useState(!!favoriteProp);
  React.useEffect(() => {
    if (favoriteProp !== undefined) setLiked(!!favoriteProp);
  }, [favoriteProp]);

  const prev = () => setI((n) => (n - 1 + len) % len);
  const next = () => setI((n) => (n + 1) % len);

  // touch-swipe
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

  const sizesAttr = fullBleed
    ? '100vw'
    : '(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1152px';

  return (
    <div
      className={wrapperClass}
      style={{ height }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Bild */}
      <Image
        key={slides[i].url}
        src={slides[i].url}
        alt={slides[i].alt ?? ''}
        fill
        sizes={sizesAttr}
        className="object-cover"
        priority
      />

      {showFavorite && (
        <button
          type="button"
          aria-label={liked ? 'Remove from favourites' : 'Save to favourites'}
          onClick={() => {
            const next = !liked;
            setLiked(next);
            onToggleFavorite?.(next);
          }}
          className="
      absolute right-4 top-4 z-20
      p-2 -m-2                 /* större osynlig träffyta */
      bg-transparent          /* ingen cirkel */
      hover:bg-transparent
      focus-visible:outline-none
    "
        >
          <svg
            viewBox="0 0 24 24"
            className="h-8 w-8 drop-shadow-[0_1px_4px_rgba(0,0,0,0.35)]"
          >
            {liked ? (
              <path
                d="M12 21s-6.8-4.7-9-8a5.2 5.2 0 018-6c1 .9 1 .9 1 0a5.2 5.2 0 018 6c-2.2 3.3-9 8-9 8z"
                fill="white"
              />
            ) : (
              <path
                d="M12.1 20.6s-6.6-4.5-8.7-7.7a5.1 5.1 0 017.7-6.3c.4.4.9 1 1 1s.6-.6 1-1a5.1 5.1 0 017.7 6.3c-2.1 3.2-8.7 7.7-8.7 7.7z"
                fill="none"
                stroke="white"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
            )}
          </svg>
        </button>
      )}

      {/* Arrows, only show when its more than one img */}
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
        z-20 h-14 w-14 rounded-app bg-sand/90 text-aegean shadow-elev
        hover:bg-sand focus-visible:outline-none
        focus-visible:ring-2 focus-visible:ring-aegean/30
      `}
    >
      {/* pil-ikon */}
      <svg viewBox="0 0 24 24" className={`h-7 w-7 mx-auto ${flip}`}>
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
    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-2">
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
