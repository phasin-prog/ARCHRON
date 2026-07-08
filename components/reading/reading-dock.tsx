"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type DockAction = {
  key: string;
  label: string;
  icon: string;
  run: () => void;
};

// Reading Dock — แถบเครื่องมือหน้าอ่าน (เฉพาะ desktop >= lg)
// downscoped: ไม่ใช่ macOS magnify dock · actions เฉพาะหน้าอ่าน ไม่ซ้ำ chrome เดิม
// hover: ไอคอน scale + ป้ายเลื่อนเข้า (transform/opacity เท่านั้น)
export function ReadingDock({ slug }: { slug: string }) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const actions: DockAction[] = [
    {
      key: "copy",
      label: copied ? "คัดลอกแล้ว" : "คัดลอกลิงก์",
      icon: copied ? "check" : "link",
      run: () => {
        navigator.clipboard
          ?.writeText(window.location.href)
          .then(() => {
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1500);
          })
          .catch(() => {});
      },
    },
    {
      key: "map",
      label: "ดูในแผนที่ความสัมพันธ์",
      icon: "hub",
      run: () => router.push(`/constellation?focus=${slug}`),
    },
    {
      key: "print",
      label: "พิมพ์ / บันทึก PDF",
      icon: "print",
      run: () => window.print(),
    },
  ];

  return (
    <div className="fixed right-4 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-2 lg:flex">
      {actions.map((a) => (
        <button
          key={a.key}
          type="button"
          onClick={a.run}
          aria-label={a.label}
          className="group relative flex items-center justify-end"
        >
          <span className="pointer-events-none absolute right-14 translate-x-2 whitespace-nowrap rounded-md border border-accent/15 bg-bg-card/95 px-3 py-1.5 text-sm text-text-heading opacity-0 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.6)] backdrop-blur transition duration-300 group-hover:translate-x-0 group-hover:opacity-100" aria-live="polite" aria-atomic="true">
            {a.label}
          </span>
          <span className="flex h-11 w-11 items-center justify-center rounded-full border border-accent/25 bg-bg-card/85 text-accent shadow-[0_8px_24px_-8px_rgba(0,0,0,0.6)] backdrop-blur transition-transform duration-300 group-hover:scale-110 group-hover:border-accent/50">
            <span className="material-symbols-outlined text-[20px]">{a.icon}</span>
          </span>
        </button>
      ))}
    </div>
  );
}
