// src/types/venue.ts
import type { BookedLite } from './booking';

/* --- Types --- */
export type Media = {
  url: string;
  alt?: string | null;
};

export type Meta = {
  wifi?: boolean;
  parking?: boolean;
  breakfast?: boolean;
  pets?: boolean;
};

export type Location = {
  city?: string | null;
  country?: string | null;
  zip?: string | null;
};

export type Owner = {
  name?: string | null;
  email?: string | null;
};

export type Venue = {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  maxGuests: number;
  media: Media[];
  meta: Meta;
  location?: Location;
  rating?: number;
  owner?: Owner;

  created?: string;
  updated?: string;
};

export type JwtPayload = {
  email?: string;
  name?: string;
  venueManager?: boolean;
  [k: string]: unknown;
};

export type Profile = {
  name: string;
  email: string;
  bio?: string | null;
  avatar?: Media | null;
  banner?: Media | null;
  venueManager: boolean;
};

export type ApiEnvelope<T> = { data: T; meta?: unknown };
export type MaybeEnvelope<T> = T | ApiEnvelope<T>;

/**
 * A Venue object extended with an optional array of booked date ranges.
 * Used for availability checks and calendar blocking.
 */
export type VenueWithBookings = Venue & {
  bookings?: BookedLite[];
};

/* --- API --- */
export type VenueListResponse = { data: Venue[] };
export type VenueResponse = Venue | { data: Venue };

/* --- Helper --- */
export function toVenue(input: VenueResponse): Venue {
  return 'data' in input ? input.data : input;
}
