import VenueGridSkeleton from '@/components/skeletons/VenueGridSkeleton';

export default function LoadingVenues() {
  return (
    <main className="mx-auto max-w-6xl p-6 space-y-4">
      <h1 className="text-2xl font-bold">All venues</h1>
      <VenueGridSkeleton count={12} />
    </main>
  );
}
