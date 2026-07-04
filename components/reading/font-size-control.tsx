"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "archron-reading-font-size";
const STEPS = [0.85, 1, 1.15, 1.3, 1.5];
const STEP_LABELS = ["เล็ก", "ปกติ", "กลาง", "ใหญ่", "ใหญ่มาก"];

export function FontSizeControl() {
  const [step, setStep] = useState(1);

  useEffect(() => {
    try {
      const saved = parseInt(localStorage.getItem(STORAGE_KEY) ?? "1", 10);
      if (saved >= 0 && saved < STEPS.length) setStep(saved);
    } catch { /* */ }
  }, []);

  const apply = useCallback((s: number) => {
    setStep(s);
    try { localStorage.setItem(STORAGE_KEY, String(s)); } catch { /* */ }
    document.documentElement.style.setProperty("--reading-font-scale", String(STEPS[s]));
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty("--reading-font-scale", String(STEPS[step]));
  }, [step]);

  const canDown = step > 0;
  const canUp = step < STEPS.length - 1;

  return (
    <div className="inline-flex items-center gap-1 rounded-lg border border-slate-boundary/25 bg-surface-container/60 px-2 py-1 text-xs backdrop-blur">
      <span className="mr-1 text-muted">Aa</span>
      <button
        type="button"
        disabled={!canDown}
        onClick={() => canDown && apply(step - 1)}
        className="flex h-11 w-11 items-center justify-center rounded text-ivory transition-colors hover:bg-white/10 disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burnished-gold/50"
        aria-label="ลดขนาดตัวอักษร"
      >
        <span className="material-symbols-outlined text-[16px]">remove</span>
      </button>
      <span className="min-w-[48px] text-center text-muted" aria-live="polite">
        {STEP_LABELS[step]}
      </span>
      <button
        type="button"
        disabled={!canUp}
        onClick={() => canUp && apply(step + 1)}
        className="flex h-11 w-11 items-center justify-center rounded text-ivory transition-colors hover:bg-white/10 disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burnished-gold/50"
        aria-label="เพิ่มขนาดตัวอักษร"
      >
        <span className="material-symbols-outlined text-[16px]">add</span>
      </button>
    </div>
  );
}
