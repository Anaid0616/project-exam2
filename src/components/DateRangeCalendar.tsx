'use client';

import * as React from 'react';
import { DayPicker, DateRange, Matcher } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

export type BlockedRange = { from: Date; to: Date };

type Props = {
  /**
   * Currently selected date range (inclusive).
   * Pass `undefined` to clear the selection.
   */
  value: DateRange | undefined;

  /**
   * Called whenever the user changes the selection.
   * The callback receives the full range or `undefined` when cleared.
   */
  onChange: (range: DateRange | undefined) => void;

  /**
   * Optional array of blocked ranges (inclusive) that cannot be selected.
   * Useful for booked dates.
   */
  blocked?: BlockedRange[];

  /**
   * Optional className applied to the outer wrapper.
   * Use this to style the calendar container (borders, padding, sizing).
   */
  className?: string;

  /**
   * Minimum selectable date. All days before this date are disabled.
   * Defaults to “today” when not provided.
   */
  minDate?: Date;
};

/**
 * CSS variables supported by react-day-picker’s root element.
 * We set only color variables here (size is handled elsewhere in the app).
 */
type RdpVars = React.CSSProperties & {
  '--rdp-accent-color'?: string;
  '--rdp-accent-background-color'?: string;
  '--rdp-selected-color'?: string;
  '--rdp-cell-size'?: string;
  '--rdp-font-size'?: string;
};

/**
 * DateRangeCalendar
 *
 * A thin wrapper around `react-day-picker` configured for range selection.
 * - Week starts on Monday.
 * - One month view, fixed weeks, shows outside days.
 * - Disables dates before `minDate` (or today) and any `blocked` ranges.
 * - When a full range is already selected, clicking a new day starts a fresh range.
 *
 * The visual theme is controlled via CSS variables and modifiers.
 */
export default function DateRangeCalendar({
  value,
  onChange,
  blocked,
  className,
  minDate,
}: Props) {
  /** Compute the disabled matchers: everything before `minDate` (or today) + blocked ranges. */
  const disabled: Matcher[] = React.useMemo(() => {
    const base = minDate ? new Date(minDate) : new Date();
    base.setHours(0, 0, 0, 0);
    return [{ before: base }, ...(blocked ?? [])];
  }, [blocked, minDate]);

  /** Theme variables for DayPicker (colors only here). */
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
        // Enable container queries on the wrapper if you want to use cqw in CSS.
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
          // Don’t react on disabled days
          if (mods?.disabled) return;

          // If a full range is already chosen, start a new one from the clicked day
          if (value?.from && value?.to) {
            onChange({ from: day, to: undefined });
            return;
          }

          onChange(next);
        }}
        disabled={disabled}
        /** Light structural tweaks; visual theme handled by CSS variables and modifiers below. */
        styles={{
          root: { width: '100%', maxWidth: '100%', margin: 0 },
          months: { margin: 0 },
          month: { margin: 0, padding: 0 },
          head_cell: { textAlign: 'center' },
        }}
        /** Blocked spans + visual styling for selected/range days. */
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
        /** Optional class hooks for connecting range pills if you style them in CSS. */
        modifiersClassNames={{
          range_start: 'rdp-connect-start',
          range_end: 'rdp-connect-end',
        }}
      />
    </div>
  );
}
