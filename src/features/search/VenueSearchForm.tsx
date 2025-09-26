'use client';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import GuestsPicker from '@/components/GuestsPicker';

/**
 * Small wrapper that renders a floating label above a field.
 * The label is visually placed above the input but still associated
 * via `htmlFor` for accessibility.
 */
function Field({
  id,
  label,
  children,
}: React.PropsWithChildren<{ id: string; label: string }>) {
  return (
    <div className="relative">
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
 *
 * Renders the hero search panel with:
 * - free-text “Where” input with async suggestions (typeahead)
 * - date pickers for check-in/out
 * - a custom Guests picker
 * - a Search submit button
 *
 * URL is updated to `/search?...` with the chosen parameters.
 */
export default function VenueSearchForm({
  className = '',
}: {
  /** Optional extra classes to merge into the form root. */
  className?: string;
}) {
  const router = useRouter();

  // Controlled inputs
  const [where, setWhere] = React.useState('');
  const [from, setFrom] = React.useState('');
  const [to, setTo] = React.useState('');
  const [guests, setGuests] = React.useState<number | null>(null);

  // Typeahead state for "Where"
  const [sugs, setSugs] = React.useState<string[]>([]);
  const [open, setOpen] = React.useState(false); // suggestions dropdown open/close
  const [hi, setHi] = React.useState(-1); // highlighted suggestion index
  const whereRef = React.useRef<HTMLInputElement>(null);

  /**
   * Fetch suggestions when the user types in "where".
   * - Debounced (250ms) to avoid spamming the API.
   * - Uses AbortController so an in-flight fetch can be cancelled when typing continues.
   */
  React.useEffect(() => {
    const q = where.trim();

    // Too short → clear and close
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

        // Remove exact duplicate of what the user already typed (case-insensitive)
        const qlc = q.toLowerCase();
        const filtered = data.filter((s) => s.toLowerCase() !== qlc);

        setSugs(filtered);
        setOpen(filtered.length > 0);
        setHi(-1);
      } catch {
        // Ignore abort or transient errors
      }
    }, 250);

    // Cleanup: cancel timer + request on re-run/unmount
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [where]);

  /**
   * Handle form submit:
   * - Validate dates (to >= from)
   * - Build query string
   * - Default guests to 2 if user hasn't chosen a number
   * - Navigate to /search with the built query
   */
  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Basic date validation
    if (from && to && new Date(from) > new Date(to)) {
      alert('Check-out must be after check-in');
      return;
    }

    const q = new URLSearchParams();
    if (where.trim()) q.set('where', where.trim());
    if (from) q.set('from', from);
    if (to) q.set('to', to);

    // Default to 2 guests if user hasn't actively chosen a value
    if (guests === null) q.set('guests', '2');
    else q.set('guests', String(guests));

    // Close any open suggestion list before navigating
    setOpen(false);

    router.push(`/search?${q.toString()}`);
  }

  return (
    <form
      onSubmit={onSubmit}
      autoComplete="off"
      className={`grid w-[min(100%,1150px)] grid-cols-1 gap-3 p-4 md:grid-cols-[1.5fr,1fr,1fr,1fr,auto] ${className}`}
    >
      <h3 className="col-span-full text-xl font-semibold -mt-1 mb-3">
        Find stays
      </h3>

      {/* WHERE + typeahead */}
      <Field id="where" label="Where">
        <div className="relative w-full">
          <input
            name="where"
            id="where"
            ref={whereRef}
            className="input h-11 w-full"
            placeholder="Santorini, Greece"
            value={where}
            onChange={(e) => setWhere(e.target.value)}
            // Open suggestions on focus if we already have results
            onFocus={() => setOpen(sugs.length > 0)}
            // Delay closing a bit so clicks inside the dropdown still register
            onBlur={() => setTimeout(() => setOpen(false), 80)}
            onKeyDown={(e) => {
              if (!open || sugs.length === 0) return;

              // Keyboard navigation inside suggestion list
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                setHi((p) => (p + 1) % sugs.length);
              }
              if (e.key === 'ArrowUp') {
                e.preventDefault();
                setHi((p) => (p - 1 + sugs.length) % sugs.length);
              }
              if (e.key === 'Enter' && hi >= 0) {
                // Accept highlighted suggestion
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

          {/* Suggestions dropdown */}
          {open && sugs.length > 0 && (
            <ul className="panel absolute left-0 right-0 top-[calc(100%+6px)] z-50 w-full max-h-64 overflow-auto p-1">
              {sugs.map((s, i) => (
                <li key={`${s}-${i}`}>
                  <button
                    type="button"
                    className={`w-full rounded-app px-3 py-2 text-left hover:bg-ink/5 ${
                      i === hi ? 'bg-ink/5' : ''
                    }`}
                    // onMouseDown to prevent input blur before we apply the choice
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
      <Field id="from" label="Check-in">
        <div className="relative">
          <input
            name="from"
            id="from"
            type="date"
            className="input h-11 dateph"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
          {/* Custom placeholder for date inputs (since native placeholders are ignored) */}
          {!from && (
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink/60">
              Add date
            </span>
          )}
        </div>
      </Field>

      {/* Check-out */}
      <Field id="to" label="Check-out">
        <div className="relative">
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

      {/* Guests (custom picker) */}
      <Field id="guests" label="Guests">
        {/* Pass `inputId` so the label is associated with the button inside GuestsPicker */}
        <GuestsPicker inputId="guests" value={guests} onChange={setGuests} />
      </Field>

      {/* Submit */}
      <button
        type="submit"
        className="btn btn-primary h-11 px-6 !py-0 !min-h-0 leading-none"
      >
        Search
      </button>
    </form>
  );
}
