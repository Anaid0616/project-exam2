export default function SegButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`btn ${active ? 'btn-primary' : 'btn-ghost'}`}
    >
      {children}
    </button>
  );
}
