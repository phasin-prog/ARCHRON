"use client";

import React, { useCallback, useEffect, useId, useRef, type ReactNode } from "react";
import { CheckIcon, CloseIcon } from "@/components/icons";

export type FeedbackSeverity = "success" | "warning" | "error" | "info";

export type FeedbackModalProps = {
  /** ควบคุมการเปิด-ปิด Modal */
  open: boolean;
  /** ฟังก์ชันเมื่อต้องการปิด Modal */
  onClose: () => void;
  /** ประเภทของข้อความแจ้งเตือน (success | warning | error | info) */
  severity: FeedbackSeverity;
  /** หัวข้อ Modal (หากไม่ระบุจะใช้ค่าเริ่มต้นตามประเภท severity) */
  title?: string;
  /** เนื้อหาหรือรายละเอียดการแจ้งเตือน (รองรับทั้ง string และ ReactNode) */
  message: ReactNode;
  /** ข้อความปุ่มหลัก (เช่น ตกลง, ลองใหม่, ดำเนินการต่อ) */
  primaryActionText?: string;
  /** ฟังก์ชันเมื่อกดปุ่มหลัก (หากไม่ระบุจะเรียก onClose) */
  onPrimaryAction?: () => void;
  /** ข้อความปุ่มรอง (หากไม่ระบุจะไม่แสดงปุ่มรอง) */
  secondaryActionText?: string;
  /** ฟังก์ชันเมื่อกดปุ่มรอง (หากไม่ระบุจะเรียก onClose) */
  onSecondaryAction?: () => void;
  /** อนุญาตให้ปิดด้วยปุ่ม ESC หรือไม่ (เริ่มต้น: true สำหรับ success/info/warning, false สำหรับ error) */
  allowEsc?: boolean;
  /** อนุญาตให้ปิดด้วยการคลิกพื้นที่ว่างรอบนอก (Backdrop) หรือไม่ (เริ่มต้น: true สำหรับ success/info) */
  allowOutsideClick?: boolean;
  /** Class เสริมสำหรับกล่อง Modal Card */
  className?: string;
  /** ส่วน Footer กำหนดเองเพิ่มเติม (ตัวเลือกเสริม) */
  footer?: ReactNode;
};

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

