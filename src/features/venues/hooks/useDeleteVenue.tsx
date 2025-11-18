'use client';

import * as React from 'react';
import DeleteModal from '@/components/ui/DeleteModal';
import { deleteVenue } from '@/features/venues/api/venues.api';
import { toast } from '@/lib/toast';

type Options = {
  /** Callback fired after a venue is successfully deleted. */
  onDeleted?: (id: string) => void;
  /** Optional custom modal title. */
  title?: string;
  /** Optional custom modal description. */
  description?: string;
  /** Optional custom label for the confirm button. */
  confirmLabel?: string;
  /** Optional custom label for the cancel button. */
  cancelLabel?: string;
};

/**
 * Hook that provides a reusable deletion flow for venues.
 *
 * Features:
 * - Opens a confirmation modal before deleting
 * - Tracks loading state while the delete request is running
 * - Fires an optional callback after deletion
 * - Renders a ready-to-use `DeleteModal`
 * - Provides a simple API: `openDelete()`, `deleteModal`, `deleting`
 *
 * Usage:
 * ```tsx
 * const { openDelete, deleteModal } = useDeleteVenue({
 *   onDeleted: (id) => refreshList()
 * });
 *
 * return (
 *   <>
 *     <button onClick={() => openDelete(venue.id)}>Delete</button>
 *     {deleteModal}
 *   </>
 * );
 * ```
 *
 * @param {Options} opts - Optional configuration and text overrides.
 * @returns {{
 *   openDelete: (id: string) - void;
 *   deleteModal: JSX.Element;
 *   deleting: boolean;
 * }} Handlers and rendered modal.
 */
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

  /** Open the confirmation modal for a specific venue ID. */
  const open = React.useCallback((id: string) => setPendingId(id), []);

  /** Close the modal (ignored during an active delete request). */
  const close = React.useCallback(() => {
    if (!deleting) setPendingId(null);
  }, [deleting]);

  /** Execute the delete request once the user confirms. */
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

  /**
   * The modal UI element.
   * Should be rendered once at the root of the page/component using this hook.
   */
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
