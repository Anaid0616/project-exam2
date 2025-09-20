'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { decodeJwt } from '@/components/utils';
import { deleteVenue } from '@/lib/venuescrud';

export default function OwnerActions({
  venueId,
  ownerName,
}: {
  venueId: string;
  ownerName?: string | null;
}) {
  const r = useRouter();

  //
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const me = token ? decodeJwt(token) : null;
  const isOwner = !!me?.name && !!ownerName && me.name === ownerName;

  if (!isOwner) return null;

  return (
    <div className="flex gap-2">
      <Link href={`/venues/${venueId}/edit`} className="btn btn-outline">
        Edit
      </Link>
      <button
        className="btn-outline-sunset"
        onClick={async () => {
          if (!confirm('Delete this venue?')) return;
          try {
            await deleteVenue(venueId);
            r.push('/profile');
          } catch (e) {
            alert(e instanceof Error ? e.message : 'Delete failed');
          }
        }}
      >
        Delete
      </button>
    </div>
  );
}
