"use client";

import { useEffect, useRef, useMemo } from "react";

interface ScrollProgressBarProps {
  /** จำนวนช่วง (section) ที่จะแสดงเส้นแบ่งบนแถบ */
  totalSections?: number;
  /** id ของ element ที่ใช้คำนวณระยะเลื่อน (default: reading-article) */
  targetId?: string;
}

export function ScrollProgressBar({
  totalSections = 0,
  targetId = "reading-article",
}: ScrollProgressBarProps) {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = document.getElementById(targetId);
    if (!el) return;

    let raf = 0;
    const compute = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const total = rect.height - vh;
      const scrolled = Math.min(Math.max(-rect.top, 0), Math.max(total, 0));
      const p = total > 0 ? Math.min(100, Math.max(0, (scrolled / total) * 100)) : 0;
      if (barRef.current) {
        barRef.current.style.width = `${p}%`;
        barRef.current.setAttribute("aria-valuenow", Math.round(p).toString());
      }
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

  const dividers = useMemo(() => {
    if (totalSections < 2) return [];
    return Array.from({ length: totalSections - 1 }, (_, i) =>
      ((i + 1) / totalSections) * 100,
    );
  }, [totalSections]);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[var(--z-overlay)] h-[5px] bg-bg-elevated lg:hidden print:hidden"
      role="progressbar"
      aria-label="ความคืบหน้าการอ่านตามหัวข้อ"
      aria-valuenow={0}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        ref={barRef}
        className="absolute inset-y-0 left-0 bg-accent transition-all duration-150 ease-out motion-reduce:transition-none"
        style={{ width: "0%" }}
      />
      {dividers.map((pos) => (
        <div
          key={pos}
          className="absolute inset-y-0 w-px bg-border/60"
          style={{ left: `${pos}%` }}
        />
      ))}
    </div>
  );
}

