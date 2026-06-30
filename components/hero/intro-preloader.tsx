"use client";

import { useState, useRef } from "react";
import { useIsomorphicLayoutEffect } from "@/lib/hooks/use-isomorphic-layout-effect";
import { gsap } from "gsap";

// ภพ · วงกลมธรรมชาติ · Magnetic Field — ARCHRON intro preloader
//
// Ahe (α = จุดกำเนิด) + Chronos (χρόνος = เวลา) = จุดเริ่มต้นแห่งกาลเวลา
//
// Phase 1 — Emergence: จุดแสง (Ahe) เกิดจากความมืด ล้อมด้วย halo จาง
// Phase 2 — Vesica Piscis: สองวงกลมธรรมชาติเคลื่อนเข้าหา → ซ้อนกัน (vesica)
//           สื่อ "จุดกำเนิดของความรู้" — วงคือ ศาสตร์สองสาย บรรจบ
// Phase 3 — Magnetic Field: เส้นสนามแม่เหล็ก (dipole) ลากตัวเองรอบ vesica
//           สื่อ "แรงดึงดูดของความจริง" อนุภาคโคจรเข้าหาศูนย์กลาง
// Phase 4 — Bhava Cycle: วงแหวน 3 วง (ภพ 3 — อดีต ปัจจุบัน อนาคต)
//           หมุนรอบจุดศูนย์ สื่อ "วงจรแห่งการดำรงอยู่"
// Phase 5 — Wordmark: Ahe + Chronos ปรากฏ → วงกลมขยาย + ละลาย → เผยหน้าเว็บ
//
// เล่นครั้งเดียวต่อ session (sessionStorage) · เคารพ prefers-reduced-motion
// กด/คลิกเพื่อข้าม · Type-safe · SSR-safe
// Cleanup: gsap.context() + revert (กัน memory leak)

const STORAGE_KEY = "archron-intro-played";
const CX = 200;
const CY = 200;

