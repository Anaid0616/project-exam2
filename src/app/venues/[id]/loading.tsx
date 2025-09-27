import VenueDetailSkeleton from '@/components/skeletons/VenueDetailSkeleton';

/**
 * Route-level loading UI for /venues/[id].
 * Renders a skeleton that mirrors the final layout while data is fetched.
 */
export default function Loading() {
  return <VenueDetailSkeleton />;
}
