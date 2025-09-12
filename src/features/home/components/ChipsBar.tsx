'use client';

const chips = [
  'All',
  'Beachfront',
  'City breaks',
  'Family-friendly',
  'Budget stays',
  'Luxury stays',
  'Pool',
];

export default function ChipsBar() {
  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((c, i) => (
        <button
          key={c}
          className={`chip ${i === 0 ? 'chip-active' : ''}`}
          type="button"
        >
          {c}
        </button>
      ))}
    </div>
  );
}
