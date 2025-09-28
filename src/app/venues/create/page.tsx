'use client';

import { useRouter } from 'next/navigation';
import type { SubmitHandler } from 'react-hook-form';
import VenueForm from '@/app/venues/_components/VenueForm';
import type { VenueFormValues } from '@/features/venues/forms/schema';
import { toVenuePayload } from '@/features/venues/forms/mappers';
import { createVenue } from '@/lib/venuescrud';
import { toast } from '@/lib/toast';

export default function NewVenuePage() {
  const router = useRouter();

  const handleSubmit: SubmitHandler<VenueFormValues> = async (values) => {
    try {
      const payload = toVenuePayload(values);
      console.log('POST payload:', payload);
      const created = await createVenue(payload); // POST
      toast.success({ title: 'Venue created' });
      router.push(`/venues/${created.id}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unexpected error';
      toast.error({ title: 'Save failed', description: message });
    }
  };

  return (
    <main className="mx-auto max-w-3xl p-2 sm:p-6 space-y-4">
      <div className="card p-5">
        <h1 className="my-4 text-center text-xl font-semibold">Create venue</h1>
        <VenueForm onSubmit={handleSubmit} submitLabel="Create venue" />
      </div>
    </main>
  );
}
