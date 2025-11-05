'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  getBooking,
  type ApiBooking,
} from '@/features/bookings/api/bookings.api';
import BookingDetailsCard from '@/features/bookings/components/BookingDetailsCard';

/**
 * BookingDetailsPage
 *
 * Displays details for a single booking (by ID).
 * Fetches booking data from the API and renders a `BookingDetailsCard`.
 * - Uses `useParams` to extract the booking ID from the route.
 * - Handles loading and error states gracefully.
 *
 * @route /profile/bookings/[id]
 */
export default function BookingDetailsPage() {
  const { id } = useParams<{ id: string }>();

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

  return (
    <main className="mx-auto max-w-3xl p-6 space-y-6">
      <BookingDetailsCard booking={data} />
    </main>
  );
}
