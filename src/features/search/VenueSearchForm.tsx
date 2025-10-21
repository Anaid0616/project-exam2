'use client';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import GuestsPicker from '@/components/GuestsPicker';

/** Floating label wrapper  */
function Field({
  id,
  label,
  className = '',
  children,
}: React.PropsWithChildren<{ id: string; label: string; className?: string }>) {
  return (
    <div className={`relative ${className}`}>
      <label
        htmlFor={id}
        className="pointer-events-none absolute -top-4 left-3 z-10 px-1 text-xs font-medium text-ink/80"
      >
        {label}
      </label>
      {children}
    </div>
  );
}

/**
 * VenueSearchForm
 * - Where med typeahead
 * - Check-in/Check-out (native date)
 * - Guests (custom picker)
 * - Search (push till /search)
 *
 * Responsiv grid:
 */
export default function VenueSearchForm({
  className = '',
  onSearchEnd,
}: {
  className?: string;
  onSearchEnd?: () => void;
}) {
  const router = useRouter();

  // Controlled inputs
  const [where, setWhere] = React.useState('');
  const [from, setFrom] = React.useState('');
  const [to, setTo] = React.useState('');
  const [guests, setGuests] = React.useState<number | null>(null);

  // Typeahead
  const [sugs, setSugs] = React.useState<string[]>([]);
  const [open, setOpen] = React.useState(false);
  const [hi, setHi] = React.useState(-1);
  const whereRef = React.useRef<HTMLInputElement>(null);

  // Fetch suggestions (debounced)
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
        const filtered = data.filter((s) => s.toLowerCase() !== qlc);
        setSugs(filtered);
        setOpen(filtered.length > 0);
        setHi(-1);
      } catch {
        /* ignore */
      }
    }, 250);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [where]);

  // Submit
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
    q.set('guests', guests === null ? '2' : String(guests));
    setOpen(false);
    router.push(`/venues?${q.toString()}`);

    if (onSearchEnd) onSearchEnd();
  }

  return (
    <form
      onSubmit={onSubmit}
      autoComplete="off"
      className={`
    w-full
    grid
    grid-cols-1
    gap-x-3 gap-y-6        
    min-[420px]:grid-cols-2
    min-[845px]:grid-cols-[1.5fr,1fr,1fr,1fr,auto]
    min-[845px]:gap-y-3     
    ${className}
  `}
    >
      <h3 className="col-span-full text-xl font-semibold -mt-1 mb-3">
        Find stays
      </h3>

      {/* WHERE */}
      <Field
        id="where"
        label="Where"
        className="min-w-0 min-[420px]:col-span-2 min-[845px]:col-span-1"
      >
        <div className="relative w-full min-w-0">
          <input
            name="where"
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
                    onMouseDown={(ev) => {
                      ev.preventDefault();
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

      {/* Check-in */}
      <Field id="from" label="Check-in" className="min-w-0">
        <div className="relative min-w-0">
          <input
            name="from"
            id="from"
            type="date"
            className="input h-11 dateph"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
          {!from && (
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink/60">
              Add date
            </span>
          )}
        </div>
      </Field>

      {/* Check-out */}
      <Field id="to" label="Check-out" className="min-w-0">
        <div className="relative min-w-0">
          <input
            name="to"
            id="to"
            type="date"
            className="input h-11 dateph"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
          {!to && (
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink/60">
              Add date
            </span>
          )}
        </div>
      </Field>

      {/* Guests */}
      <Field id="guests" label="Guests" className="min-w-0">
        <GuestsPicker inputId="guests" value={guests} onChange={setGuests} />
      </Field>

      {/* Search — fullbredd på minsta skärmar, auto från 420px */}
      <button
        type="submit"
        className="btn btn-primary h-11 w-full min-[420px]:w-auto px-6 !py-0 !min-h-0 leading-none"
      >
        Search
      </button>
    </form>
  );
}
