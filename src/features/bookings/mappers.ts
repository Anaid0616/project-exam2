// src/features/bookings/mappers.ts
import type { ApiBooking } from '@/features/bookings/api/bookings.api';
import type { UiBooking } from '@/features/profile/components/CustomerTabContent';
import { nightsBetween } from '@/lib/dates';

export function toUiBooking(b: ApiBooking): UiBooking {
  const from = String(b.dateFrom).slice(0, 10);
  const to = String(b.dateTo).slice(0, 10);
  const name = b.venue?.name ?? 'Venue';
  const image = b.venue?.media?.[0]?.url;
  const price = Number(b.venue?.price ?? 0);
  const nights = nightsBetween(from, to);
  const total = price && nights ? price * nights : 0;

  const city = b.venue?.location?.city ?? '';
  const country = b.venue?.location?.country ?? '';
  const location = [city, country].filter(Boolean).join(', ') || undefined;

  type MaybeGuests = { guests?: number };
  const maybe = b as MaybeGuests;
  const guests = typeof maybe.guests === 'number' ? maybe.guests : undefined;

  return {
    id: b.id,
    venueId: b.venue?.id,
    venueName: name,
    when: `${from}–${to}`,
    total,
    image,
    location,
    guests,
    nights,
  };
}
