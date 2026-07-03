"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

// ReadingMobileBar - แถบเครื่องมือล่างมือถือสำหรับหน้าอ่าน (≤ lg)
// แสดง 3 actions: คัดลอกลิงก์ · ดูในแผนที่ · แชร์ (Web Share API)
// ซ้อนอยู่เหนือ Tabbar — เคารพ prefers-reduced-motion
export function ReadingMobileBar({ slug }: { slug: string }) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard
      ?.writeText(window.location.href)
      .then(() => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1500);
      })
      .catch(() => {});
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ url: window.location.href }).catch(() => {});
    } else {
      handleCopy();
    }
  };

  return (
    <div className="fixed inset-x-0 bottom-[calc(3.5rem+env(safe-area-inset-bottom))] z-30 flex items-center justify-center gap-1 border-t border-slate-boundary/30 bg-deep-navy/95 px-2 py-2 backdrop-blur lg:hidden print:hidden">
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? "คัดลอกลิงก์แล้ว" : "คัดลอกลิงก์"}
        className="flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs text-on-surface-variant transition-colors hover:bg-surface-container hover:text-accent active:scale-95 max-w-[120px]"
      >
        <span className="material-symbols-outlined text-[18px]">
          {copied ? "check" : "link"}
        </span>
        <span className="hidden sm:inline" aria-live="polite" aria-atomic="true">{copied ? "คัดลอกแล้ว" : "คัดลอกลิงก์"}</span>
      </button>

      <button
        type="button"
        onClick={() => router.push(`/constellation?focus=${slug}`)}
        aria-label="ดูในแผนที่ความสัมพันธ์"
        className="flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs text-on-surface-variant transition-colors hover:bg-surface-container hover:text-accent active:scale-95 max-w-[120px]"
      >
        <span className="material-symbols-outlined text-[18px]">hub</span>
        <span className="hidden sm:inline">แผนที่</span>
      </button>

      <button
        type="button"
        onClick={handleShare}
        aria-label="แชร์"
        className="flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs text-on-surface-variant transition-colors hover:bg-surface-container hover:text-accent active:scale-95 max-w-[120px]"
      >
        <span className="material-symbols-outlined text-[18px]">share</span>
        <span className="hidden sm:inline">แชร์</span>
      </button>
    </div>
  );
}