'use client';

type Props = {
  rows?: number;
  withPanel?: boolean;
};

export default function TableSkeleton({ rows = 8, withPanel = true }: Props) {
  const table = (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left border-b">
          {Array.from({ length: 6 }).map((_, i) => (
            <th key={i} className="p-3">
              <div className="h-4 w-24 rounded-app bg-ink/10 animate-pulse" />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, r) => (
          <tr key={r} className="border-b last:border-0">
            {Array.from({ length: 6 }).map((_, c) => (
              <td key={c} className="p-3">
                <div className="h-4 w-[clamp(60px,12vw,160px)] rounded-app bg-ink/10 animate-pulse" />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );

  return withPanel ? (
    <div className="panel overflow-x-auto p-0">{table}</div>
  ) : (
    table
  );
}
