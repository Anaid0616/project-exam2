'use client';

import Link from 'next/link';
import MobileNav from '@/components/MobileNav';
import Image from 'next/image';
import * as React from 'react';
import { Heart } from 'lucide-react';
import { decodeJwt } from '@/components/utils';
import type { JwtPayload, Profile } from '@/types/venue';
import { isVenueManager } from '@/lib/isVenueManager';
import { getProfile } from '@/lib/venuescrud';
import Portal from '@/components/Portal';
import NavLink from '@/components/header/NavLink';
import ProfileMenu from '@/components/header/ProfileMenu';
import { Plus } from 'lucide-react';

/**
 * Returns true if a decoded JWT payload is expired.
 * Relies on the standard `exp` claim (seconds since epoch).
 *
 * @param {JwtPayload | null | undefined} p - Decoded JWT payload.
 * @returns {boolean} Whether the token is expired.
 */
function isExpired(p?: JwtPayload | null): boolean {
  if (!p || typeof p.exp !== 'number') return false;
  return Date.now() / 1000 > p.exp;
}

/**
 * Clears auth token from localStorage and performs a hard navigation
 * to the homepage. A hard reload ensures any in-memory state or caches
 * depending on the token are reset.
 */
function logout() {
  try {
    localStorage.removeItem('token');
  } finally {
    window.location.href = '/';
  }
}

/**
 * Top application header.
 *
 * Responsibilities:
 * - Reads JWT from localStorage on mount, decodes & validates it.
 * - Optionally fetches the user profile (to decide venue manager role).
 * - Renders desktop navigation (register/login or manager actions + saved + profile menu).
 * - Renders mobile actions (saved + hamburger), and the mobile sheet via a Portal.
 * - Applies a translucent background with backdrop blur while sticky on top.
 *
 * Accessibility:
 * - Desktop profile dropdown is an ARIA menu triggered by a button.
 * - MobileNav is rendered in a Portal to avoid clipping/stacking issues and
 *   covers the whole viewport.
 */
export default function Header() {
  /** Decoded JWT payload (null when not authenticated). */
  const [payload, setPayload] = React.useState<JwtPayload | null>(null);
  /** Profile object for additional role checks (may be null if not fetched or unauthenticated). */
  const [profile, setProfile] = React.useState<Profile | null>(null);
  /** Controls visibility of the mobile sheet menu. */
  const [mobileOpen, setMobileOpen] = React.useState(false);

  // Read token, validate expiry, decode payload, and try to fetch profile.
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const p = decodeJwt(token);
    if (isExpired(p)) {
      logout();
      return;
    }
    setPayload(p ?? null);

    (async () => {
      if (!p?.name) return;
      try {
        const prof = await getProfile(p.name);
        setProfile(prof);
      } catch {
        // If profile fetch fails, we can still rely on JWT flags.
      }
    })();
  }, []);

  /** Whether the user is authenticated. */
  const isAuthed = !!payload;
  /** Whether the current user is a venue manager (from profile or JWT flags). */
  const isManager = isVenueManager(profile, payload);

  return (
    <div className="sticky top-0 z-[200] w-full bg-white">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="relative h-[40px] w-[130px]">
            <Image src="/logo.svg" alt="Holidaze" fill priority />
          </div>
          <span className="sr-only">Holidaze</span>
        </Link>

        {/* Desktop nav */}
        {!isAuthed ? (
          <nav className="hidden items-center gap-6 md:flex">
            <NavLink href="/auth/register" size="sm">
              Register
            </NavLink>
            <Link href="/auth/login" className="btn btn-outline">
              Login
            </Link>
          </nav>
        ) : (
          <nav className="hidden items-center gap-3 md:flex md:gap-4">
            {isManager && (
              <NavLink
                href="/venues/create"
                className="flex items-center gap-1"
              >
                <div className="inline-flex items-center gap-1">
                  <Plus className="h-4 w-4 stroke-[2.75]" aria-hidden />
                  <span>Create venue</span>
                </div>
              </NavLink>
            )}

            {/* Saved (desktop) */}
            <Link
              href="/profile?saved=1"
              aria-label="Saved venues"
              title="Saved venues"
              className="inline-flex items-center justify-center px-2 py-1 text-ink/80 hover:text-ink"
            >
              <Heart className="h-5 w-5" />
            </Link>

            {/* Profile dropdown */}
            <ProfileMenu onLogout={logout} />
          </nav>
        )}

        {/* Mobile actions: saved + hamburger */}
        <div className="flex items-center gap-4 md:hidden">
          {isAuthed && (
            <Link
              href="/profile?saved=1"
              aria-label="Saved venues"
              title="Saved venues"
              className="inline-flex items-center justify-center p-2 -m-2 text-ink/80 hover:text-ink"
            >
              <Heart className="h-6 w-6" />
            </Link>
          )}

          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
            className="p-2 -m-2 rounded-full hover:bg-ink/10"
          >
            <svg
              viewBox="0 0 20 20"
              className="h-6 w-6"
              fill="currentColor"
              aria-hidden
            >
              <path d="M3 6.5h14a1 1 0 1 0 0-2H3a1 1 0 1 0 0 2Zm14 3H3a1 1 0 1 0 0 2h14a1 1 0 1 0 0-2Zm0 5H3a1 1 0 1 0 0 2h14a1 1 0 1 0 0-2Z" />
            </svg>
          </button>
        </div>

        {/* Mobile sheet rendered in a Portal (escapes header's layout/stacking) */}
        <Portal>
          <MobileNav
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            isAuthed={isAuthed}
            isManager={isManager}
            onLogout={logout}
          />
        </Portal>
      </div>
    </div>
  );
}
