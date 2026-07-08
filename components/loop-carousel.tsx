"use client";

// LoopCarousel — แถวการ์ดเลื่อนซ้าย/ขวาแบบวนไม่รู้จบ (infinite loop)
// เทคนิค: render ชุดการ์ด 3 รอบ แล้วดีดกลับเข้าชุดกลางเมื่อหยุดเลื่อน (seamless)
// รองรับ ลากนิ้ว/เมาส์ + ปุ่ม + คีย์บอร์ด · โชว์ ~3 การ์ด/จอ (ปรับตามจอ)
import {
  Children,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
  type PointerEvent as ReactPointerEvent,
  type MouseEvent as ReactMouseEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";

export function LoopCarousel({
  children,
  ariaLabel = "แถวการ์ดเลื่อนแนวนอนแบบวน",
}: {
  children: ReactNode;
  ariaLabel?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const items = Children.toArray(children);
  const drag = useRef({ down: false, startX: 0, startLeft: 0, moved: 0 });
  const settleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ดีดตำแหน่งกลับเข้าชุดกลาง (ทำตอนหยุดเลื่อนแล้ว เพื่อไม่ให้กระตุก)
  const recenter = useCallback(() => {
    const t = trackRef.current;
    if (!t || t.scrollWidth === 0) return;
    const set = t.scrollWidth / 3;
    if (t.scrollLeft < set * 0.5) t.scrollLeft += set;
    else if (t.scrollLeft > set * 1.5) t.scrollLeft -= set;
  }, []);

  useEffect(() => {
    const t = trackRef.current;
    if (!t) return;
    const init = requestAnimationFrame(() => {
      t.scrollLeft = t.scrollWidth / 3; // เริ่มที่ชุดกลาง
    });
    const onScroll = () => {
      if (settleTimer.current) clearTimeout(settleTimer.current);
      settleTimer.current = setTimeout(recenter, 130);
    };
    t.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", recenter);
    return () => {
      cancelAnimationFrame(init);
      if (settleTimer.current) clearTimeout(settleTimer.current);
      t.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", recenter);
    };
  }, [recenter]);

  const step = () => {
    const t = trackRef.current;
    if (!t) return 320;
    const first = t.querySelector<HTMLElement>("[data-loop-item]");
    return first ? first.offsetWidth + 20 : t.clientWidth / 3;
  };
  const go = (dir: number) => trackRef.current?.scrollBy({ left: dir * step(), behavior: "smooth" });

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const t = trackRef.current;
    if (!t) return;
    drag.current = { down: true, startX: e.clientX, startLeft: t.scrollLeft, moved: 0 };
    t.classList.add("cursor-grabbing");
    t.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    const t = trackRef.current;
    if (!d.down || !t) return;
    const dx = e.clientX - d.startX;
    d.moved = Math.max(d.moved, Math.abs(dx));
    t.scrollLeft = d.startLeft - dx;
  };
  const endDrag = () => {
    drag.current.down = false;
    trackRef.current?.classList.remove("cursor-grabbing");
  };
  const onClickCapture = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (drag.current.moved > 6) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.moved = 0;
    }
  };
  const onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      go(1);
      e.preventDefault();
    } else if (e.key === "ArrowLeft") {
      go(-1);
      e.preventDefault();
    }
  };

  const btn =
    "flex h-11 w-11 items-center justify-center rounded-full border border-border/40 text-text-secondary transition-all hover:border-accent/45 hover:text-text-heading focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none";

  return (
    <div>
      <div className="mb-5 flex items-center justify-end gap-2">
        <button type="button" onClick={() => go(-1)} aria-label="เลื่อนซ้าย" className={btn}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M15 5l-7 7 7 7" /></svg>
        </button>
        <button type="button" onClick={() => go(1)} aria-label="เลื่อนขวา" className={btn}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>

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
        className="flex cursor-grab gap-5 overflow-x-auto pb-4 [scrollbar-width:none] focus-visible:outline-none [&::-webkit-scrollbar]:hidden"
      >
        {[0, 1, 2].map((s) =>
          items.map((child, i) => (
            <div
              key={`${s}-${i}`}
              data-loop-item
              aria-hidden={s !== 1}
              className="flex shrink-0 basis-[84%] sm:basis-[calc((100%-20px)/2)] lg:basis-[calc((100%-40px)/3)]"
            >
              {child}
            </div>
          )),
        )}
      </div>
    </div>
  );
}
