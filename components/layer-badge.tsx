"use client";

import { useEffect, useState } from "react";

const THEME_LABELS: Record<string, string> = {
  prima: "LAYER 01 : PRIMA FOUNDATION",
  psyche: "LAYER 01 : PSYCHE SOUL",
  lumen: "LAYER 01 : LUMEN LIGHT",
  sapientia: "LAYER 01 : SAPIENTIA AUTHORITY",
  mercurius: "LAYER 01 : MERCURIUS MESSENGER",
  humanitas: "LAYER 01 : HUMANITAS SOCIETY",
};

export function LayerBadge({ className = "" }: { className?: string }) {
  const [label, setLabel] = useState("LAYER 01 : SAPIENTIA AUTHORITY");

  useEffect(() => {
    const update = () => {
      const theme = document.body.getAttribute("data-theme") || "sapientia";
      setLabel(THEME_LABELS[theme] || "LAYER 01 : ARCHRON");
    };
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.body, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  return (
    <span className={`inline-flex items-center gap-2 rounded-full border border-[var(--active-accent,var(--color-burnished-gold))] bg-black/30 px-4 py-1.5 text-[10px] font-sans font-bold uppercase tracking-[0.3em] text-[var(--active-accent,var(--color-burnished-gold))] shadow-inner ${className}`}>
      <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--active-accent,var(--color-burnished-gold))]" />
      {label}
    </span>
  );
}
