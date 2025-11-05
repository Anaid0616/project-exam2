'use client';

import * as React from 'react';
import DeleteModal from '@/components/ui/DeleteModal';
import { deleteVenue } from '@/features/venues/api/venues.api';
import { toast } from '@/lib/toast';

type Options = {
  /** Called after a venue is successfully deleted. */
  onDeleted?: (id: string) => void;
  /** Texts (optional overrides) */
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
};

export function useDeleteVenue(opts: Options = {}) {
  const {
    onDeleted,
    title = 'Delete venue?',
    description = 'This action cannot be undone. The venue will be removed from your listings.',
    confirmLabel = 'Delete',
    cancelLabel = 'Cancel',
  } = opts;

  const [pendingId, setPendingId] = React.useState<string | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  /** Call this to open the confirm modal for a specific venue id. */
  const open = React.useCallback((id: string) => setPendingId(id), []);

  /** Close the modal (no action). */
  const close = React.useCallback(() => {
    if (!deleting) setPendingId(null);
  }, [deleting]);

  /** Runs when user confirms deletion. */
  const confirm = React.useCallback(async () => {
    if (!pendingId || deleting) return;
    setDeleting(true);
    try {
      await deleteVenue(pendingId);
      toast.success({
        title: 'Venue deleted',
        description: `Venue ${pendingId.slice(0, 6)}… has been removed.`,
      });
      onDeleted?.(pendingId);
    } catch (err) {
      toast.error({
        title: 'Delete failed',
        description: err instanceof Error ? err.message : 'Unknown error',
      });
    } finally {
      setDeleting(false);
      setPendingId(null);
    }
  }, [pendingId, deleting, onDeleted]);

  /** Render this somewhere once (e.g. at end of the page component). */
  const modal = (
    <DeleteModal
      open={!!pendingId}
      title={title}
      description={description}
      confirmLabel={deleting ? 'Deleting…' : confirmLabel}
      cancelLabel={cancelLabel}
      busy={deleting}
      onClose={close}
      onConfirm={confirm}
    />
  );

  return { openDelete: open, deleteModal: modal, deleting };
}
