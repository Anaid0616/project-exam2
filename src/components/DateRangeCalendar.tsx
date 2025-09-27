'use client';

import * as React from 'react';
import { DayPicker, DateRange, Matcher } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

export type BlockedRange = { from: Date; to: Date };

type Props = {
  value: DateRange | undefined;
  onChange: (range: DateRange | undefined) => void;
  blocked?: BlockedRange[];
  className?: string;
  minDate?: Date;
};

type RdpVars = React.CSSProperties & {
  '--rdp-accent-color'?: string;
  '--rdp-accent-background-color'?: string;
  '--rdp-selected-color'?: string;
  '--rdp-cell-size'?: string;
  '--rdp-font-size'?: string;
};

export default function DateRangeCalendar({
  value,
  onChange,
  blocked,
  className,
  minDate,
}: Props) {
  const disabled: Matcher[] = React.useMemo(() => {
    const base = minDate ? new Date(minDate) : new Date();
    base.setHours(0, 0, 0, 0);
    return [{ before: base }, ...(blocked ?? [])];
  }, [blocked, minDate]);

  const rdpVars: RdpVars = {
    '--rdp-accent-color': '#0E7490',
    '--rdp-accent-background-color': '#0E7490',
    '--rdp-selected-color': '#ffffff',
  };

  return (
    <div
      className={className}
      style={{
        ...rdpVars,

        containerType: 'inline-size',
      }}
    >
      <DayPicker
        mode="range"
        numberOfMonths={1}
        showOutsideDays
        fixedWeeks
        weekStartsOn={1}
        selected={value}
        onSelect={(next, day, mods) => {
          if (mods?.disabled) return;
          if (value?.from && value?.to) {
            onChange({ from: day, to: undefined });
            return;
          }
          onChange(next);
        }}
        disabled={disabled}
        styles={{
          root: { width: '100%', maxWidth: '100%', margin: 0 },
          months: { margin: 0 },
          month: { margin: 0, padding: 0 },
          head_cell: { textAlign: 'center' },
        }}
        modifiers={{ blocked: blocked ?? [] }}
        modifiersStyles={{
          blocked: { textDecoration: 'line-through', opacity: 0.35 },
          range_middle: {
            backgroundColor: 'rgba(14,116,144,0.12)',
            color: '#0F172A',
            borderRadius: '9999px',
            transform: 'scale(0.82)',
          },
          range_start: {
            backgroundColor: '#0E7490',
            color: '#fff',
            borderRadius: '9999px',
            transform: 'scale(0.82)',
          },
          range_end: {
            backgroundColor: '#0E7490',
            color: '#fff',
            borderRadius: '9999px',
            transform: 'scale(0.82)',
          },
          selected: {
            backgroundColor: '#0E7490',
            color: '#fff',
            borderRadius: '9999px',
            transform: 'scale(0.82)',
          },
        }}
        modifiersClassNames={{
          range_start: 'rdp-connect-start',
          range_end: 'rdp-connect-end',
        }}
      />
    </div>
  );
}
