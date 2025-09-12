import Image from 'next/image';
import ChipsBar from '@/features/home/components/ChipsBar';
import VenueGrid from '@/components/VenueGrid';

export const revalidate = 0;

export default async function HomePage({
  searchParams,
}: {
  //
  searchParams: Promise<{ page?: string; tag?: string; q?: string }>;
}) {
  const { page: p, tag, q } = await searchParams;
  const page = Number(p ?? '1');

  return (
    <main className="mx-auto max-w-6xl space-y-6">
      <section className="relative bleed">
        <div className="relative h-[340px] md:h-[420px]">
          <Image
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=2000&q=60&auto=format&fit=crop"
            alt=""
            fill
            className="object-cover"
            priority
            unoptimized
          />
        </div>

        <div className="absolute inset-x-0 -bottom-8 z-10 flex justify-center px-4">
          <div className="w-full max-w-5xl"></div>
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-semibold">Popular right now</h2>
        <div className="mt-3">
          <ChipsBar />
        </div>

        <VenueGrid page={page} pageSize={12} tag={tag} q={q} path="/" />
      </section>
    </main>
  );
}
