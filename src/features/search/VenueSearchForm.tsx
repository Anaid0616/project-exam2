'use client';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import GuestsPicker from '@/components/GuestsPicker';

// Floating label
function Field({
  id,
  label,
  children,
}: React.PropsWithChildren<{ id: string; label: string }>) {
  return (
    <div className="relative">
      <label
        htmlFor={id}
        className="pointer-events-none absolute -top-4 left-3 z-10 px-1
                     text-xs font-medium text-ink/70"
      >
        {label}
      </label>
      {children}
    </div>
  );
}

export default function VenueSearchForm({
  className = '',
}: {
  className?: string;
}) {
  const router = useRouter();
  const [where, setWhere] = React.useState('');
  const [from, setFrom] = React.useState('');
  const [to, setTo] = React.useState('');
  const [guests, setGuests] = React.useState<number | null>(null);

  // --- typeahead-state för "Where" ---
  const [sugs, setSugs] = React.useState<string[]>([]);
  const [open, setOpen] = React.useState(false);
  const [hi, setHi] = React.useState(-1);
  const whereRef = React.useRef<HTMLInputElement>(null);

  //  (debounce 250 ms)
  React.useEffect(() => {
    const q = where.trim();
    if (q.length < 2) {
      setSugs([]);
      setOpen(false);
      setHi(-1);
      return;
    }
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/where?q=${encodeURIComponent(q)}`, {
          signal: ctrl.signal,
        });
        const data = (await res.json()) as string[];
        const qlc = q.toLowerCase();

        // visa inte exakt det som redan står i fältet
        const filtered = data.filter((s) => s.toLowerCase() !== qlc);
        setSugs(filtered);
        setOpen(filtered.length > 0);
        setHi(-1);
      } catch {
        /* ignore abort */
      }
    }, 250);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [where]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (from && to && new Date(from) > new Date(to)) {
      alert('Check-out must be after check-in');
      return;
    }
    const q = new URLSearchParams();
    if (where.trim()) q.set('where', where.trim());
    if (from) q.set('from', from);
    if (to) q.set('to', to);
    if (guests) q.set('guests', String(guests));

    if (guests === null) q.set('guests', '2');
    else q.set('guests', String(guests));
    router.push(`/search?${q.toString()}`);
  }

  return (
    <form
      onSubmit={onSubmit}
      autoComplete="off"
      className={`grid w-[min(100%,1150px)] grid-cols-1 gap-3 p-4
                  md:grid-cols-[1.5fr,1fr,1fr,1fr,auto] ${className}`}
    >
      <h3 className="col-span-full text-xl font-semibold -mt-1 mb-3">
        Find stays
      </h3>

      {/* WHERE + typeahead */}
      <Field id="where" label="Where">
        <div className="relative w-full">
          <input
            id="where"
            ref={whereRef}
            className="input h-11 w-full"
            placeholder="Santorini, Greece"
            value={where}
            onChange={(e) => setWhere(e.target.value)}
            onFocus={() => setOpen(sugs.length > 0)}
            onBlur={() => setTimeout(() => setOpen(false), 80)}
            onKeyDown={(e) => {
              if (!open || sugs.length === 0) return;
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                setHi((p) => (p + 1) % sugs.length);
              }
              if (e.key === 'ArrowUp') {
                e.preventDefault();
                setHi((p) => (p - 1 + sugs.length) % sugs.length);
              }
              if (e.key === 'Enter' && hi >= 0) {
                e.preventDefault();
                setWhere(sugs[hi]);
                setOpen(false);
                setHi(-1);
              }
              if (e.key === 'Escape') {
                setOpen(false);
                setHi(-1);
              }
            }}
          />

          {open && sugs.length > 0 && (
            <ul className="panel absolute left-0 right-0 top-[calc(100%+6px)] z-50 w-full max-h-64 overflow-auto p-1">
              {sugs.map((s, i) => (
                <li key={`${s}-${i}`}>
                  <button
                    type="button"
                    className={`w-full rounded-app px-3 py-2 text-left hover:bg-ink/5 ${
                      i === hi ? 'bg-ink/5' : ''
                    }`}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setWhere(s);
                      setOpen(false);
                      whereRef.current?.focus();
                    }}
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Field>

      <Field id="from" label="Check-in">
        <div className="relative">
          <input
            id="from"
            type="date"
            className="input h-11 dateph"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
          {!from && (
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink/50">
              Add date
            </span>
          )}
        </div>
      </Field>

      <Field id="to" label="Check-out">
        <div className="relative">
          <input
            id="to"
            type="date"
            className="input h-11 dateph"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
          {!to && (
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink/50">
              Add date
            </span>
          )}
        </div>
      </Field>
      <Field id="guests" label="Guests">
        <GuestsPicker value={guests} onChange={setGuests} />
      </Field>

      <button
        type="submit"
        className="btn btn-primary h-11 px-6 !py-0 !min-h-0 leading-none"
      >
        Search
      </button>
    </form>
  );
}
