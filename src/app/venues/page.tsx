import VenueGrid from '@/components/VenueGrid';

export const revalidate = 0;

export default async function VenuesPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    tag?: string;
    q?: string;
    loc?: string;
  }>;
}) {
  const { page: p, tag, q, loc } = await searchParams;
  const page = Number(p ?? '1');

  return (
    <main className="mx-auto max-w-6xl p-6 space-y-4">
      <h1 className="text-2xl font-bold">All venues</h1>

      {/* VenueGrid and Pagination */}
      <VenueGrid
        page={page}
        pageSize={24}
        tag={tag ?? null}
        q={q ?? null}
        path="/venues"
      />
    </main>
  );
}
