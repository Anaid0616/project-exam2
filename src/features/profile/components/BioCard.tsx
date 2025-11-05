'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Pencil } from 'lucide-react';
import type { JwtPayload, Profile } from '@/types/venue';
import { isVenueManager } from '@/lib/isVenueManager';

/**
 * Supported user roles for the profile UI.
 * @typedef {'customer' | 'manager'} Role
 */
type Role = 'customer' | 'manager';

/**
 * InfoCard
 *
 * Renders a user profile header with:
 * - cover/banner image
 * - avatar, name, role, email, bio
 * - action buttons (e.g., Create venue, Edit profile)
 * - optional actions/tabs/content section below
 *
 * Layout behavior:
 * - On small screens, buttons drop under the avatar/name section and are right-aligned.
 * - On `md+`, the layout becomes a row with buttons aligned to the right.
 *
 * Image behavior:
 * - Uses `unoptimized` so external URLs work without whitelisting.
 * - Gracefully accepts custom `coverUrl`, falls back if profile banner is missing.
 */
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
  /**
   * Auth payload for the current user (used as fallback for name/email and for role detection).
   */
  payload: JwtPayload | null;

  /**
   * Force a specific role. If omitted, role is derived from `profile` + `payload` via `isVenueManager`.
   */
  role?: Role;

  /**
   * Profile data to render. If a field is missing, component falls back to `payload` or sensible defaults.
   */
  profile?: Profile;

  /**
   * Fallback banner URL when the profile has no banner set.
   * Defaults to an Unsplash image.
   */
  coverUrl?: string;

  /**
   * Called when the "Edit profile" button is clicked.
   */
  onEdit?: () => void;

  /**
   * Optional content rendered below the divider (e.g., tabs + tab panels).
   */
  children?: React.ReactNode;

  /**
   * Optional right-aligned action area rendered above `children` (e.g., filters, extra buttons).
   */
  actions?: React.ReactNode;

  /**
   * Extra class names applied to the container that wraps `{actions}` and `{children}`.
   */
  childrenClassName?: string;
}) {
  /** Role resolution: explicit `roleProp` wins; otherwise derive from profile+payload. */
  const role: Role =
    roleProp ?? (isVenueManager(profile, payload) ? 'manager' : 'customer');

  /** Email/name resolution with fallbacks. */
  const email = profile?.email ?? payload?.email ?? '—';
  const nameFromEmail =
    email && email.includes('@') ? email.split('@')[0] : 'Traveler';
  const name = profile?.name ?? payload?.name ?? nameFromEmail;

  /** Image & bio fallbacks. */
  const bannerUrl = profile?.banner?.url ?? coverUrl;
  const avatarUrl =
    profile?.avatar?.url ??
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=256&q=60&auto=format&fit=crop';
  const bio = profile?.bio ?? '—';

  return (
    <section aria-labelledby="profile-header" className="relative z-0">
      <h2 id="profile-header" className="sr-only">
        Profile
      </h2>

      {/* Banner */}
      <div className="bleed overflow-hidden">
        <div className="relative z-0 mx-auto h-72 md:h-92 w-full">
          <Image
            src={bannerUrl}
            alt="Profile cover"
            fill
            priority
            unoptimized
            className="object-cover"
            sizes="100vw"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/10" />
        </div>
      </div>

      <article className="panel relative z-[10] mx-auto -mt-8 md:-mt-10 p-3 md:p-4">
        {/* Avatar + text + buttons */}
        <div className="flex flex-col gap-3 md:flex-row md:items-start">
          {/* Avatar + text */}
          <div className="flex items-start gap-2 sm:gap-4">
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
              <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                <h3 className="truncate text-lg sm:text-xl font-bold">
                  {name}
                </h3>
                <span className="chip-role">
                  <span className="chip-dot" aria-hidden="true" />
                  {role === 'manager' ? 'Venue Manager' : 'Customer'}
                </span>
              </div>
              <p className="text-ink/90 text-sm mt-1">{email}</p>
              <p className="text-ink/90"> {bio}</p>
            </div>
          </div>

          {/* Buttons — below on small screens, right-aligned on md+ */}
          <div className="flex gap-2 justify-end pt-1 md:pt-0 md:ml-auto md:self-start">
            {role === 'manager' && (
              <Link
                href="/venues/create"
                className="btn btn-secondary btn-sm text-sm"
              >
                Create venue
              </Link>
            )}
            <button
              className="btn btn-white py-1.5 px-2 text-sm gap-1"
              onClick={onEdit}
              type="button"
            >
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
