'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';

/**
 * Props for {@link NavLink}.
 */
type NavLinkProps = {
  /** Target URL for the link. */
  href: string;
  /** Link content. */
  children: React.ReactNode;
  /** Optional extra classes. */
  className?: string;
  /** Size variant for the underline style. */
  size?: 'sm' | 'md';
};

/**
 * Navigation link with active-state styling.
 * Adds `data-active="true"` when the current pathname matches `href`
 * or starts with `href + '/'`. Uses your `nav-link-underline` classes.
 *
 * @example
 * ```tsx
 * <NavLink href="/auth/register" size="sm">Register</NavLink>
 * ```
 */
export default function NavLink({
  href,
  children,
  className = '',
  size = 'md',
}: NavLinkProps) {
  const pathname = usePathname();

  let active = pathname === href || pathname.startsWith(href + '/');

  // "Venues" NOT active when on /venues/create
  if (href === '/venues' && pathname.startsWith('/venues/create')) {
    active = false;
  }

  const sizeCls = size === 'sm' ? 'nav-link-underline--sm' : '';
  return (
    <Link
      href={href}
      data-active={active ? 'true' : undefined}
      className={`nav-link-underline ${sizeCls} ${className}`}
    >
      {children}
    </Link>
  );
}
