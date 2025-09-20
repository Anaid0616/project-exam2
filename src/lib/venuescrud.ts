import { API, authApi } from '@/lib/api';
import type {
  Venue,
  Profile,
  ApiEnvelope,
  MaybeEnvelope,
  VenueWithBookings,
} from '@/types/venue';

// Type guard
function isEnvelope<T>(res: MaybeEnvelope<T>): res is ApiEnvelope<T> {
  return typeof res === 'object' && res !== null && 'data' in res;
}
function unwrap<T>(res: MaybeEnvelope<T>): T {
  return isEnvelope(res) ? res.data : res;
}

// Profile
export async function getProfile(name: string): Promise<Profile> {
  const res = await authApi<MaybeEnvelope<Profile>>(
    `${API.profiles}/${encodeURIComponent(name)}`
  );
  return unwrap(res);
}

// Create venue
export async function createVenue(input: Partial<Venue>): Promise<Venue> {
  const res = await authApi<MaybeEnvelope<Venue>>(API.venues, {
    method: 'POST',
    body: JSON.stringify(input),
  });
  return unwrap(res);
}

// Update venue
export async function updateVenue(
  id: string,
  input: Partial<Venue>
): Promise<Venue> {
  const res = await authApi<MaybeEnvelope<Venue>>(`${API.venues}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(input),
  });
  return unwrap(res);
}

export async function deleteVenue(id: string): Promise<void> {
  await authApi<void>(`${API.venues}/${id}`, { method: 'DELETE' });
}

// My venues
export async function getMyVenues(profileName: string): Promise<Venue[]> {
  const res = await authApi<MaybeEnvelope<Venue[]>>(
    `${API.profiles}/${encodeURIComponent(profileName)}/venues`
  );
  return unwrap(res);
}

export async function getVenue(id: string): Promise<Venue> {
  const res = await authApi<MaybeEnvelope<Venue>>(`${API.venues}/${id}`);
  return unwrap(res);
}

export type NewVenuePayload = {
  name: string;
  description: string;
  media: { url: string; alt?: string | null }[];
  price: number;
  maxGuests: number;
  meta: { wifi: boolean; parking: boolean; breakfast: boolean; pets: boolean };
  location: {
    address?: string | null;
    city?: string | null;
    zip?: string | null;
    country?: string | null;
    continent?: string | null;
    lat?: number | null;
    lng?: number | null;
  };
};

// --- Bookings ---
export type CreateBookingPayload = {
  dateFrom: string; // ISO: YYYY-MM-DD
  dateTo: string; // ISO
  guests: number;
  venueId: string;
};

export async function createBooking(input: CreateBookingPayload) {
  return authApi(`${API.bookings}`, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export type ApiBooking = {
  id: string;
  dateFrom: string;
  dateTo: string;
  guests: number;
  venue?: {
    id?: string;
    name?: string | null;
    price?: number | null;
    media?: { url: string; alt?: string | null }[];
    location?: { city?: string | null; country?: string | null } | null;
  } | null;
};

// My bookings
export async function getMyBookings(
  profileName: string
): Promise<ApiBooking[]> {
  const res = await authApi<MaybeEnvelope<ApiBooking[]>>(
    `${API.profiles}/${encodeURIComponent(profileName)}/bookings?_venue=true`
  );
  return unwrap(res) ?? [];
}

export async function getBooking(id: string): Promise<ApiBooking> {
  const res = await authApi<MaybeEnvelope<ApiBooking>>(
    `${API.bookings}/${id}?_venue=true`
  );
  return unwrap(res);
}

export async function getVenueWithBookings(
  id: string
): Promise<VenueWithBookings> {
  const res = await authApi<MaybeEnvelope<VenueWithBookings>>(
    `${API.venues}/${id}?_bookings=true&_owner=true`
  );
  return unwrap(res);
}
