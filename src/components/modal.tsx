"use client";

import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
};

const FOCUSABLE = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Modal({ open, onClose, title, children, footer, className = "" }: Props) {
  const [mounted, setMounted] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const prevFocusRef = useRef<HTMLElement | null>(null);
  const titleId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
      return;
    }
    if (e.key === "Tab" && containerRef.current) {
      const focusable = containerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (focusable.length === 0) {
        e.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    prevFocusRef.current = document.activeElement as HTMLElement;
    cardRef.current?.focus();
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      prevFocusRef.current?.focus();
    };
  }, [open, handleKeyDown]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!mounted || typeof document === "undefined") return null;

  return createPortal(
    <div
      ref={containerRef}
      className={`fixed inset-0 z-[var(--z-overlay)] overflow-y-auto bg-black/45 p-4 sm:p-6 transition-[opacity,visibility] duration-250 ${
        open ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? titleId : undefined}
    >
      <div
        className="flex min-h-full items-center justify-center py-4"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <div
          ref={cardRef}
          tabIndex={-1}
          className={`flex max-h-[calc(100vh-3rem)] w-[min(95%,540px)] flex-col rounded-[0.85rem] bg-bg-card shadow-[0_20px_60px_rgba(0,0,0,0.18)] overflow-hidden transition-[transform,opacity] duration-250 focus-visible:outline-none ${
            open ? "translate-y-0 scale-100 opacity-100" : "translate-y-5 scale-[.96] opacity-0"
          } ${className}`}
          onClick={(e) => e.stopPropagation()}
        >
          {title && (
            <div className="flex shrink-0 items-center justify-between px-6 py-4 sm:px-7 sm:py-[22px] border-b border-border/60 bg-bg-card">
              <h2 id={titleId} className="font-heading text-lg sm:text-[22px] text-text-heading">{title}</h2>
              <button
                type="button"
                onClick={onClose}
                className="flex size-[38px] shrink-0 items-center justify-center rounded-[10px] border-none bg-bg-elevated text-lg text-text-secondary transition-colors hover:bg-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                aria-label="ปิด"
              >
                ✕
              </button>
            </div>
          )}

          <div className="flex-1 overflow-y-auto px-6 py-5 sm:px-7 sm:py-[28px] text-text-body leading-relaxed overscroll-contain">
            {children}
          </div>

          {footer && (
            <div className="flex shrink-0 items-center justify-end gap-3 px-6 py-4 sm:px-7 sm:py-[22px] border-t border-border/60 bg-bg-card">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
