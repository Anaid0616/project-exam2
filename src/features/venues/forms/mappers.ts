// src/features/venues/forms/mappers.ts
import type { Venue } from '@/types/venue';
import type { VenueFormValues } from './types';

export function toVenuePayload(v: VenueFormValues): Partial<Venue> {
  const media = (v.media ?? [])
    .map(({ url, alt }) => ({
      url: (url ?? '').trim(),
      alt: (alt ?? '').trim() || undefined,
    }))
    .filter((m) => m.url.length > 0);

  return {
    name: v.name.trim(),
    description: v.description?.trim() || undefined,
    media,
    price: typeof v.price === 'number' ? v.price : undefined,
    maxGuests: typeof v.maxGuests === 'number' ? v.maxGuests : undefined,
    meta: {
      wifi: !!v.wifi,
      parking: !!v.parking,
      breakfast: !!v.breakfast,
      pets: !!v.pets,
    },
    location: {
      city: v.city?.trim() || undefined,
      country: v.country?.trim() || undefined,
    },
  };
}
