"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function CardTilt({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const enter = () => {
      el.style.willChange = "transform";
    };

    const move = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rx = ((y - cy) / cy) * -6;
      const ry = ((x - cx) / cx) * 6;
      el.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px) scale(1.01)`;
    };

    const leave = () => {
      el.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)";
      el.style.willChange = "auto";
    };

    el.addEventListener("mouseenter", enter);
    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", leave);
    return () => {
      el.removeEventListener("mouseenter", enter);
      el.removeEventListener("mousemove", move);
      el.removeEventListener("mouseleave", leave);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`archron-card ${className}`}
      style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
    >
      {children}
    </div>
  );
}
