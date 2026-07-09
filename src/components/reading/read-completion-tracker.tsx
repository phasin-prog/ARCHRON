"use client";

import { useEffect, useRef } from "react";
import { recordReadCompletion } from "@/lib/content/reading-actions";

// ตัวติดตาม "อ่านจบ" อัตโนมัติ (ไม่มีปุ่มกด — Decisions ข้อ 2)
// เงื่อนไข: เลื่อนถึง sentinel ท้ายเนื้อหา (IntersectionObserver) และ
//           ค้างหน้าครบเวลาขั้นต่ำ (dwell) → เรียก server action หนึ่งครั้ง
// กันยิงซ้ำ: ref ภายในหน้า + sessionStorage per-slug
// ปลอดภัยสำหรับผู้ไม่ล็อกอิน: action จะ no-op เอง (ไม่ throw)

const DWELL_MS = 15000; // เวลาค้างหน้าขั้นต่ำ 15 วินาที (ปรับได้)

export function ReadCompletionTracker({
  slug,
  contentType,
}: {
  slug: string;
  contentType: string;
}) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const firedRef = useRef(false);
  const bottomReachedRef = useRef(false);
  const dwellDoneRef = useRef(false);

  useEffect(() => {
    if (!slug) return;

    const storageKey = `archron:read:${slug}`;
    // ยิงไปแล้วใน session นี้ → ข้าม
    try {
      if (sessionStorage.getItem(storageKey) === "1") {
        firedRef.current = true;
        return;
      }
    } catch {
      // sessionStorage อาจถูกปิด — เดินหน้าต่อโดยไม่ persist
    }

    const maybeFire = () => {
      if (firedRef.current) return;
      if (!bottomReachedRef.current || !dwellDoneRef.current) return;
      firedRef.current = true;
      try {
        sessionStorage.setItem(storageKey, "1");
      } catch {
        // ไม่เป็นไร
      }
      // fire-and-forget — ไม่ให้ error ล้มหน้าอ่าน
      void recordReadCompletion(slug, contentType).catch(() => {});
    };

    // 1) dwell timer
    const timer = window.setTimeout(() => {
      dwellDoneRef.current = true;
      maybeFire();
    }, DWELL_MS);

    // 2) sentinel ถึงท้ายเนื้อหา
    const el = sentinelRef.current;
    let observer: IntersectionObserver | null = null;
    if (el && "IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              bottomReachedRef.current = true;
              maybeFire();
            }
          }
        },
        { root: null, threshold: 0.1 },
      );
      observer.observe(el);
    } else {
      // ไม่มี IO → ถือว่าถึงท้ายเมื่อครบ dwell (fallback ปลอดภัย)
      bottomReachedRef.current = true;
    }

    return () => {
      window.clearTimeout(timer);
      if (observer) observer.disconnect();
    };
  }, [slug, contentType]);

  // sentinel ล่องหน — วางไว้ท้ายเนื้อหา
  return <div ref={sentinelRef} aria-hidden="true" className="h-px w-full" />;
}
