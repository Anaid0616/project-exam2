'use client';
import * as React from 'react';
import { useRouter } from 'next/navigation';

export default function VenueSearchForm({
  className = '',
}: {
  className?: string;
}) {
  const router = useRouter();
  const [where, setWhere] = React.useState('');
  const [from, setFrom] = React.useState('');
  const [to, setTo] = React.useState('');

  const [guests, setGuests] = React.useState<number>(2);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (from && to && new Date(from) > new Date(to)) {
      alert('Check-out must be after check-in');
      return;
    }
    const q = new URLSearchParams();
    if (where.trim()) q.set('where', where.trim());
    if (from) q.set('from', from);
    if (to) q.set('to', to);
    if (guests) q.set('guests', String(guests));
    router.push(`/search?${q.toString()}`);
  }

  function Field({
    id,
    label,
    children,
  }: React.PropsWithChildren<{ id: string; label: string }>) {
    return (
      <div className="relative">
        {/* etiketten ligger ovanpå och räknas inte i höjden */}
        <label
          htmlFor={id}
          className="pointer-events-none absolute -top-2.5 left-3 z-10
                   px-1 text-xs font-medium text-ink/70
                   bg-white rounded"
        >
          {label}
        </label>

        {/* border-mask så etiketten “skär” igenom kanten snyggt */}
        <div
          aria-hidden
          className="absolute top-0 h-2 bg-white"
          style={{ left: '15px', width: 'calc(var(--label-w, 40px))' }}
        />

        {children}
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className={`card grid w-[min(100%,1150px)] grid-cols-1 gap-3 rounded-app p-4 md:grid-cols-[1.5fr,1fr,1fr,1fr,auto] ${className}`}
    >
      <h3 className="col-span-full text-xl font-semibold">Find stays</h3>
      <Field id="where" label="Where">
        <input
          id="where"
          className="input h-11 rounded-app"
          placeholder="Santorini, Greece"
          value={where}
          onChange={(e) => setWhere(e.target.value)}
        />
      </Field>

      <Field id="from" label="Check-in">
        <input
          id="from"
          type="date"
          className="input h-11 rounded-app placeholder:text-ink/50"
          placeholder="yyyy-mm-dd"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        />
      </Field>

      <Field id="to" label="Check-out">
        <input
          id="to"
          type="date"
          className="input h-11 rounded-app placeholder:text-ink/50"
          placeholder="yyyy-mm-dd"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
      </Field>

      <Field id="guests" label="Guests">
        <div className="relative rounded-app overflow-hidden">
          <select
            id="guests"
            className="input h-11 w-full pr-10 appearance-none [-webkit-appearance:none]"
            value={String(guests)}
            onChange={(e) => setGuests(Number(e.target.value))}
          >
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n} guest{n > 1 ? 's' : ''}
              </option>
            ))}
          </select>
          <svg
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-60"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.06l3.71-3.83a.75.75 0 1 1 1.08 1.04l-4.25 4.38a.75.75 0 0 1-1.08 0L5.21 8.27a.75.75 0 0 1 .02-1.06z" />
          </svg>
        </div>
      </Field>

      <button
        type="submit"
        className="btn btn-primary h-11 rounded-app px-6 !py-0 !min-h-0 leading-none"
      >
        Search
      </button>
    </form>
  );
}
