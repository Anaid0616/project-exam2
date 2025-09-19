import Image from 'next/image';
import Link from 'next/link';
import { money } from './utils';

// Minimal typ som matchar UiBooking i ProfileScreen
type BookingLite = {
  id: string;
  venueId?: string;
  venueName: string;
  when: string;
  total: number;
  image?: string;
};

export default function BookingCard({ b }: { b: BookingLite }) {
  const fallback =
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=60&auto=format&fit=crop';

  const src = b.image ?? fallback;

  return (
    <article className="card p-3">
      <div className="flex gap-3">
        <div className="relative w-[140px] h-[105px] overflow-hidden rounded-app shrink-0">
          <Image
            src={src}
            alt={b.venueName}
            fill
            className="object-cover"
            sizes="140px"
            unoptimized
          />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold leading-tight">{b.venueName}</h4>
          <p className="text-sm text-ink/70">{b.when}</p>

          <div className="mt-2 flex items-center justify-between">
            <p className="font-medium">{money(b.total)} total</p>

            <div className="flex gap-3">
              <Link
                href={`/profile/bookings/${b.id}`}
                className="text-aegean text-sm hover:underline"
              >
                View booking
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
