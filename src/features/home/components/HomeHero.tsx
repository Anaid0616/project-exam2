'use client';
import Image from 'next/image';

export default function HomeHero() {
  return (
    <section className="relative overflow-hidden shadow-elev">
      <Image
        src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=2000&q=60&auto=format&fit=crop"
        alt=""
        fill
        className="object-cover"
        priority
        unoptimized
      />

      {/* Sökpanel – överlappar nederkanten av hero */}
      <div className="pointer-events-none absolute inset-x-0 -bottom-8 flex justify-center">
        <form className="pointer-events-auto card grid w-[min(100%,900px)] grid-cols-1 gap-3 rounded-app p-4 md:grid-cols-[1.5fr,1fr,1fr,1fr,auto]">
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
