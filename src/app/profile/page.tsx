import { Suspense } from 'react';
import ProfileScreen from '@/features/profile/components/ProfileScreen';

export default function Page() {
  return (
    <Suspense fallback={<main className="p-6">Loading…</main>}>
      <ProfileScreen />
    </Suspense>
  );
}
