'use client'; // add this line

import Link from 'next/link';
import Head from 'next/head'; // add this

type Qs = Record<string, string | number | null | undefined>;

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
  return `${path}?${sp.toString()}`;
}

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

  const disabled = 'pointer-events-none opacity-40';

  return (
    <>
      {/* Inject rel="prev/next" into <head> for SEO */}
      <Head>
        {page > 1 && <link rel="prev" href={prevHref} />}
        {hasNext && <link rel="next" href={nextHref} />}
      </Head>

      <nav
        className={`mt-6 flex items-center justify-center gap-2 ${className}`}
        aria-label="Pagination"
      >
        <Link
          href={prevHref}
          aria-disabled={page <= 1}
          className={`btn ${page <= 1 ? disabled : ''}`}
          rel="prev"
        >
          ‹ Prev
        </Link>

        <span className="px-3 text-sm text-ink/70">
          Page {page}
          {totalPages ? ` of ${totalPages}` : ''}
        </span>

        <Link
          href={nextHref}
          aria-disabled={!hasNext}
          className={`btn ${!hasNext ? disabled : ''}`}
          rel="next"
        >
          Next ›
        </Link>
      </nav>
    </>
  );
}
