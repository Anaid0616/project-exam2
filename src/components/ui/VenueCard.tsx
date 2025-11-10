// src/components/VenueCard.tsx
import Image from 'next/image';
import Link from 'next/link';
import { money } from '@/lib/utils';
import type { Venue } from '@/types/venue';
import SaveButton from '@/components/ui/SaveButton';
import Rating from '@/components/ui/Rating';
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
  const loc = v.location
    ? [v.location.city, v.location.country].filter(Boolean).join(', ')
    : '—';

  const img =
    v.media && v.media[0] && v.media[0].url?.trim()
      ? v.media[0].url
      : '/placeholder.jpg';

  const isPlaceholder = img === '/placeholder.jpg';

  const rawAlt = v.media?.[0]?.alt?.trim();

  const isSuspiciousAlt =
    !rawAlt || /^(image|photo|picture|venue image)$/i.test(rawAlt);

  const imgAlt = isPlaceholder
    ? '' // decorative for placeholder
    : !isSuspiciousAlt
    ? rawAlt!
    : v.name
    ? loc
      ? `${v.name} in ${loc}`
      : v.name
    : 'Holiday rental';

  return (
    <article className="card p-3">
      <div className="relative">
        <Image
          src={img}
          alt={imgAlt}
          aria-hidden={isPlaceholder ? true : undefined}
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

        <Link
          href={`/venues/${v.id}`}
          className="group inline-flex items-center gap-1 font-semibold text-ink hover:text-ink/80 transition-all"
        >
          <span>View venue</span>
          <svg
            className="w-4 h-4 translate-x-0 group-hover:translate-x-1 transition-transform duration-200"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>
    </article>
  );
}
