"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

// ปุ่มเลื่อนขึ้นบนสุด (Back to Top) — โผล่เมื่อ scroll ลงพอประมาณ, มีทุกหน้า (อยู่ใน layout)
export function ScrollToTop() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);

  useEffect(() => {
    let rafId: number;
    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => setShow(window.scrollY > 400));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const toTop = () => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  if (pathname?.startsWith("/studio")) return null;

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label="เลื่อนขึ้นบนสุด"
      className={`fixed bottom-24 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-burnished-gold/40 bg-surface-container/80 text-burnished-gold shadow-[0_8px_24px_-8px_rgba(0,0,0,0.6)] backdrop-blur transition-all duration-300 hover:bg-burnished-gold hover:text-deep-navy md:bottom-6 ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <span className="material-symbols-outlined text-[22px]">arrow_upward</span>
    </button>
  );
}
