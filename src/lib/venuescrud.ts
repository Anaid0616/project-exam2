import { API, authApi } from '@/lib/api';
import type { Venue, Profile, ApiEnvelope, MaybeEnvelope } from '@/types/venue';

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
