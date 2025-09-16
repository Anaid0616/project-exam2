import Link from 'next/link';
import Image from 'next/image';
import Pagination from '@/components/Pagination';
import { api, API } from '@/lib/api';
import type { VenueListResponse, Venue } from '@/types/venue';

type Props = {
  page: number;
  pageSize?: number;
  tag?: string | null;
  q?: string | null;
  loc?: string | string[] | null;
  path?: string;
  hideZzz?: boolean;
  onlyWithImage?: boolean;
};

export default async function VenueGrid({
  page,
  pageSize = 12,
  tag,
  q,
  loc,
  path = '/',
  hideZzz = true,
  onlyWithImage = true,
}: Props) {
  const wantCount = page * pageSize + 1;

  const batch = 100;
  let apiPage = 1;
  let more = true;

  const filtered: Venue[] = [];
  const seen = new Set<string>();

  const norm = (s: string) => s.trim().toLowerCase();
  const locTerms = Array.isArray(loc)
    ? loc.filter(Boolean).map(norm)
    : loc
    ? [norm(loc)]
    : [];

  const keep = (v: Venue) => {
    if (hideZzz && /^z+/i.test(v.name ?? '')) return false;
    if (onlyWithImage && !v.media?.[0]?.url) return false;

    if (locTerms.length) {
      const place = `${v.location?.city ?? ''} ${
        v.location?.country ?? ''
      }`.toLowerCase();
      if (!locTerms.some((t) => place.includes(t))) return false;
    }

    return true;
  };

  const MAX_PAGES = 200;

  for (
    let guard = 0;
    filtered.length < wantCount && more && guard < MAX_PAGES;
    guard++
  ) {
    const p = new URLSearchParams();
    p.set('limit', String(batch));
    p.set('page', String(apiPage));
    if (tag) p.set('tag', tag);
    if (q) p.set('q', q);

    const { data } = await api<VenueListResponse>(
      `${API.venues}?${p.toString()}`
    );

    if (data.length === 0) {
      more = false;
      break;
    }

    if (data.length < batch) {
      more = false;
    } else {
      apiPage += 1;
    }

    let newSeenThisRound = 0;

    for (const v of data) {
      if (!v?.id) continue;
      if (seen.has(v.id)) continue;

      seen.add(v.id);
      newSeenThisRound++;

      if (keep(v)) {
        filtered.push(v);
        if (filtered.length >= wantCount) break;
      }
    }

    if (newSeenThisRound === 0) {
      more = false;
    }
  }

  const start = (page - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize);
  const hasNext = filtered.length > start + pageSize;

  const locParam = Array.isArray(loc) ? loc[loc.length - 1] : loc ?? undefined;

  return (
    <>
      <section className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((v) => {
          const img =
            v.media?.[0]?.url ??
            'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=60&auto=format&fit=crop';
          const locText = [v.location?.city, v.location?.country]
            .filter(Boolean)
            .join(', ');

          return (
            <article
              key={v.id}
              className="rounded-app bg-shell p-3 shadow-elev border"
            >
              <Image
                src={img}
                alt={v.media?.[0]?.alt ?? v.name}
                width={1200}
                height={700}
                className="mb-3 aspect-[16/9] w-full rounded-app object-cover"
                unoptimized
              />

              <div className="min-w-0">
                <h3
                  className="font-semibold leading-tight truncate"
                  title={v.name}
                >
                  {v.name}
                </h3>
              </div>

              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink/70">
                {locText && <span>{locText}</span>}
                <span className="hidden sm:inline text-ink/30">|</span>
                <span>{v.maxGuests ?? 1} guests</span>
                <span className="hidden sm:inline text-ink/30">|</span>
                <span className="inline-flex items-center gap-1">
                  <Image
                    src="/logofooter.svg"
                    alt=""
                    width={14}
                    height={14}
                    className="opacity-80"
                    unoptimized
                  />
                  {(typeof v.rating === 'number' ? v.rating : 0).toFixed(1)}
                </span>
              </div>

              <div className="mt-2 flex items-center justify-between">
                {typeof v.price === 'number' && (
                  <p className="font-medium">€{v.price} / night</p>
                )}
                <Link
                  href={`/venues/${v.id}`}
                  className="text-aegean text-sm font-medium hover:underline group"
                >
                  <span className="inline-flex items-center gap-1">
                    View venue
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      className="h-4 w-4 -mt-px transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    >
                      <path
                        d="M8 5l8 7-8 7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </Link>
              </div>
            </article>
          );
        })}
      </section>

      <Pagination
        page={page}
        hasNext={hasNext}
        path={path}
        query={{
          tag: tag ?? undefined,
          q: q ?? undefined,
          loc: locParam,
        }}
      />
    </>
  );
}
