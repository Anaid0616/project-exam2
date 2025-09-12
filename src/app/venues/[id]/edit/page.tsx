'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import VenueForm from '@/components/VenueForm';
import type { VenueFormValues } from '@/features/venues/forms/types';

import { authApi } from '@/lib/api';
import { updateVenue } from '@/lib/venuescrud';
import type { Venue } from '@/types/venue';

export default function EditVenuePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [venue, setVenue] = useState<Venue | null>(null);

  useEffect(() => {
    authApi<Venue>(`/holidaze/venues/${id}`).then(setVenue);
  }, [id]);

  async function handleSubmit(values: VenueFormValues) {
    const tags = (values.tags || '')
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const media = (values.media || [])
      .map((m) => ({
        url: (m.url || '').trim(),
        alt: (m.alt || '').trim() || null,
      }))
      .filter((m) => m.url);

    const payload = {
      name: values.name,
      description: values.description || null,
      ...(tags.length ? { tags } : {}),
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

    await updateVenue(id, payload);
    router.push(`/venues/${id}`);
  }

  if (!venue) return <main className="p-6">Loading…</main>;

  return (
    <main className="mx-auto max-w-3xl p-6 space-y-4">
      <div className="card p-5">
        <h1 className="text-xl font-semibold my-4 text-center">Edit venue</h1>
        <VenueForm
          initial={venue}
          onSubmit={handleSubmit}
          submitLabel="Save changes"
        />
      </div>
    </main>
  );
}
