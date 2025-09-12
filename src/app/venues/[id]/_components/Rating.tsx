import Image from 'next/image';

export default function Rating({ value = 0 }: { value?: number }) {
  const n = Math.max(0, Math.min(5, Math.round(value ?? 0)));
  return (
    <span className="inline-flex items-center gap-1 align-middle">
      {Array.from({ length: 5 }).map((_, i) => (
        <Image
          key={i}
          src="/logofooter.svg"
          alt=""
          width={25}
          height={25}
          unoptimized
          className={i < n ? 'opacity-100' : 'opacity-30'}
        />
      ))}
      <span className="ml-1 text-xs text-ink/60">
        {Number(value ?? 0).toFixed(1)}
      </span>
    </span>
  );
}
