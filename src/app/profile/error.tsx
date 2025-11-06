'use client';

import { useEffect } from 'react';
import Link from 'next/link';

/**
 * Error boundary for the Profile page.
 *
 * This component appears when an error occurs while loading
 * or rendering the /profile route.
 *
 * UX:
 * - Displays a friendly error message.
 * - Includes a “Try again” button (uses Next.js `reset()` to retry).
 * - Provides a safe link back to the homepage.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Profile page error:', error);
  }, [error]);

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 text-center">
      <h2 className="text-2xl font-semibold text-red-600 mb-3">
        Something went wrong 😞
      </h2>

      <p className="text-ink/70 mb-6">
        We couldn’t load your profile information right now.
        <br />
        Please try again or return to the home page.
      </p>

      <div className="flex justify-center gap-3">
        <button onClick={() => reset()} className="btn btn-primary">
          Try again
        </button>

        <Link href="/" className="btn btn-white">
          Go home
        </Link>
      </div>
    </main>
  );
}