function WarningIcon({ className = "size-7" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function ErrorIcon({ className = "size-7" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6" />
      <path d="m9 9 6 6" />
    </svg>
  );
}

function InfoIcon({ className = "size-7" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}

const SEVERITY_CONFIG: Record<
  FeedbackSeverity,
  {
    icon: React.ComponentType<{ className?: string }>;
    defaultTitle: string;
    defaultPrimaryText: string;
    bgRingClass: string;
    textClass: string;
    btnClass: string;
  }
> = {
  success: {
    icon: CheckIcon,
    defaultTitle: "ดำเนินการสำเร็จ",
    defaultPrimaryText: "ตกลง",
    bgRingClass: "bg-success/15 border border-success/30",
    textClass: "text-success",
    btnClass: "bg-success text-text-inverse hover:brightness-110 focus-visible:ring-success",
  },
  warning: {
    icon: WarningIcon,
    defaultTitle: "แจ้งเตือนการตรวจสอบ",
    defaultPrimaryText: "รับทราบและปิด",
    bgRingClass: "bg-warning/15 border border-warning/30",
    textClass: "text-warning",
    btnClass: "bg-warning text-text-heading font-bold hover:brightness-110 focus-visible:ring-warning",
  },
  error: {
    icon: ErrorIcon,
    defaultTitle: "เกิดข้อผิดพลาด",
    defaultPrimaryText: "ปิด",
    bgRingClass: "bg-error/15 border border-error/30",
    textClass: "text-error",
    btnClass: "bg-error text-text-inverse hover:brightness-110 focus-visible:ring-error",
  },
  info: {
    icon: InfoIcon,
    defaultTitle: "ข้อมูลและการดำเนินการ",
    defaultPrimaryText: "ตกลง",
    bgRingClass: "bg-accent/12 border border-accent/25",
    textClass: "text-accent",
    btnClass: "bg-accent text-text-inverse hover:brightness-110 focus-visible:ring-accent",
  },
};

/**
 * Viewport-Centered Feedback Modal
 *
 * Modal สำหรับแสดงข้อความตอบกลับผู้ใช้หลังทำ Action สำคัญ (เช่น บันทึก, เผยแพร่, ลบ, ตรวจสอบ หรือเกิดข้อผิดพลาด)
 * โดยวางตำแหน่งกึ่งกลาง Viewport ปัจจุบันเสมอ (position: fixed; inset: 0; display: flex; justify-content: center; align-items: center;)
 * ล็อค Scroll พื้นหลัง ป้องกันการโต้ตอบกับหน้าเว็บ และกัก Focus ภายใน Modal เพื่อความพร้อมใช้งานด้าน Accessibility (WAI-ARIA)
 */
export function FeedbackModal({
  open,
  onClose,
  severity = "info",
  title,
  message,
  primaryActionText,
  onPrimaryAction,
  secondaryActionText,
  onSecondaryAction,
  allowEsc,
  allowOutsideClick,
  className = "",
  footer,
}: FeedbackModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const primaryBtnRef = useRef<HTMLButtonElement>(null);
  const prevFocusRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const messageId = useId();

  const config = SEVERITY_CONFIG[severity] || SEVERITY_CONFIG.info;
  const IconComponent = config.icon;
  const displayTitle = title || config.defaultTitle;
  const primaryText = primaryActionText || config.defaultPrimaryText;
  const canEsc = allowEsc ?? (severity !== "error");
  const canClickOutside = allowOutsideClick ?? (severity === "success" || severity === "info");

  // Keyboard Event & Focus Trap
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (canEsc) {
          e.preventDefault();
          onClose();
        }
        return;
      }
      if (e.key === "Tab" && cardRef.current) {
        const focusable = cardRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
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
    },
    [onClose, canEsc]
  );

  useEffect(() => {
    if (!open) return;
    prevFocusRef.current = document.activeElement as HTMLElement;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Auto focus primary button
    const focusTimer = setTimeout(() => {
      if (primaryBtnRef.current) {
        primaryBtnRef.current.focus();
      } else if (cardRef.current) {
        cardRef.current.focus();
      }
    }, 30);

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(focusTimer);
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      prevFocusRef.current?.focus();
    };
  }, [open, handleKeyDown]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      className={`fixed inset-0 z-[var(--z-overlay,9999)] flex items-center justify-center p-4 sm:p-6 transition-[opacity,visibility] duration-200 ${
        open ? "opacity-100 visible pointer-events-auto" : "opacity-0 invisible pointer-events-none"
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/45 backdrop-blur-[2px] transition-opacity duration-200"
        onClick={() => {
          if (canClickOutside) onClose();
        }}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={messageId}
        tabIndex={-1}
        className={`relative z-10 w-full max-w-[440px] overflow-hidden rounded-[1.25rem] bg-bg-card shadow-[0_25px_70px_rgba(0,0,0,0.22)] border border-border/80 transition-all duration-200 focus-visible:outline-none ${
          open ? "translate-y-0 scale-100 opacity-100" : "translate-y-4 scale-[0.96] opacity-0"
        } ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <div className="absolute right-4 top-4">
          <button
            type="button"
            onClick={onClose}
            className="flex size-9 items-center justify-center rounded-xl border-none bg-transparent text-text-secondary transition-colors hover:bg-bg-elevated hover:text-text-heading focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
            aria-label="ปิดหน้าต่าง"
          >
            <CloseIcon className="size-5" />
          </button>
        </div>

        {/* Content Section */}
        <div className="pt-8 pb-6 px-7 sm:px-8 text-center flex flex-col items-center gap-4">
          <div className={`flex size-14 shrink-0 items-center justify-center rounded-full shadow-sm ${config.bgRingClass}`}>
            <IconComponent className={`size-7 ${config.textClass}`} />
          </div>

          <div className="space-y-2 max-w-full">
            <h2 id={titleId} className="font-heading text-xl font-bold text-text-heading leading-snug">
              {displayTitle}
            </h2>
            <div id={messageId} className="font-body text-sm text-text-secondary leading-relaxed">
              {message}
            </div>
          </div>
        </div>

        {/* Actions Section */}
        <div className="px-7 pb-7 pt-1 flex flex-col sm:flex-row-reverse items-center justify-center gap-3">
          <button
            ref={primaryBtnRef}
            type="button"
            onClick={() => {
              if (onPrimaryAction) onPrimaryAction();
              else onClose();
            }}
            className={`w-full sm:w-auto min-w-[120px] inline-flex items-center justify-center rounded-xl px-6 py-2.5 font-ui text-sm font-semibold shadow-sm transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${config.btnClass}`}
          >
            {primaryText}
          </button>

          {(secondaryActionText || onSecondaryAction) && (
            <button
              type="button"
              onClick={() => {
                if (onSecondaryAction) onSecondaryAction();
                else onClose();
              }}
              className="w-full sm:w-auto min-w-[100px] inline-flex items-center justify-center rounded-xl border border-border px-5 py-2.5 font-ui text-sm font-medium text-text-secondary transition-colors hover:bg-bg-elevated hover:text-text-heading active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border"
            >
              {secondaryActionText || "ยกเลิก"}
            </button>
          )}
        </div>

        {/* Custom Footer Option */}
        {footer && (
          <div className="w-full px-7 pb-6 pt-3 border-t border-border/60 text-left text-sm text-text-secondary">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
