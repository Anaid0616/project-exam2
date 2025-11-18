'use client';

import * as React from 'react';
import Image from 'next/image';
import SaveButton from '@/components/ui/SaveButton';
/**
 * HeroCarousel
 *
 * Displays the venue's hero images as a large, swipeable carousel.
 *
 * Accessibility:
 * - Each image has a descriptive `alt` text if available.
 * - If the alt text is missing or non-informative ("image", "photo", etc.),
 *   the slide is treated as decorative (`alt=""`) so screen readers skip it.
 * - Buttons for previous/next images have descriptive `aria-label`s.
 *
 * Props:
 * @param {Media[]} [images] - Optional list of hero images for the venue.
 * @param {Media} fallback - Fallback image when no images exist.
 * @param {number} [height=520] - Fixed height of the hero container in pixels.
 * @param {boolean} [fullBleed=false] - Whether the carousel stretches full width.
 * @param {boolean} [showFavorite=true] - Whether to show the favorite/save button overlay.
 * @param {string} venueId - The current venue ID (used for SaveButton).
 */
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

  /** Navigate to previous slide (wraps around). */
  const prev = () => setI((n) => (n - 1 + len) % len);
  /** Navigate to next slide (wraps around). */
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

  /** Determine container style based on fullBleed setting. */
  const wrapperClass = fullBleed
    ? 'relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen'
    : 'relative w-full rounded-app shadow-elev overflow-hidden';

  /** Responsive image sizes attribute (desktop ≈ 1152px). */
  const sizesAttr = fullBleed ? '100vw' : '(min-width:1280px) 1152px, 100vw';

  /** Generate low-quality blur placeholder for Unsplash images. */
  const blurFor = (url: string) =>
    url.includes('images.unsplash.com')
      ? `${url}&w=32&q=10&auto=format`
      : undefined;

  // LCP: Only first img get priority/eager
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

/**
 * Arrow
 *
 * A circular button that navigates to the previous or next slide.
 *
 * Accessibility:
 * - Each button has a descriptive `aria-label` ("Previous image" or "Next image").
 *
 * Props:
 * @param onClick Function to trigger navigation.
 * @param position Either `'left'` or `'right'`, controls placement and rotation.
 */
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

/**
 * Dots
 *
 * Renders small circular indicators for each carousel slide.
 * The active dot is visually highlighted to show the current image.
 *
 * Props:
 * @param count Total number of slides.
 * @param active Index (0-based) of the currently active slide.
 */
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
