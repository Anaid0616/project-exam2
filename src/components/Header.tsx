'use client';

import Link from 'next/link';
import Image from 'next/image';
import * as React from 'react';
import { Heart } from 'lucide-react';
import { decodeJwt } from '@/components/utils';
import type { JwtPayload } from '@/types/venue';

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
  return (
    <Link
      href={href}
      className={[
        'relative px-2 py-1 text-sm md:text-base text-ink/80 hover:text-ink',
        'after:absolute after:left-0 after:-bottom-0.5 after:h-[3px] after:bg-lagoon after:w-0',
        'hover:after:w-full after:transition-all after:duration-200',
        className,
      ].join(' ')}
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
}: {
  children: React.ReactNode;
  onClick: () => void;
  ariaExpanded?: boolean;
  ariaHaspopup?: 'menu' | 'listbox' | 'dialog' | 'grid' | 'tree';
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={ariaExpanded}
      aria-haspopup={ariaHaspopup}
      className={[
        'relative px-2 py-1 text-base text-ink/80 hover:text-black',
        'after:absolute after:left-0 after:-bottom-0.5 after:h-[3px] after:bg-lagoon after:w-0',
        'hover:after:w-full after:transition-all after:duration-200',
      ].join(' ')}
    >
      {children}
    </button>
  );
}

/* Dropdownen */
function ProfileMenu() {
  const [open, setOpen] = React.useState(false);
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

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const p = decodeJwt(token);
    if (isExpired(p)) {
      logout();
      return;
    }
    setPayload(p ?? null);
  }, []);

  const isAuthed = !!payload;
  const isManager = !!payload?.venueManager;

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
            {/* Manager: Create venue före hjärtat, som länk */}
            {isManager && <NavLink href="/venues/create">Create venue</NavLink>}

            {/* Saved (ikon) */}
            <Link
              href="/profile?saved=1"
              aria-label="Saved venues"
              title="Saved venues"
              className="inline-flex items-center justify-center px-2 py-1 text-ink/80 hover:text-ink"
            >
              <Heart className="h-5 w-5" />
            </Link>

            {/* Profilmeny (knapp som ser ut som länk) */}
            <ProfileMenu />
          </nav>
        )}
      </div>
    </div>
  );
}
