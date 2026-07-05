"use client";

import { useEffect, useRef, useState } from "react";

type PopupState = {
  tag: string;
  text: string;
  x: number;
  y: number;
  visible: boolean;
};

export function ConceptPopup() {
  const ref = useRef<HTMLDivElement>(null);
  const [p, setP] = useState<PopupState>({ tag: "INSIGHT", text: "", x: 0, y: 0, visible: false });

  useEffect(() => {
    const over = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest("[data-concept]") as HTMLElement | null;
      if (el) {
        setP((s) => ({ ...s, tag: el.getAttribute("data-tag") || "INSIGHT", text: el.getAttribute("data-concept") || "", visible: true }));
      }
    };

    const move = (e: MouseEvent) => {
      if (!ref.current) return;
      const el = (e.target as HTMLElement).closest("[data-concept]");
      if (!el) return;
      let left = e.clientX + 18;
      let top = e.clientY + 18;
      const rect = ref.current.getBoundingClientRect();
      if (left + rect.width > window.innerWidth - 20) left = e.clientX - rect.width - 18;
      if (top + rect.height > window.innerHeight - 20) top = e.clientY - rect.height - 18;
      setP((s) => ({ ...s, x: left, y: top }));
    };

    const out = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest("[data-concept]") as HTMLElement | null;
      if (el && (!e.relatedTarget || !el.contains(e.relatedTarget as Node))) {
        setP((s) => ({ ...s, visible: false }));
      }
    };

    document.addEventListener("mouseover", over);
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseout", out);
    return () => {
      document.removeEventListener("mouseover", over);
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseout", out);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed z-[9999] max-w-sm rounded-2xl border border-burnished-gold/50 bg-surface-container/90 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl transition-[opacity,transform] duration-300"
      style={{
        left: p.x,
        top: p.y,
        opacity: p.visible ? 1 : 0,
        transform: p.visible ? "scale(1) translateY(0)" : "scale(0.95) translateY(8px)",
      }}
    >
      <div className="mb-2.5 flex items-center justify-between gap-3 border-b border-burnished-gold/20 pb-2">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-burnished-gold" />
          <span className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-burnished-gold">
            {p.tag}
          </span>
        </div>
        <span className="rounded border border-slate-boundary/50 px-2 py-0.5 font-mono text-[9px] text-muted">
          INSIGHT
        </span>
      </div>
      <p className="font-body text-sm leading-relaxed text-ivory">
        {p.text}
      </p>
    </div>
  );
}
