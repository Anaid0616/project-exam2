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
  const [guests, setGuests] = React.useState<number | ''>('');

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

  return (
    <form
      onSubmit={onSubmit}
      className={`card grid w-[min(100%,900px)] grid-cols-1 gap-3 rounded-app p-4 md:grid-cols-[1.5fr,1fr,1fr,1fr,auto] ${className}`}
    >
      <h3 className="col-span-full text-xl font-semibold">Find stays</h3>

      <input
        className="input"
        placeholder="Where"
        value={where}
        onChange={(e) => setWhere(e.target.value)}
      />

      <input
        className="input"
        type="date"
        placeholder="Check-in"
        value={from}
        onChange={(e) => setFrom(e.target.value)}
      />

      <input
        className="input"
        type="date"
        placeholder="Check-out"
        value={to}
        onChange={(e) => setTo(e.target.value)}
      />

      <input
        className="input"
        type="number"
        min={1}
        placeholder="Guests"
        value={guests}
        onChange={(e) =>
          setGuests(e.target.value ? Number(e.target.value) : '')
        }
      />

      <button className="btn btn-primary" type="submit">
        Search
      </button>
    </form>
  );
}
