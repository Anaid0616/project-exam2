import type { ApiBooking } from '@/features/bookings/api/bookings.api';
import type { BookingLite } from '@/types/booking';
import { toDateOnly, nightsBetween } from '@/lib/date';

/**
 * Maps a full `ApiBooking` object from the API into a lightweight,
 * UI-friendly `BookingLite` structure.
 *
 * - Converts ISO dates to date-only strings.
 * - Computes number of nights between dates.
 * - Calculates the total price from venue price × nights.
 * - Extracts primary image and location text.
 * - Handles missing venue fields gracefully.
 *
 * @param {ApiBooking} b - Raw booking object returned from the API.
 * @returns {BookingLite} A normalized, simplified booking object for the UI.
 */
export function toBookingLite(b: ApiBooking): BookingLite {
  const from = toDateOnly(b.dateFrom);
  const to = toDateOnly(b.dateTo);
  const nights = nightsBetween(from, to);

  return {
    id: b.id,
    venueId: b.venue?.id,
    venueName: b.venue?.name ?? 'Venue',
    dateFrom: from,
    dateTo: to,
    total: (b.venue?.price ?? 0) * nights,
    image: b.venue?.media?.[0]?.url,
    location:
      [b.venue?.location?.city, b.venue?.location?.country]
        .filter(Boolean)
        .join(', ') || undefined,
    guests: (b as { guests?: number }).guests,
    nights,
  };
}
