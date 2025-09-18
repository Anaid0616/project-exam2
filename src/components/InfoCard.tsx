'use client';

import Image from 'next/image';
import type { JwtPayload, Profile } from '@/types/venue';
import { Camera } from 'lucide-react';

type Role = 'customer' | 'manager';

export default function InfoCard({
  payload,
  role: roleProp,
  profile,
  coverUrl = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop',
  onEdit,
}: {
  payload: JwtPayload | null;
  role?: Role; // får du från ProfileScreen
  profile?: Profile; // får du från ProfileScreen
  coverUrl?: string;
  onEdit?: () => void;
}) {
  // 1) Roll: prop -> profile -> JWT -> customer
  const role: Role =
    roleProp ??
    (profile?.venueManager
      ? 'manager'
      : payload?.venueManager
      ? 'manager'
      : 'customer');

  // 2) Visa helst data från profilen
  const email = profile?.email ?? payload?.email ?? '—';
  const nameFromEmail =
    email && email.includes('@') ? email.split('@')[0] : 'Traveler';
  const name = profile?.name ?? payload?.name ?? nameFromEmail;

  const bannerUrl = profile?.banner?.url ?? coverUrl;
  const avatarUrl =
    profile?.avatar?.url ??
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=256&q=60&auto=format&fit=crop';
  const bio = profile?.bio ?? '—';

  return (
    <header className="relative">
      {/* Banner */}
      <div className="relative mx-[calc(50%-50vw)] w-screen overflow-hidden">
        <div className="relative h-36 md:h-48">
          <Image
            src={bannerUrl}
            alt="Profile cover"
            fill
            priority
            className="object-cover"
            unoptimized
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/10" />
        </div>
      </div>

      {/* Info-kort */}
      <section className="panel relative mx-auto -mt-10 flex items-start gap-4 md:-mt-14 md:items-center">
        {/* Avatar */}
        <div className="relative shrink-0">
          <Image
            src={avatarUrl}
            alt="Avatar"
            width={80}
            height={80}
            className="rounded-full object-cover ring-4 ring-white"
            unoptimized
          />
          <button
            type="button"
            aria-label="Change avatar"
            className="absolute bottom-0 right-0 grid h-7 w-7 place-items-center rounded-full border border-white bg-ink text-white shadow-md"
            title="Change avatar"
            onClick={onEdit}
          >
            <Camera className="h-4 w-4" />
          </button>
        </div>

        {/* Text */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="truncate text-xl font-bold">{name}</h1>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              {role === 'manager' ? 'Venue Manager' : 'Customer'}
            </span>
          </div>
          <p className="mt-0.5 text-sm text-ink/70">{email}</p>
          <p className="mt-1 text-sm text-ink/70">Bio: {bio}</p>
        </div>

        <div className="md:ml-4">
          <button className="btn btn-ghost" onClick={onEdit} type="button">
            Edit profile
          </button>
        </div>
      </section>
    </header>
  );
}
