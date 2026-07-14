"use client";

import { useEffect, useState } from "react";

// แถบความคืบหน้าการอ่าน — เติมตามระยะเลื่อนภายในเนื้อหาบทความ (#reading-article)
// สีใช้ dynamic accent (ผูกกับ cosmology ของหน้า) · เคารพ prefers-reduced-motion
export function ReadingProgress({ targetId = "reading-article" }: { targetId?: string }) {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const el = document.getElementById(targetId);
    if (!el) return;

    let raf = 0;
    const compute = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const total = rect.height - vh; // ระยะที่เลื่อนได้ภายในบทความ
      const scrolled = Math.min(Math.max(-rect.top, 0), Math.max(total, 0));
      const p = total > 0 ? (scrolled / total) * 100 : 0;
      setPct(Math.min(100, Math.max(0, p)));
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [targetId]);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[var(--z-overlay)] h-[3px] bg-transparent lg:hidden print:hidden"
      role="progressbar"
      aria-label="ความคืบหน้าการอ่าน"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full origin-left bg-accent transition-transform duration-150 ease-out motion-reduce:transition-none"
        style={{ transform: `scaleX(${pct / 100})` }}
      />
    </div>
  );
}
