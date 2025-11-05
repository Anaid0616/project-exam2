import { API, authApi } from '@/lib/api';
import { unwrap } from '@/lib/envelope';
import type { Profile, MaybeEnvelope } from '@/types/venue';

/**
 * Fetch a single user profile by username.
 *
 * @param name - The username of the profile to fetch.
 * @returns The profile data.
 */
export async function getProfile(name: string): Promise<Profile> {
  const res = await authApi<MaybeEnvelope<Profile>>(
    `${API.profiles}/${encodeURIComponent(name)}`
  );
  return unwrap(res);
}

/**
 * Payload type for updating a profile.
 */
export type UpdateProfilePayload = {
  name?: string;
  bio?: string;
  avatar?: { url: string; alt?: string | null } | null;
  banner?: { url: string; alt?: string | null } | null;
};

/**
 * Update a user profile with new data.
 *
 * @param profileName - The username of the profile to update.
 * @param input - The new profile data.
 * @returns The updated profile.
 */
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
