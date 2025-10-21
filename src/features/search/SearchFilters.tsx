'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import * as React from 'react';
import Image from 'next/image';

/**
 * SearchFilters
 *
 * Sidebar (or mobile sheet content) that reads/writes its state from the URL query string.
 * All controls are controlled by the current URL; updates are performed by pushing a new URL
 * via Next.js navigation, which re-renders the page with filtered results.
 *
 * UX notes
 * - Range slider uses a filled track to visualize the selected max price.
 * - Guests stepper clamps values to [1, 10].
 * - Ratings list uses your brand icon (logo) as a star replacement.
 * - Amenity toggles are boolean flags that map to "1" (on) or removal (off) in the URL.
 *
 * Accessibility
 * - Interactive elements have labels and use standard input controls (range, radio, checkbox).
 * - Icon images used as “stars” are decorative (`alt=""`) and therefore not announced.
 */
export default function SearchFilters() {
  const router = useRouter();
  const sp = useSearchParams();

  /**
   * Cached copy of the current query string.
   * Using URLSearchParams makes add/remove of keys predictable.
   */
  const q = React.useMemo(() => new URLSearchParams(sp.toString()), [sp]);

  /**
   * setParam
   *
   * Updates (or removes) a single query parameter, then navigates to /search?…
   *
   * Removal rules:
   * - empty string, '0', `undefined` → remove the key entirely
   *
   * @param key - Query string key to write (e.g., "guests", "priceMax")
   * @param val - Value to set; falsy values remove the key
   */
  const setParam = React.useCallback(
    (key: string, val?: string) => {
      const next = new URLSearchParams(q);
      if (!val || val === '0' || val === '') next.delete(key);
      else next.set(key, val);
      router.push(`/venues?${next.toString()}`);
    },
    [q, router]
  );

  /** Price slider bounds (kept local for readability, adjust as needed). */
  const PRICE_MIN = 20;
  const PRICE_MAX = 500;

  /** Current values parsed from the URL (with sensible defaults). */
  const priceMax = Number(sp.get('priceMax') ?? '0') || 212;
  const guests = Number(sp.get('guests') ?? '0') || 2;
  const ratingMin = Number(sp.get('ratingMin') ?? '0') || 0;

  const wifi = sp.get('wifi') === '1';
  const parking = sp.get('parking') === '1';
  const breakfast = sp.get('breakfast') === '1';
  const pets = sp.get('pets') === '1';

  /**
   * Percentage of the slider track to color (for the filled track bg).
   * Clamped implicitly by slider min/max.
   */
  const pct = Math.round(
    ((priceMax - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100
  );

  /** Brand icon used for the “rating stars”. */
  const logoSrc = '/icon.png';

  return (
    <aside className="panel space-y-5">
      <h3 className="text-lg font-semibold">Filter</h3>

      {/* ---- Price (aegean) ---- */}
      <div>
        <label className="block font-medium mb-2">Price</label>

        {/* 
          Range slider with a custom filled track using inline style.
          Note: the inline style uses CSS variables where available and falls back to hex.
        */}
        <input
          type="range"
          min={PRICE_MIN}
          max={PRICE_MAX}
          value={priceMax}
          onChange={(e) => setParam('priceMax', e.target.value)}
          className="w-full accent-aegean"
          style={
            {
              background: `linear-gradient(to right, var(--color-aegean, #0E7490) ${pct}%, #e5e7eb ${pct}%)`,
              height: 6,
              borderRadius: 9999,
              appearance: 'none',
            } as React.CSSProperties
          }
          aria-label="Maximum price per night"
        />
        <div className="text-ink/80 mt-1">Up to €{priceMax}</div>
      </div>

      {/* ---- Guests stepper +/- ---- */}
      <div>
        <label className="block font-medium mb-2">Guests</label>

        {/* Simple stepper, clamped to [1, 10] */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setParam('guests', String(Math.max(1, guests - 1)))}
            className="p-2 text-aegean hover:opacity-80 focus-visible:outline-none"
            aria-label="Minus one guest"
          >
            <Image
              src="/minus.svg"
              alt="minus"
              width={20}
              height={20}
              className="w-6 h-6"
              aria-hidden
            />
          </button>

          <span
            className="w-8 text-center font-semibold select-none"
            aria-live="polite"
          >
            {guests}
          </span>

          <button
            type="button"
            onClick={() => setParam('guests', String(Math.min(10, guests + 1)))}
            className="p-2 text-aegean hover:opacity-80 focus-visible:outline-none"
            aria-label="Plus one guest"
          >
            <Image
              src="/plus.svg"
              alt="plus"
              width={20}
              height={20}
              className="w-6 h-6"
              aria-hidden
            />
          </button>
        </div>
      </div>

      {/* ---- Ratings ---- */}
      <div>
        <label className="block font-medium mb-2">Ratings</label>

        {/* Vertical list of radio options (5 → 1). Each row shows N brand icons. */}
        <div className="flex flex-col gap-2">
          {[5, 4, 3, 2, 1].map((r) => (
            <label key={r} className="block cursor-pointer">
              <input
                type="radio"
                name="ratingMin"
                checked={ratingMin === r}
                onChange={() => setParam('ratingMin', String(r))}
                className="sr-only"
                aria-label={`Minimum rating ${r}`}
              />
              <span
                className={[
                  'inline-flex items-center gap-1 whitespace-nowrap rounded-md p-1 transition',
                  ratingMin === r
                    ? 'bg-aegean/10 ring-1 ring-aegean'
                    : 'hover:bg-ink/5',
                ].join(' ')}
              >
                {Array.from({ length: r }).map((_, i) => (
                  <Image key={i} src={logoSrc} alt="" width={18} height={18} />
                ))}
              </span>
            </label>
          ))}

          <button
            type="button"
            onClick={() => setParam('ratingMin', undefined)}
            className="self-start text-sm text-aegean hover:underline"
          >
            Clear rating
          </button>
        </div>
      </div>

      {/* ---- Amenities ---- */}
      <div>
        <label className="block font-medium mb-2">Amenities</label>
        <ul className="space-y-2">
          <li className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={wifi}
              onChange={(e) =>
                setParam('wifi', e.target.checked ? '1' : undefined)
              }
              className="accent-aegean"
              id="amen-wifi"
            />
            <label htmlFor="amen-wifi">Wi-Fi</label>
          </li>
          <li className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={parking}
              onChange={(e) =>
                setParam('parking', e.target.checked ? '1' : undefined)
              }
              className="accent-aegean"
              id="amen-parking"
            />
            <label htmlFor="amen-parking">Parking</label>
          </li>
          <li className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={breakfast}
              onChange={(e) =>
                setParam('breakfast', e.target.checked ? '1' : undefined)
              }
              className="accent-aegean"
              id="amen-breakfast"
            />
            <label htmlFor="amen-breakfast">Breakfast</label>
          </li>
          <li className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={pets}
              onChange={(e) =>
                setParam('pets', e.target.checked ? '1' : undefined)
              }
              className="accent-aegean"
              id="amen-pets"
            />
            <label htmlFor="amen-pets">Pets</label>
          </li>
        </ul>
      </div>

      {/* ---- Clear all ---- */}
      <div className="pt-2">
        <button
          type="button"
          className="btn btn-white w-full"
          onClick={() => router.push('/venues')}
          aria-label="Clear all filters"
        >
          Clear filter
        </button>
      </div>
    </aside>
  );
}
