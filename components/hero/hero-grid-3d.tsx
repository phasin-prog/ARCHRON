"use client";

import { useEffect, useRef } from "react";

// HeroGrid3D — พื้นหลัง Grid 3D แบบ full-page สำหรับ hero section
// สร้างจาก CSS perspective + multiple grid layers ที่หมุนได้เล็กน้อย
// Server-safe: ไม่มี JS heavy logic, ใช้ CSS ล้วน

export function HeroGrid3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      container.style.setProperty("--mx", `${x * 8}deg`);
      container.style.setProperty("--my", `${y * 6}deg`);
    };

    container.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => container.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="hero-grid-3d"
      aria-hidden="true"
      style={{
        // mouse tracking values (updated by JS)
        "--mx": "0deg",
        "--my": "0deg",
      } as React.CSSProperties}
    >
      {/* ชั้นหลัก: perspective grid ที่ responds กับ mouse */}
      <div className="hero-grid-3d__base" />

      {/* ชั้นที่ 2: secondary grid จางกว่า เลื่อนช้ากว่า (depth illusion) */}
      <div className="hero-grid-3d__depth" />

      {/* ชั้นที่ 3: glow lines ตามแกน X/Y ตัดกัน */}
      <div className="hero-grid-3d__glow" />

      {/* จุด intersection ประกายเล็กๆ */}
      <div className="hero-grid-3d__dots" />

      {/* Vignette — เจือจางขอบให้ content เด่น */}
      <div className="hero-grid-3d__vignette" />
    </div>
  );
}
