'use client';

import * as React from 'react';
import {
  getMyVenues,
  getVenueWithBookings,
} from '@/features/venues/api/venues.api';
import type { VenueWithBookings } from '@/types/venue';
import type { VenueBooking } from '@/types/booking';

// --- Types ---
type ApiBookingLike = {
  id?: string | null;
  dateFrom: string; // ISO
  dateTo: string; // ISO
  guests?: number | null;
  customer?: { name?: string | null } | null;
  user?: { name?: string | null } | null;
  status?: VenueBooking['status'] | null;
};

type VenueForBookings = {
  id: string;
  name?: string | null;
  price?: number | null;
  bookings?: ApiBookingLike[] | null;
};

// --- Helpers ---
function nightsBetweenIso(fromIso: string, toIso: string) {
  const a = new Date(fromIso);
  const b = new Date(toIso);
  const d = Math.ceil((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
  return d > 0 ? d : 0;
}
function inferStatus(fromIso: string, toIso: string): VenueBooking['status'] {
  const now = new Date();
  const from = new Date(fromIso);
  const to = new Date(toIso);
  if (now < from) return 'Upcoming';
  if (now > to) return 'Completed';
  return 'Pending';
}

function toRow(v: VenueForBookings, b: ApiBookingLike): VenueBooking {
  const checkIn = String(b.dateFrom).slice(0, 10);
  const checkOut = String(b.dateTo).slice(0, 10);
  const nights = nightsBetweenIso(checkIn, checkOut);
  const price = Number(v.price ?? 0);
  const total = price && nights ? price * nights : 0;

  return {
    id: b.id ?? `${v.id}-${checkIn}`,
    venueName: v.name ?? 'Venue',
    guestName: b.customer?.name ?? b.user?.name ?? '—',
    checkIn,
    checkOut,
    nights,
    guests: Number(b.guests ?? 1),
    total,
    status: b.status ?? inferStatus(checkIn, checkOut),
  };
}

// --- Hook ---
/**
 * useOwnerVenueBookings
 *
 * Fetches all venues owned by a given profile and expands each venue
 * with its bookings, then flattens that into a table-friendly array.
 *
 * Typical use case: a manager’s dashboard “Bookings” tab.
 *
 * @param ownerName - Profile name (username) of the venue owner.
 * @param enabled   - Toggle the effect on/off (default true).
 * @returns { rows, loading, error }  A flat list of booking rows and state flags.
 */
export function useOwnerVenueBookings(ownerName?: string, enabled = true) {
  const [rows, setRows] = React.useState<VenueBooking[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!enabled || !ownerName) return;

    let active = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        // 1) Get my venues
        const venues = await getMyVenues(ownerName);

        // 2) Get details + bookings for venue
        const details = await Promise.all(
          (venues ?? []).map((v) => getVenueWithBookings(v.id))
        );

        // 3) Map to rows
        const mapped: VenueBooking[] = details.flatMap(
          (vd: VenueWithBookings) => {
            // type hack
            const v = vd as unknown as VenueForBookings;
            const list = v.bookings ?? [];
            return list.map((b) => toRow(v, b));
          }
        );

        if (active) setRows(mapped);
      } catch (e) {
        if (active) setError(e instanceof Error ? e.message : 'Failed to load');
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [ownerName, enabled]);

  return { rows, loading, error };
}
