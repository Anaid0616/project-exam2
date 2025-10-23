// src/components/VenueCard.tsx
import Image from 'next/image';
import Link from 'next/link';
import { money } from '@/components/utils';
import type { Venue } from '@/types/venue';
import SaveButton from '@/components/SaveButton';
import Rating from '@/components/Rating';
import { Pencil, Trash } from 'lucide-react';

/**
 * VenueCard
 *
 * Displays a venue preview with image, name, location, and price.
 * Optionally shows management buttons (edit/delete) for venue managers.
 *
 * @param {object} props
 * @param {Venue} props.v - The venue data object.
 * @param {boolean} [props.showManage] - If true, shows edit/delete overlay icons.
 * @param- Callback fired when delete is clicked.
 * @param {boolean} [props.showSave] - If true, shows a save (favorite) button overlay.
 * @param {boolean} [props.priority] - If true, prioritizes image loading.
 */
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
          className="mb-2 w-full h-[220px] rounded-app object-cover"
          priority={priority}
        />

        {/* --- Overlay buttons --- */}
        {showManage && (
          <div className="absolute top-2 right-2 flex gap-2 z-10">
            <Link
              href={`/venues/${v.id}/edit`}
              aria-label="Edit venue"
              className="bg-white/80 hover:bg-white text-ink rounded-full p-1.5 shadow-sm transition"
            >
              <Pencil size={16} />
            </Link>

            <button
              aria-label="Delete venue"
              onClick={() => onDelete?.(v.id)}
              className="bg-white/80 hover:bg-white text-sunset rounded-full p-1.5 shadow-sm transition"
            >
              <Trash size={16} />
            </button>
          </div>
        )}

        {/* --- Heart overlay for favorites --- */}
        {showSave && (
          <SaveButton
            venueId={String(v.id)}
            variant="overlay"
            tone="white"
            size="md"
            className="absolute right-2 top-2"
          />
        )}
      </div>

      <div className="flex gap-x-2">
        <h3 className="font-semibold leading-tight">{v.name}</h3>
        <Rating
          value={v.rating ?? 0}
          variant="single"
          size="md"
          precision={1}
        />
      </div>

      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 font-regular">
        <p className="text-ink/90">{loc}</p>
        <span className="hidden sm:inline">|</span>
        <span className="text-ink/90">{v.maxGuests ?? 1} guests</span>
      </div>

      <div className="mt-2 flex items-center justify-between">
        <p className="font-medium">
          {typeof v.price === 'number' ? `${money(v.price)} / night` : '—'}
        </p>

        <Link href={`/venues/${v.id}`} className="btn btn-primary">
          View venue
        </Link>
      </div>
    </article>
  );
}
