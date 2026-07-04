"use client";

import { useState, useCallback } from "react";
import Image from "next/image";

interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: "image" | "video" | "audio" | "document";
  size: number;
  createdAt: string;
}

interface MediaManagerProps {
  onSelect?: (media: MediaItem) => void;
  allowMultiple?: boolean;
}

export function MediaManager({ onSelect, allowMultiple = false }: MediaManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [filter, setFilter] = useState<"all" | "image" | "video" | "audio" | "document">("all");

  const handleUpload = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    // In a real implementation, this would upload to Cloudflare R2
    // For now, simulate upload
    for (const file of Array.from(files)) {
      const newMedia: MediaItem = {
        id: `media-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type.startsWith("image/")
          ? "image"
          : file.type.startsWith("video/")
            ? "video"
            : file.type.startsWith("audio/")
              ? "audio"
              : "document",
        size: file.size,
        createdAt: new Date().toISOString(),
      };
      setMediaItems((prev) => [newMedia, ...prev]);
    }
    setUploading(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      handleUpload(e.dataTransfer.files);
    },
    [handleUpload],
  );

  const filteredItems = mediaItems.filter(
    (item) => filter === "all" || item.type === filter,
  );

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-boundary bg-surface-container px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:bg-surface-container-high hover:text-ivory"
      >
        <span className="material-symbols-outlined text-[16px]">perm_media</span>
        จัดการสื่อ
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="mx-4 flex max-h-[80vh] w-full max-w-3xl flex-col rounded-xl border border-slate-boundary bg-surface-container-low shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-boundary p-4">
              <h3 className="font-serif text-lg font-semibold text-ivory">จัดการสื่อ</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-md p-1 text-muted transition-colors hover:bg-surface-container hover:text-ivory"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Upload Area */}
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="mx-4 mt-4 rounded-lg border-2 border-dashed border-slate-boundary p-6 text-center transition-colors hover:border-burnished-gold/50 hover:bg-burnished-gold/5"
            >
              {uploading ? (
                <div className="flex flex-col items-center">
                  <span className="material-symbols-outlined mb-2 animate-spin text-2xl text-burnished-gold">
                    progress_activity
                  </span>
                  <p className="text-sm text-muted">กำลังอัปโหลด...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <span className="material-symbols-outlined mb-2 text-3xl text-muted">
                    cloud_upload
                  </span>
                  <p className="text-sm text-ivory">ลากและวางไฟล์ที่นี่</p>
                  <p className="mt-1 text-xs text-muted">หรือคลิกเพื่อเลือกไฟล์</p>
                  <input
                    type="file"
                    multiple
                    onChange={(e) => handleUpload(e.target.files)}
                    className="mt-3 cursor-pointer text-xs text-muted file:mr-2 file:rounded-md file:border-0 file:bg-burnished-gold/20 file:px-3 file:py-1 file:text-xs file:font-medium file:text-burnished-gold hover:file:bg-burnished-gold/30"
                  />
                </div>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="mx-4 mt-4 flex gap-1">
              {(["all", "image", "video", "audio", "document"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                    filter === f
                      ? "bg-burnished-gold/15 text-burnished-gold"
                      : "text-muted hover:bg-surface-container hover:text-ivory"
                  }`}
                >
                  {f === "all"
                    ? "ทั้งหมด"
                    : f === "image"
                      ? "รูปภาพ"
                      : f === "video"
                        ? "วิดีโอ"
                        : f === "audio"
                          ? "เสียง"
                          : "เอกสาร"}
                </button>
              ))}
            </div>

            {/* Media Grid */}
            <div className="mx-4 mt-4 flex-1 overflow-y-auto">
              {filteredItems.length === 0 ? (
                <div className="py-12 text-center">
                  <span className="material-symbols-outlined mb-2 text-4xl text-muted">
                    folder_open
                  </span>
                  <p className="text-sm text-muted">ยังไม่มีสื่อในคลัง</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
                  {filteredItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => onSelect?.(item)}
                      className="group relative aspect-square overflow-hidden rounded-lg border border-slate-boundary bg-surface-container transition-colors hover:border-burnished-gold/50"
                    >
                      {item.type === "image" ? (
                        <Image
                          src={item.url}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full flex-col items-center justify-center">
                          <span className="material-symbols-outlined text-2xl text-muted">
                            {item.type === "video"
                              ? "videocam"
                              : item.type === "audio"
                                ? "audio_file"
                                : "description"}
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                        <p className="truncate text-[10px] text-white">{item.name}</p>
                        <p className="text-[9px] text-white/70">{formatSize(item.size)}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-slate-boundary p-4">
              <p className="text-xs text-muted">
                {mediaItems.length} ไฟล์ · {formatSize(mediaItems.reduce((acc, m) => acc + m.size, 0))}
              </p>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg bg-burnished-gold/20 px-4 py-2 text-xs font-medium text-burnished-gold transition-colors hover:bg-burnished-gold/30"
              >
                เสร็จสิ้น
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
