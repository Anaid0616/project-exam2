import Link from 'next/link';
import Image from 'next/image';
import Pagination from './pagination';
import { api, API } from '@/lib/api';
import type { VenueListResponse } from '@/types/venue';

export default async function VenueGrid({
  page,
  pageSize = 12,
  tag,
  q,
  path = '/',
}: {
  page: number;
  pageSize?: number;
  tag?: string | null;
  q?: string | null;
  path?: string;
}) {
  const offset = (page - 1) * pageSize;

  const limit = pageSize + 1;

  const params = new URLSearchParams();
  params.set('limit', String(limit));
  params.set('offset', String(offset));
  if (tag) params.set('tag', tag);
  if (q) params.set('q', q);

  const { data } = await api<VenueListResponse>(`${API.venues}?${params}`);
  const items = data.slice(0, pageSize);
  const hasNext = data.length > pageSize;

  return (
    <>
      <section className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((v) => {
          const img =
            v.media?.[0]?.url ??
            'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=60&auto=format&fit=crop';
          const loc = [v.location?.city, v.location?.country]
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
                height={675}
                className="mb-3 aspect-[16/9] w-full rounded-app object-cover"
                unoptimized
              />
              <h3 className="font-semibold leading-tight">{v.name}</h3>
              {loc && <p className="mt-1 text-sm text-ink/70">{loc}</p>}
              <div className="mt-2 flex items-center justify-between">
                {typeof v.price === 'number' && (
                  <p className="font-medium">€{v.price} / night</p>
                )}
                <Link
                  href={`/venues/${v.id}`}
                  className="text-aegean text-sm font-medium hover:underline"
                >
                  View venue
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
        query={{ tag: tag ?? undefined, q: q ?? undefined }}
      />
    </>
  );
}
