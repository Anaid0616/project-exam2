'use client';
import * as React from 'react';
import {
  getMyBookings,
  type ApiBooking,
} from '@/features/bookings/api/bookings.api';
import { toBookingLite } from '@/features/bookings/mappers';
import type { BookingLite } from '@/types/booking';

export function useMyBookings(name?: string) {
  const [rows, setRows] = React.useState<BookingLite[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    let alive = true;
    (async () => {
      if (!name) {
        setRows([]);
        return;
      }
      setLoading(true);
      try {
        const api: ApiBooking[] = await getMyBookings(name);
        if (!alive) return;
        setRows(api.map(toBookingLite));
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [name]);

  return { rows, setRows, loading };
}
