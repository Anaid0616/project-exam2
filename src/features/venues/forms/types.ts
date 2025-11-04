import type { Venue } from '@/types/venue';
import type { VenueFormValues } from './schema';

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

    rating: typeof initial?.rating === 'number' ? initial.rating : undefined,
  };
}
