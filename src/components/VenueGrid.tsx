// src/components/VenueGrid.tsx
import VenueCard from '@/components/VenueCard';
import Pagination from './Pagination';
import { api, API } from '@/lib/api';
import type { VenueListResponse, Venue } from '@/types/venue';

type Props = {
  /** Current (1-based) page index. */
  page: number;
  /** Number of venues per page (default: 12). */
  pageSize?: number;
  /** Optional tag filter passed to the API. */
  tag?: string | null;
  /** Optional free-text query passed to the API. */
  q?: string | null;
  /** Optional location filter (city/country string or array of strings). */
  loc?: string | string[] | null;
  /** Base path used by the Pagination component (default: '/'). */
  path?: string;
  /** Hide venues starting with “Z…” (default: true). */
  hideZzz?: boolean;
  /** Keep only venues that have at least one image (default: true). */
  onlyWithImage?: boolean;
};

/**
 * VenueGrid
 *
 * Server component that:
 * 1) Fetches venues in batches until we have enough to fill the requested page.
 * 2) Applies lightweight client-side filters (hide “zzz”, has image, location match).
 * 3) Renders a responsive grid of `VenueCard`s (without save-heart or manage actions).
 * 4) Improves LCP by marking the *first* card on page 1 as `priority`.
 *
 * Notes:
 * - This component intentionally keeps the network loop minimal: it loads enough
 *   results to fill the current page and one extra item to detect `hasNext`.
 * - Location filtering is substring-based on “city country”.
 */
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
  // We want enough to fill the current page plus one extra to know if there is a next page
  const wantCount = page * pageSize + 1;

  const batch = 100; // API batch size
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

  // Local filter predicate
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

  // Guard to avoid excessive API paging
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

  // Slice current page
  const start = (page - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize);
  const hasNext = filtered.length > start + pageSize;

  const locParam = Array.isArray(loc) ? loc[loc.length - 1] : loc ?? undefined;

  return (
    <>
      <section className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xxl:grid-cols-4">
        {items.map((v, i) => (
          <VenueCard
            key={v.id}
            v={v}
            showSave={false} // no heart in the grid
            showManage={false} // no edit/delete in the grid
            priority={page === 1 && i === 0} // improve LCP on the first visible card
          />
        ))}
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
