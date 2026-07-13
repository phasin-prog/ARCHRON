"use client";

import { useState, useRef, type DragEvent, type ChangeEvent } from "react";
import { EditorIcon } from "@/components/studio/editor-icon";

type ImagePickerProps = {
  value: string; // current URL (empty = no image)
  onChange: (url: string) => void; // called with new URL after upload
  onRemove: () => void; // called to clear image
  entryId?: string; // entry UUID สำหรับ path บน R2
  className?: string;
};

// ImagePicker — drag-and-drop + click to upload image to R2 via /api/upload
// แสดง preview เมื่อมีรูป, loading ขณะอัปโหลด, error เมื่อไม่สำเร็จ
export function ImagePicker({ value, onChange, onRemove, entryId, className = "" }: ImagePickerProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml", "image/avif"];

  async function uploadFile(file: File) {
    if (!ALLOWED.includes(file.type)) {
      setError("รองรับเฉพาะ JPEG, PNG, WebP, GIF, SVG, AVIF");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("ไฟล์ต้องไม่เกิน 10 MB");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const form = new FormData();
      form.append("file", file);
      if (entryId) form.append("entryId", entryId);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: form,
      });

      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "อัปโหลดไม่สำเร็จ");
      } else {
        onChange(json.url);
      }
    } catch {
      setError("เกิดข้อผิดพลาดในการอัปโหลด");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    // reset so same file can be re-selected
    e.target.value = "";
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  }

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    setDragOver(true);
  }

  function handleDragLeave() {
    setDragOver(false);
  }

  return (
    <div className={className}>
      {value ? (
        // Preview mode
        <div className="relative overflow-hidden rounded-md border border-border/30">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="ภาพปก"
            loading="lazy"
            decoding="async"
            className="h-48 w-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/70 to-transparent px-4 py-3">
            <span className="text-xs text-text-heading/80">ภาพปกปัจจุบัน</span>
            <button
              type="button"
              onClick={onRemove}
              className="rounded border border-error/40 bg-error/10 px-3 py-1 text-xs text-error transition-colors hover:bg-error/20"
            >
              ลบรูป
            </button>
          </div>
        </div>
      ) : (
        // Upload zone
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => inputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-md border-2 border-dashed p-8 transition-colors ${
            dragOver
              ? "border-accent/60 bg-accent/5"
              : "border-border/30 hover:border-border/50 bg-bg-card/30"
          }`}
        >
          {loading ? (
            <>
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent/30 border-t-accent" />
              <span className="text-sm text-text-secondary">กำลังอัปโหลด...</span>
            </>
          ) : (
            <>
              <EditorIcon name="newspaper" className="h-8 w-8 text-text-secondary/30" />
              <div className="text-center">
                <p className="text-sm text-text-secondary">
                  ลากรูปมาวาง หรือคลิกเพื่อเลือกไฟล์
                </p>
                <p className="mt-1 text-xs text-text-secondary">
                  JPEG, PNG, WebP, GIF, SVG, AVIF — สูงสุด 10 MB
                </p>
              </div>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml,image/avif"
            onChange={handleChange}
            className="hidden"
            aria-label="อัปโหลดภาพปก"
          />
        </div>
      )}

      {error ? (
        <p className="mt-2 text-xs text-error" role="alert">{error}</p>
      ) : null}
    </div>
  );
}