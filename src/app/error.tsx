'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

/**
 * Error boundary for the Home page (`/`).
 * Rendered when an unhandled error occurs during rendering or data fetching.
 *
 * @param props.error  The thrown error caught by Next.js for this route
 * @param props.reset  Retry function to re-render the route
 */
export default function ErrorHome({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Error on Home page:', error);
  }, [error]);

  return (
    <main className="mx-auto max-w-4xl px-4 py-20 text-center">
      <div className="flex flex-col items-center gap-4">
        <Image
          src="/icon.png"
          alt=""
          width={60}
          height={60}
          className="opacity-70"
        />

        <h1 className="text-2xl font-semibold text-ink">
          Something went wrong
        </h1>

        <p className="text-ink/70 max-w-md">
          We couldn’t load the home content right now. Please try again in a
          moment.
        </p>

        <div className="mt-4 flex gap-3">
          <button
            onClick={() => reset()}
            className="btn btn-primary"
            aria-label="Retry"
          >
            Try again
          </button>
          <Link href="/" className="btn btn-white" aria-label="Go to homepage">
            Go home
          </Link>
        </div>
      </div>
    </main>
  );
}
