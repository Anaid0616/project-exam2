'use client';

import * as React from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import dynamic from 'next/dynamic';
import type { BlockedRange } from '@/components/ui/DateRangeCalendar';

import { createBooking } from '@/features/bookings/api/bookings.api';
import { useToast } from '@/providers/ToastProvider';

const DateRangeCalendar = dynamic(
  () => import('@/components/ui/DateRangeCalendar'),
  {
    ssr: false,
    loading: () => (
      <div
        className="
         rounded-app border border-ink/10 p-2
         w-full max-w-[360px] md:max-w-[400px] mx-auto
        "
      >
        {/* keep height to avoid layout shift */}
        <div className="aspect-[4/3] w-full rounded bg-ink/10 animate-pulse" />
      </div>
    ),
  }
);

/** Minimal booked-range shape coming from the venue API. */
type BookedLite = { dateFrom: string; dateTo: string };

const ICONS = { minus: '/minus.svg', plus: '/plus.svg' };

/**
 * Format a number as EUR without decimals (e.g. "€145").
 */
function money(n: number) {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(n);
}

/**
 * Calculate nights between two local Date objects.
 * Uses ceil to treat partial days as a full night and clamps at 0.
 */
function nightsBetween(a: Date, b: Date) {
  const ms = b.getTime() - a.getTime();
  const d = Math.ceil(ms / (1000 * 60 * 60 * 24));
  return d > 0 ? d : 0;
}

/**
 * Format a Date to ISO date-only (YYYY-MM-DD).
 * (Aligns with API expectation for date-only fields.)
 */
const iso = (d: Date) => format(d, 'yyyy-MM-dd');

/**
 * Parse "YYYY-MM-DD" (or ISO-like) safely as a local-date object at midnight.
 * If a full ISO string is passed, UTC parts are used to avoid TZ shifts.
 */
function asLocalDate(input: string) {
  const d = new Date(input);
  if (!Number.isNaN(d.getTime())) {
    return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  }
  const [y, m, dd] = input.split('-').map(Number);
  return new Date(y, (m ?? 1) - 1, dd ?? 1);
}

/** Return a new Date offset by `n` days. */
function addDays(d: Date, n: number) {
  const c = new Date(d);
  c.setDate(c.getDate() + n);
  return c;
}

/**
 * BookingPanel
 *
 * Side panel used on the venue detail page to select dates and guests, and create a booking.
 * - Pre-fills date range and guests from URL query (?from, ?to, ?guests) when present.
 * - Blocks already-booked ranges in the inline calendar.
 * - Announces async success/error via an aria-live region.
 *
 * @param venueId   - The current venue id (required).
 * @param price     - Price per night in EUR.
 * @param maxGuests - Maximum allowed guests for the venue (defaults to 1).
 * @param booked    - Existing bookings for this venue (to block out in the calendar).
 * @param venueName - Optional venue name for confirmation payload/URL.
 * @param location  - Optional location string for confirmation payload/URL.
 */
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
  const searchParams = useSearchParams();
  const { success, error } = useToast();

  // --- read query params to prefill ---
  const fromParam = searchParams.get('from');
  const toParam = searchParams.get('to');
  const guestsParam = searchParams.get('guests');

  /**
   * Selected date range for the inline calendar.
   * Prefilled from URL (?from, ?to) if both are present and valid.
   */
  const [range, setRange] = React.useState<DateRange | undefined>(() => {
    if (fromParam && toParam) {
      const from = asLocalDate(fromParam);
      const to = asLocalDate(toParam);
      if (!isNaN(from.getTime()) && !isNaN(to.getTime())) return { from, to };
    }
    return undefined;
  });

  /**
   * Selected guests.
   * Prefilled from URL (?guests) and clamped to [1, maxGuests].
   */
  const [guests, setGuests] = React.useState<number>(() => {
    const g = guestsParam ? parseInt(guestsParam, 10) : NaN;
    if (!Number.isFinite(g)) return 1;
    return Math.min(Math.max(g, 1), maxGuests);
    // If maxGuests changes later, we clamp again below.
  });

  // Clamp guests if maxGuests prop changes.
  React.useEffect(() => {
    setGuests((g) => Math.min(Math.max(g, 1), maxGuests));
  }, [maxGuests]);

  /**
   * Blocked ranges for the calendar (booked days are not selectable).
   * We block [dateFrom, dateTo) by subtracting one day at the end,
   * so a booking ending on X doesn't block the next guest from arriving on X.
   */
  const blockedRanges: BlockedRange[] = React.useMemo(
    () =>
      (booked ?? []).map((b) => {
        const from = asLocalDate(b.dateFrom);
        const to = addDays(asLocalDate(b.dateTo), -1);
        return { from, to };
      }),
    [booked]
  );

  // --- derived values for UI and payload ---
  const checkIn = range?.from ? iso(range.from) : '';
  const checkOut = range?.to ? iso(range.to) : '';
  const nights =
    range?.from && range?.to ? nightsBetween(range.from, range.to) : 0;
  const total = price && nights ? price * nights : undefined;
  const canBook = !!venueId && !!price && nights > 0;

  /** Screen-reader live region message for async feedback. */
  const [liveMsg, setLiveMsg] = React.useState<string>('');

  /**
   * Create booking and redirect to confirmation.
   * On success/failure we also set an aria-live message and a toast.
   */
  async function onBook() {
    if (!canBook || !checkIn || !checkOut) return;
    try {
      await createBooking({
        dateFrom: checkIn,
        dateTo: checkOut,
        guests,
        venueId,
      });

      setLiveMsg('Booking confirmed.');
      success({ title: 'Booking confirmed' });

      const q = new URLSearchParams({
        id: venueId,
        from: checkIn,
        to: checkOut,
        guests: String(guests),
        ...(total ? { total: String(total) } : {}),
        ...(venueName ? { venueName } : {}),
        ...(location ? { location } : {}),
      });

      router.push(`/book/confirmation?${q.toString()}`);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Could not create booking';
      setLiveMsg('Booking failed.');
      error({ title: 'Booking failed', description: msg });
    }
  }

  return (
    <aside className="min-w-0 w-full min-[900px]:sticky min-[900px]:top-24 self-start">
      {/* aria-live region for async status (invisible visually) */}
      <p aria-live="polite" className="sr-only">
        {liveMsg}
      </p>

      {/* panel card */}
      <div className="panel space-y-3 p-4">
        {/* Price */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm text-ink/60">Price</p>
            <p className="text-xl font-semibold">
              {price ? `${money(price)} / night` : '—'}
            </p>
          </div>
        </div>

        {/* Inline calendar */}
        <div>
          <span id="select-dates-label" className="label mb-1 block">
            Select dates
          </span>

          <div role="group" aria-labelledby="select-dates-label">
            <DateRangeCalendar
              value={range}
              onChange={setRange}
              blocked={blockedRanges}
              className="
        booking-calendar rounded-app border border-ink/10 p-2
        w-full max-w-[360px] md:max-w-[400px] mx-auto
        [&_.rdp]:inline-block origin-top overflow-visible
        max-[338px]:scale-[0.80] max-[338px]:-mb-20
      "
            />
          </div>
        </div>

        {/* Guests */}
        <div>
          {/* byt label -> p */}
          <p id="guests-label" className="label">
            Guests (max {maxGuests})
          </p>

          <div
            role="group"
            aria-labelledby="guests-label"
            className="flex items-center gap-2"
          >
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

        {/* Summary */}
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
      </div>
    </aside>
  );
}

/**
 * Small icon-only button used for the guests stepper.
 * Accessible with an aria-label and proper disabled styling.
 */
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
