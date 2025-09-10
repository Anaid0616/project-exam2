import VenueGrid from '@/components/VenueGrid';
import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl p-6">
      <h1 className="text-2xl font-bold">Popular right now</h1>
      <VenueGrid limit={12} />
    </main>
  );
}
