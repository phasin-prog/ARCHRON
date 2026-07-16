"use client";

import { useState } from "react";

type PsycheFunction = "thinking" | "feeling" | "sensation" | "intuition" | "ego";

const COMPASS_DETAILS: Record<PsycheFunction, { title: string; subtitle: string; desc: string; stack: string }> = {
  thinking: {
    title: "Thinking (T): การคิด",
    subtitle: "การประเมินด้วยเหตุผล",
    desc: "ฟังก์ชันที่ใช้พิจารณาหลักการ เหตุผล และความสอดคล้องของข้อมูลก่อนตัดสินใจ",
    stack: "ช่วยจัดระเบียบความคิดและตรวจสอบความสัมพันธ์ระหว่างแนวคิด",
  },
  feeling: {
    title: "Feeling (F): ความรู้สึก",
    subtitle: "การประเมินคุณค่าและความสัมพันธ์",
    desc: "ฟังก์ชันที่ใช้พิจารณาคุณค่าของสิ่งต่าง ๆ และน้ำหนักของความสัมพันธ์ต่อบุคคลหรือสังคม",
    stack: "ช่วยประเมินว่าสิ่งใดสำคัญหรือเหมาะสมในบริบทนั้น",
  },
  sensation: {
    title: "Sensation (S): การรับรู้สัมผัส",
    subtitle: "การรับรู้ข้อเท็จจริงและรายละเอียด",
    desc: "ฟังก์ชันที่รับข้อมูลจากสิ่งที่เกิดขึ้นตรงหน้า ผ่านประสาทสัมผัส รายละเอียด และข้อเท็จจริงที่สังเกตได้",
    stack: "ช่วยให้กลับมาสังเกตสิ่งที่เกิดขึ้นจริงในปัจจุบัน",
  },
  intuition: {
    title: "Intuition (N): การหยั่งรู้",
    subtitle: "การรับรู้ความเป็นไปได้และแบบแผน",
    desc: "ฟังก์ชันที่มองหาความเชื่อมโยง ความเป็นไปได้ และความหมายที่อาจอยู่เบื้องหลังข้อมูลที่พบ",
    stack: "ช่วยมองภาพรวมและแนวโน้มที่อาจเกิดขึ้นต่อไป",
  },
  ego: {
    title: "Ego / Self Axis: ศูนย์กลางทางจิต",
    subtitle: "Ego และองค์รวมของ Psyche",
    desc: "Ego คือศูนย์กลางของจิตสำนึก ส่วน Self หมายถึงองค์รวมของชีวิตทางจิต แผนภาพนี้ใช้แสดงความสัมพันธ์ระหว่างฟังก์ชันต่าง ๆ",
    stack: "ใช้เป็นจุดตั้งต้นในการทำความเข้าใจความสัมพันธ์ระหว่างฟังก์ชัน",
  },
};

