'use client';

import Image from 'next/image';

export default function VenuesHero() {
  return (
    <section className="bleed relative">
      {/* --- Hero image --- */}
      <div className="relative h-[300px] md:h-[380px] shadow-elev">
        <Image
          src="https://images.unsplash.com/photo-1502784444187-359ac186c5bb?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1965"
          alt="luxury hotel venue"
          fill
          className="object-cover pointer-events-none"
          priority
          unoptimized
        />
      </div>
    </section>
  );
}
