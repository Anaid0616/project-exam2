// src/features/bookings/api/bookings.api.ts
import { API, authApi } from '@/lib/api';
import { unwrap } from '@/lib/envelope';
import type { MaybeEnvelope } from '@/types/venue';

/**
 * Payload for creating a new booking.
 *
 * @property {string} dateFrom - ISO start date of the booking.
 * @property {string} dateTo - ISO end date of the booking.
 * @property {number} guests - Number of guests included in the booking.
 * @property {string} venueId - ID of the venue being booked.
 */
export type CreateBookingPayload = {
  dateFrom: string;
  dateTo: string;
  guests: number;
  venueId: string;
};

/**
 * Sends a POST request to create a new booking.
 *
 * @param {CreateBookingPayload} input - Booking data to submit.
 * @returns {Promise<void>} Resolves when the request completes.
 */
export async function createBooking(
  input: CreateBookingPayload
): Promise<void> {
  await authApi(API.bookings, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

/**
 * Booking entity returned by the Holidaze API.
 *
 * @property {string} id - Unique booking ID.
 * @property {string} dateFrom - ISO start date.
 * @property {string} dateTo - ISO end date.
 * @property {number} guests - Number of guests.
 * @property {object|null} [venue] - Optional venue summary included with `_venue=true`.
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

/**
 * Fetches all bookings that belong to a given profile.
 *
 * @param {string} profileName - The profile name to fetch bookings for.
 * @returns {Promise<ApiBooking[]>} A list of bookings (empty if none).
 */
export async function getMyBookings(
  profileName: string
): Promise<ApiBooking[]> {
  const res = await authApi<MaybeEnvelope<ApiBooking[]>>(
    `${API.profiles}/${encodeURIComponent(profileName)}/bookings?_venue=true`
  );
  return unwrap(res) ?? [];
}

/**
 * Fetches a single booking by ID.
 *
 * @param {string} id - Booking ID.
 * @returns {Promise<ApiBooking>} The booking data.
 */
export async function getBooking(id: string): Promise<ApiBooking> {
  const res = await authApi<MaybeEnvelope<ApiBooking>>(
    `${API.bookings}/${id}?_venue=true`
  );
  return unwrap(res);
}
