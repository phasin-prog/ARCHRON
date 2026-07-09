"use client";

import { useRef } from "react";
import { useIsomorphicLayoutEffect } from "@/lib/hooks/use-isomorphic-layout-effect";
import { gsap } from "gsap";

// VesicaUnity — vesica logomark เคลื่อนไหวด้วย GSAP สื่อ "unity ของศาสตร์"
// สองวง (ศาสตร์สองสาย) ค่อย ๆ เคลื่อนเข้าหา → ซ้อนกัน → จุดศูนย์ (มนุษย์) สว่างขึ้น
// loop ช้า ~6s · เคารพ prefers-reduced-motion (ปิด timeline แสดงสถานะสุดท้าย)
//
// Type-safe: ref ใช้ useRef<SVGSVGElement>, ไม่เรียก .current ตอน render
// SSR-safe: useIsomorphicLayoutEffect ไม่ทำงานบน server
// Cleanup: gsap.context() + revert ใน effect return (กัน memory leak)

type Props = {
  className?: string;
};

export function VesicaUnity({ className }: Props) {
  const rootRef = useRef<SVGSVGElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // ปิด animation ถ้าผู้ใช้งดการเคลื่อนไหว → คงสถานะ "unity" (วงซ้อน + จุดสว่าง)
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ repeat: -1, defaults: { ease: "power2.inOut" } });

      // ค่าเริ่มต้น: สองวงแยกกัน (offset ±8), จุดศูนย์หรือเล็ก/จาง
      gsap.set(".vu-circle-left", { attr: { cx: 16.5 } });
      gsap.set(".vu-circle-right", { attr: { cx: 31.5 } });
      gsap.set(".vu-center", { scale: 0.4, transformOrigin: "24px 24px", opacity: 0.35 });

      tl.to(".vu-circle-left", { attr: { cx: 17.5 }, duration: 2.4 })
        .to(
          ".vu-circle-right",
          { attr: { cx: 30.5 }, duration: 2.4 },
          "<",
        )
        // ซ้อนกันแล้ว → จุดศูนย์สว่างขึ้น
        .to(".vu-center", { scale: 1, opacity: 1, duration: 1.2, ease: "power2.out" }, "-=0.6")
        // คงสถานะ unity
        .to({}, { duration: 1.6 })
        // ค่อย ๆ แยก กลับเริ่มใหม่
        .to(".vu-center", { scale: 0.4, opacity: 0.35, duration: 1.0, ease: "power2.in" })
        .to(".vu-circle-left", { attr: { cx: 16.5 }, duration: 1.6 }, "<")
        .to(".vu-circle-right", { attr: { cx: 31.5 }, duration: 1.6 }, "<");

      return () => {
        tl.kill();
      };
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <svg
      ref={rootRef}
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
    >
      {/* วงรอบใหญ่ (อารยธรรม) — คงที่ */}
      <circle cx="24" cy="24" r="21" strokeWidth="1" opacity="0.35" />
      {/* จุดบน/ล่าง (ขอบเขต) — คงที่ */}
      <circle cx="24" cy="3.5" r="1.3" fill="currentColor" stroke="none" opacity="0.7" />
      <circle cx="24" cy="44.5" r="1.3" fill="currentColor" stroke="none" opacity="0.7" />
      {/* สองวงซ้อน (ศาสตร์สองสาย) — เคลื่อนไหว */}
      <circle className="vu-circle-left" cx="17.5" cy="24" r="12.5" strokeWidth="1.4" />
      <circle className="vu-circle-right" cx="30.5" cy="24" r="12.5" strokeWidth="1.4" />
      {/* จุดศูนย์กลาง (มนุษย์/unity) — pulse */}
      <circle className="vu-center" cx="24" cy="24" r="2.6" fill="currentColor" stroke="none" />
    </svg>
  );
}
