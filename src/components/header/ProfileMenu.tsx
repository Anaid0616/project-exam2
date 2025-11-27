'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * Props for {@link ProfileMenu}.
 */
type Props = {
  /**
   * Callback invoked when the "Logout" action is selected.
   * Typically clears auth token and redirects.
   */
  onLogout: () => void;
};

/**
 * Small profile dropdown with links to "My Profile", "Contact" and "Logout".
 * - Toggles on click.
 * - Closes on Escape and outside click.
 * - Applies a selected style when the current route starts with `/profile`.
 *
 * Accessibility:
 * - The trigger is a `button` with `aria-haspopup="menu"` and `aria-expanded`.
 * - The popup uses `role="menu"` and each action has `role="menuitem"`.
 *
 * @example
 * ```tsx
 * <ProfileMenu onLogout={() => logout()} />
 * ```
 */
export default function ProfileMenu({ onLogout }: Props) {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const active = pathname.startsWith('/profile');
  const btnRef = React.useRef<HTMLButtonElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);

  // Close on Escape and outside click
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
      <button
        ref={btnRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        data-active={active || open ? 'true' : undefined}
        className="nav-link-underline text-base font-medium"
        onClick={() => setOpen((v) => !v)}
      >
        My Profile
      </button>

      {open && (
        <div
          ref={menuRef}
          role="menu"
          className="absolute right-0 z-[210] mt-2 w-48 rounded-2xl border bg-white p-1 shadow-elev"
        >
          <Link
            href="/profile"
            role="menuitem"
            className="block rounded-app px-3 py-2 font-medium hover:bg-sand"
            onClick={() => setOpen(false)}
          >
            My Profile
          </Link>

          <Link
            href="/contact"
            role="menuitem"
            className="block rounded-app px-3 py-2 font-medium hover:bg-sand"
            onClick={() => setOpen(false)}
          >
            Contact
          </Link>

          <button
            role="menuitem"
            className="block w-full rounded-app px-3 py-2 text-left font-medium hover:bg-sand"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
