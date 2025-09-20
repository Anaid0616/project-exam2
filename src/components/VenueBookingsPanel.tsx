// src/components/VenueBookingsPanel.tsx
'use client';
import * as React from 'react';
import VenueBookingsTable from '@/components/VenueBookingsTable';
import type { VenueBooking } from '@/types/venue';

type Props = {
  rows: VenueBooking[];
  viewBasePath?: string;
};

const ALL_STATUSES: VenueBooking['status'][] = [
  'Upcoming',
  'Pending',
  'Completed',
  'Canceled',
];

export default function VenueBookingsPanel({ rows, viewBasePath }: Props) {
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

  function toggleStatus(s: VenueBooking['status']) {
    setActiveStatuses((prev) => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s);
      else next.add(s);
      return next.size === 0 ? new Set([s]) : next;
    });
  }

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
      <div className="panel flex flex-wrap items-end gap-3 p-3">
        <div className="flex-1 min-w-[220px]">
          <label className="label">Search</label>
          <input
            className="input w-full"
            placeholder="Search venue or guest…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div>
          <label className="label">Check-in from</label>
          <input
            type="date"
            className="input"
            value={fromStr}
            onChange={(e) => setFromStr(e.target.value)}
            max={toStr || undefined}
          />
        </div>
        <div>
          <label className="label">Check-in to</label>
          <input
            type="date"
            className="input"
            value={toStr}
            onChange={(e) => setToStr(e.target.value)}
            min={fromStr || undefined}
          />
        </div>
        <div className="flex flex-wrap gap-2 ml-auto">
          {ALL_STATUSES.map((s) => {
            const active = activeStatuses.has(s);
            return (
              <button
                key={s}
                type="button"
                onClick={() => toggleStatus(s)}
                className={`rounded-app px-3 py-1 text-sm border transition ${
                  active
                    ? 'bg-aegean/10 text-aegean border-aegean/20'
                    : 'bg-ink/5 text-ink/70 border-ink/10'
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

      {filtered.length === 0 ? (
        <p className="text-sm text-ink/60 px-1">
          No bookings match your filters.
        </p>
      ) : (
        <VenueBookingsTable rows={filtered} viewBasePath={viewBasePath} />
      )}
    </section>
  );
}

function stripTime(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function endOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}
