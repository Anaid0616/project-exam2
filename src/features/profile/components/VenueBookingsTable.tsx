// src/components/VenueBookingsTable.tsx
import type { VenueBooking } from '@/types/booking';
import { money } from '@/lib/utils';

/**
 * Renders a colored status pill for a booking.
 *
 * @param {{ value: VenueBooking['status'] }} props - Booking status value.
 * @returns {JSX.Element} A styled pill representing the status.
 */
function StatusPill({ value }: { value: VenueBooking['status'] }) {
  const map: Record<VenueBooking['status'], string> = {
    Upcoming: 'bg-lagoon/20 text-aegean',
    Pending: 'bg-coral/50 text-black/70',
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

/**
 * Desktop table view for venue bookings.
 *
 * The mobile layout is handled separately by the VenueBookingsPanel component.
 *
 * @param {{
 *   rows: VenueBooking[];
 *   viewBasePath?: string;
 *   onDelete?: (id: string) - void;
 * }} props - Booking rows and view configuration.
 * @returns {JSX.Element} A table listing venue bookings.
 */
export default function VenueBookingsTable({
  rows,
  viewBasePath = '/profile/bookings',
}: {
  /** Rows to render in the table. */
  rows: VenueBooking[];
  /** Base path used for the "View" link in each row. */
  viewBasePath?: string;
  /** Placeholder for a delete handler (not used here). */
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
              <td className="p-3">
                <a
                  href={`${viewBasePath}/${b.id}`}
                  className="inline-flex items-center rounded-app border border-lagoon bg-lagoon px-3 py-1 font-semibold text-black shadow-sm hover:bg-lagoon/90 focus:outline-none focus:ring-2 focus:ring-lagoon/40"
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
