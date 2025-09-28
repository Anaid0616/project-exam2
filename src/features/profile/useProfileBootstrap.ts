'use client';
import * as React from 'react';
import { decodeJwt } from '@/components/utils';
import { getProfile } from '@/lib/venuescrud';
import type { JwtPayload, Profile } from '@/types/venue';

export type Role = 'customer' | 'manager';

export function useProfileBootstrap() {
  const [payload, setPayload] = React.useState<JwtPayload | null>(null);
  const [profile, setProfile] = React.useState<Profile | null>(null);
  const [role, setRole] = React.useState<Role>('customer');
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const t =
          typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const p = t ? decodeJwt(t) : null;
        if (!alive) return;
        setPayload(p);

        const name = p?.name;
        if (!t || !name) {
          if (!alive) return;
          setRole('customer');
          setLoading(false);
          return;
        }

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
