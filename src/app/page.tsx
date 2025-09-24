// app/page.tsx
import ChipsBar from '@/features/home/components/ChipsBar';
import VenueGrid from '@/components/VenueGrid';
import HomeHero from '@/features/home/components/HomeHero';

export const revalidate = 0;

type RawSearchParams = {
  page?: string | string[];
  tag?: string | string[];
  q?: string | string[];
  loc?: string | string[];
};

export default async function HomePage({
  searchParams,
}: {
  searchParams: RawSearchParams; // <-- inte Promise
}) {
  const sp = searchParams; // <-- ingen await

  const pageStr = Array.isArray(sp.page) ? sp.page[0] : sp.page;
  const tag = Array.isArray(sp.tag) ? sp.tag[0] : sp.tag;
  const q = Array.isArray(sp.q) ? sp.q[0] : sp.q;
  const locRaw = Array.isArray(sp.loc) ? sp.loc.at(-1) : sp.loc;

  const page = Number(pageStr ?? '1') || 1;
  const locOne = locRaw ? locRaw.toLowerCase() : null;

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

        <VenueGrid
          page={page}
          pageSize={12}
          tag={tag ?? undefined}
          q={q ?? undefined}
          loc={locOne}
          path="/"
        />
      </section>
    </main>
  );
}
