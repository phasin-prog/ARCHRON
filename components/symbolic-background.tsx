"use client";

import { useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { routeCosmology } from "@/lib/content/cosmology";

type Position = { left: string; top: string };

const POSITIONS: Position[] = [
  { left: "5%", top: "12%" },
  { left: "88%", top: "20%" },
  { left: "45%", top: "65%" },
  { left: "8%", top: "78%" },
  { left: "78%", top: "75%" },
  { left: "50%", top: "8%" },
];

// แมป cosmology → ชุดสัญลักษณ์ (fallback ถ้า CSS --symbol-set ไม่พร้อม)
const SYMBOL_MAP: Record<string, string[]> = {
  prima:     ["Ω", "⬡", "◇", "⌾"],
  psyche:    ["Ψ", "☤", "◎", "∼"],
  lumen:     ["Φ", "☀", "✧", "⟡"],
  sapientia: ["⚜", "☸", "⬟", "⌘"],
  mercurius: ["☿", "⚡", "✎", "∞"],
  humanitas: ["☯", "◉", "⌂", "♢"],
};

export function SymbolicBackground() {
  const pathname = usePathname();
  const [symbols, setSymbols] = useState<string[]>([]);
  const [cosmology, setCosmology] = useState("sapientia");

  const updateFromDOM = useCallback(() => {
    const html = document.documentElement;
    const cos = html.getAttribute("data-cosmology") || routeCosmology(pathname ?? "/");
    setCosmology(cos);

    // ลองอ่านจาก CSS custom property ก่อน ถ้าไม่ได้ใช้ fallback
    const style = getComputedStyle(html);
    const raw = style.getPropertyValue("--symbol-set").trim();
    if (raw) {
      // รูปแบบ: "Ω" "⬡" "◇" "⌾" → แยกเป็น array
      const parts = raw.match(/"([^"]+)"/g)?.map((s) => s.slice(1, -1));
      if (parts && parts.length > 0) {
        setSymbols(parts);
        return;
      }
    }
    setSymbols(SYMBOL_MAP[cos] ?? SYMBOL_MAP.sapientia);
  }, [pathname]);

  useEffect(() => {
    updateFromDOM();
    // watch attribute change เผื่อ AccentController อัปเดตช้า
    const observer = new MutationObserver(() => updateFromDOM());
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-cosmology"],
    });
    return () => observer.disconnect();
  }, [updateFromDOM]);

  // เลือกตำแหน่งย่อยจาก POSITIONS ตามสัญลักษณ์ที่มี
  const items = symbols.map((sym, i) => {
    const pos = POSITIONS[i % POSITIONS.length];
    return { sym, pos, key: `${cosmology}-${i}` };
  });

  return (
    <div className="symbolic-bg" aria-hidden="true">
      {items.map(({ sym, pos, key }) => (
        <span
          key={key}
          className="symbolic-bg__item"
          style={{ left: pos.left, top: pos.top }}
        >
          {sym}
        </span>
      ))}
    </div>
  );
}
