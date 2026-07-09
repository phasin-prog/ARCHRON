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
    <div className="fixed inset-x-0 bottom-[56px] z-30 flex items-center justify-center gap-1 border-t border-border/30 bg-bg/95 px-2 py-2 backdrop-blur [bottom:calc(56px+env(safe-area-inset-bottom))] lg:hidden print:hidden">
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? "คัดลอกลิงก์แล้ว" : "คัดลอกลิงก์"}
        className="flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs text-text-secondary transition-colors hover:bg-bg-card hover:text-accent active:scale-95 max-w-[160px]"
      >
        <span className="inline-flex items-center justify-center w-[18px] h-[18px] text-[18px]" aria-hidden="true">
          {copied ? "✓" : "🔗"}
        </span>
        <span className="hidden sm:inline" aria-live="polite" aria-atomic="true">{copied ? "คัดลอกแล้ว" : "คัดลอกลิงก์"}</span>
      </button>

      <button
        type="button"
        onClick={() => router.push(`/constellation?focus=${slug}`)}
        aria-label="ดูในแผนที่ความสัมพันธ์"
        className="flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs text-text-secondary transition-colors hover:bg-bg-card hover:text-accent active:scale-95 max-w-[160px]"
      >
        <span className="inline-flex items-center justify-center w-[18px] h-[18px] text-[18px]" aria-hidden="true">✦</span>
        <span className="hidden sm:inline">แผนที่</span>
      </button>

      <button
        type="button"
        onClick={handleShare}
        aria-label="แชร์"
        className="flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs text-text-secondary transition-colors hover:bg-bg-card hover:text-accent active:scale-95 max-w-[160px]"
      >
        <span className="inline-flex items-center justify-center w-[18px] h-[18px] text-[18px]" aria-hidden="true">↗</span>
        <span className="hidden sm:inline">แชร์</span>
      </button>
    </div>
  );
}