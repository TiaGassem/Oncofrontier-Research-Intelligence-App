export function BrandMark({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="brandCell" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#2cc3b1" />
          <stop offset="1" stopColor="#7fe6d8" />
        </linearGradient>
      </defs>
      <path
        d="M84 74 C76 82 58 84 44 76 C28 67 26 46 40 36 C52 27 68 32 71 45 C74 57 64 66 53 64 C44 62 40 52 46 45"
        fill="none"
        stroke="url(#brandCell)"
        strokeWidth="9"
        strokeLinecap="round"
      />
    </svg>
  );
}
