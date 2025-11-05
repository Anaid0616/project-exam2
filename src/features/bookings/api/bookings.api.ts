// src/features/bookings/api/bookings.api.ts
import { API, authApi } from '@/lib/api';
import { unwrap } from '@/lib/envelope';
import type { MaybeEnvelope } from '@/types/venue';

export type CreateBookingPayload = {
  dateFrom: string;
  dateTo: string;
  guests: number;
  venueId: string;
};

export async function createBooking(
  input: CreateBookingPayload
): Promise<void> {
  await authApi(API.bookings, {
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
