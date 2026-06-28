"use client";

import { useEffect, useState, type MouseEvent } from "react";

type TocItem = { id: string; text: string; level: 2 | 3 };

// slug รองรับไทย: เก็บอักขระไทย/อังกฤษ/ตัวเลข แทนช่องว่างด้วย -
function slug(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^฀-๿a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// สารบัญลอย + scroll-spy — สแกนหัวข้อจริงจาก DOM ของบทความ (content-agnostic)
// แสดงเมื่อมีหัวข้อ >= 3 เท่านั้น (หน้าแนวคิดสั้น/stub จะไม่ขึ้น)
export function ReadingToc({ containerId = "reading-article" }: { containerId?: string }) {
  const [items, setItems] = useState<TocItem[]>([]);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const root = document.getElementById(containerId);
    if (!root) return;

    const nodes = Array.from(root.querySelectorAll<HTMLElement>("h2, h3")).filter(
      (h) => !h.closest("aside"),
    );
    if (nodes.length < 3) return;

    const built: TocItem[] = nodes.map((h, i) => {
      if (!h.id) h.id = `toc-${i}-${slug(h.textContent ?? "")}`;
      h.style.scrollMarginTop = "6.5rem";
      return {
        id: h.id,
        text: (h.textContent ?? "").trim(),
        level: h.tagName === "H3" ? 3 : 2,
      };
    });
    // defer ออกจาก effect body (เลี่ยง cascading render + อ่าน DOM เสร็จหลัง paint)
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
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [containerId]);

  if (items.length < 3) return null;

  const handleClick = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    setActive(id);
    if (typeof history !== "undefined" && history.replaceState) {
      history.replaceState(null, "", `#${id}`);
    }
  };

  return (
    <nav aria-label="สารบัญในหน้านี้" className="text-sm">
      <p className="mb-3 text-[11px] uppercase tracking-[0.18em] text-subtle">ในหน้านี้</p>
      <ul className="space-y-1 border-l border-white/10">
        {items.map((it) => (
          <li key={it.id} className={it.level === 3 ? "pl-3" : ""}>
            <a
              href={`#${it.id}`}
              onClick={(e) => handleClick(e, it.id)}
              className={`-ml-px block border-l-2 py-1 pl-3 leading-snug transition-colors ${
                active === it.id
                  ? "border-antique-gold text-soft-gold"
                  : "border-transparent text-muted hover:text-soft-ivory"
              }`}
            >
              {it.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
