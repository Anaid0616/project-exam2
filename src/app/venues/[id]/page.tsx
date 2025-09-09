import Image from 'next/image';
import { api, API } from '@/lib/api';
import { type Venue, type VenueResponse, toVenue } from '@/types/venue';

export const revalidate = 0;

export default async function VenueDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // VenueResponse
  const raw = await api<VenueResponse>(`${API.venues}/${id}`);
  const v: Venue = toVenue(raw);

  const img =
    v.media?.[0]?.url ??
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=60&auto=format&fit=crop';

  return (
    <main className="mx-auto max-w-4xl p-6">
      <Image
        src={img}
        alt={v.media?.[0]?.alt ?? v.name}
        width={1200}
        height={675}
        className="mb-4 aspect-[16/9] w-full rounded-2xl object-cover"
        unoptimized
      />
      <h1 className="text-3xl font-bold">{v.name}</h1>
      <p className="mt-2 text-ink/70">{v.description ?? 'No description.'}</p>
      {typeof v.price === 'number' && (
        <p className="mt-4 text-lg font-semibold">€{v.price} / night</p>
      )}
    </main>
  );
}
