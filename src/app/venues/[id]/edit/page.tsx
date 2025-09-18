'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { SubmitHandler } from 'react-hook-form';

import VenueForm from '@/app/venues/_components/VenueForm';
import type { VenueFormValues } from '@/features/venues/forms/types';
import { toVenuePayload } from '@/features/venues/forms/mappers';
import { updateVenue } from '@/lib/venuescrud';
import { authApi, API } from '@/lib/api';
import type { Venue } from '@/types/venue';
import { toast } from '@/lib/toast';

export default function EditVenuePage() {
  const router = useRouter();
  const params = useParams();
  const id = String(params?.id); // id is always defined here

  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);

  // Load venue data
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const v = await authApi<Venue>(`${API.venues}/${id}`);
        if (alive) setVenue(v);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Failed to load venue';
        toast.error({ title: 'Load error', description: message });
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  const handleSubmit: SubmitHandler<VenueFormValues> = async (values) => {
    try {
      await updateVenue(id, toVenuePayload(values)); // PUT
      toast.success({ title: 'Changes saved' });
      router.push(`/venues/${id}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unexpected error';
      toast.error({ title: 'Save failed', description: message });
    }
  };

  if (loading) return <main className="p-6">Loading…</main>;
  if (!venue) return <main className="p-6">Not found</main>;

  return (
    <main className="mx-auto max-w-3xl p-6 space-y-4">
      <div className="card p-5">
        <h1 className="my-4 text-center text-xl font-semibold">Edit venue</h1>
        <VenueForm
          initial={venue}
          onSubmit={handleSubmit}
          submitLabel="Save changes"
        />
      </div>
    </main>
  );
}
