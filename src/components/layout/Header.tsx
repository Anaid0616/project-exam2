'use client';

import Link from 'next/link';
import MobileNav from '@/components/header/MobileNav';
import Image from 'next/image';
import * as React from 'react';
import { Heart, Plus } from 'lucide-react';
import { decodeJwt } from '@/lib/utils';
import type { JwtPayload, Profile } from '@/types/venue';
import { isVenueManager } from '@/lib/isVenueManager';
import { getProfile } from '@/features/profile/api/profile.api';
import Portal from '@/components/ui/Portal';
import NavLink from '@/components/header/NavLink';
import ProfileMenu from '@/components/header/ProfileMenu';

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
 * Clears the auth token from localStorage and performs a hard navigation
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
 * Behavior:
 * - Synchronously initializes auth state from localStorage on the client to reduce "flash".
 * - Verifies token on mount (logout if expired) and optionally fetches the user profile.
 * - Renders desktop navigation (register/login OR manager actions + saved + profile menu).
 * - Renders mobile actions (saved + hamburger) and the mobile sheet via a Portal.
 *
 * UX:
 * - While auth status is unknown, renders a neutral skeleton to avoid flashing unauthenticated UI.
 *
 * Accessibility:
 * - Desktop profile dropdown is an ARIA menu triggered by a button.
 * - MobileNav is rendered in a Portal to avoid clipping/stacking issues and covers the viewport.
 */
export default function Header() {
  /**
   * Decoded JWT payload (null when not authenticated).
   * Initialized synchronously from localStorage on the client to minimize "loading" time.
   */

  const [payload, setPayload] = React.useState<JwtPayload | null>(() => {
    if (typeof window === 'undefined') return null; // SSR-safe
    const token = localStorage.getItem('token');
    if (!token) return null;
    const p = decodeJwt(token);
    if (isExpired(p)) return null; // no side effects here
    return p ?? null;
  });

  /** Profile object for additional role checks (may be null if not fetched or unauthenticated). */
  const [profile, setProfile] = React.useState<Profile | null>(null);

  /** Controls visibility of the mobile sheet menu. */
  const [mobileOpen, setMobileOpen] = React.useState(false);

  /**
   * Indicates that the initial auth check has completed (so we can render
   * the correct UI or a skeleton until then).
   */
  const [authReady, setAuthReady] = React.useState(false);

  // Verify token (logout if expired) and fetch profile once on mount.
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setAuthReady(true);
      return;
    }

    const p = decodeJwt(token);
    if (isExpired(p)) {
      logout(); // redirects; no further render needed
      return;
    }

    // If the sync initializer didn't set payload (edge cases), correct it.
    if (!payload && p) setPayload(p);
    setAuthReady(true);

    (async () => {
      if (!p?.name) return;
      try {
        const prof = await getProfile(p.name);
        setProfile(prof);
      } catch {
        // It's fine to continue without a profile; JWT flags may be enough.
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once

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
            <Image
              src="/logo.svg"
              alt="Holidaze logo"
              fill
              sizes="130px"
              priority
              fetchPriority="high"
            />
          </div>
          <span className="sr-only">Holidaze</span>
        </Link>

        {/* Desktop nav */}
        {!authReady ? (
          // Neutral skeleton to avoid flash and layout shift
          <div className="hidden md:flex items-center gap-6">
            <div className="h-9 w-28 rounded-md bg-black/5" aria-hidden />
            <div className="h-9 w-24 rounded-md bg-black/5" aria-hidden />
          </div>
        ) : !isAuthed ? (
          <nav className="hidden items-center gap-6 md:flex">
            <NavLink href="/venues">Venues</NavLink>
            <NavLink href="/auth/register" size="sm">
              Register
            </NavLink>
            <Link href="/auth/login" className="btn btn-primary">
              Login
            </Link>
          </nav>
        ) : (
          <nav className="hidden items-center gap-3 md:flex md:gap-4">
            <NavLink href="/venues">Venues</NavLink>
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
          {authReady && isAuthed && (
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
            isAuthed={authReady && isAuthed}
            isManager={authReady && isManager}
            onLogout={logout}
          />
        </Portal>
      </div>
    </div>
  );
}
