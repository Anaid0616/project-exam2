// src/components/VenueBookingsTable.tsx
import type { VenueBooking } from '@/types/venue';
import { money } from './utils';

function StatusPill({ value }: { value: VenueBooking['status'] }) {
  const map: Record<VenueBooking['status'], string> = {
    Upcoming: 'bg-lagoon/10 text-aegean',
    Pending: 'bg-coral/60 text-black/70',
    Completed: 'bg-green-100 text-green-700',
    Canceled: 'bg-sunset-100 text-sunset-600',
  };
  return (
    <span
      className={`rounded-app px-2 py-0.5 text-xs font-medium ${map[value]}`}
    >
      {value}
    </span>
  );
}

export default function VenueBookingsTable({
  rows,
  viewBasePath = '/profile/bookings',
}: {
  rows: VenueBooking[];
  viewBasePath?: string;
  onDelete?: (id: string) => void;
}) {
  return (
    <div className="panel overflow-x-auto p-0">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th className="p-3">Venue</th>
            <th className="p-3">Guest name</th>
            <th className="p-3">Check-in</th>
            <th className="p-3">Check-out</th>
            <th className="p-3">Nights</th>
            <th className="p-3">Guests</th>
            <th className="p-3">Total</th>
            <th className="p-3">Status</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((b) => (
            <tr key={b.id} className="border-b last:border-0">
              <td className="p-3">{b.venueName}</td>
              <td className="p-3">{b.guestName}</td>
              <td className="p-3">
                {new Date(b.checkIn).toLocaleDateString()}
              </td>
              <td className="p-3">
                {new Date(b.checkOut).toLocaleDateString()}
              </td>
              <td className="p-3">{b.nights}</td>
              <td className="p-3">{b.guests}</td>
              <td className="p-3">{money(b.total)}</td>
              <td className="p-3">
                <StatusPill value={b.status} />
              </td>
              <td className="p-3 flex items-center gap-3">
                <a
                  href={`${viewBasePath}/${b.id}`}
                  className="text-aegean hover:underline"
                >
                  View
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
