'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import * as React from 'react';
import Image from 'next/image';

/**
 * SearchFilters
 *
 * Sidebar filter UI reading/writing from the URL query string.
 * This version keeps the exact original UI and styling, but now uses
 * LOCAL STATE for all filter controls, and applies all changes only
 * when the user clicks the "Apply filters" button.
 *
 * This prevents multiple router pushes -> avoids API spam (429)
 * and makes the UI feel instant and smooth.
 */
export default function SearchFilters() {
  const router = useRouter();
  const sp = useSearchParams();

  // ----- Read defaults from URL -----
  const defaultPrice = Number(sp.get('priceMax') ?? '212');
  const defaultGuests = Number(sp.get('guests') ?? '2');
  const defaultRating = Number(sp.get('ratingMin') ?? '0');

  const defaultWifi = sp.get('wifi') === '1';
  const defaultParking = sp.get('parking') === '1';
  const defaultBreakfast = sp.get('breakfast') === '1';
  const defaultPets = sp.get('pets') === '1';

  // ----- LOCAL STATE FOR ALL FILTERS -----
  const [localPriceMax, setLocalPriceMax] = React.useState(defaultPrice);
  const [localGuests, setLocalGuests] = React.useState(defaultGuests);
  const [localRating, setLocalRating] = React.useState(defaultRating);

  const [localWifi, setLocalWifi] = React.useState(defaultWifi);
  const [localParking, setLocalParking] = React.useState(defaultParking);
  const [localBreakfast, setLocalBreakfast] = React.useState(defaultBreakfast);
  const [localPets, setLocalPets] = React.useState(defaultPets);

  // Sync when browser back/forward changes URL
  React.useEffect(() => setLocalPriceMax(defaultPrice), [defaultPrice]);
  React.useEffect(() => setLocalGuests(defaultGuests), [defaultGuests]);
  React.useEffect(() => setLocalRating(defaultRating), [defaultRating]);
  React.useEffect(() => setLocalWifi(defaultWifi), [defaultWifi]);
  React.useEffect(() => setLocalParking(defaultParking), [defaultParking]);
  React.useEffect(
    () => setLocalBreakfast(defaultBreakfast),
    [defaultBreakfast]
  );
  React.useEffect(() => setLocalPets(defaultPets), [defaultPets]);

  // ----- APPLY ALL FILTERS (one router push total) -----
  const applyFilters = () => {
    const next = new URLSearchParams();

    next.set('priceMax', String(localPriceMax));
    next.set('guests', String(localGuests));

    if (localRating > 0) next.set('ratingMin', String(localRating));
    if (localWifi) next.set('wifi', '1');
    if (localParking) next.set('parking', '1');
    if (localBreakfast) next.set('breakfast', '1');
    if (localPets) next.set('pets', '1');

    router.push(`/venues?${next.toString()}`, { scroll: false });
  };

  // ----- Price slider fill percentage -----
  const PRICE_MIN = 20;
  const PRICE_MAX = 500;
  const pct = Math.round(
    ((localPriceMax - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100
  );

  const logoSrc = '/icon.png';

  return (
    <aside className="panel space-y-5">
      <h2 className="text-lg font-semibold">Filter</h2>

      {/* ---- Price ---- */}
      <fieldset className="mt-4">
        <legend className="block font-medium mb-2">
          Maximum price per night
        </legend>

        <input
          id="priceMax"
          type="range"
          min={PRICE_MIN}
          max={PRICE_MAX}
          value={localPriceMax}
          onChange={(e) => setLocalPriceMax(Number(e.target.value))}
          className="w-full accent-aegean"
          style={{
            background: `linear-gradient(to right, var(--color-aegean, #0E7490) ${pct}%, #e5e7eb ${pct}%)`,
            height: 6,
            borderRadius: 9999,
            appearance: 'none',
          }}
        />
        <div className="text-ink/80 mt-1">Up to €{localPriceMax}</div>
      </fieldset>

      {/* ---- Guests stepper +/- ---- */}
      <fieldset className="mt-4" aria-label="Number of guests">
        <legend className="block font-medium mb-2">Guests</legend>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setLocalGuests((g) => Math.max(1, g - 1))}
            className="p-2 text-aegean hover:opacity-80"
          >
            <Image src="/minus.svg" alt="" width={20} height={20} />
          </button>

          <span className="w-8 text-center font-semibold select-none">
            {localGuests}
          </span>

          <button
            type="button"
            onClick={() => setLocalGuests((g) => Math.min(10, g + 1))}
            className="p-2 text-aegean hover:opacity-80"
          >
            <Image src="/plus.svg" alt="" width={20} height={20} />
          </button>
        </div>
      </fieldset>

      {/* ---- Ratings ---- */}
      <fieldset className="mt-4">
        <legend className="block font-medium mb-2">Minimum rating</legend>

        <div className="flex flex-col gap-2">
          {[5, 4, 3, 2, 1].map((r) => (
            <div key={r}>
              <input
                id={`rating-${r}`}
                type="radio"
                name="ratingMin"
                checked={localRating === r}
                onChange={() => setLocalRating(r)}
                className="sr-only"
              />
              <label
                htmlFor={`rating-${r}`}
                className={[
                  'inline-flex items-center gap-1 whitespace-nowrap rounded-md p-1 transition cursor-pointer',
                  localRating === r
                    ? 'bg-aegean/10 ring-1 ring-aegean'
                    : 'hover:bg-ink/5',
                ].join(' ')}
              >
                {Array.from({ length: r }).map((_, i) => (
                  <Image key={i} src={logoSrc} alt="" width={18} height={18} />
                ))}
              </label>
            </div>
          ))}

          <button
            type="button"
            onClick={() => setLocalRating(0)}
            className="self-start text-sm text-aegean hover:underline"
          >
            Clear rating
          </button>
        </div>
      </fieldset>

      {/* ---- Amenities ---- */}
      <fieldset className="mt-4">
        <legend className="block font-medium mb-2">Amenities</legend>

        <ul className="space-y-2">
          <li className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={localWifi}
              onChange={() => setLocalWifi(!localWifi)}
              className="accent-aegean"
              id="amen-wifi"
            />
            <label htmlFor="amen-wifi">Wi-Fi</label>
          </li>

          <li className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={localParking}
              onChange={() => setLocalParking(!localParking)}
              className="accent-aegean"
              id="amen-parking"
            />
            <label htmlFor="amen-parking">Parking</label>
          </li>

          <li className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={localBreakfast}
              onChange={() => setLocalBreakfast(!localBreakfast)}
              className="accent-aegean"
              id="amen-breakfast"
            />
            <label htmlFor="amen-breakfast">Breakfast</label>
          </li>

          <li className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={localPets}
              onChange={() => setLocalPets(!localPets)}
              className="accent-aegean"
              id="amen-pets"
            />
            <label htmlFor="amen-pets">Pets</label>
          </li>
        </ul>
      </fieldset>

      {/* ---- APPLY FILTERS ---- */}
      <button
        type="button"
        className="btn btn-primary w-full"
        onClick={applyFilters}
      >
        Apply filters
      </button>

      {/* ---- Clear all ---- */}
      <div className="pt-0">
        <button
          type="button"
          className="btn btn-white w-full"
          onClick={() => router.push('/venues', { scroll: false })}
        >
          Clear filter
        </button>
      </div>
    </aside>
  );
}
