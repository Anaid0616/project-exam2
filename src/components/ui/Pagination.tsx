'use client';

import Link from 'next/link';
import Head from 'next/head';

/**
 * Query string record used to preserve filters while paginating.
 */
type Qs = Record<string, string | number | null | undefined>;

/**
 * makeHref
 *
 * Builds a URL with the desired page number while keeping all existing
 * filter query parameters (e.g. priceMax, ratingMin, guests).
 *
 * @param path - Base pathname (e.g. "/venues")
 * @param page - Page number to navigate to
 * @param query - Optional query params to include in the resulting URL
 * @returns Fully formatted URL string with updated page parameter
 */
function makeHref(path: string, page: number, query?: Qs) {
  const sp = new URLSearchParams();

  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined && v !== null && `${v}`.length > 0) {
        sp.set(k, String(v));
      }
    }
  }

  sp.set('page', String(page));
  return `${path}?${sp.toString()}#search-header`;
}

/**
 * Pagination
 *
 * A complete, SEO-friendly pagination component with support for "prev" and
 * "next" buttons, page count display, and preservation of all active filters.
 *
 * - Adds <link rel="prev/next"> tags in <head> for better SEO crawling.
 * - Automatically disables edges (page 1 and last page).
 * - Hover styles added to improve click affordance.
 *
 * @param page - Current page number
 * @param hasNext - Whether a next page exists
 * @param path - Base pathname (default: "/")
 * @param query - Active query params (filters)
 * @param className - Additional styles for the wrapper
 * @param total - Total number of items for pagination (optional)
 * @param pageSize - Items per page (default: 12)
 */
export default function Pagination({
  page,
  hasNext,
  path = '/',
  query,
  className = '',
  total,
  pageSize = 12,
}: {
  page: number;
  hasNext: boolean;
  path?: string;
  query?: Qs;
  className?: string;
  total?: number;
  pageSize?: number;
}) {
  const prevPage = Math.max(1, page - 1);
  const nextPage = page + 1;

  const totalPages = total ? Math.ceil(total / pageSize) : undefined;

  const prevHref = makeHref(path, prevPage, query);
  const nextHref = makeHref(path, nextPage, query);

  // Disabled button styling
  const disabled = 'pointer-events-none opacity-40';

  return (
    <>
      {/* SEO: prev/next navigation hints */}
      <Head>
        {page > 1 && <link rel="prev" href={prevHref} />}
        {hasNext && <link rel="next" href={nextHref} />}
      </Head>

      <nav
        className={`mt-6 flex items-center justify-center gap-2 ${className}`}
        aria-label="Pagination"
      >
        {/* Prev Button */}
        <Link
          href={prevHref}
          aria-disabled={page <= 1}
          className={`btn hover:bg-aegean/10 transition ${
            page <= 1 ? disabled : ''
          }`}
          rel="prev"
        >
          ‹ Prev
        </Link>

        {/* Current page display */}
        <span className="px-3 text-sm text-ink/70">
          Page {page}
          {totalPages ? ` of ${totalPages}` : ''}
        </span>

        {/* Next Button */}
        <Link
          href={nextHref}
          aria-disabled={!hasNext}
          className={`btn hover:bg-aegean/10 transition ${
            !hasNext ? disabled : ''
          }`}
          rel="next"
        >
          Next ›
        </Link>
      </nav>
    </>
  );
}
