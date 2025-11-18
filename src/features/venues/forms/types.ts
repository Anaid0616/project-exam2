import type { Venue } from '@/types/venue';
import type { VenueFormValues } from './schema';

/**
 * Builds the initial form values for the venue creation/editing form.
 *
 * Behavior:
 * - When an existing venue is provided, its fields are mapped into a
 *   client-friendly `VenueFormValues` structure.
 * - When no venue is provided, returns clean default values for a new venue.
 * - Ensures that:
 *   - Media is always an array with at least one empty item
 *   - Booleans fall back to `false`
 *   - Undefined rating stays undefined (to differentiate from "0")
 *
 * @param {Venue | undefined} initial - Optional existing venue to populate defaults from.
 * @returns {VenueFormValues} Fully populated form values ready for use with react-hook-form.
 */
export function createDefaultValues(initial?: Venue): VenueFormValues {
  return {
    name: initial?.name ?? '',
    description: initial?.description ?? '',

    media: initial?.media?.length
      ? initial.media.map((m) => ({ url: m.url ?? '', alt: m.alt ?? '' }))
      : [{ url: '', alt: '' }],

    price: initial?.price ?? 0,
    maxGuests: initial?.maxGuests ?? 1,

    city: initial?.location?.city ?? '',
    country: initial?.location?.country ?? '',

    wifi: initial?.meta?.wifi ?? false,
    parking: initial?.meta?.parking ?? false,
    breakfast: initial?.meta?.breakfast ?? false,
    pets: initial?.meta?.pets ?? false,

    // Keep undefined if no rating exists so the form can differentiate
    rating: typeof initial?.rating === 'number' ? initial.rating : undefined,
  };
}
