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
    } catch (err: any) {
      console.error(err);
      setError(err.message || "อัปโหลดไม่สำเร็จ");
    } finally {
      setUploading(false);
    }
  };

  const copyMarkdown = (url: string) => {
    const md = `![คำอธิบายรูปภาพ](${url})`;
    navigator.clipboard.writeText(md);
    alert("คัดลอก Markdown เรียบร้อยแล้ว!");
  };

  return (
    <div className="rounded-md border border-white/10 bg-surface-1/40 p-5 space-y-4">
      <h3 className="font-serif text-base text-ivory flex items-center gap-2">
        <span className="text-antique-gold text-lg">✦</span> อัปโหลดรูปภาพ (R2)
      </h3>

      <div className="space-y-3">
        {/* Dropzone / File Select Box */}
        <label className="flex flex-col items-center justify-center border border-dashed border-white/20 rounded-md p-4 cursor-pointer hover:border-antique-gold/40 transition-colors bg-charcoal/20">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <span className="text-xs text-soft-ivory text-center truncate max-w-full px-2">
            {file ? `เลือกรูปภาพแล้ว: ${file.name}` : "คลิกเลือกรูปภาพ หรือลากมาวาง"}
          </span>
          <span className="text-[10px] text-muted mt-1">PNG, JPG, WEBP (สูงสุด 5MB)</span>
        </label>

        {/* Error message */}
        {error && <p className="text-xs text-danger">{error}</p>}

        {/* Upload Button */}
        {file && !uploading && (
          <button
            onClick={handleUpload}
            className="w-full rounded-sm bg-gradient-to-br from-antique-gold to-soft-gold py-1.5 text-xs font-semibold text-deep-navy hover:brightness-110 cursor-pointer transition-all"
          >
            อัปโหลดไปยัง Cloudflare R2
          </button>
        )}

        {/* Uploading Status */}
        {uploading && (
          <div className="text-center text-xs text-soft-gold py-1.5 animate-pulse">
            กำลังอัปโหลด...
          </div>
        )}

        {/* Success state */}
        {uploadedUrl && (
          <div className="rounded-md bg-charcoal/30 p-3 border border-white/5 space-y-2">
            <p className="text-xs text-success flex items-center gap-1 font-semibold">
              ✓ อัปโหลดสำเร็จ!
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onInsertImage(uploadedUrl)}
                className="flex-1 min-h-[40px] rounded-sm border border-antique-gold/30 bg-antique-gold/10 px-3 py-2 text-xs text-antique-gold hover:bg-antique-gold/20 cursor-pointer transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-antique-gold flex items-center justify-center font-medium"
              >
                แทรกในเนื้อหา
              </button>
              <button
                type="button"
                onClick={() => copyMarkdown(uploadedUrl)}
                className="flex-1 min-h-[40px] rounded-sm border border-white/10 bg-white/5 px-3 py-2 text-xs text-soft-ivory hover:bg-white/10 cursor-pointer transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-antique-gold flex items-center justify-center font-medium"
              >
                คัดลอกลิงก์
              </button>
            </div>
            <input
              type="text"
              readOnly
              value={uploadedUrl}
              className="w-full text-[10px] text-muted bg-black/30 border border-white/5 px-2 py-1 rounded outline-none select-all"
            />
          </div>
        )}
      </div>
    </div>
  );
}
