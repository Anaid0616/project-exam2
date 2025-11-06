'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

/**
 * Route-level error boundary for `/venues`.
 * Shown when a critical server or render error occurs.
 */
export default function ErrorVenues({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Error in /venues page:', error);
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
          We couldn’t load the venues right now. Please try again in a few
          moments.
        </p>
        <div className="mt-4 flex gap-3">
          <button onClick={() => reset()} className="btn btn-primary">
            Try again
          </button>
          <Link href="/" className="btn btn-white">
            Go home
          </Link>
        </div>
      </div>
    </main>
  );
}
