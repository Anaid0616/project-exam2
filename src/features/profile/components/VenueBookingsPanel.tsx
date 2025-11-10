// src/components/VenueBookingsPanel.tsx
'use client';
import * as React from 'react';
import VenueBookingsTable from '@/features/profile/components/VenueBookingsTable';
import type { VenueBooking } from '@/types/booking';
import { money } from '@/lib/utils';

/** Allowed booking statuses shown in the UI. */
const ALL_STATUSES: VenueBooking['status'][] = [
  'Upcoming',
  'Pending',
  'Completed',
  'Canceled',
];

/** Active chip styles matching your palette: bg sand, stroke aegean, text ink. */
const CHIP_ACTIVE = 'bg-sand text-ink border-2 border-aegean/50';

/** Inactive chip styles (clean, subtle, still discoverable on hover). */
const CHIP_INACTIVE = 'bg-ink/5 text-ink/70 border-ink/15 hover:bg-ink/10';

/** Visual status pill reused in the mobile cards. */
function StatusPill({ value }: { value: VenueBooking['status'] }) {
  const map: Record<VenueBooking['status'], string> = {
    Upcoming: 'bg-lagoon/20 text-aegean',
    Pending: 'bg-coral/50 text-black/70',
    Completed: 'bg-green-100 text-green-700',
    Canceled: 'bg-sunset-100 text-sunset-600',
  };
  return (
    <span
      className={`rounded-app px-2 py-0.5 text-xs font-medium ${map[value]}`}
    >
      {value}
    </span>
  );
}

const fmt = (d: string | number | Date) => new Date(d).toLocaleDateString();

type Props = {
  /** List of bookings to display. */
  rows: VenueBooking[];
  /** Base path used for the "View" action links. */
  viewBasePath?: string;
};

/**
 * Bookings panel with filtering and a responsive result view.
 * - Under 845px: compact card grid.
 * - 845px and up: table (uses your existing VenueBookingsTable).
 *
 * No business logic has been changed; only layout/styling/responsiveness.
 */
export default function VenueBookingsPanel({
  rows,
  viewBasePath = '/profile/bookings',
}: Props) {
  const [q, setQ] = React.useState('');
  const [fromStr, setFromStr] = React.useState('');
  const [toStr, setToStr] = React.useState('');
  const [activeStatuses, setActiveStatuses] = React.useState<
    Set<VenueBooking['status']>
  >(new Set(ALL_STATUSES));

  const fromDate = React.useMemo(
    () => (fromStr ? stripTime(new Date(fromStr)) : null),
    [fromStr]
  );
  const toDate = React.useMemo(
    () => (toStr ? endOfDay(new Date(toStr)) : null),
    [toStr]
  );

  /** Toggle a status chip; never allow all to be off. */
  function toggleStatus(s: VenueBooking['status']) {
    setActiveStatuses((prev) => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s);
      else next.add(s);
      return next.size === 0 ? new Set([s]) : next;
    });
  }

  /** Apply text/date/status filters to rows. */
  const filtered = React.useMemo(() => {
    const qLower = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (!activeStatuses.has(r.status)) return false;

      if (qLower) {
        const hay = `${r.venueName} ${r.guestName}`.toLowerCase();
        if (!hay.includes(qLower)) return false;
      }

      const checkIn = new Date(r.checkIn);
      if (fromDate && checkIn < stripTime(fromDate)) return false;
      if (toDate && checkIn > endOfDay(toDate)) return false;

      return true;
    });
  }, [rows, q, activeStatuses, fromDate, toDate]);

  return (
    <section className="space-y-3">
      {/* Filter panel */}
      <div className="panel p-3 space-y-3">
        {/* Row 1: Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
          <div className="lg:col-span-2">
            <label className="label" htmlFor="booking-search">
              Search
            </label>
            <input
              id="booking-search"
              className="input w-full"
              placeholder="Search venue or guest…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <div>
            <label className="label" htmlFor="booking-from">
              Check-in from
            </label>
            <input
              id="booking-from"
              type="date"
              className="input w-full"
              value={fromStr}
              onChange={(e) => setFromStr(e.target.value)}
              max={toStr || undefined}
            />
          </div>
          <div>
            <label className="label" htmlFor="booking-to">
              Check-in to
            </label>
            <input
              id="booking-to"
              type="date"
              className="input w-full"
              value={toStr}
              onChange={(e) => setToStr(e.target.value)}
              min={fromStr || undefined}
            />
          </div>
        </div>

        {/* Row 2: Status chips (under inputs). Right-aligned on desktop, wraps on small. */}
        <div className="flex flex-wrap gap-2 md:justify-end">
          {ALL_STATUSES.map((s) => {
            const active = activeStatuses.has(s);
            return (
              <button
                key={s}
                type="button"
                onClick={() => toggleStatus(s)}
                className={`rounded-app px-3 py-1 text-sm border transition ${
                  active ? CHIP_ACTIVE : CHIP_INACTIVE
                }`}
              >
                {s}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => {
              setQ('');
              setFromStr('');
              setToStr('');
              setActiveStatuses(new Set(ALL_STATUSES));
            }}
            className="rounded-app px-3 py-1 text-sm border bg-sand/70 text-aegean border-aegean/20"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <p className="text-sm text-ink/60 px-1">
          No bookings match your filters.
        </p>
      ) : (
        <>
          {/* Cards (UNDER 845px) */}
          <div className="block min-[845px]:hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filtered.map((b) => (
                <article
                  key={b.id}
                  className="rounded-app border border-black/10 bg-white p-3 shadow-sm hover:shadow transition-shadow"
                >
                  <header className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-semibold">
                        {b.venueName}
                      </h3>
                      <p className="truncate text-xs text-black/60">
                        {b.guestName}
                      </p>
                    </div>
                    <StatusPill value={b.status} />
                  </header>

                  <div className="mt-2 space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-black/60">Check-in</span>
                      <span className="font-medium">{fmt(b.checkIn)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-black/60">Check-out</span>
                      <span className="font-medium">{fmt(b.checkOut)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-black/60">Nights • Guests</span>
                      <span>
                        {b.nights} • {b.guests}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-black/60">Total</span>
                      <span className="font-semibold">{money(b.total)}</span>
                    </div>
                  </div>

                  <footer className="mt-3 flex justify-end">
                    <a
                      href={`${viewBasePath}/${b.id}`}
                      className="inline-flex items-center rounded-app border border-lagoon bg-lagoon px-3 py-1 font-semibold text-black shadow-sm hover:bg-lagoon/90 focus:outline-none focus:ring-2 focus:ring-lagoon/40"
                    >
                      View
                    </a>
                  </footer>
                </article>
              ))}
            </div>
          </div>

          {/* Table (845px AND UP) */}
          <div className="hidden min-[845px]:block">
            <VenueBookingsTable rows={filtered} viewBasePath={viewBasePath} />
          </div>
        </>
      )}
    </section>
  );
}

/** Zero out time to 00:00:00.000 (local). */
function stripTime(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

/** Set time to 23:59:59.999 (local). */
function endOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}
