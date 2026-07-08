"use client";

import { useEffect, useState, type MouseEvent } from "react";

type TocItem = { id: string; text: string; level: 2 | 3 };

// slug รองรับไทย
function slug(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^฀-๿a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// FloatingToc — ปุ่มลอยสารบัญบนมือถือ/แท็บเล็ต (≤ xl)
// กดเปิด Bottom Sheet แสดงหัวข้อ → แตะแล้ว scroll ไป
// ซ่อนเมื่อมีหัวข้อ < 3 หรือบน xl+ (ที่มี sidebar TOC อยู่แล้ว)
export function FloatingToc({ containerId = "reading-article" }: { containerId?: string }) {
  const [items, setItems] = useState<TocItem[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const root = document.getElementById(containerId);
    if (!root) return;

    const nodes = Array.from(root.querySelectorAll<HTMLElement>("h2, h3")).filter(
      (h) => !h.closest("aside"),
    );
    if (nodes.length < 3) return;

    const built: TocItem[] = nodes.map((h, i) => {
      if (!h.id) h.id = `toc-m-${i}-${slug(h.textContent ?? "")}`;
      h.style.scrollMarginTop = "5rem";
      return {
        id: h.id,
        text: (h.textContent ?? "").trim(),
        level: h.tagName === "H3" ? 3 : 2,
      };
    });

    const raf = requestAnimationFrame(() => setItems(built));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -65% 0px", threshold: 0 },
    );
    built.forEach((it) => {
      const el = document.getElementById(it.id);
      if (el) observer.observe(el);
    });

    // Close on Escape
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      document.removeEventListener("keydown", onKey);
    };
  }, [containerId]);

  // Close on route change (backdrop click handled inline)
  const handleClick = (e: MouseEvent, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    setActive(id);
    setOpen(false);
  };

  // Don't render on xl+ (sidebar TOC exists) or if too few headings
  if (items.length < 3) return null;

  return (
    <>
      {/* Floating button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="สารบัญ"
        aria-expanded={open}
        aria-controls="floating-toc-panel"
        className="fixed bottom-[calc(7rem+env(safe-area-inset-bottom))] right-4 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-accent/30 bg-bg-card/90 text-accent shadow-[0_8px_24px_-8px_rgba(0,0,0,0.6)] backdrop-blur transition-all duration-300 hover:bg-accent hover:text-text-inverse lg:hidden print:hidden"
      >
        <span className="inline-flex items-center justify-center w-[22px] h-[22px] text-[22px]" aria-hidden="true">
          {open ? "✕" : "≡"}
        </span>
      </button>

      {/* Backdrop */}
      {open ? (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      ) : null}

      {/* Bottom sheet */}
      <nav
        id="floating-toc-panel"
        aria-label="สารบัญในหน้านี้"
        className={`fixed inset-x-0 bottom-0 z-50 max-h-[60vh] overflow-y-auto rounded-t-2xl border-t border-border/40 bg-bg-card px-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-4 shadow-[0_-10px_30px_-10px_rgba(0,0,0,0.5)] transition-transform duration-300 ease-out lg:hidden ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-border/60" />
        <p className="mb-3 text-[11px] font-semibold tracking-[0.05em] text-accent/70">
          สารบัญ
        </p>
        <ul className="space-y-0.5">
          {items.map((it) => (
            <li key={it.id} className={it.level === 3 ? "pl-4" : ""}>
              <a
                href={`#${it.id}`}
                onClick={(e) => handleClick(e, it.id)}
                className={`block rounded-md px-3 py-2.5 text-sm leading-snug transition-colors ${
                  active === it.id
                    ? "bg-accent/10 text-accent"
                    : "text-text-secondary/80 hover:bg-bg-card hover:text-text-heading"
                }`}
              >
                {it.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
