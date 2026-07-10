"use client";

import { useEffect, useRef, type ReactNode } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function Modal({ open, onClose, title, children, footer }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    cardRef.current?.focus();
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div
      className={`fixed inset-0 z-[var(--z-overlay)] flex items-center justify-center bg-black/45 transition-[opacity,visibility] duration-250 ${
        open ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        ref={cardRef}
        tabIndex={-1}
        className={`w-[min(90%,520px)] rounded-[18px] bg-bg-card shadow-[0_20px_60px_rgba(0,0,0,0.18)] overflow-hidden transition-[transform,opacity] duration-250 focus-visible:outline-none ${
          open ? "translate-y-0 scale-100 opacity-100" : "translate-y-5 scale-[.96] opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="flex items-center justify-between px-7 py-[22px] border-b border-border/60">
            <h2 className="font-heading text-[22px] text-text-heading">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              className="flex size-[38px] items-center justify-center rounded-[10px] border-none bg-bg-elevated text-lg text-text-secondary transition-colors hover:bg-border"
              aria-label="ปิด"
            >
              ✕
            </button>
          </div>
        )}

        <div className="px-7 py-[28px] text-text-body leading-relaxed">
          {children}
        </div>

        {footer && (
          <div className="flex items-center justify-end gap-3 px-7 py-[22px] border-t border-border/60">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
