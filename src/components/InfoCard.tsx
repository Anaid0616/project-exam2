'use client';

import Image from 'next/image';
import SegButton from './SegButton';
import type { JwtPayload } from '@/types/venue';

export default function InfoCard({
  payload,
  role,
  setRole,
}: {
  payload: JwtPayload | null;
  role: 'customer' | 'manager';
  setRole: (r: 'customer' | 'manager') => void;
}) {
  return (
    <section className="panel flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
      <Image
        src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=256&q=60&auto=format&fit=crop"
        alt="Avatar"
        width={64}
        height={64}
        className="rounded-full object-cover"
        unoptimized
      />
      <div className="flex-1">
        <h1 className="text-xl font-bold">{payload?.name ?? 'Traveler'}</h1>
        <p className="text-sm text-ink/70">{payload?.email ?? '—'}</p>
        <p className="text-sm mt-1 text-ink/70">Bio: —</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <SegButton
          active={role === 'customer'}
          onClick={() => setRole('customer')}
        >
          Customer
        </SegButton>
        <SegButton
          active={role === 'manager'}
          onClick={() => setRole('manager')}
        >
          Venue Manager
        </SegButton>
        <button className="btn btn-ghost">Edit profile</button>
      </div>
    </section>
  );
}
