'use client';

import * as React from 'react';

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

/**
 * Route-level error boundary for /venues/[id]
 * - Catches render/data errors in this segment only.
 * - Shows a friendly message and a "Try again" button.
 */
export default function VenueError({ error, reset }: Props) {
  React.useEffect(() => {
    console.error('Venue detail error:', error);
  }, [error]);

  return (
    <main className="mx-auto max-w-3xl p-6">
      <div className="card p-5 text-center">
        <h1 className="text-2xl font-semibold">Something went wrong</h1>
        <p className="mt-2 text-ink/70">
          We couldn’t load this venue right now. Please try again.
        </p>

        {/* Helpful details in dev */}
        {process.env.NODE_ENV !== 'production' && (
          <pre className="mt-3 overflow-auto rounded-app bg-ink/5 p-3 text-left text-xs text-ink/80">
            {error.message}
            {error.digest ? `\n\nDigest: ${error.digest}` : ''}
          </pre>
        )}

        <div className="mt-4">
          <button className="btn btn-primary" onClick={() => reset()}>
            Try again
          </button>
        </div>
      </div>
    </main>
  );
}
