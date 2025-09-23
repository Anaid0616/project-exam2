// src/components/VenueCard.tsx
import Image from 'next/image';
import Link from 'next/link';
import { money } from '@/components/utils';
import type { Venue } from '@/types/venue';

export default function VenueCard({
  v,
  showManage,
  onDelete,
}: {
  v: Venue;
  showManage?: boolean;
  onDelete?: (id: string) => void;
}) {
  const img =
    v.media?.[0]?.url ??
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=60&auto=format&fit=crop';

  const loc = v.location
    ? [v.location.city, v.location.country].filter(Boolean).join(', ')
    : '—';

  return (
    <article className="card p-3">
      <Image
        src={img}
        alt={v.media?.[0]?.alt ?? v.name}
        width={800}
        height={450}
        className="mb-2 aspect-[16/9] w-full rounded-app object-cover"
        unoptimized
      />
      <h4 className="font-semibold leading-tight">{v.name}</h4>
      <p className="text-sm text-ink/70">{loc}</p>

      <div className="mt-2 flex items-center justify-between">
        <p className="font-medium">
          {typeof v.price === 'number' ? `${money(v.price)} / night` : '—'}
        </p>
        <Link
          href={`/venues/${v.id}`}
          className="text-aegean text-sm hover:underline"
        >
          View
        </Link>
      </div>

      {showManage && (
        <div className="mt-3 flex items-center justify-end gap-2">
          <Link
            href={`/venues/${v.id}/edit`}
            className="btn btn-outline btn-sm"
          >
            Edit
          </Link>
          <button
            className="btn btn-outline-sunset btn-sm"
            onClick={() => onDelete?.(v.id)}
          >
            Delete
          </button>
        </div>
      )}
    </article>
  );
}
