export function LayerBadge({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border border-[var(--color-concept)] bg-black/30 px-4 py-1.5 text-[10px] font-sans font-bold uppercase tracking-[0.3em] text-[var(--color-concept)] shadow-inner ${className}`}>
      <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--color-concept)]" />
      PSYCHE SOUL
    </span>
  );
}
