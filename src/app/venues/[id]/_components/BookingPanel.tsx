// src/components/BookingPanel.tsx
'use client';

import * as React from 'react';
import Image from 'next/image';

const ICONS = {
  minus: '/minus.svg',
  plus: '/plus.svg',
};

// --- ersätt din IconBtn med denna ---
function IconBtn({
  src,
  label,
  onClick,
  disabled,
}: {
  src: string;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="
        group inline-flex h-9 w-9 items-center justify-center
        rounded-app
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aegean/30
        disabled:opacity-40
      "
    >
      <Image
        src={src}
        alt=""
        width={20}
        height={20}
        priority
        sizes="20px"
        style={{ width: 20, height: 20 }}
        className="transition duration-150 group-hover:opacity-80"
      />
    </button>
  );
}

function money(n: number) {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(n);
}

export default function BookingPanel({
  price,
  maxGuests = 1,
}: {
  price?: number;
  maxGuests?: number;
}) {
  const [checkIn, setCheckIn] = React.useState('');
  const [checkOut, setCheckOut] = React.useState('');
  const [guests, setGuests] = React.useState(1);

  const nights = React.useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const a = new Date(checkIn);
    const b = new Date(checkOut);
    const diff = Math.ceil((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  }, [checkIn, checkOut]);

  const total = price && nights ? price * nights : undefined;

  return (
    <aside className="panel md:sticky md:top-8 space-y-3 p-4">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-sm text-ink/60">Price</p>
          <p className="text-xl font-semibold">
            {price ? `${money(price)} / night` : '—'}
          </p>
        </div>
      </div>

      <div className="grid gap-3">
        <div>
          <label className="label">Check-in</label>
          <input
            type="date"
            className="input"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
          />
        </div>
        <div>
          <label className="label">Check-out</label>
          <input
            type="date"
            className="input"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
          />
        </div>

        <div>
          <label className="label">Guests (max {maxGuests})</label>
          <div className="flex items-center gap-2">
            <IconBtn
              src={ICONS.minus}
              label="Decrease guests"
              onClick={() => setGuests((g) => Math.max(1, g - 1))}
              disabled={guests <= 1}
            />

            <span
              aria-live="polite"
              className="inline-block w-6 text-center select-none"
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {guests}
            </span>

            <IconBtn
              src={ICONS.plus}
              label="Increase guests"
              onClick={() => setGuests((g) => Math.min(maxGuests, g + 1))}
              disabled={guests >= maxGuests}
            />
          </div>
        </div>
      </div>

      <div className="mt-1 flex items-center justify-between">
        <p className="text-sm text-ink/60">
          {nights ? `Total for ${nights} night${nights > 1 ? 's' : ''}` : '—'}
        </p>
        <p className="font-semibold">{total ? money(total) : '—'}</p>
      </div>

      <button className="btn btn-primary w-full" disabled={!price || !nights}>
        Book now
      </button>
    </aside>
  );
}
