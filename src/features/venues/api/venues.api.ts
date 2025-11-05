import { API, authApi, publicApi } from '@/lib/api';
import { unwrap } from '@/lib/envelope';
import type { Venue, VenueWithBookings, MaybeEnvelope } from '@/types/venue';

/* -------------------------------------------------------------------------- */
/*                                CRUD Methods                                */
/* -------------------------------------------------------------------------- */

/**
 * Create a new venue owned by the authenticated manager.
 *
 * @param input - Venue creation payload.
 * @returns The created venue.
 */
export async function createVenue(input: Partial<Venue>): Promise<Venue> {
  const res = await authApi<MaybeEnvelope<Venue>>(API.venues, {
    method: 'POST',
    body: JSON.stringify(input),
  });
  return unwrap(res);
}

/**
 * Update an existing venue.
 *
 * @param id - Venue ID.
 * @param input - Updated fields.
 * @returns The updated venue.
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
 * Delete a venue by ID.
 *
 * @param id - The ID of the venue to delete.
 */
export async function deleteVenue(id: string): Promise<void> {
  await authApi<void>(`${API.venues}/${id}`, { method: 'DELETE' });
}

/* -------------------------------------------------------------------------- */
/*                                Query Methods                               */
/* -------------------------------------------------------------------------- */

/**
 * Fetch a single venue by ID.
 *
 * @param id - Venue ID.
 * @returns The venue data.
 */
export async function getVenue(id: string): Promise<Venue> {
  const res = await publicApi<MaybeEnvelope<Venue>>(`${API.venues}/${id}`);
  return unwrap(res);
}

/**
 * Fetch a venue with its bookings and owner data.
 *
 * @param id - Venue ID.
 * @returns Venue with bookings and owner.
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
 * Fetch all venues owned by a specific profile.
 *
 * @param profileName - The username of the owner.
 * @returns Array of venues.
 */
export async function getMyVenues(profileName: string): Promise<Venue[]> {
  const res = await authApi<MaybeEnvelope<Venue[]>>(
    `${API.profiles}/${encodeURIComponent(profileName)}/venues`
  );
  return unwrap(res);
}

/* -------------------------------------------------------------------------- */
/*                            Search & List Methods                           */
/* -------------------------------------------------------------------------- */

/**
 * Search for venues by keyword (in name or description).
 *
 * @param q - Search query string.
 * @param opts - Optional parameters (include bookings, limit results).
 * @returns Matching venues.
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
 * Fetch a list of venues including their bookings.
 *
 * @param limit - Maximum number of venues to fetch.
 * @returns Array of venues with bookings.
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

/**
 * Fetch all venues (paged) including bookings.
 *
 * @param maxItems - Maximum number of venues to fetch in total.
 * @param pageSize - Number of venues per page.
 * @returns All venues (up to maxItems).
 */
export async function listAllVenuesWithBookings(
  maxItems = 1000,
  pageSize = 100
): Promise<VenueWithBookings[]> {
  const all: VenueWithBookings[] = [];
  let page = 1;

  while (all.length < maxItems) {
    const url = `${API.venues}?_bookings=true&limit=${pageSize}&page=${page}`;
    const res = await publicApi<MaybeEnvelope<VenueWithBookings[]>>(url).catch(
      () => authApi<MaybeEnvelope<VenueWithBookings[]>>(url)
    );

    const batch = unwrap(res) ?? [];
    if (!Array.isArray(batch) || batch.length === 0) break;
    all.push(...batch);
    page++;
  }

  return all.slice(0, maxItems);
}
