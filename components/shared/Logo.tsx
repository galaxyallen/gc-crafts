export function Logo({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <path d="M14 6C8.5 6 4 12 4 18s4.5 12 10 12c3.5 0 6.5-1.8 8.5-4.5" stroke="#c4a265" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M22.5 10.5C20.5 7.8 17.5 6 14 6" stroke="#c4a265" strokeWidth="2.2" strokeLinecap="round" opacity="0.4" />
      <path d="M26 34c5.5 0 10-6 10-12S31.5 10 26 10c-3.5 0-6.5 1.8-8.5 4.5" stroke="#c4a265" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M17.5 29.5c2 2.7 5 4.5 8.5 4.5" stroke="#c4a265" strokeWidth="2.2" strokeLinecap="round" opacity="0.4" />
    </svg>
  );
}
