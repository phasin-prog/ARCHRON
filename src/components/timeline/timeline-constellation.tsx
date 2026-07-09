export type ConstellationEvent = {
  year: string;
  label: string;
  domain?: string;
  description?: string;
};

export function TimelineConstellation({
  events,
  className = "",
}: {
  events: ConstellationEvent[];
  className?: string;
}) {
  return (
    <div className={`relative overflow-x-auto ${className}`} style={{ padding: "40px 20px" }}>
      <div className="relative flex min-w-0 w-full items-center" style={{ padding: "0 24px" }}>
        <div
          className="absolute pointer-events-none"
          style={{
            left: "24px",
            right: "24px",
            height: "1px",
            background: "linear-gradient(90deg, transparent, var(--border-tint, var(--color-border)), transparent)",
          }}
        />
        <div className="relative z-10 flex w-full justify-between">
          {events.map((ev, i) => (
            <div
              key={i}
              data-domain={ev.domain || ""}
              data-tag={`TIMELINE ${ev.year}`}
              data-concept={ev.description || ""}
              className="group relative cursor-pointer"
              style={{ position: "relative", width: "16px", height: "16px" }}
            >
              {/* Dot */}
              <div
                className="rounded-full transition-all duration-500"
                style={{
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  background: "var(--bg-canvas, var(--color-bg))",
                  border: "3px solid var(--domain-base, var(--active-accent, var(--color-accent)))",
                  transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                  boxShadow: "0 0 0 1px color-mix(in srgb, var(--domain-base, var(--active-accent, var(--color-accent))) 20%, transparent)",
                }}
              />
              {/* Year badge */}
              <span
                className="pointer-events-none absolute left-1/2 whitespace-nowrap rounded px-2 py-0.5 font-mono text-[11px] font-bold"
                style={{
                  top: "-32px",
                  transform: "translateX(-50%)",
                  color: "var(--domain-on-tint, var(--color-accent))",
                  background: "var(--domain-tint, color-mix(in srgb, var(--active-accent, var(--color-accent)) 15%, var(--color-bg-card)))",
                  border: "1px solid var(--domain-base, var(--active-accent, var(--color-accent)))",
                }}
              >
                {ev.year}
              </span>
              {/* Label */}
              <span
                className="pointer-events-none absolute left-1/2 whitespace-nowrap text-center font-heading text-[13px] font-bold transition-colors duration-300 group-hover:text-[var(--active-accent,var(--color-accent))]"
                style={{
                  top: "24px",
                  transform: "translateX(-50%)",
                  color: "var(--color-text-heading)",
                }}
              >
                {ev.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
