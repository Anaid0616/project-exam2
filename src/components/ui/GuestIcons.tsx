type IconProps = {
  className?: string;
};

export const PlusIcon = ({ className = '' }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    aria-hidden
    fill="none"
    stroke="currentColor"
    strokeWidth="4"
    strokeLinecap="round"
  >
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const MinusIcon = ({ className = '' }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    aria-hidden
    fill="none"
    stroke="currentColor"
    strokeWidth="4 "
    strokeLinecap="round"
  >
    <path d="M5 12h14" />
  </svg>
);
