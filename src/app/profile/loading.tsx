// app/profile/loading.tsx
import InfoCardSkeleton from '@/components/skeletons/BioCardSkeleton';

export default function Loading() {
  return (
    <main className="mx-auto max-w-6xl space-y-6 px-2 sm:px-6 pt-0 min-h-[900px]">
      <InfoCardSkeleton />
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-60 rounded-app bg-ink/10 animate-pulse" />
        ))}
      </section>
    </main>
  );
}
