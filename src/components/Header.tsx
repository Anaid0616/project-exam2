'use client';

import Link from 'next/link';
import Image from 'next/image';
import * as React from 'react';
import { Heart } from 'lucide-react';
import { decodeJwt } from '@/components/utils';
import type { JwtPayload, Profile } from '@/types/venue';
import { isVenueManager } from '@/lib/isVenueManager';
import { getProfile } from '@/lib/venuescrud';
import { usePathname } from 'next/navigation';

/* ==== helpers ==== */
function isExpired(p?: JwtPayload | null): boolean {
  if (!p || typeof p.exp !== 'number') return false;
  return Date.now() / 1000 > p.exp;
}
function logout() {
  try {
    localStorage.removeItem('token');
  } finally {
    window.location.href = '/';
  }
}

function NavButtonLikeLink({
  href,
  children,
  className = '',
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(href + '/');

  return (
    <Link
      href={href}
      data-active={active ? 'true' : undefined}
      className={`nav-link-underline ${className}`}
    >
      {children}
    </Link>
  );
}

/* Länk med lagoon-underline */
function NavLink({
  href,
  children,
  className = '',
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(href + '/');

  return (
    <Link
      href={href}
      data-active={active ? 'true' : undefined}
      className={`nav-link-underline nav-link-underline--sm ${className}`}
    >
      {children}
    </Link>
  );
}

/* Button my profile and nav links */
function NavButtonLike({
  children,
  onClick,
  ariaExpanded,
  ariaHaspopup,
  isActive = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  ariaExpanded?: boolean;
  ariaHaspopup?: 'menu' | 'listbox' | 'dialog' | 'grid' | 'tree';
  isActive?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={ariaExpanded}
      aria-haspopup={ariaHaspopup}
      data-active={isActive ? 'true' : undefined}
      className={['nav-link-underline', 'text-base'].join(' ')}
    >
      {children}
    </button>
  );
}

/* Dropdownen */
function ProfileMenu() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const active = pathname.startsWith('/profile');
  const btnRef = React.useRef<HTMLButtonElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    const onClick = (e: MouseEvent) => {
      if (!open) return;
      const t = e.target as Node;
      if (!menuRef.current?.contains(t) && !btnRef.current?.contains(t)) {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('mousedown', onClick);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('mousedown', onClick);
    };
  }, [open]);

  return (
    <div className="relative">
      <NavButtonLike
        onClick={() => setOpen((o) => !o)}
        ariaExpanded={open}
        ariaHaspopup="menu"
        isActive={active || open}
      >
        My Profile
      </NavButtonLike>

      {open && (
        <div
          ref={menuRef}
          role="menu"
          className="absolute right-0 z-[210] mt-2 w-48 rounded-2xl border bg-white p-1 shadow-elev"
        >
          <Link
            href="/profile"
            role="menuitem"
            className="block rounded-app px-3 py-2 text-sm hover:bg-sand"
            onClick={() => setOpen(false)}
          >
            My Profile
          </Link>
          <Link
            href="/contact"
            role="menuitem"
            className="block rounded-app px-3 py-2 text-sm hover:bg-sand"
            onClick={() => setOpen(false)}
          >
            Contact
          </Link>
          <button
            role="menuitem"
            onClick={logout}
            className="block w-full rounded-app px-3 py-2 text-left text-sm hover:bg-sand"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

/* ==== Header ==== */
export default function Header() {
  const [payload, setPayload] = React.useState<JwtPayload | null>(null);
  const [profile, setProfile] = React.useState<Profile | null>(null);

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
        // ignorera — vi kan fortfarande använda payload om den har flaggan
      }
    })();
  }, []);

  const isAuthed = !!payload;
  const isManager = isVenueManager(profile, payload);

  return (
    <div className="sticky top-0 z-[200] w-full bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="relative h-[40px] w-[130px]">
            <Image src="/logo.svg" alt="Holidaze" fill priority />
          </div>
          <span className="sr-only">Holidaze</span>
        </Link>

        {/* Right side */}
        {!isAuthed ? (
          <nav className="flex items-center gap-6">
            <NavLink href="/auth/register">Register</NavLink>
            <Link href="/auth/login" className="btn btn-outline">
              Login
            </Link>
          </nav>
        ) : (
          <nav className="flex items-center gap-3 md:gap-4">
            {isManager && (
              <NavButtonLikeLink
                href="/venues/create"
                className="flex items-center gap-1"
              >
                <span className="text-lg leading-none">+</span>
                <span>Create venue</span>
              </NavButtonLikeLink>
            )}

            {/* Saved (ikon) */}
            <Link
              href="/profile?saved=1"
              aria-label="Saved venues"
              title="Saved venues"
              className="inline-flex items-center justify-center px-2 py-1 text-ink/80 hover:text-ink"
            >
              <Heart className="h-5 w-5" />
            </Link>

            {/* profile menu */}
            <ProfileMenu />
          </nav>
        )}
      </div>
    </div>
  );
}
