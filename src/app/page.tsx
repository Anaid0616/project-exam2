// app/page.tsx
import Image from 'next/image';
import ChipsBar from '@/features/home/components/ChipsBar';
import VenueGrid from '@/components/VenueGrid';

export const revalidate = 0;

type RawSearchParams = {
  page?: string | string[];
  tag?: string | string[];
  q?: string | string[];
  loc?: string | string[];
  [key: string]: string | string[] | undefined;
};

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const sp = await searchParams; //

  const pageStr = Array.isArray(sp.page) ? sp.page[0] : sp.page;
  const tag = Array.isArray(sp.tag) ? sp.tag[0] : sp.tag;
  const q = Array.isArray(sp.q) ? sp.q[0] : sp.q;
  const locRaw = Array.isArray(sp.loc) ? sp.loc.at(-1) : sp.loc;

  const page = Number(pageStr ?? '1') || 1;
  const locOne = locRaw ? locRaw.toLowerCase() : null;

  return (
    <main className="mx-auto max-w-6xl space-y-6">
      {/* Hero */}
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

        {/* Search panel*/}
        <div className="absolute inset-x-0 -bottom-10 z-10 flex justify-center px-4">
          <form className="pointer-events-auto card grid w-[min(100%,1150px)] grid-cols-1 gap-3 rounded-app p-4 md:p-5 md:grid-cols-[1.4fr,1fr,1fr,1fr,auto]">
            <h3 className="col-span-full text-xl font-semibold">Find stays</h3>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-ink/70">
                Where
              </label>
              <input
                className="input"
                placeholder="Santorini, Greece"
                aria-label="Where"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-ink/70">
                Check-in
              </label>
              <input
                type="date"
                className="input"
                placeholder="Add date"
                aria-label="Check-in"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-ink/70">
                Check-out
              </label>
              <input
                type="date"
                className="input"
                placeholder="Add date"
                aria-label="Check-out"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-ink/70">
                Guests
              </label>
              <input
                className="input"
                placeholder="2 guests"
                aria-label="Guests"
              />
            </div>
            <button className="btn btn-primary self-end h-11 px-5">
              Search
            </button>
          </form>
        </div>
      </section>

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
