'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import * as React from 'react';
import Image from 'next/image';

export default function SearchFilters() {
  const router = useRouter();
  const sp = useSearchParams();

  const q = React.useMemo(() => new URLSearchParams(sp.toString()), [sp]);
  const setParam = React.useCallback(
    (key: string, val?: string) => {
      const next = new URLSearchParams(q);
      if (!val || val === '0' || val === '') next.delete(key);
      else next.set(key, val);
      router.push(`/search?${next.toString()}`);
    },
    [q, router]
  );

  // ----- current values from URL -----
  const PRICE_MIN = 20;
  const PRICE_MAX = 500;

  const priceMax = Number(sp.get('priceMax') ?? '0') || 212; // default t.ex. 212
  const guests = Number(sp.get('guests') ?? '0') || 2;
  const ratingMin = Number(sp.get('ratingMin') ?? '0') || 0;

  const wifi = sp.get('wifi') === '1';
  const parking = sp.get('parking') === '1';
  const breakfast = sp.get('breakfast') === '1';
  const pets = sp.get('pets') === '1';

  //
  const pct = Math.round(
    ((priceMax - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100
  );

  //
  const logoSrc = '/icon.png';

  return (
    <aside className="panel space-y-5 sticky top-24 h-fit">
      <h3 className="text-lg font-semibold">Filter</h3>

      {/* ---- Price (aegean) ---- */}
      <div>
        <label className="block text-sm font-medium mb-2">Price</label>

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
        />
        <div className="text-sm text-ink/70 mt-1">Up to €{priceMax}</div>
      </div>

      {/* ---- Guests stepper +/- ---- */}
      <div>
        <label className="block text-sm font-medium mb-2">Guests</label>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setParam('guests', String(Math.max(1, guests - 1)))}
            className="p-2 text-aegean hover:opacity-80 focus-visible:outline-none"
            aria-label="Minus one guest"
          >
            <Image src="/minus.svg" alt="minus" width={20} height={20} />
          </button>

          <span className="w-8 text-center font-semibold select-none">
            {guests}
          </span>

          <button
            type="button"
            onClick={() => setParam('guests', String(Math.min(10, guests + 1)))}
            className="p-2 text-aegean hover:opacity-80 focus-visible:outline-none"
            aria-label="Plus one guest"
          >
            <Image src="/plus.svg" alt="plus" width={20} height={20} />
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Ratings</label>

        {/* vertikal lista */}
        <div className="flex flex-col gap-2">
          {[5, 4, 3, 2, 1].map((r) => (
            <label key={r} className="block cursor-pointer">
              <input
                type="radio"
                name="ratingMin"
                checked={ratingMin === r}
                onChange={() => setParam('ratingMin', String(r))}
                className="sr-only"
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
                  <Image key={i} src={logoSrc} alt="" width={16} height={16} />
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
        <label className="block text-sm font-medium mb-2">Amenities</label>
        <ul className="space-y-2 text-sm">
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
      <div className="pt-2">
        <button
          type="button"
          className="btn btn-outline w-full"
          onClick={() => router.push('/search')}
        >
          Clear filter
        </button>
      </div>
    </aside>
  );
}
