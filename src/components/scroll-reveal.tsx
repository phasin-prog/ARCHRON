"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function ScrollReveal() {
  const pathname = usePathname();
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const root = document.documentElement;

    if (typeof window !== "undefined" && window.innerWidth <= 768) {
      root.classList.add("js-reveal");
      document.querySelectorAll(".scroll-reveal").forEach((el) => {
        el.classList.add("visible");
      });
      return;
    }

    root.classList.add("js-reveal");

    observerRef.current?.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observerRef.current?.unobserve(entry.target);
          }
        }
      },
      {
        rootMargin: "0px 0px -5% 0px",
        threshold: 0.01,
      },
    );

    const all = document.querySelectorAll<HTMLElement>(".scroll-reveal");
    const viewportThreshold = window.innerHeight * 0.98;

    const geometryPass = Array.from(all).map((el) => ({
      el,
      top: el.getBoundingClientRect().top,
    }));

    for (const { el, top } of geometryPass) {
      if (top < viewportThreshold) {
        el.classList.add("visible");
      } else {
        observerRef.current?.observe(el);
      }
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [pathname]);

  return null;
}
