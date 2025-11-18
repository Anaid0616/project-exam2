import type { Profile, JwtPayload } from '@/types/venue';

function toBool(v: unknown): boolean {
  if (typeof v === 'boolean') return v;
  if (typeof v === 'string') return v === 'true' || v === '1';
  if (typeof v === 'number') return v === 1;
  return false;
}

/**
 * Determines whether the user is a venue manager.
 *
 * The manager flag may appear either:
 * - on the `Profile` object (from the API), or
 * - inside the decoded JWT payload.
 *
 * Because different sources may encode the value as boolean, string,
 * or number, this helper normalizes everything via `toBool()`.
 *
 * @param {Profile | null | undefined} profile - The user's full profile object.
 * @param {JwtPayload | null | undefined} payload - Decoded auth token payload.
 * @returns {boolean} `true` if the user is a venue manager in either source.
 */
export function isVenueManager(
  profile?: Profile | null,
  payload?: JwtPayload | null
): boolean {
  return toBool(profile?.venueManager) || toBool(payload?.venueManager);
}
