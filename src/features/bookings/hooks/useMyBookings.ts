'use client';
import * as React from 'react';
import {
  getMyBookings,
  type ApiBooking,
} from '@/features/bookings/api/bookings.api';
import { toBookingLite } from '@/features/bookings/mappers';
import type { BookingLite } from '@/types/booking';

/**
 * Loads all bookings belonging to a given profile name.
 *
 * - Fetches bookings whenever `name` changes.
 * - Returns a lightweight mapped version of each booking.
 * - Manages internal loading state.
 * - Cancels state updates if the component unmounts early.
 *
 * @param {string | undefined} name - Profile name whose bookings should be loaded.
 * @returns {{
 *   rows: BookingLite[];
 *   setRows: React.Dispatch<React.SetStateAction<BookingLite[]>>;
 *   loading: boolean;
 * }} Booking state and loading indicators.
 */
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
