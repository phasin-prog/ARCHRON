"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// เปิดเอฟเฟกต์ค่อย ๆ ปรากฏ (.scroll-reveal → .visible) แบบทนทาน
// - CSS ซ่อนเฉพาะเมื่อ html มีคลาส js-reveal (เติมที่นี่ตอน JS พร้อม) → ถ้า JS ช้า/พลาด เนื้อหายังแสดง
// - ผูกกับ usePathname → re-scan ทุกการนำทาง (ไม่พึ่ง template re-mount อย่างเดียว)
// - เผยรอบแรกทันที (sync) กัน flash + ขับด้วย scroll/resize จริง (ทนทานกว่า IntersectionObserver)
// - เคารพ prefers-reduced-motion (บังคับ visible ใน globals.css)
export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;

    const remaining = () =>
      Array.from(document.querySelectorAll<HTMLElement>(".scroll-reveal:not(.visible)"));

    const revealInView = () => {
      const vh = window.innerHeight || document.documentElement.clientHeight;
      remaining().forEach((el) => {
        if (el.getBoundingClientRect().top < vh * 0.92) el.classList.add("visible");
      });
    };

    // ปิดเอฟเฟกต์แอนิเมชันทันทีบนหน้าจอขนาดเล็ก (Mobile/Tablet) เพื่อลดภาระการประมวลผลและการเลื่อนกระตุก
    if (typeof window !== "undefined" && window.innerWidth <= 768) {
      root.classList.add("js-reveal");
      document.querySelectorAll(".scroll-reveal").forEach((el) => {
        el.classList.add("visible");
      });
      return;
    }

    // เปิดโหมดซ่อน-แล้วเผย จากนั้นเผย element ที่อยู่ในจอทันที (sync, ก่อน paint รอบถัดไป → ไม่วาบ)
    root.classList.add("js-reveal");
    revealInView();

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(revealInView);
    };

    // เผยซ้ำหลัง layout settle (กัน race scroll-restoration ตอนนำทาง / ฟอนต์-ภาพโหลดช้า)
    const r1 = requestAnimationFrame(() => requestAnimationFrame(revealInView));
    const t1 = window.setTimeout(revealInView, 200);
    const t2 = window.setTimeout(revealInView, 600);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(r1);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  return null;
}
