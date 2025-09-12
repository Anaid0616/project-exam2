import Image from 'next/image';
import Link from 'next/link';
import { money } from './utils';
import type { Booking } from '@/types/venue';

export default function BookingCard({ b }: { b: Booking }) {
  return (
    <article className="card p-3">
      <div className="flex gap-3">
        <Image
          src={
            b.image ??
            'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=60&auto=format&fit=crop'
          }
          alt={b.venueName}
          width={140}
          height={90}
          className="rounded-app object-cover aspect-[4/3]"
          unoptimized
        />
        <div className="flex-1">
          <h4 className="font-semibold leading-tight">{b.venueName}</h4>
          <p className="text-sm text-ink/70">{b.when}</p>
          <div className="mt-2 flex items-center justify-between">
            <p className="font-medium">{money(b.total)} total</p>
            <Link
              href={`/bookings/${b.id}`}
              className="text-aegean text-sm hover:underline"
            >
              View
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
