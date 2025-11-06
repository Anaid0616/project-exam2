import type { ApiBooking } from '@/features/bookings/api/bookings.api';
import type { BookingLite } from '@/types/booking';
import { toDateOnly, nightsBetween } from '@/lib/date';

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
