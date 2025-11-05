'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { decodeJwt } from '@/lib/utils';
import { deleteVenue } from '@/features/venues/api/venues.api';
import { Pencil, Trash } from 'lucide-react';
import { toast } from '@/lib/toast';
import DeleteModal from '@/components/ui/DeleteModal';

/**
 * OwnerActions
 *
 * Shows Edit and Delete buttons for the venue owner.
 * Uses DeleteModal for confirmation instead of alert().
 */
export default function OwnerActions({
  venueId,
  ownerName,
}: {
  venueId: string;
  ownerName?: string | null;
}) {
  const router = useRouter();
  const [isOwner, setIsOwner] = useState(false);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  // Safe client-side ownership check
  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const me = decodeJwt(token);
      if (me?.name && ownerName && me.name === ownerName) {
        setIsOwner(true);
      }
    } catch {
      setIsOwner(false);
    }
  }, [ownerName]);

  async function handleConfirmDelete() {
    try {
      setBusy(true);
      await deleteVenue(venueId);
      toast.success({ title: 'Venue deleted successfully' });
      setOpen(false);
      router.push('/profile');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to delete venue';
      toast.error({ title: 'Delete failed', description: msg });
    } finally {
      setBusy(false);
    }
  }

  if (!isOwner) return null;

  return (
    <>
      {/* Action buttons */}
      <div className="flex items-center gap-3 mt-3">
        {/* Edit button */}
        <Link
          href={`/venues/${venueId}/edit`}
          className="flex items-center gap-2 rounded-full bg-white/80 hover:bg-white text-ink border border-ink/10 px-3 py-1.5 shadow-sm transition"
          aria-label="Edit venue"
        >
          <Pencil size={20} />
          <span className="hidden sm:inline text-sm font-medium">Edit</span>
        </Link>

        {/* Delete button */}
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-full bg-white/80 hover:bg-white text-sunset border border-sunset/30 px-3 py-1.5 shadow-sm transition"
          aria-label="Delete venue"
        >
          <Trash size={20} />
          <span className="hidden sm:inline text-sm font-medium">Delete</span>
        </button>
      </div>

      {/* Delete confirmation modal */}
      <DeleteModal
        open={open}
        title="Delete venue?"
        description="Are you sure you want to delete this venue? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleConfirmDelete}
        onClose={() => setOpen(false)}
        busy={busy}
      />
    </>
  );
}
