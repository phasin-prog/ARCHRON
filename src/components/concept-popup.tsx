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
  const rafId = useRef<number>(0);

  useEffect(() => {
    const over = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest("[data-concept]") as HTMLElement | null;
      if (el) {
        setP((s) => ({ ...s, tag: el.getAttribute("data-tag") || "INSIGHT", text: el.getAttribute("data-concept") || "", visible: true }));
      }
    };

    let latestMove: MouseEvent | null = null;

    const move = (e: MouseEvent) => {
      latestMove = e;
      if (rafId.current === 0) {
        rafId.current = requestAnimationFrame(() => {
          rafId.current = 0;
          const ev = latestMove;
          latestMove = null;
          if (!ev || !ref.current) return;
          const el = (ev.target as HTMLElement).closest("[data-concept]");
          if (!el) return;
          let left = ev.clientX + 18;
          let top = ev.clientY + 18;
          const rect = ref.current.getBoundingClientRect();
          if (left + rect.width > window.innerWidth - 20) left = ev.clientX - rect.width - 18;
          if (top + rect.height > window.innerHeight - 20) top = ev.clientY - rect.height - 18;
          setP((s) => ({ ...s, x: left, y: top }));
        });
      }
    };

    const out = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest("[data-concept]") as HTMLElement | null;
      if (el && (!e.relatedTarget || !el.contains(e.relatedTarget as Node))) {
        setP((s) => ({ ...s, visible: false }));
      }
    };

    document.addEventListener("mouseover", over);
    document.addEventListener("mousemove", move, { passive: true });
    document.addEventListener("mouseout", out);
    return () => {
      cancelAnimationFrame(rafId.current);
      document.removeEventListener("mouseover", over);
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseout", out);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed z-[9999] max-w-sm rounded-2xl border border-accent/50 bg-bg-card/90 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-md transition-[opacity,transform] duration-300"
      /* intentionally above all tokens */
      style={{
        left: p.x,
        top: p.y,
        opacity: p.visible ? 1 : 0,
        transform: p.visible ? "scale(1) translateY(0)" : "scale(0.95) translateY(8px)",
      }}
    >
      <div className="mb-2.5 flex items-center justify-between gap-3 border-b border-accent/20 pb-2">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />
          <span className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
            {p.tag}
          </span>
        </div>
        <span className="rounded border border-border/50 px-2 py-0.5 font-mono text-[9px] text-text-secondary">
          INSIGHT
        </span>
      </div>
      <p className="font-body text-sm leading-relaxed text-text-heading">
        {p.text}
      </p>
    </div>
  );
}
