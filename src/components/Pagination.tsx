import Link from 'next/link';

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
}: {
  page: number;
  hasNext: boolean;
  path?: string;
  query?: Qs;
  className?: string;
}) {
  const prevPage = Math.max(1, page - 1);
  const nextPage = page + 1;

  const prevHref = makeHref(path, prevPage, query);
  const nextHref = makeHref(path, nextPage, query);

  const disabled = 'pointer-events-none opacity-40';

  return (
    <nav className={`mt-6 flex items-center justify-center gap-2 ${className}`}>
      <Link
        href={prevHref}
        aria-disabled={page <= 1}
        className={`btn ${page <= 1 ? disabled : ''}`}
      >
        ‹ Prev
      </Link>

      <span className="px-3 text-sm text-ink/70">Page {page}</span>

      <Link
        href={nextHref}
        aria-disabled={!hasNext}
        className={`btn ${!hasNext ? disabled : ''}`}
      >
        Next ›
      </Link>
    </nav>
  );
}
