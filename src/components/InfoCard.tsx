'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Pencil } from 'lucide-react';
import type { JwtPayload, Profile } from '@/types/venue';

type Role = 'customer' | 'manager';

export default function InfoCard({
  payload,
  role: roleProp,
  profile,
  coverUrl = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop',
  onEdit,
  children,
  actions,
  childrenClassName,
}: {
  payload: JwtPayload | null;
  role?: Role;
  profile?: Profile;
  coverUrl?: string;
  onEdit?: () => void;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  childrenClassName?: string;
}) {
  const role: Role =
    roleProp ??
    (profile?.venueManager
      ? 'manager'
      : payload?.venueManager
      ? 'manager'
      : 'customer');

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
    // YTTRE SEKTION med dold rubrik (bra för a11y)
    <section aria-labelledby="profile-header" className="relative z-0">
      <h2 id="profile-header" className="sr-only">
        Profile
      </h2>

      {/* Banner */}
      <div className="mx-auto w-full px-4 relative z-0">
        <div className="relative z-0 mx-auto h-56 md:h-72 bleed-small overflow-hidden rounded-app">
          <Image
            src={bannerUrl}
            alt="Profile cover"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/10" />
        </div>
      </div>

      {/* KORTET: använd ARTICLE istället för nested section */}
      <article className="panel relative z-[10] mx-auto -mt-10 md:-mt-14 p-3 md:p-4">
        {/* Avatar + text + buttons */}
        <div className="flex items-start gap-4 md:items-start">
          <div className="relative z-[10] h-24 w-20 md:h-28 md:w-24 shrink-0 overflow-hidden rounded-full ring-4 ring-white -translate-y-4 md:-translate-y-10">
            <Image
              src={avatarUrl}
              alt="Avatar"
              fill
              className="object-cover"
              sizes="(min-width: 768px) 128px, 112px"
              unoptimized
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-xl font-bold">{name}</h3>
              <span className="rounded-full bg-primary/10 px-2 text-xs font-medium text-primary">
                {role === 'manager' ? 'Venue Manager' : 'Customer'}
              </span>
            </div>
            <p className="text-ink/70">{email}</p>
            <p className="text-ink/70">Bio: {bio}</p>
          </div>

          {/* Buttons */}
          <div className="ml-auto flex items-center gap-2 self-start md:self-start">
            {role === 'manager' && (
              <Link href="/venues/create" className="btn btn-primary">
                Create venue
              </Link>
            )}
            <button className="btn btn-outline" onClick={onEdit} type="button">
              <Pencil className="h-4 w-4" aria-hidden />
              Edit profile
            </button>
          </div>
        </div>

        {/* Divider + actions + tabs */}
        {(actions || children) && (
          <div
            className={`mt-3 border-t border-ink/10 pt-1 ${
              childrenClassName ?? ''
            }`}
          >
            {actions && <div className="flex justify-end">{actions}</div>}
            {children}
          </div>
        )}
      </article>
    </section>
  );
}
