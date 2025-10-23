// src/lib/venuescrud.ts
import { API, authApi, publicApi } from '@/lib/api';
import type {
  Venue,
  Profile,
  ApiEnvelope,
  MaybeEnvelope,
  VenueWithBookings,
} from '@/types/venue';

/**
 * Type guard to check if a response is wrapped in an envelope.
 * The Noroff API sometimes returns `{ data: ... }` objects instead of raw arrays.
 */
function isEnvelope<T>(res: MaybeEnvelope<T>): res is ApiEnvelope<T> {
  return typeof res === 'object' && res !== null && 'data' in res;
}

/**
 * Unwraps an API response that may or may not be in an envelope.
 * Ensures you always get the core data (not the wrapper).
 */
function unwrap<T>(res: MaybeEnvelope<T>): T {
  return isEnvelope(res) ? res.data : res;
}

/* -------------------------------------------------------------------------- */
/*                              PROFILE ENDPOINTS                             */
/* -------------------------------------------------------------------------- */

/**
 * Fetches a single user profile by name.
 *
 * @param {string} name - The profile name (username)
 * @returns {Promise<Profile>} The user's profile data
 */
export async function getProfile(name: string): Promise<Profile> {
  const res = await authApi<MaybeEnvelope<Profile>>(
    `${API.profiles}/${encodeURIComponent(name)}`
  );
  return unwrap(res);
}

/**
 * Updates a user profile with new data such as bio or avatar.
 *
 * @param {string} profileName - The username of the profile to update
 * @param {UpdateProfilePayload} input - The updated profile fields
 * @returns {Promise<Profile>} The updated profile
 */
export type UpdateProfilePayload = {
  name?: string;
  bio?: string;
  avatar?: { url: string; alt?: string | null } | null;
  banner?: { url: string; alt?: string | null } | null;
};

export async function updateProfile(
  profileName: string,
  input: UpdateProfilePayload
): Promise<Profile> {
  const res = await authApi<MaybeEnvelope<Profile>>(
    `${API.profiles}/${encodeURIComponent(profileName)}`,
    {
      method: 'PUT',
      body: JSON.stringify(input),
    }
  );
  return unwrap(res);
}

/* -------------------------------------------------------------------------- */
/*                               VENUE ENDPOINTS                              */
/* -------------------------------------------------------------------------- */

/**
 * Creates a new venue owned by the current authenticated manager.
 *
 * @param {Partial<Venue>} input - Venue creation payload
 * @returns {Promise<Venue>} The created venue
 */
export async function createVenue(input: Partial<Venue>): Promise<Venue> {
  const res = await authApi<MaybeEnvelope<Venue>>(API.venues, {
    method: 'POST',
    body: JSON.stringify(input),
  });
  return unwrap(res);
}

/**
 * Updates a venue owned by the current manager.
 *
 * @param {string} id - Venue ID
 * @param {Partial<Venue>} input - Fields to update
 * @returns {Promise<Venue>} The updated venue
 */
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

/**
 * Deletes a venue by ID.
 *
 * @param {string} id - The ID of the venue to delete
 */
export async function deleteVenue(id: string): Promise<void> {
  await authApi<void>(`${API.venues}/${id}`, { method: 'DELETE' });
}

/**
 * Fetches all venues owned by a specific user profile.
 *
 * @param {string} profileName - The profile name (username)
 * @returns {Promise<Venue[]>} List of venues owned by the user
 */
export async function getMyVenues(profileName: string): Promise<Venue[]> {
  const res = await authApi<MaybeEnvelope<Venue[]>>(
    `${API.profiles}/${encodeURIComponent(profileName)}/venues`
  );
  return unwrap(res);
}

/**
 * Fetches a single venue by ID.
 *
 * @param {string} id - Venue ID
 * @returns {Promise<Venue>} The venue data
 */
export async function getVenue(id: string): Promise<Venue> {
  const res = await publicApi<MaybeEnvelope<Venue>>(`${API.venues}/${id}`);
  return unwrap(res);
}

/**
 * Creates a new booking for a venue.
 *
 * @param {CreateBookingPayload} input - Booking request data
 * @returns {Promise<void>} Resolves when booking is created
 */
export type CreateBookingPayload = {
  dateFrom: string; // ISO date (YYYY-MM-DD)
  dateTo: string; // ISO date (YYYY-MM-DD)
  guests: number;
  venueId: string;
};

export async function createBooking(
  input: CreateBookingPayload
): Promise<void> {
  await authApi(`${API.bookings}`, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

/**
 * Fetches all bookings for the current user's profile.
 *
 * @param {string} profileName - The username
 * @returns {Promise<ApiBooking[]>} List of bookings with linked venues
 */
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

export async function getMyBookings(
  profileName: string
): Promise<ApiBooking[]> {
  const res = await authApi<MaybeEnvelope<ApiBooking[]>>(
    `${API.profiles}/${encodeURIComponent(profileName)}/bookings?_venue=true`
  );
  return unwrap(res) ?? [];
}

/**
 * Fetches a single booking by ID, including its venue details.
 *
 * @param {string} id - Booking ID
 * @returns {Promise<ApiBooking>} The booking data
 */
export async function getBooking(id: string): Promise<ApiBooking> {
  const res = await authApi<MaybeEnvelope<ApiBooking>>(
    `${API.bookings}/${id}?_venue=true`
  );
  return unwrap(res);
}

/**
 * Fetches a single venue along with all its bookings and owner info.
 *
 * @param {string} id - Venue ID
 * @returns {Promise<VenueWithBookings>} The venue and its bookings
 */
export async function getVenueWithBookings(
  id: string
): Promise<VenueWithBookings> {
  const res = await authApi<MaybeEnvelope<VenueWithBookings>>(
    `${API.venues}/${id}?_bookings=true&_owner=true`
  );
  return unwrap(res);
}

/**
 * Searches venues by name or description.
 *
 * @param {string} q - Search query
 * @param {{ bookings?: boolean; limit?: number }} [opts] - Extra search options
 * @returns {Promise<Venue[] | VenueWithBookings[]>} Matching venues
 */
export async function searchVenues(
  q: string,
  opts?: { bookings?: boolean; limit?: number }
): Promise<Venue[] | VenueWithBookings[]> {
  const withBookings = opts?.bookings ? '&_bookings=true' : '';
  const limit = opts?.limit ? `&limit=${opts.limit}` : '';
  const url = `${API.venues}/search?q=${encodeURIComponent(
    q
  )}${withBookings}${limit}`;

  const res = await publicApi<MaybeEnvelope<Venue[] | VenueWithBookings[]>>(
    url
  );
  return unwrap(res) ?? [];
}

/**
 * Fetches a list of venues with their associated bookings.
 *
 * @param {number} [limit=120] - Maximum number of venues to return
 * @returns {Promise<VenueWithBookings[]>} List of venues with bookings
 */
export async function listVenuesWithBookings(
  limit = 120
): Promise<VenueWithBookings[]> {
  const res = await authApi<{ data: VenueWithBookings[] }>(
    `${API.venues}?_bookings=true&limit=${limit}`
  ).catch(() =>
    authApi<VenueWithBookings[]>(`${API.venues}?_bookings=true&limit=${limit}`)
  );

  return Array.isArray(res) ? (res as VenueWithBookings[]) : res?.data ?? [];
}
