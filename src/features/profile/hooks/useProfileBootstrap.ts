'use client';
import * as React from 'react';
import { decodeJwt } from '@/lib/utils';
import { getProfile } from '@/features/profile/api/profile.api';
import type { JwtPayload, Profile } from '@/types/venue';

export type Role = 'customer' | 'manager';

/**
 * Initializes and bootstraps the user's profile state.
 *
 * Responsibilities:
 * - Reads the auth token from `localStorage`
 * - Decodes the JWT to extract basic payload info
 * - Fetches the user's full profile from the API (if logged in)
 * - Determines the user's role (`customer` or `manager`)
 * - Exposes loading state while bootstrapping
 *
 * This hook is typically used by a global UserProvider.
 *
 * @returns {{
 *   payload: JwtPayload | null;
 *   profile: Profile | null;
 *   setProfile: React.Dispatch<React.SetStateAction<Profile | null>>;
 *   role: Role;
 *   loading: boolean;
 * }} Bootstrapped user state.
 */
export function useProfileBootstrap() {
  const [payload, setPayload] = React.useState<JwtPayload | null>(null);
  const [profile, setProfile] = React.useState<Profile | null>(null);
  const [role, setRole] = React.useState<Role>('customer');
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let alive = true;

    (async () => {
      try {
        // Pull token from localStorage
        const t =
          typeof window !== 'undefined' ? localStorage.getItem('token') : null;

        // Decode token → payload
        const p = t ? decodeJwt(t) : null;
        if (!alive) return;
        setPayload(p);

        const name = p?.name;

        // Not logged in
        if (!t || !name) {
          if (!alive) return;
          setRole('customer');
          setLoading(false);
          return;
        }

        // Logged in → fetch profile
        const pData = await getProfile(name);
        if (!alive) return;

        setProfile(pData);
        setRole(pData.venueManager ? 'manager' : 'customer');
      } catch {
        if (!alive) return;
        setRole('customer');
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  return { payload, profile, setProfile, role, loading };
}
