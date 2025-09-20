'use client';

import Link from 'next/link';
import * as React from 'react';
import { decodeJwt } from '@/components/utils';
import type { JwtPayload } from '@/types/venue';
import Image from 'next/image';
import { Heart } from 'lucide-react';

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

function ProfileMenu() {
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  return (
    <div className="relative">
      <button
        type="button"
        className="btn btn-ghost"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        My Profile
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 z-20 mt-2 w-48 rounded-2xl border bg-shell p-1 shadow-elev"
          onMouseLeave={() => setOpen(false)}
        >
          <Link
            href="/profile"
            role="menuitem"
            className="block rounded-app px-3 py-2 text-sm hover:bg-sand"
          >
            My Profile
          </Link>
          <Link
            href="/contact"
            role="menuitem"
            className="block rounded-app px-3 py-2 text-sm hover:bg-sand"
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
    <div className="sticky top-0 z-50 bg-white backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative h-[40px] w-[130px]">
            <Image src="/logo.svg" alt="Holidaze" fill priority />
          </div>
          <span className="sr-only">Holidaze</span>
        </Link>

        {!isAuthed ? (
          <nav className="flex items-center gap-2">
            <Link href="/auth/register" className="">
              Register
            </Link>
            <Link href="/auth/login" className="btn btn-primary">
              Login
            </Link>
          </nav>
        ) : (
          <nav className="flex items-center gap-2">
            {/* Only managers */}
            {isManager && (
              <Link href="/venues/create" className="">
                Create venue
              </Link>
            )}

            {/* Only customers */}
            {!isManager && (
              <Link
                href="/profile?saved=1"
                className="inline-flex items-center gap-2 px-3 py-1"
                aria-label="Go to saved venues"
                title="Saved venues"
              >
                <Heart className="h-5 w-5 hover:bg-ink/5" />
              </Link>
            )}

            {/* Everyone (customer + manager) */}
            <ProfileMenu />
          </nav>
        )}
      </div>
    </div>
  );
}
