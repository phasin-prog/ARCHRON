"use client";

import { useEffect } from "react";

// เปิดเอฟเฟกต์ค่อย ๆ ปรากฏเมื่อเลื่อนถึง (.scroll-reveal → .visible)
// progressive enhancement: ถ้าไม่มี JS มี noscript fallback ใน layout ให้แสดงทันที
//
// กันบั๊ก scroll-restoration race ตอนนำทาง client-side: เมื่อกดลิงก์จากกลาง-ล่างหน้า
// แล้วเด้งไปหน้าใหม่ scroll offset อาจยังไม่ reset ไปบนสุดในจังหวะที่ observer คำนวณรอบแรก
// ทำให้เนื้อหา above-the-fold ไม่ถูกเผย/ค้าง — แก้โดยเผย element ที่อยู่ในจอทันที
// ผ่าน rAF + setTimeout (หลัง scroll settle) ควบคู่กับ IntersectionObserver (สำหรับ below-fold)
export function ScrollReveal() {
  useEffect(() => {
    let io: IntersectionObserver | null = null;

    const reveal = (el: Element) => {
      el.classList.add("visible");
      io?.unobserve(el);
    };

    const remaining = () =>
      Array.from(document.querySelectorAll<HTMLElement>(".scroll-reveal:not(.visible)"));

    const initial = remaining();
    if (initial.length === 0) return;

    io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) reveal(entry.target);
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -100px 0px" },
    );
    initial.forEach((el) => io?.observe(el));

    // เผย element ที่อยู่ในจอ (หรือเหนือ fold) ทันที — กัน race ตอน scroll ยังไม่ reset
    const revealInView = () => {
      const vh = window.innerHeight || document.documentElement.clientHeight;
      remaining().forEach((el) => {
        if (el.getBoundingClientRect().top < vh * 0.9) reveal(el);
      });
    };

    const raf = requestAnimationFrame(() => requestAnimationFrame(revealInView));
    const t1 = window.setTimeout(revealInView, 250);
    const t2 = window.setTimeout(revealInView, 700);

    return () => {
      io?.disconnect();
      cancelAnimationFrame(raf);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  return null;
}
