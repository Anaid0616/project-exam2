// src/components/DateRangeField.tsx
'use client';

import * as React from 'react';
import { DayPicker, DateRange, Matcher } from 'react-day-picker';
import { format } from 'date-fns';

export type BlockedRange = { from: Date; to: Date };

export function toISO(d: Date) {
  return format(d, 'yyyy-MM-dd');
}

type Props = {
  labelStart?: string;
  labelEnd?: string;
  value: DateRange | undefined;
  onChange: (range: DateRange | undefined) => void;
  blocked?: BlockedRange[];
  className?: string;
};

export default function DateRangeField({
  labelStart = 'Check-in',
  labelEnd = 'Check-out',
  value,
  onChange,
  blocked,
  className,
}: Props) {
  const [open, setOpen] = React.useState<null | 'start' | 'end'>(null);

  const startStr = value?.from ? toISO(value.from) : '';
  const endStr = value?.to ? toISO(value.to) : '';

  // Disabled för DayPicker
  const disabledForPicker: Matcher[] = React.useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return [{ before: today }, ...(blocked ?? [])];
  }, [blocked]);

  return (
    <div className={className ?? 'grid gap-3 relative'}>
      <div>
        <label className="label">{labelStart}</label>
        <input
          type="text"
          className="input"
          placeholder="YYYY-MM-DD"
          value={startStr}
          readOnly
          onFocus={() => setOpen('start')}
          onClick={() => setOpen('start')}
        />
      </div>
      <div>
        <label className="label">{labelEnd}</label>
        <input
          type="text"
          className="input"
          placeholder="YYYY-MM-DD"
          value={endStr}
          readOnly
          onFocus={() => setOpen('end')}
          onClick={() => setOpen('end')}
        />
      </div>

      {open && (
        <div
          role="dialog"
          aria-label="Choose dates"
          className="absolute z-20 mt-2 w-max rounded-app border border-ink/10 bg-white p-2 shadow-lg"
          style={{ top: open === 'start' ? 70 : 130, left: 0 }}
        >
          <DayPicker
            mode="range"
            selected={value}
            onSelect={(r) => {
              onChange(r);
              if (r?.from && r?.to) setOpen(null);
            }}
            disabled={disabledForPicker}
            numberOfMonths={1}
            weekStartsOn={1}
          />
          <div className="flex justify-end gap-2 mt-2">
            <button
              className="btn btn-ghost"
              type="button"
              onClick={() => {
                onChange(undefined);
                setOpen(null);
              }}
            >
              Clear
            </button>
            <button
              className="btn btn-primary"
              type="button"
              onClick={() => setOpen(null)}
              disabled={!value?.from || !value?.to}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
