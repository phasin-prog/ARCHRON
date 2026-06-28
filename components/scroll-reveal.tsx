"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// เปิดเอฟเฟกต์ค่อย ๆ ปรากฏเมื่อเลื่อนถึง (.scroll-reveal → .visible)
// progressive enhancement: ถ้าไม่มี JS มี noscript fallback ใน layout ให้แสดงทันที
//
// กันบั๊ก scroll-restoration race ตอนนำทาง client-side: เมื่อกดลิงก์จากกลาง-ล่างหน้า
// แล้วเด้งไปหน้าใหม่ scroll offset อาจยังไม่ reset ไปบนสุดในจังหวะที่ observer คำนวณรอบแรก
// ทำให้เนื้อหา above-the-fold ไม่ถูกเผย/ค้าง — แก้ไขโดยการใช้ MutationObserver 
// คอยเฝ้าสแกนเนื้อหาที่เรนเดอร์ช้า ร่วมกับการใช้ usePathname ดักจับการเปลี่ยนหน้า
export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    let io: IntersectionObserver | null = null;
    let mo: MutationObserver | null = null;

    const reveal = (el: Element) => {
      el.classList.add("visible");
      io?.unobserve(el);
    };

    // ตรวจสอบและสั่งให้เผยแพร่ element ทันทีหากอยู่เหนือแนวระดับ fold ของหน้าจอ
    const observeElement = (el: Element) => {
      if (el.classList.contains("visible")) return;

      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      
      // ตรวจสอบจุด Above-the-fold (ถ้าอยู่ครึ่งบนของหน้าจอหรือด้านบนเลย ให้แสดงทันทีเพื่อป้องกันหน้าขาวค้าง)
      if (rect.top < vh * 0.85) {
        reveal(el);
        return;
      }

      io?.observe(el);
    };

    io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            reveal(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px -50px 0px" },
    );

    // 1. สังเกตองค์ประกอบที่มีอยู่แล้วใน DOM ณ ตอนนี้
    const initialElements = document.querySelectorAll(".scroll-reveal:not(.visible)");
    initialElements.forEach(observeElement);

    // 2. ใช้ MutationObserver ดักสแกน element .scroll-reveal ที่เรนเดอร์ขึ้นมาทีหลัง (จาก RSC payload/Async)
    mo = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            if (node.classList.contains("scroll-reveal")) {
              observeElement(node);
            }
            node.querySelectorAll(".scroll-reveal:not(.visible)").forEach(observeElement);
          }
        });
      });
    });

    mo.observe(document.body, { childList: true, subtree: true });

    // 3. ป้องกัน race condition หลังหน้าเปลี่ยน ให้นับเวลาและตรวจเช็คซ้ำอีก 3 รอบ (ในกรณี scroll เด้งช้า)
    const checkAllInView = () => {
      const vh = window.innerHeight || document.documentElement.clientHeight;
      document.querySelectorAll(".scroll-reveal:not(.visible)").forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < vh * 0.9) {
          reveal(el);
        }
      });
    };

    const t1 = window.setTimeout(checkAllInView, 100);
    const t2 = window.setTimeout(checkAllInView, 350);
    const t3 = window.setTimeout(checkAllInView, 800);

    return () => {
      io?.disconnect();
      mo?.disconnect();
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, [pathname]);

  return null;
}
