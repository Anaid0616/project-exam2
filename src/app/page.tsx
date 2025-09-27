import { Suspense } from 'react';
import ChipsBar from '@/features/home/components/ChipsBar';
import VenueGrid from '@/components/VenueGrid';
import HomeHero from '@/features/home/components/HomeHero';
import VenueGridSkeleton from '@/components/skeletons/VenueGridSkeleton';
import { one, last, int, type Sp } from '@/lib/url-params';

export const revalidate = 0;

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<Sp>;
}) {
  const sp = await searchParams;

  const pageStr = one(sp.page);
  const tag = one(sp.tag);
  const q = one(sp.q);
  const locRaw = last(sp.loc);

  const page = int(pageStr, 1);
  const locOne = (locRaw ? locRaw.toLowerCase() : null) as string | null;

  return (
    <main className="mx-auto max-w-6xl space-y-6">
      <HomeHero />
      <section>
        <h2 className="text-2xl font-semibold pt-12 md:pt-17">
          Popular right now
        </h2>
        <div className="mt-3">
          <ChipsBar />
        </div>

        <div className="mt-6">
          <Suspense fallback={<VenueGridSkeleton count={12} />}>
            <VenueGrid
              page={page}
              pageSize={12}
              tag={tag ?? undefined}
              q={q ?? undefined}
              loc={locOne}
              path="/"
            />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
