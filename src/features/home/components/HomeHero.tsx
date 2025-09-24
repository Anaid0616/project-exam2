// features/home/components/HomeHero.tsx
'use client';
import Image from 'next/image';

export default function HomeHero() {
  return (
    <section className="relative z-0 h-[340px] md:h-[420px] shadow-elev">
      <Image
        src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=2000&q=60&auto=format&fit=crop"
        alt=""
        fill
        className="object-cover"
        priority
        unoptimized
      />

      <div className="absolute inset-x-0 -bottom-8 z-[5] flex justify-center px-4">
        <form className="card grid w-[min(100%,900px)] grid-cols-1 gap-3 rounded-app p-4 md:grid-cols-[1.5fr,1fr,1fr,1fr,auto]">
          <h3 className="col-span-full text-xl font-semibold">Find stays</h3>
          <input className="input" placeholder="Where" />
          <input className="input" placeholder="Check-in" />
          <input className="input" placeholder="Check-out" />
          <input className="input" placeholder="Guests" />
          <button className="btn btn-primary">Search</button>
        </form>
      </div>
    </section>
  );
}
