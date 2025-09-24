import type { Profile, JwtPayload } from '@/types/venue';

function toBool(v: unknown): boolean {
  if (typeof v === 'boolean') return v;
  if (typeof v === 'string') return v === 'true' || v === '1';
  if (typeof v === 'number') return v === 1;
  return false;
}

/** flag */
export function isVenueManager(
  profile?: Profile | null,
  payload?: JwtPayload | null
): boolean {
  return toBool(profile?.venueManager) || toBool(payload?.venueManager);
}
