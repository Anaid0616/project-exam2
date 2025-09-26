'use client';

import * as React from 'react';
import { DayPicker, DateRange, Matcher } from 'react-day-picker';

export type BlockedRange = { from: Date; to: Date };

type Props = {
  value: DateRange | undefined;
  onChange: (range: DateRange | undefined) => void;
  blocked?: BlockedRange[];
  className?: string;
  minDate?: Date;
};

export default function DateRangeCalendar({
  value,
  onChange,
  blocked,
  className,
  minDate,
}: Props) {
  // Disable anything before today (or minDate) + your blocked ranges
  const disabled: Matcher[] = React.useMemo(() => {
    const base = minDate ? new Date(minDate) : new Date();
    base.setHours(0, 0, 0, 0);
    return [{ before: base }, ...(blocked ?? [])];
  }, [blocked, minDate]);

  return (
    <div className={className}>
      <DayPicker
        mode="range"
        selected={value}
        onSelect={onChange}
        disabled={disabled}
        showOutsideDays
        fixedWeeks
        weekStartsOn={1}
        // Make it fill the container
        className="w-full"
        classNames={{
          months: 'w-full',
          month: 'w-full',
          table: 'w-full border-collapse',
          head_row: 'text-ink/60',
          caption: 'flex items-center justify-between mb-2',
          nav: 'flex gap-2',
          nav_button: 'h-8 w-8 rounded-md hover:bg-ink/5',
          // Days
          day: 'h-9 w-9 text-sm rounded-md hover:bg-ink/5 focus:outline-none',
          day_disabled: 'opacity-30 pointer-events-none line-through',
          day_outside: 'opacity-40 pointer-events-none',
          day_selected: 'bg-aegean text-white hover:bg-aegean',
          day_range_start: 'bg-aegean text-white',
          day_range_end: 'bg-aegean text-white',
          day_range_middle: 'bg-aegean/10',
        }}
        // Optional extra marker for blocked (in addition to disabling them)
        modifiers={{ blocked: blocked ?? [] }}
        modifiersClassNames={{
          blocked: 'opacity-30 line-through',
        }}
        styles={{
          root: { width: '100%' },
          months: { width: '100%' },
          month: { width: '100%' },
          table: { width: '100%' },
        }}
      />
    </div>
  );
}
