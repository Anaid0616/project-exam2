'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

const chips = [
  { label: 'All', loc: null },
  { label: 'Greece', loc: 'greece' },
  { label: 'Sweden', loc: 'sweden' },
  { label: 'Norway', loc: 'norway' },
  { label: 'Italy', loc: 'italy' },
  { label: 'Spain', loc: 'spain' },

  { label: 'USA', loc: 'usa' },
  { label: 'Thailand', loc: 'thailand' },
];

function hrefWith(
  pathname: string,
  sp: URLSearchParams,
  patch: Record<string, string | null>
) {
  const next = new URLSearchParams(sp.toString());
  next.set('page', '1'); // reset page at chip-click
  for (const [k, v] of Object.entries(patch)) {
    if (v == null || v === '') next.delete(k);
    else next.set(k, v);
  }
  const qs = next.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}

const toKey = (s?: string | null) => (s ?? '').trim().toLowerCase();

export default function ChipsBar() {
  const pathname = usePathname();
  const sp = useSearchParams();
  const active = toKey(sp.get('loc'));

  return (
    <nav className="mt-3 flex flex-wrap items-center gap-2">
      {chips.map(({ label, loc }) => {
        const key = toKey(loc);
        const isActive = key === active;
        const href = hrefWith(pathname, sp, {
          loc: key || null,
        });

        return (
          <Link
            key={label}
            href={href}
            className={isActive ? 'chip chip-active' : 'chip'}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
