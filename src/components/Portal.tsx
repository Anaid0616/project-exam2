'use client';
import * as React from 'react';
import { createPortal } from 'react-dom';

/**
 * Portal
 *
 * Renders `children` into `document.body` via a React portal.
 * Used for our **hamburger menu** (overlay to bottom over content).
 * SSR-safe: renders `null` until mounted to avoid touching `document` on the server.
 *
 * Accessibility tips (brief):
 * - Give the overlay `role="dialog"` and `aria-modal="true"`.
 * - Lock body scroll while open; return focus to the toggle on close.
 */
export default function Portal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(children, document.body);
}
