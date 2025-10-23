// src/features/venues/forms/mappers.ts
import type { NewVenuePayload } from './schema';

import type { VenueFormValues } from './schema';

export function toVenuePayload(values: VenueFormValues): NewVenuePayload {
  return {
    name: values.name.trim(),
    description: (values.description ?? '').trim(),
    media: (values.media || [])
      .map((m) => ({
        url: String(m.url ?? '').trim(),
        alt: (m.alt ?? '').trim().slice(0, 80) || null, // curt alt to 80 chars
      }))
      .filter((m) => m.url),
    price: Number(values.price),
    maxGuests: Number(values.maxGuests),
    meta: {
      wifi: !!values.wifi,
      parking: !!values.parking,
      breakfast: !!values.breakfast,
      pets: !!values.pets,
    },
    location: {
      city: values.city?.trim() || null,
      country: values.country?.trim() || null,
      address: null,
      zip: null,
      continent: null,
      lat: null,
      lng: null,
    },
  };
}
