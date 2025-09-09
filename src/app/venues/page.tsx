import VenueGrid from '@/components/VenueGrid';

export default function VenuesPage() {
  return (
    <main className="mx-auto max-w-6xl p-6">
      <h1 className="text-2xl font-bold">All venues</h1>
      <VenueGrid limit={24} />
    </main>
  );
}
