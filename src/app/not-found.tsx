// src/app/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-[60vh] grid place-items-center p-8">
      <div className="max-w-md text-center">
        <p className="text-sm uppercase tracking-widest text-gray-500">Error</p>
        <h1 className="mt-2 text-5xl font-extrabold tracking-tight">
          404 — Page not found
        </h1>
        <p className="mt-4 text-gray-600">
          The page you’re looking for doesn’t exist or may have been moved.
        </p>

        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            href="/"
            className="rounded-app border px-4 py-2 font-medium hover:bg-gray-50"
          >
            Go to homepage
          </Link>
        </div>
      </div>
    </main>
  );
}
