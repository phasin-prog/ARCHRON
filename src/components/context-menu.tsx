"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type MouseEvent,
  type TouchEvent,
} from "react";
import { createPortal } from "react-dom";
import { SymbolIcon } from "@/components/icons";

export type ContextMenuItem = {
  label: string;
  icon?: string;
  onSelect: () => void;
};

type Pos = { x: number; y: number };

// ContextMenu — เมนูลัดแบบ wiki (คลิกขวา desktop / กดค้าง touch)
// ปิดเมื่อ: คลิกนอก · Esc · scroll · resize · clamp ไม่ให้ล้นจอ · กัน click ซ้อนหลัง long-press
// motion: ใช้ .menu-in เดิม (transform/opacity + เคารพ prefers-reduced-motion)
export function ContextMenu({
  items,
  children,
  className,
  as = "div",
}: {
  items: ContextMenuItem[];
  children: ReactNode;
  className?: string;
  as?: "div" | "span";
}) {
  const Wrapper = as;
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<Pos>({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement | null>(null);
  const pressTimer = useRef<number | null>(null);
  const suppressClick = useRef(false);

  const close = useCallback(() => setOpen(false), []);

  const openAt = useCallback((x: number, y: number) => {
    setPos({ x, y });
    setOpen(true);
  }, []);

  const onContextMenu = (e: MouseEvent) => {
    e.preventDefault();
    openAt(e.clientX, e.clientY);
  };

  const clearPress = useCallback(() => {
    if (pressTimer.current !== null) {
      window.clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  }, []);

  const onTouchStart = (e: TouchEvent) => {
    const t = e.touches[0];
    if (!t) return;
    const x = t.clientX;
    const y = t.clientY;
    clearPress();
    pressTimer.current = window.setTimeout(() => {
      suppressClick.current = true;
      openAt(x, y);
    }, 500);
  };

  // ถ้าเพิ่งเปิดเมนูด้วย long-press → กลืน click ที่ตามมา (กันเด้งลิงก์)
  const onClickCapture = (e: MouseEvent) => {
    if (suppressClick.current) {
      e.preventDefault();
      e.stopPropagation();
      suppressClick.current = false;
    }
  };

  useEffect(() => {
    if (!open) return;
    const onDocClick = () => close();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [open, close]);

  // clamp ตำแหน่งไม่ให้ล้นจอ + โฟกัสรายการแรก (ทำใน rAF เลี่ยง setState ใน effect body)
  useEffect(() => {
    return () => {
      clearPress();
    };
  }, [clearPress]);

  useEffect(() => {
    if (!open) return;
    const raf = requestAnimationFrame(() => {
      const el = menuRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const pad = 8;
      let x = pos.x;
      let y = pos.y;
      if (x + r.width + pad > window.innerWidth) x = window.innerWidth - r.width - pad;
      if (y + r.height + pad > window.innerHeight) y = window.innerHeight - r.height - pad;
      if (x < pad) x = pad;
      if (y < pad) y = pad;
      if (x !== pos.x || y !== pos.y) setPos({ x, y });
      el.querySelector<HTMLButtonElement>("[role='menuitem']")?.focus();
    });
    return () => cancelAnimationFrame(raf);
  }, [open, pos.x, pos.y]);

  return (
    <Wrapper
      className={className}
      onContextMenu={onContextMenu}
      onTouchStart={onTouchStart}
      onTouchEnd={clearPress}
      onTouchMove={clearPress}
      onClickCapture={onClickCapture}
    >
      {children}
      {open && typeof document !== "undefined"
        ? createPortal(
            <div
              ref={menuRef}
              role="menu"
              aria-label="เมนูลัด"
              className="menu-in fixed z-overlay min-w-48 overflow-hidden rounded-lg border border-accent/20 bg-bg-card/95 py-1.5 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.7)] backdrop-blur"
              style={{ left: pos.x, top: pos.y }}
              onClick={(e) => e.stopPropagation()}
            >
              {items.map((it) => (
                <button
                  key={it.label}
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    it.onSelect();
                    close();
                  }}
                  className="flex w-full items-center gap-2.5 px-4 py-3 text-left text-sm text-text-heading transition-colors hover:bg-accent/12 hover:text-accent focus:bg-accent/12 focus:text-accent focus:outline-none"
                >
                  {it.icon ? (
                    <SymbolIcon className="h-4 w-4 shrink-0 text-accent stroke-[1.75]" aria-hidden="true" />
                  ) : null}
                  {it.label}
                </button>
              ))}
            </div>,
            document.body,
          )
        : null}
    </Wrapper>
  );
}
