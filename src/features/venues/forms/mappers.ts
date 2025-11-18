// src/features/venues/forms/mappers.ts

import type { NewVenuePayload, VenueFormValues } from './schema';

/**
 * Converts validated venue form values into the API payload format.
 *
 * Responsibilities:
 * - Trims all string fields
 * - Sanitizes media items (ensures URL, trims alt text, enforces max length)
 * - Ensures numbers are properly cast
 * - Normalizes boolean meta flags
 * - Builds a minimal location object (city/country only)
 *
 * Any extraneous or client-only form fields are removed here to ensure
 * the API receives only what it expects.
 *
 * @param {VenueFormValues} values - The raw form values from the venue form.
 * @returns {NewVenuePayload} A clean API-ready venue payload.
 */
export function toVenuePayload(values: VenueFormValues): NewVenuePayload {
  return {
    name: values.name.trim(),
    description: (values.description ?? '').trim(),

    media: (values.media || [])
      .map((m) => ({
        url: String(m.url ?? '').trim(),
        // alt text limited to 80 chars; null if empty after trimming
        alt: (m.alt ?? '').trim().slice(0, 80) || null,
      }))
      .filter((m) => m.url),

    price: Number(values.price),
    maxGuests: Number(values.maxGuests),
    rating:
      typeof values.rating === 'number' && !isNaN(values.rating)
        ? values.rating
        : undefined,

    meta: {
      wifi: !!values.wifi,
      parking: !!values.parking,
      breakfast: !!values.breakfast,
      pets: !!values.pets,
    },

    location: {
      city: values.city?.trim() || null,
      country: values.country?.trim() || null,
      // Reserved for future additions
      address: null,
      zip: null,
      continent: null,
      lat: null,
      lng: null,
    },
  };
}
