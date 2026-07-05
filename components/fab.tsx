"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { conceptRegistry } from "@/lib/content/concept-registry";

type FabAction = {
  key: string;
  label: string;
  icon: string;
  x: number;
  y: number;
  run: () => void;
};

// FAB + Radial — ปุ่มลัดลอย กางพัดเป็นเมนู (มุมล่างซ้าย, เฉพาะ desktop >= md)
// คุมโทน night-library: ทอง burnished, กางแบบสง่า, transform/opacity เท่านั้น
// เคารพ prefers-reduced-motion ผ่าน motion-reduce: · เลี่ยงชน Tabbar(มือถือ)/scroll-to-top(ล่างขวา)/Dock(กลางขวา)
export function Fab() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onClick = () => setOpen(false);
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, [open]);

  const go = (fn: () => void) => {
    fn();
    setOpen(false);
  };

  const randomConcept = () => {
    const c = conceptRegistry[Math.floor(Math.random() * conceptRegistry.length)];
    if (c) router.push(`/concepts/${c.slug}`);
  };

  // ตำแหน่งกางพัด (ควอเตอร์อาร์ก ขึ้น→ขวา จากมุมล่างซ้าย)
  const actions: FabAction[] = [
    { key: "search", label: "ค้นหา", icon: "search", x: 0, y: -84, run: () => router.push("/search") },
    { key: "map", label: "แผนที่ความสัมพันธ์", icon: "hub", x: 59, y: -59, run: () => router.push("/constellation") },
    { key: "random", label: "สุ่มแนวคิด", icon: "shuffle", x: 84, y: 0, run: randomConcept },
  ];

  // ไม่แสดงบนหน้า Studio
  if (pathname?.startsWith("/studio")) return null;

  return (
    <div
      id="fab-actions"
      className="fixed bottom-6 left-6 z-40 hidden md:block"
      onClick={(e) => e.stopPropagation()}
    >
      {actions.map((a, i) => (
        <button
          key={a.key}
          type="button"
          aria-label={a.label}
          tabIndex={open ? 0 : -1}
          onClick={() => go(a.run)}
          style={{
            transform: open
              ? `translate(${a.x}px, ${a.y}px) scale(1)`
              : "translate(0px, 0px) scale(0.5)",
            transitionDelay: `${open ? i * 40 : 0}ms`,
          }}
          className={`group absolute bottom-1.5 left-1.5 flex h-11 w-11 items-center justify-center rounded-full border border-burnished-gold/40 bg-surface-container/90 text-burnished-gold shadow-[0_8px_24px_-8px_rgba(0,0,0,0.6)] backdrop-blur transition-all duration-300 ease-out hover:bg-burnished-gold hover:text-deep-navy motion-reduce:transition-none ${
            open ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">{a.icon}</span>
          <span className="pointer-events-none absolute left-14 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md border border-burnished-gold/15 bg-surface-container/95 px-2.5 py-1 text-xs text-on-surface opacity-0 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.6)] backdrop-blur transition-opacity duration-200 group-hover:opacity-100">
            {a.label}
          </span>
        </button>
      ))}

      <button
        type="button"
        aria-label={open ? "ปิดเมนูลัด" : "เปิดเมนูลัด"}
        aria-expanded={open}
        aria-controls="fab-actions"
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-14 w-14 items-center justify-center rounded-full border border-burnished-gold/40 bg-gradient-to-br from-burnished-gold to-soft-gold text-prima shadow-[0_10px_30px_-8px_rgba(0,0,0,0.7)] transition-transform duration-300 hover:scale-105 motion-reduce:transition-none"
      >
        <span
          className={`material-symbols-outlined text-[26px] transition-transform duration-300 motion-reduce:transition-none ${
            open ? "rotate-45" : ""
          }`}
        >
          add
        </span>
      </button>
    </div>
  );
}
