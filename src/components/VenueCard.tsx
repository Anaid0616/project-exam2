// src/components/VenueCard.tsx
import Image from 'next/image';
import Link from 'next/link';
import { money } from '@/components/utils';
import type { Venue } from '@/types/venue';
import SaveButton from '@/components/SaveButton';

export default function VenueCard({
  v,
  showManage,
  onDelete,
  showSave = false,
  priority = false,
}: {
  v: Venue;
  showManage?: boolean;
  onDelete?: (id: string) => void;
  showSave?: boolean;
  priority?: boolean;
}) {
  const img =
    v.media?.[0]?.url ??
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=60&auto=format&fit=crop';

  const loc = v.location
    ? [v.location.city, v.location.country].filter(Boolean).join(', ')
    : '—';

  return (
    <article className="card p-3">
      <div className="relative">
        <Image
          src={img}
          alt={v.media?.[0]?.alt ?? v.name}
          width={800}
          height={450}
          className="mb-2 aspect-[16/9] w-full rounded-app object-cover"
          priority={priority}
        />

        {/* heart overlay only i saved */}
        {showSave && (
          <div className="absolute right-2 top-2">
            <SaveButton
              venueId={String(v.id)}
              variant="overlay"
              tone="ink"
              size="md"
            />
          </div>
        )}
      </div>

      <h4 className="font-semibold leading-tight">{v.name}</h4>

      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink/70">
        <p className="text-sm text-ink/70">{loc}</p>
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
        <p className="font-medium">
          {typeof v.price === 'number' ? `${money(v.price)} / night` : '—'}
        </p>

        <Link
          href={`/venues/${v.id}`}
          className="group inline-flex items-center gap-1 text-aegean text-sm font-medium hover:underline"
        >
          <span className="leading-none">View venue</span>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="h-4 w-4 flex-none transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          >
            <path
              d="M8 5l8 7-8 7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
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
