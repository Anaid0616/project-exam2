'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getBooking, type ApiBooking } from '@/lib/venuescrud';

function money(n: number) {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(n);
}

function nightsBetween(a: string, b: string) {
  const A = new Date(a);
  const B = new Date(b);
  const d = Math.ceil((B.getTime() - A.getTime()) / (1000 * 60 * 60 * 24));
  return d > 0 ? d : 0;
}

function fmt(d: string) {
  return new Date(d).toISOString().slice(0, 10); // "YYYY-MM-DD"
}

export default function BookingDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [data, setData] = useState<ApiBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const b = await getBooking(id);
        if (alive) setData(b);
      } catch (e) {
        setErr(e instanceof Error ? e.message : 'Failed to load booking');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  if (loading) return <main className="p-6">Loading…</main>;
  if (err || !data) return <main className="p-6">Could not load booking.</main>;

  const venue = data.venue ?? {};
  const vName = venue.name ?? 'Venue';
  const vId = venue.id;
  const cover =
    venue.media?.[0]?.url ??
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=60&auto=format&fit=crop';

  const nights = nightsBetween(data.dateFrom, data.dateTo);
  const price = Number(venue.price ?? 0);
  const total = price && nights ? price * nights : 0;

  const loc =
    venue.location &&
    [venue.location.city, venue.location.country].filter(Boolean).join(', ');

  return (
    <main className="mx-auto max-w-3xl p-6 space-y-6">
      {/* Header */}
      <div className="card p-4 flex items-center gap-4">
        <Image
          src={cover}
          alt={vName}
          width={120}
          height={80}
          className="rounded-app object-cover aspect-[3/2]"
          unoptimized
        />
        <div className="min-w-0">
          <h1 className="text-lg font-semibold truncate">{vName}</h1>
          {loc && <p className="text-sm text-ink/70">{loc}</p>}
          <p className="text-sm text-ink/70">Booking ref: {data.id}</p>
        </div>
      </div>

      {/* Details */}
      <section className="card p-5 space-y-3">
        <h2 className="font-semibold">Booking details</h2>
        <div className="grid gap-2 text-sm">
          <p>
            Dates: <span className="font-medium">{data.dateFrom}</span> →{' '}
            <span className="font-medium">{data.dateTo}</span> ({nights} night
            {nights !== 1 ? 's' : ''})
          </p>
          <p>Guests: {data.guests}</p>
          <p>
            Price: {price ? `${money(price)} / night` : '—'} · Total:{' '}
            <span className="font-semibold">{total ? money(total) : '—'}</span>
          </p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/profile" className="btn btn-ghost">
            View my bookings
          </Link>
        </div>
      </section>
    </main>
  );
}
