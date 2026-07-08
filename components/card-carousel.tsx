"use client";

// CardCarousel — แถวการ์ดเลื่อนซ้าย/ขวา (ลากด้วยนิ้ว/เมาส์ + ปุ่ม + คีย์บอร์ด)
// ใช้ครอบการ์ดอะไรก็ได้ (children) · snap เข้าตำแหน่ง · progress + ขอบจาง · เคารพ reduced-motion
import {
  Children,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type PointerEvent as ReactPointerEvent,
  type MouseEvent as ReactMouseEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";

export function CardCarousel({
  children,
  ariaLabel = "แถวการ์ดเลื่อนแนวนอน",
  fadeFrom = "var(--color-bg)",
}: {
  children: ReactNode;
  ariaLabel?: string;
  fadeFrom?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const movedRef = useRef(0);
  const dragRef = useRef<{ down: boolean; startX: number; startLeft: number }>({
    down: false,
    startX: 0,
    startLeft: 0,
  });
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const step = useCallback(() => {
    const t = trackRef.current;
    if (!t) return 320;
    return Math.min(t.clientWidth * 0.85, 360);
  }, []);

  const update = useCallback(() => {
    const t = trackRef.current;
    if (!t) return;
    const max = t.scrollWidth - t.clientWidth;
    const x = t.scrollLeft;
    setAtStart(x <= 2);
    setAtEnd(x >= max - 2);
    const bar = barRef.current;
    if (bar) {
      const vis = t.scrollWidth > 0 ? t.clientWidth / t.scrollWidth : 1;
      const ratio = max > 0 ? x / max : 0;
      bar.style.width = `${Math.max(12, vis * 100)}%`;
      bar.style.transform = `translateX(${ratio * (100 / Math.max(vis, 0.0001) - 100)}%)`;
    }
  }, []);

  useEffect(() => {
    const t = trackRef.current;
    if (!t) return;
    let rafId: number;
    const handleScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    };
    handleScroll();
    t.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      cancelAnimationFrame(rafId);
      t.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [update]);

  const scrollByDir = (dir: number) => {
    trackRef.current?.scrollBy({ left: dir * step(), behavior: "smooth" });
  };

  // ลากด้วยเมาส์ (touch ใช้ native scroll)
  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const t = trackRef.current;
    if (!t) return;
    dragRef.current = { down: true, startX: e.clientX, startLeft: t.scrollLeft };
    movedRef.current = 0;
    t.classList.add("cursor-grabbing");
    t.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = dragRef.current;
    const t = trackRef.current;
    if (!d.down || !t) return;
    const dx = e.clientX - d.startX;
    movedRef.current = Math.max(movedRef.current, Math.abs(dx));
    t.scrollLeft = d.startLeft - dx;
  };
  const endDrag = () => {
    dragRef.current.down = false;
    trackRef.current?.classList.remove("cursor-grabbing");
  };
  // กันคลิกลิงก์เผลอหลังลาก
  const onClickCapture = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (movedRef.current > 6) {
      e.preventDefault();
      e.stopPropagation();
      movedRef.current = 0;
    }
  };
  const onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      scrollByDir(1);
      e.preventDefault();
    } else if (e.key === "ArrowLeft") {
      scrollByDir(-1);
      e.preventDefault();
    }
  };

  return (
    <div>
      {/* ปุ่มเลื่อน */}
      <div className="mb-5 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => scrollByDir(-1)}
          disabled={atStart}
          aria-label="เลื่อนซ้าย"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-border/40 text-text-secondary transition-all hover:border-accent/45 hover:text-text-heading disabled:opacity-30 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => scrollByDir(1)}
          disabled={atEnd}
          aria-label="เลื่อนขวา"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-border/40 text-text-secondary transition-all hover:border-accent/45 hover:text-text-heading disabled:opacity-30 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="relative">
        {/* ขอบจางซ้าย/ขวา บอกว่ายังมีการ์ดต่อ */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-14 transition-opacity duration-300"
          style={{ background: `linear-gradient(90deg, ${fadeFrom}, transparent)`, opacity: atStart ? 0 : 1 }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-14 transition-opacity duration-300"
          style={{ background: `linear-gradient(270deg, ${fadeFrom}, transparent)`, opacity: atEnd ? 0 : 1 }}
          aria-hidden="true"
        />

        <div
          ref={trackRef}
          tabIndex={0}
          role="group"
          aria-label={ariaLabel}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onClickCapture={onClickCapture}
          onKeyDown={onKeyDown}
          className="flex cursor-grab snap-x snap-mandatory gap-6 overflow-x-auto pb-4 [scrollbar-width:none] focus-visible:outline-none [&::-webkit-scrollbar]:hidden"
        >
          {Children.map(children, (child) => (
            <div className="flex shrink-0 basis-[82vw] snap-start sm:basis-[340px]">{child}</div>
          ))}
        </div>
      </div>

      {/* แถบความคืบหน้า */}
      <div className="mt-2 h-[3px] overflow-hidden rounded-full bg-border/20">
        <div ref={barRef} className="h-full rounded-full bg-accent/70" style={{ width: "30%" }} />
      </div>
    </div>
  );
}
