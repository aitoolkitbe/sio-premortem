export function BrandMark({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const dim = size === 'sm' ? 28 : size === 'lg' ? 48 : 36;
  return (
    <div className="flex items-center gap-3 select-none">
      <svg
        width={dim}
        height={dim}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <circle cx="20" cy="20" r="19" stroke="#1a1a1a" strokeWidth="1.5" />
        <path
          d="M12 22c2-4 5-6 8-6s6 2 8 6"
          stroke="#8a5a3b"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <circle cx="20" cy="14" r="1.6" fill="#1a1a1a" />
      </svg>
      <div className="leading-tight">
        <div className="font-serif text-lg text-ink">De Pre-mortem</div>
        <div className="text-[11px] uppercase tracking-[0.14em] text-ink-muted">
          Studio Inside Out
        </div>
      </div>
    </div>
  );
}

export function BrandFooter() {
  return (
    <footer className="mt-16 border-t border-paper-line py-8 text-center text-xs text-ink-muted">
      De Pre-mortem · Studio Inside Out · Analysetool voor gevoelige interne communicatie
    </footer>
  );
}
