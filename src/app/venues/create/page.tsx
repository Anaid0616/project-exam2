'use client';

import { useRouter } from 'next/navigation';
import VenueForm from '@/app/venues/_components/VenueForm';
import type { VenueFormValues } from '@/features/venues/forms/types';
import { createVenue } from '@/lib/venuescrud';

export default function NewVenuePage() {
  const router = useRouter();

  async function handleSubmit(values: VenueFormValues) {
    const media = (values.media || [])
      .map((m) => ({
        url: (m.url || '').trim(),
        alt: (m.alt || '').trim() || null,
      }))
      .filter((m) => m.url);

    const payload = {
      name: values.name,
      description: values.description || null,
      price: Number(values.price),
      maxGuests: Number(values.maxGuests),
      media,
      location: { city: values.city || null, country: values.country || null },
      meta: {
        wifi: !!values.wifi,
        parking: !!values.parking,
        breakfast: !!values.breakfast,
        pets: !!values.pets,
      },
    };

    const v = await createVenue(payload);
    router.push(`/venues/${v.id}`);
  }

  return (
    <main className="mx-auto max-w-3xl p-6 space-y-4">
      <div className="card p-5">
        <h1 className="text-xl font-semibold my-4 text-center">Create venue</h1>
        <VenueForm onSubmit={handleSubmit} submitLabel="Create venue" />
      </div>
    </main>
  );
}
