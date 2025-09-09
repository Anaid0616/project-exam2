import VenueGrid from '@/components/VenueGrid';
import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl p-6">
      <nav className="mt-3 flex gap-3 text-sm">
        <Link href="/auth/login" className="btn-ghost">
          Log in
        </Link>
        <Link href="/auth/register" className="btn-ghost">
          Register
        </Link>
      </nav>
      <h1 className="text-2xl font-bold">Popular right now</h1>
      <VenueGrid limit={12} />
    </main>
  );
}
