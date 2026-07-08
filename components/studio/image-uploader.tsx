"use client";

import React, { useState } from "react";

interface ImageUploaderProps {
  onInsertImage: (url: string) => void;
}

export function ImageUploader({ onInsertImage }: ImageUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      // ตรวจสอบประเภทไฟล์
      if (!selectedFile.type.startsWith("image/")) {
        setError("กรุณาเลือกไฟล์รูปภาพเท่านั้น");
        return;
      }
      // ตรวจสอบขนาดไฟล์ (ไม่เกิน 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("ขนาดรูปภาพต้องไม่เกิน 5MB");
        return;
      }
      setFile(selectedFile);
      setError(null);
      setUploadedUrl(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "เกิดข้อผิดพลาดในการอัปโหลด");
      }

      const data = await res.json();
      setUploadedUrl(data.url);
      setFile(null);
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "อัปโหลดไม่สำเร็จ");
    } finally {
      setUploading(false);
    }
  };

  const copyMarkdown = async (url: string) => {
    const md = `![คำอธิบายรูปภาพ](${url})`;
    await navigator.clipboard.writeText(md);
  };

  return (
    <div className="archron-panel p-5 space-y-4">
      <h3 className="font-serif text-base text-text-heading flex items-center gap-2">
        <span className="material-symbols-outlined text-[20px] text-accent" aria-hidden="true">image</span>
        อัปโหลดรูปภาพ (R2)
      </h3>

      <div className="space-y-3">
        {/* Dropzone / File Select Box */}
        <label className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border/40 bg-bg-card/30 p-6 cursor-pointer hover:border-accent/40 hover:bg-bg-card/50 transition-colors focus-within:ring-2 focus-within:ring-accent/40 focus-within:outline-none">
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={handleFileChange}
            aria-label="เลือกรูปภาพ"
          />
          <span className="material-symbols-outlined text-[28px] text-text-secondary/40 mb-2" aria-hidden="true">
            cloud_upload
          </span>
          <span className="text-sm text-text-heading text-center">
            {file ? `เลือกรูปภาพแล้ว: ${file.name}` : "คลิกเลือกรูปภาพ หรือลากมาวาง"}
          </span>
          <span className="text-xs text-text-secondary/60 mt-1">PNG, JPG, WEBP (สูงสุด 5MB)</span>
        </label>

        {/* Error message */}
        {error && (
          <p className="flex items-center gap-1.5 text-xs text-error" role="alert">
            <span className="material-symbols-outlined text-[14px]" aria-hidden="true">error</span>
            {error}
          </p>
        )}

        {/* Upload Button */}
        {file && !uploading && (
          <button
            type="button"
            onClick={handleUpload}
            className="w-full rounded-lg bg-gradient-to-br from-accent to-accent py-2.5 text-sm font-semibold text-text-inverse hover:brightness-110 cursor-pointer transition-all focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
          >
            อัปโหลดไปยัง Cloudflare R2
          </button>
        )}

        {/* Uploading Status */}
        {uploading && (
          <div className="flex items-center justify-center gap-2 text-sm text-accent py-2" role="status">
            <span className="material-symbols-outlined animate-spin text-[18px]" aria-hidden="true">progress_activity</span>
            กำลังอัปโหลด...
          </div>
        )}

        {/* Success state */}
        {uploadedUrl && (
          <div className="rounded-lg bg-success/10 border border-success/30 p-3 space-y-2">
            <p className="text-xs text-success flex items-center gap-1.5 font-semibold">
              <span className="material-symbols-outlined text-[16px]" aria-hidden="true">check_circle</span>
              อัปโหลดสำเร็จ!
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onInsertImage(uploadedUrl)}
                className="flex-1 min-h-[40px] rounded-lg border border-accent/40 bg-accent/10 px-3 py-2 text-xs text-accent hover:bg-accent/20 cursor-pointer transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none flex items-center justify-center font-medium"
              >
                แทรกในเนื้อหา
              </button>
              <button
                type="button"
                onClick={() => copyMarkdown(uploadedUrl)}
                className="flex-1 min-h-[40px] rounded-lg border border-border/40 bg-bg-card/40 px-3 py-2 text-xs text-text-heading hover:bg-bg-card cursor-pointer transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none flex items-center justify-center font-medium"
              >
                คัดลอกลิงก์
              </button>
            </div>
            <input
              type="text"
              readOnly
              value={uploadedUrl}
              aria-label="URL ของรูปภาพ"
              className="w-full text-[10px] text-text-secondary/60 bg-bg-card/50 border border-border/20 px-2 py-1.5 rounded-lg select-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent/40"
            />
          </div>
        )}
      </div>
    </div>
  );
}
