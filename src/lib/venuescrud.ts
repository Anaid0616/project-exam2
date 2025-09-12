import { API, authApi } from '@/lib/api';
import type { Venue } from '@/types/venue';

// create venue
export async function createVenue(input: Partial<Venue>) {
  return authApi<Venue>(API.venues, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

// Update venue
export async function updateVenue(id: string, input: Partial<Venue>) {
  return authApi<Venue>(`${API.venues}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(input),
  });
}

// Delete venue
export async function deleteVenue(id: string) {
  return authApi<void>(`${API.venues}/${id}`, { method: 'DELETE' });
}

// Get "my" venues (manager)
export async function getMyVenues(profileName: string) {
  return authApi<Venue[]>(
    `${API.profiles}/${encodeURIComponent(profileName)}/venues`
  );
}