export function IntroPreloader() {
  const [visible, setVisible] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let alreadyPlayed = false;
    try {
      alreadyPlayed = sessionStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      /* private mode */
    }

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (alreadyPlayed || prefersReduced) {
      setVisible(false);
      return;
    }

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const ctx = gsap.context(() => {
      gsap.set(".intro-line", { strokeDasharray: 600, strokeDashoffset: 600 });
      gsap.set(".intro-vesica", { opacity: 0 });
      gsap.set(".intro-bhava", { opacity: 0, scale: 0.6 });
      gsap.set(".intro-ahe", { opacity: 0, scale: 0 });

      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        onComplete: () => {
          try { sessionStorage.setItem(STORAGE_KEY, "1"); } catch { /* noop */ }
          document.body.style.overflow = prevOverflow;
          setVisible(false);
        },
      });
      tlRef.current = tl;
      const O = `${CX}px ${CY}px`;

      // ── Phase 1: Ahe (α) — จุดกำเนิดจากความมืด ──
      tl.fromTo(".intro-halo",
        { opacity: 0, scale: 0.3 },
        { opacity: 0.8, scale: 1, duration: 0.8, transformOrigin: O },
      )
      .fromTo(".intro-ahe",
        { opacity: 0, scale: 0 },
        { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.7)", transformOrigin: O },
        "-=0.4",
      )

      // ── Phase 2: Vesica Piscis — สองวงกลมธรรมชาติเคลื่อนเข้าหา ──
      .to(".intro-vesica", { opacity: 0.9, duration: 0.3 }, "-=0.1")
      .fromTo(".intro-vesica-left",
        { attr: { cx: 120 } },
        { attr: { cx: 172 }, duration: 1.2, ease: "power2.inOut" },
      )
      .fromTo(".intro-vesica-right",
        { attr: { cx: 280 } },
        { attr: { cx: 228 }, duration: 1.2, ease: "power2.inOut" },
        "<",
      )
      // Vesica ซ้อนกัน → ahe ขยายเล็กน้อย
      .to(".intro-ahe", { scale: 1.15, duration: 0.4, transformOrigin: O }, "-=0.3")

      // ── Phase 3: Magnetic Field — เส้นสนามลากตัวเองรอบ vesica ──
      .to(".intro-field", { opacity: 0.8, duration: 0.2 }, "-=0.1")
      .to(".intro-line", {
        strokeDashoffset: 0,
        duration: 1.2,
        stagger: 0.08,
        ease: "power2.inOut",
      }, "-=0.1")

      // ── Phase 4: Bhava Cycle — วงแหวน 3 วง (อดีต ปัจจุบัน อนาคต) ──
      .to(".intro-bhava", { opacity: 0.7, duration: 0.3 }, "-=0.8")
      .fromTo(".intro-bhava-ring-1",
        { rotation: 0 },
        { rotation: 120, duration: 2.5, ease: "none", transformOrigin: O },
        "-=1.0",
      )
      .fromTo(".intro-bhava-ring-2",
        { rotation: 0 },
        { rotation: -120, duration: 2.5, ease: "none", transformOrigin: O },
        "<",
      )
      .fromTo(".intro-bhava-ring-3",
        { rotation: 0 },
        { rotation: 60, duration: 2.5, ease: "none", transformOrigin: O },
        "<",
      )

      // ── Phase 4b: Convergence — อนุภาคถูกดึงเข้า + สนามจาง ──
      .to(".intro-line", { opacity: 0.3, duration: 0.5 }, "-=1.2")
      .to(".intro-ahe", { scale: 1.3, duration: 0.4, transformOrigin: O }, "-=1.0")
      .to(".intro-bhava", { scale: 1.2, opacity: 0.5, duration: 0.5, transformOrigin: O }, "<")

      // ── Phase 5: Wordmark — Ahe + Chronos ปรากฏ ──
      .fromTo(".intro-wordmark-ahe",
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.5 },
        "-=0.3",
      )
      .fromTo(".intro-wordmark-plus",
        { opacity: 0, scale: 0.5 },
        { opacity: 1, scale: 1, duration: 0.3 },
        "-=0.2",
      )
      .fromTo(".intro-wordmark-chronos",
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.5 },
        "-=0.1",
      )

      // ── Phase 6: Reveal — วงกลมขยาย + ละลาย → เผยหน้าเว็บ ──
      .to({}, { duration: 0.4 })
      .to(".intro-ahe", { scale: 4, opacity: 0, duration: 0.7, ease: "power2.inOut", transformOrigin: O })
      .to(".intro-ring", { scale: 3.5, opacity: 0, duration: 0.7, ease: "power2.inOut", transformOrigin: O }, "<")
      .to(".intro-halo", { scale: 2.5, opacity: 0, duration: 0.7, ease: "power2.inOut", transformOrigin: O }, "<")
      .to(".intro-vesica, .intro-field, .intro-bhava", { opacity: 0, duration: 0.4 }, "<")
      .to(".intro-wordmark-ahe, .intro-wordmark-plus, .intro-wordmark-chronos",
        { opacity: 0, y: -8, duration: 0.3 }, "<")
      .to(root, { opacity: 0, duration: 0.3, ease: "power2.inOut" }, "-=0.2");
    }, rootRef);

    const skip = () => {
      if (tlRef.current) tlRef.current.kill();
      try { sessionStorage.setItem(STORAGE_KEY, "1"); } catch { /* noop */ }
      document.body.style.overflow = prevOverflow;
      setVisible(false);
    };
    root.addEventListener("click", skip);
    window.addEventListener("keydown", skip);

    return () => {
      ctx.revert();
      root.removeEventListener("click", skip);
      window.removeEventListener("keydown", skip);
      document.body.style.overflow = prevOverflow;
      if (tlRef.current) tlRef.current.kill();
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-deep-navy"
      aria-hidden="true"
      role="presentation"
    >
      <svg
        viewBox="0 0 400 400"
        className="h-[min(55vh,380px)] w-[min(55vh,380px)]"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="ig-core-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#E7D7A6" stopOpacity="0.95" />
            <stop offset="35%" stopColor="#B58D4A" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#B58D4A" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="ig-halo-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#B58D4A" stopOpacity="0.2" />
            <stop offset="55%" stopColor="#B58D4A" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#B58D4A" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Halo — เรืองแสงรอบจุดกำเนิด */}
        <circle className="intro-halo" cx={CX} cy={CY} r="175" fill="url(#ig-halo-grad)" opacity="0" />

        {/* Vesica Piscis — สองวงกลมธรรมชาติ */}
        <g className="intro-vesica">
          <circle className="intro-vesica-left" cx="120" cy={CY} r="80"
            stroke="var(--color-antique-gold)" strokeWidth="1" opacity="0.35" />
          <circle className="intro-vesica-right" cx="280" cy={CY} r="80"
            stroke="var(--color-antique-gold)" strokeWidth="1" opacity="0.35" />
          {/* เส้น界定 vesica (intersection) */}
          <ellipse cx={CX} cy={CY} rx="28" ry="80"
            stroke="var(--color-soft-gold)" strokeWidth="0.8" opacity="0.2" strokeDasharray="4 3" />
        </g>

        {/* Magnetic Field — dipole lines */}
        <g className="intro-field" style={{ stroke: "var(--color-antique-gold)", opacity: 0 }} fill="none" strokeWidth="0.8" strokeLinecap="round">
          <path className="intro-line" d="M 200,160 C 250,160 250,240 200,240" />
          <path className="intro-line" d="M 200,160 C 310,160 310,240 200,240" />
          <path className="intro-line" d="M 200,160 C 360,160 360,240 200,240" />
          <path className="intro-line" d="M 200,160 C 140,160 140,240 200,240" />
          <path className="intro-line" d="M 200,160 C 90,160 90,240 200,240" />
          <path className="intro-line" d="M 200,160 C 40,160 40,240 200,240" />
        </g>

        {/* จุดกำเนิด Ahe (α) — แกนกลาง */}
        <circle className="intro-ahe" cx={CX} cy={CY} r="38" fill="url(#ig-core-grad)" opacity="0" />
        <circle className="intro-ring" cx={CX} cy={CY} r="32"
          stroke="var(--color-soft-gold)" strokeWidth="1.2" fill="none" opacity="0" />

        {/* Bhava Cycle — วงแหวน 3 วง (อดีต ปัจจุบัน อนาคต) */}
        <g className="intro-bhava">
          <circle className="intro-bhava-ring-1" cx={CX} cy={CY} r="110"
            stroke="var(--color-antique-gold)" strokeWidth="0.6" opacity="0.25" strokeDasharray="8 12" />
          <circle className="intro-bhava-ring-2" cx={CX} cy={CY} r="130"
            stroke="var(--color-soft-gold)" strokeWidth="0.5" opacity="0.18" strokeDasharray="6 14" />
          <circle className="intro-bhava-ring-3" cx={CX} cy={CY} r="150"
            stroke="var(--color-antique-gold)" strokeWidth="0.4" opacity="0.12" strokeDasharray="4 16" />
          {/* จุดบนวงแหวน — แทน ภพ 3 */}
          <circle cx="200" cy="90" r="2.5" fill="var(--color-soft-gold)" opacity="0.5" />
          <circle cx="295" cy="255" r="2.5" fill="var(--color-soft-gold)" opacity="0.5" />
          <circle cx="105" cy="255" r="2.5" fill="var(--color-soft-gold)" opacity="0.5" />
        </g>
      </svg>

      {/* Wordmark — Ahe + Chronos */}
      <div className="flex items-center gap-2">
        <span className="intro-wordmark-ahe font-cinzel text-lg font-semibold tracking-[0.35em] text-ivory/80 opacity-0">
          Ahe
        </span>
        <span className="intro-wordmark-plus font-cinzel text-xs text-burnished-gold/60 opacity-0">
          +
        </span>
        <span className="intro-wordmark-chronos font-cinzel text-lg font-semibold tracking-[0.35em] text-ivory/80 opacity-0">
          Chronos
        </span>
      </div>
      <span className="intro-wordmark-ahe font-cinzel text-[10px] tracking-[0.6em] text-burnished-gold/40 opacity-0">
        ARCHRON
      </span>
    </div>
  );
}
