import type { Venue } from '@/types/venue';

export type MediaField = { url?: string; alt?: string };

export type VenueFormValues = {
  name: string;
  price?: number | null;
  maxGuests?: number | null;
  description?: string;

  media: MediaField[];
  city?: string;
  country?: string;
  wifi?: boolean;
  parking?: boolean;
  breakfast?: boolean;
  pets?: boolean;
};

export function createDefaultValues(initial?: Venue): VenueFormValues {
  if (initial) {
    return {
      name: initial.name,
      price: initial.price,
      maxGuests: initial.maxGuests,
      description: initial.description ?? '',

      media: (initial.media ?? []).length
        ? initial.media.map((m) => ({ url: m.url, alt: m.alt ?? '' }))
        : [{ url: '', alt: '' }],
      city: initial.location?.city || '',
      country: initial.location?.country || '',
      wifi: !!initial.meta?.wifi,
      parking: !!initial.meta?.parking,
      breakfast: !!initial.meta?.breakfast,
      pets: !!initial.meta?.pets,
    };
  }

  // create placeholders shows
  return {
    name: '',
    description: '',

    media: [{ url: '', alt: '' }],
    city: '',
    country: '',
    wifi: false,
    parking: false,
    breakfast: false,
    pets: false,
  };
}
