// src/app/venues/[id]/_components/BookingPanel.tsx
'use client';

import * as React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';

import DateRangeField, { type BlockedRange } from '@/components/DateRangeField';
import { createBooking } from '@/lib/venuescrud';
import { toast } from '@/lib/toast';

type BookedLite = { dateFrom: string; dateTo: string };

const ICONS = { minus: '/minus.svg', plus: '/plus.svg' };

// --- utilities ---
function money(n: number) {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(n);
}
function nightsBetween(a: Date, b: Date) {
  const ms = b.getTime() - a.getTime();
  const d = Math.ceil(ms / (1000 * 60 * 60 * 24));
  return d > 0 ? d : 0;
}
const iso = (d: Date) => format(d, 'yyyy-MM-dd');

export default function BookingPanel({
  venueId,
  price,
  maxGuests = 1,
  booked,
  venueName,
  location,
}: {
  venueId: string;
  price?: number;
  maxGuests?: number;
  booked: BookedLite[];
  venueName?: string;
  location?: string;
}) {
  const router = useRouter();

  // Range från DateRangeField
  const [range, setRange] = React.useState<DateRange | undefined>(undefined);

  // Guests
  const [guests, setGuests] = React.useState(1);

  // Blockerade datum för kalendern (bokningar)
  const blockedRanges: BlockedRange[] = React.useMemo(
    () =>
      (booked ?? []).map((b) => ({
        from: new Date(b.dateFrom),
        to: new Date(b.dateTo),
      })),
    [booked]
  );

  // Derived
  const checkIn = range?.from ? iso(range.from) : '';
  const checkOut = range?.to ? iso(range.to) : '';
  const nights =
    range?.from && range?.to ? nightsBetween(range.from, range.to) : 0;
  const total = price && nights ? price * nights : undefined;

  const canBook = !!venueId && !!price && nights > 0;

  async function onBook() {
    if (!canBook || !checkIn || !checkOut) return;
    try {
      await createBooking({
        dateFrom: checkIn,
        dateTo: checkOut,
        guests,
        venueId,
      });

      toast.success({ title: 'Booking confirmed' });

      const q = new URLSearchParams({
        id: venueId,
        from: checkIn,
        to: checkOut,
        guests: String(guests),
        ...(total ? { total: String(total) } : {}),
        ...(venueName ? { venueName } : {}),
        ...(location ? { location } : {}),
      });
      router.push(`/book?${q.toString()}`);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Could not create booking';
      toast.error({ title: 'Booking failed', description: msg });
    }
  }

  return (
    <aside className="panel md:sticky md:top-8 space-y-3 p-4">
      {/* Price */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-sm text-ink/60">Price</p>
          <p className="text-xl font-semibold">
            {price ? `${money(price)} / night` : '—'}
          </p>
        </div>
      </div>

      {/* Datum – återanvändbar komponent */}
      <DateRangeField
        value={range}
        onChange={setRange}
        blocked={blockedRanges}
        className="grid gap-3 relative"
      />

      {/* Guests */}
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

      {/* Sum */}
      <div className="mt-1 flex items-center justify-between">
        <p className="text-sm text-ink/60">
          {nights ? `Total for ${nights} night${nights > 1 ? 's' : ''}` : '—'}
        </p>
        <p className="font-semibold">{total ? money(total) : '—'}</p>
      </div>

      <button
        className="btn btn-primary w-full"
        disabled={!canBook}
        onClick={onBook}
      >
        Book now
      </button>
    </aside>
  );
}

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
      className="group inline-flex h-9 w-9 items-center justify-center rounded-app focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aegean/30 disabled:opacity-40"
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
