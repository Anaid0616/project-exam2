'use client';
import * as React from 'react';
import Link from 'next/link';
import { Plus, UserRound, Mail, LogOut } from 'lucide-react';

type Props = {
  open: boolean;
  onClose: () => void;
  isAuthed: boolean;
  isManager: boolean;
  onLogout: () => void;
};

export default function MobileNav({
  open,
  onClose,
  isAuthed,
  isManager,
  onLogout,
}: Props) {
  // close on ESC and outside click on overlay
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className={[
        'fixed inset-0 z-[999]',
        open ? 'pointer-events-auto' : 'pointer-events-none',
      ].join(' ')}
    >
      {/* overlay */}
      <div
        onClick={onClose}
        className={[
          'absolute inset-0 bg-black/30 transition-opacity',
          open ? 'opacity-100' : 'opacity-0',
        ].join(' ')}
      />

      {/* sheet */}
      <aside
        className={[
          'absolute inset-y-0 right-0 h-full w-[min(92vw,360px)]',
          'bg-white shadow-elev flex flex-col',
          'transform transition-transform duration-300',
          open ? 'translate-x-0' : 'translate-x-full',
        ].join(' ')}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
      >
        <div className="h-20 flex items-center justify-between px-4 py-5 border-b bg-white">
          <div className="font-medium">Menu</div>
          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="p-2 -m-2 px-0 rounded-full hover:bg-ink/10"
          >
            <svg
              viewBox="0 0 20 20"
              className="h-9 w-9"
              fill="currentColor"
              aria-hidden
            >
              <path d="M6.22 6.22a.75.75 0 0 1 1.06 0L10 8.94l2.72-2.72a.75.75 0 0 1 1.06 1.06L11.06 10l2.72 2.72a.75.75 0 1 1-1.06 1.06L10 11.06l-2.72 2.72a.75.75 0 1 1-1.06-1.06L8.94 10 6.22 7.28a.75.75 0 0 1 0-1.06Z" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 p-2 bg-white">
          {!isAuthed ? (
            <>
              <Link
                href="/auth/register"
                className="block rounded-app px-3 py-3 hover:bg-sand"
                onClick={onClose}
              >
                Register
              </Link>
              <Link
                href="/auth/login"
                className="block rounded-app px-3 py-3 hover:bg-sand"
                onClick={onClose}
              >
                Login
              </Link>
              <Link
                href="/contact"
                className="block rounded-app px-3 py-3 hover:bg-sand"
                onClick={onClose}
              >
                Contact
              </Link>
            </>
          ) : (
            <>
              {isManager && (
                <Link
                  href="/venues/create"
                  className="block rounded-app px-3 py-3 hover:bg-sand"
                  onClick={onClose}
                >
                  <div className="inline-flex items-center gap-2">
                    <Plus className="h-4 w-4 stroke-[2.50]" aria-hidden />
                    <span>Create venue</span>
                  </div>
                </Link>
              )}

              <Link
                href="/profile"
                className="block rounded-app px-3 py-3 hover:bg-sand"
                onClick={onClose}
              >
                <div className="inline-flex items-center gap-2">
                  <UserRound className="h-5 w-5" aria-hidden />
                  My Profile
                </div>
              </Link>

              <Link
                href="/contact"
                className="block rounded-app px-3 py-3 hover:bg-sand"
                onClick={onClose}
              >
                <div className="inline-flex items-center gap-2">
                  <Mail className="h-5 w-5" aria-hidden />
                  Contact
                </div>
              </Link>

              <button
                type="button"
                className="block w-full text-left rounded-app px-3 py-3 hover:bg-sand"
                onClick={() => {
                  onClose();
                  onLogout();
                }}
              >
                <div className="inline-flex items-center gap-2">
                  <LogOut className="h-5 w-5" aria-hidden />
                  Logout
                </div>
              </button>
            </>
          )}
        </nav>

        <div className="mt-auto" />

        {/* Footer area */}
        <div className="px-4 pb-4 pt-2 border-t text-sm text-ink/70 bg-white">
          © Holidaze
        </div>
      </aside>
    </div>
  );
}
