import type { ReactNode } from "react";

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
    <div
      className={`relative overflow-x-auto py-10 ${className}`}
    >
      <div className="relative flex min-w-[650px] items-center px-6">
        <div className="absolute left-6 right-6 h-px bg-gradient-to-r from-transparent via-[var(--color-slate-boundary)]/60 to-transparent" />
        <div className="relative z-10 flex w-full justify-between">
          {events.map((ev, i) => {
            const hue =
              ev.domain === "reason"
                ? "from-[#3E5C76] via-[#3E5C76] to-[#3E5C76]"
                : ev.domain === "psyche"
                  ? "from-[#5B4B8A] via-[#5B4B8A] to-[#5B4B8A]"
                  : ev.domain === "semiotics"
                    ? "from-[#2E7266] via-[#2E7266] to-[#2E7266]"
                    : ev.domain === "collective"
                      ? "from-[#9C6B2E] via-[#9C6B2E] to-[#9C6B2E]"
                      : ev.domain === "numinous"
                        ? "from-[#B8922E] via-[#B8922E] to-[#B8922E]"
                        : ev.domain === "synthetic"
                          ? "from-[#3E7C82] via-[#3E7C82] to-[#3E7C82]"
                          : "from-[var(--color-burnished-gold)] via-[var(--color-burnished-gold)] to-[var(--color-burnished-gold)]";

            const baseColor =
              ev.domain === "reason"
                ? "#3E5C76"
                : ev.domain === "psyche"
                  ? "#5B4B8A"
                  : ev.domain === "semiotics"
                    ? "#2E7266"
                    : ev.domain === "collective"
                      ? "#9C6B2E"
                      : ev.domain === "numinous"
                        ? "#B8922E"
                        : ev.domain === "synthetic"
                          ? "#3E7C82"
                          : "var(--color-burnished-gold)";

            return (
              <div
                key={i}
                data-tag={`TIMELINE ${ev.year}`}
                data-concept={ev.description || ""}
                className="group relative cursor-pointer"
              >
                <div className="relative mx-auto h-4 w-4 rounded-full border-[3px] bg-[var(--color-deep-navy)] transition-all duration-400 group-hover:scale-150 group-hover:shadow-[0_0_18px_var(--color-burnished-gold)]"
                  style={{
                    borderColor: baseColor,
                    background: `var(--color-deep-navy)`,
                    boxShadow: `0 0 0 1px ${baseColor}33`,
                  }}
                />
                <span
                  className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded px-2 py-0.5 font-mono text-[11px] font-bold"
                  style={{
                    color: `color-mix(in srgb, ${baseColor} 90%, white)`,
                    backgroundColor: `color-mix(in srgb, ${baseColor} 15%, var(--color-surface-container))`,
                    border: `1px solid color-mix(in srgb, ${baseColor} 40%, transparent)`,
                  }}
                >
                  {ev.year}
                </span>
                <span className="absolute left-1/2 top-6 -translate-x-1/2 whitespace-nowrap text-center text-[13px] font-bold text-[var(--color-ivory)] transition-colors group-hover:text-[var(--color-burnished-gold)]">
                  {ev.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