export function PsycheCompass() {
  const [activeFunc, setActiveFunc] = useState<PsycheFunction>("ego");
  const detail = COMPASS_DETAILS[activeFunc];

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative aspect-square w-full max-w-[320px] rounded-full border border-border/30 bg-bg/40 p-4 backdrop-blur-sm">
        <svg viewBox="0 0 320 320" className="h-full w-full">
          <defs>
            <radialGradient id="gold-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--color-premium)" stopOpacity="0.4" />
              <stop offset="100%" stopColor="var(--color-premium)" stopOpacity="0" />
            </radialGradient>
          </defs>

          <circle cx="160" cy="160" r="130" fill="none" stroke="var(--color-border)" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="160" cy="160" r="90" fill="none" stroke="var(--color-border)" strokeWidth="1" opacity="0.6" />
          <circle cx="160" cy="160" r="45" fill="none" stroke="var(--color-border)" strokeWidth="1" opacity="0.3" />
          <line x1="160" y1="30" x2="160" y2="290" stroke="var(--color-border)" strokeWidth="1" opacity="0.4" />
          <line x1="30" y1="160" x2="290" y2="160" stroke="var(--color-border)" strokeWidth="1" opacity="0.4" />

          {activeFunc === "thinking" && <line x1="160" y1="30" x2="160" y2="160" stroke="var(--color-accent)" strokeWidth="1.5" />}
          {activeFunc === "feeling" && <line x1="160" y1="290" x2="160" y2="160" stroke="var(--color-accent)" strokeWidth="1.5" />}
          {activeFunc === "intuition" && <line x1="30" y1="160" x2="160" y2="160" stroke="var(--color-accent)" strokeWidth="1.5" />}
          {activeFunc === "sensation" && <line x1="290" y1="160" x2="160" y2="160" stroke="var(--color-accent)" strokeWidth="1.5" />}

          {activeFunc === "thinking" && <circle cx="160" cy="30" r="24" fill="url(#gold-glow)" />}
          {activeFunc === "feeling" && <circle cx="160" cy="290" r="24" fill="url(#gold-glow)" />}
          {activeFunc === "intuition" && <circle cx="30" cy="160" r="24" fill="url(#gold-glow)" />}
          {activeFunc === "sensation" && <circle cx="290" cy="160" r="24" fill="url(#gold-glow)" />}
          {activeFunc === "ego" && <circle cx="160" cy="160" r="30" fill="url(#gold-glow)" />}

          <g className="cursor-pointer" onClick={() => setActiveFunc("thinking")} tabIndex={0} onKeyDown={(e) => e.key === "Enter" && setActiveFunc("thinking")} aria-label="ฟังก์ชันการคิด">
            <circle cx="160" cy="30" r="20" fill="var(--color-bg)" stroke={activeFunc === "thinking" ? "var(--color-accent)" : "var(--color-border)"} strokeWidth="1.5" />
            <text x="160" y="35" textAnchor="middle" fill={activeFunc === "thinking" ? "var(--color-accent)" : "var(--color-text-heading)"} fontSize="12" fontWeight="bold" fontFamily="monospace">T</text>
          </g>

          <g className="cursor-pointer" onClick={() => setActiveFunc("feeling")} tabIndex={0} onKeyDown={(e) => e.key === "Enter" && setActiveFunc("feeling")} aria-label="ฟังก์ชันความรู้สึก">
            <circle cx="160" cy="290" r="20" fill="var(--color-bg)" stroke={activeFunc === "feeling" ? "var(--color-accent)" : "var(--color-border)"} strokeWidth="1.5" />
            <text x="160" y="295" textAnchor="middle" fill={activeFunc === "feeling" ? "var(--color-accent)" : "var(--color-text-heading)"} fontSize="12" fontWeight="bold" fontFamily="monospace">F</text>
          </g>

          <g className="cursor-pointer" onClick={() => setActiveFunc("intuition")} tabIndex={0} onKeyDown={(e) => e.key === "Enter" && setActiveFunc("intuition")} aria-label="ฟังก์ชันการหยั่งรู้">
            <circle cx="30" cy="160" r="20" fill="var(--color-bg)" stroke={activeFunc === "intuition" ? "var(--color-accent)" : "var(--color-border)"} strokeWidth="1.5" />
            <text x="30" y="165" textAnchor="middle" fill={activeFunc === "intuition" ? "var(--color-accent)" : "var(--color-text-heading)"} fontSize="12" fontWeight="bold" fontFamily="monospace">N</text>
          </g>

          <g className="cursor-pointer" onClick={() => setActiveFunc("sensation")} tabIndex={0} onKeyDown={(e) => e.key === "Enter" && setActiveFunc("sensation")} aria-label="ฟังก์ชันการรับรู้สัมผัส">
            <circle cx="290" cy="160" r="20" fill="var(--color-bg)" stroke={activeFunc === "sensation" ? "var(--color-accent)" : "var(--color-border)"} strokeWidth="1.5" />
            <text x="290" y="165" textAnchor="middle" fill={activeFunc === "sensation" ? "var(--color-accent)" : "var(--color-text-heading)"} fontSize="12" fontWeight="bold" fontFamily="monospace">S</text>
          </g>

          <g className="cursor-pointer" onClick={() => setActiveFunc("ego")} tabIndex={0} onKeyDown={(e) => e.key === "Enter" && setActiveFunc("ego")} aria-label="ศูนย์กลาง Ego">
            <circle cx="160" cy="160" r="18" fill="var(--color-bg-card)" stroke={activeFunc === "ego" ? "var(--color-accent)" : "var(--color-border)"} strokeWidth="2" />
            <circle cx="160" cy="160" r="4" fill="var(--color-accent)" />
          </g>
        </svg>

        <span className="absolute -top-6 left-1/2 -translate-x-1/2 rounded bg-bg-card px-2 py-0.5 text-sm font-medium text-text-secondary/80">
          ผังฟังก์ชันจิต
        </span>
      </div>

      <div className="mt-6 w-full max-w-[340px] rounded-md border border-border/30 bg-bg-card/40 p-4 text-center backdrop-blur-sm">
        <h4 className="font-serif text-sm font-semibold text-accent">{detail.title}</h4>
        <p className="text-sm font-medium text-text-secondary/80">{detail.subtitle}</p>
        <p className="mt-2 text-xs leading-relaxed text-text-body/90">{detail.desc}</p>
        <p className="mt-2 border-t border-border/20 pt-2 text-[11px] italic text-accent/80">{detail.stack}</p>
      </div>
    </div>
  );
}
