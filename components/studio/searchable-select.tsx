"use client";

import { useEffect, useRef, useState } from "react";

type Option = { value: string; label?: string };
type OptionMeta = { icon: string; accent: string };

export function SearchableSelect({
  value,
  onChange,
  options,
  placeholder = "เลือก...",
  meta,
  allowCustom = false,
  id,
}: {
  value: string;
  onChange: (v: string) => void;
  options: (string | Option)[];
  placeholder?: string;
  // ออปชัน: คืนไอคอน+สีประจำตัวเลือก (เช่น content type) — ถ้าไม่ส่ง จะไม่แสดงไอคอน
  meta?: (value: string) => OptionMeta;
  // ออปชัน: อนุญาตให้พิมพ์สร้างค่าใหม่ที่ไม่อยู่ในรายการ (เช่น Framework)
  allowCustom?: boolean;
  // ออปชัน: id สำหรับ label association (a11y)
  id?: string;
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const norm: Option[] = options.map((o) =>
    typeof o === "string" ? { value: o, label: o } : { value: o.value, label: o.label ?? o.value },
  );
  const current = norm.find((o) => o.value === value);
  // ป้ายที่แสดง: ถ้าเป็นค่าที่สร้างเอง (ไม่อยู่ใน options) ให้โชว์ค่าดิบ
  const displayLabel = current ? current.label : value || "";
  const filtered = norm.filter((o) =>
    (o.label ?? o.value).toLowerCase().includes(q.toLowerCase()),
  );

  const trimmed = q.trim();
  const hasExact = norm.some(
    (o) =>
      o.value.toLowerCase() === trimmed.toLowerCase() ||
      (o.label ?? o.value).toLowerCase() === trimmed.toLowerCase(),
  );
  const showAdd = allowCustom && trimmed !== "" && !hasExact;

  // Close dropdown on outside click
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQ("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // Close dropdown on Escape key
  useEffect(() => {
    if (!open) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setQ("");
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        id={id}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-md border border-ink/10 bg-charcoal/40 px-3 py-2 text-left text-ivory"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={`flex items-center gap-2 ${displayLabel ? "text-ivory" : "text-subtle"}`}>
          {displayLabel && meta ? (
            <span
              className="material-symbols-outlined text-[18px]"
              style={{ color: meta(value).accent }}
            >
              {meta(value).icon}
            </span>
          ) : null}
          {displayLabel || placeholder}
        </span>
        <span className="text-muted">▾</span>
      </button>
      {open ? (
        <div className="absolute z-[100] mt-1 w-full rounded-md border border-ink/15 bg-surface-2 p-2 shadow-[0_12px_30px_-12px_rgba(0,0,0,0.8)]">
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={allowCustom ? "ค้นหา หรือพิมพ์สร้างใหม่..." : "ค้นหา..."}
            className="w-full rounded border border-ink/10 bg-charcoal/60 px-2 py-1.5 text-sm text-ivory outline-none focus:border-antique-gold/50 focus:ring-2 focus:ring-antique-gold/20 transition-colors"
            aria-label="ค้นหาตัวเลือก"
          />
          <ul className="mt-2 max-h-56 overflow-y-auto" role="listbox">
            {showAdd ? (
              <li role="option" aria-selected={false}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(trimmed);
                    setOpen(false);
                    setQ("");
                  }}
                  className="flex w-full items-center gap-2 rounded px-2 py-2 text-left text-sm font-medium text-burnished-gold hover:bg-ink/5"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  เพิ่ม &quot;{trimmed}&quot;
                </button>
              </li>
            ) : null}
            {filtered.length === 0 && !showAdd ? (
              <li className="px-2 py-2 text-sm text-muted">ไม่พบรายการ</li>
            ) : (
              filtered.map((o) => (
                <li key={o.value} role="option" aria-selected={value === o.value}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(o.value);
                      setOpen(false);
                      setQ("");
                    }}
                    className="flex w-full items-center gap-2 rounded px-2 py-2 text-left text-sm text-soft-ivory hover:bg-ink/5"
                  >
                    {meta ? (
                      <span
                        className="material-symbols-outlined text-[18px]"
                        style={{ color: meta(o.value).accent }}
                      >
                        {meta(o.value).icon}
                      </span>
                    ) : null}
                    {o.label}
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
