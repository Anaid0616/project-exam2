'use client';
import SearchResultCardSkeleton from '@/components/skeletons/SearchResultCardSkeleton';

export default function SearchResultsSkeleton({
  count = 6,
}: {
  count?: number;
}) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <SearchResultCardSkeleton key={i} />
      ))}
    </div>
  );
}
