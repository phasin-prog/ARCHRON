// lib/content/assets.ts — Asset Management System (Phase 59)
// ระบบจัดการทรัพยากร (images, documents, media)

export type AssetType = "image" | "video" | "audio" | "document" | "other";

export type Asset = {
  id: string;
  name: string;
  type: AssetType;
  url: string;
  r2Key?: string;
  size: number;
  mimeType: string;
  width?: number;
  height?: number;
  duration?: number; // for video/audio in seconds
  createdAt: string;
  updatedAt: string;
  uploadedBy?: string;
  alt?: string;
  caption?: string;
  tags?: string[];
};

export type AssetFolder = {
  id: string;
  name: string;
  parentId?: string;
  createdAt: string;
};

export const ASSET_TYPE_LABEL: Record<AssetType, string> = {
  image: "รูปภาพ",
  video: "วิดีโอ",
  audio: "เสียง",
  document: "เอกสาร",
  other: "อื่น ๆ",
};

export const ASSET_TYPE_ICON: Record<AssetType, string> = {
  image: "image",
  video: "videocam",
  audio: "audio_file",
  document: "description",
  other: "folder",
};

export const ASSET_MIME_TYPES: Record<AssetType, string[]> = {
  image: ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"],
  video: ["video/mp4", "video/webm", "video/ogg"],
  audio: ["audio/mpeg", "audio/wav", "audio/ogg", "audio/webm"],
  document: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
    "text/markdown",
  ],
  other: [],
};

export const MAX_FILE_SIZE: Record<AssetType, number> = {
  image: 10 * 1024 * 1024, // 10MB
  video: 100 * 1024 * 1024, // 100MB
  audio: 50 * 1024 * 1024, // 50MB
  document: 20 * 1024 * 1024, // 20MB
  other: 10 * 1024 * 1024, // 10MB
};

export function getAssetTypeFromMime(mimeType: string): AssetType {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType.startsWith("audio/")) return "audio";
  if (
    mimeType === "application/pdf" ||
    mimeType === "application/msword" ||
    mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    mimeType === "text/plain" ||
    mimeType === "text/markdown"
  ) {
    return "document";
  }
  return "other";
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  if (h > 0) {
    return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function validateAssetFile(file: File, type: AssetType): { valid: boolean; error?: string } {
  // Check file size
  if (file.size > MAX_FILE_SIZE[type]) {
    return {
      valid: false,
      error: `ไฟล์มีขนาดใหญ่เกินไป (สูงสุด ${formatFileSize(MAX_FILE_SIZE[type])})`,
    };
  }

  // Check mime type
  const allowedMimes = ASSET_MIME_TYPES[type];
  if (allowedMimes.length > 0 && !allowedMimes.includes(file.type)) {
    return {
      valid: false,
      error: `ประเภทไฟล์ไม่ถูกต้อง (อนุญาตเฉพาะ ${allowedMimes.join(", ")})`,
    };
  }

  return { valid: true };
}

export function generateAssetR2Key(asset: Omit<Asset, "id" | "createdAt" | "updatedAt">): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const random = Math.random().toString(36).slice(2, 8);
  const ext = asset.name.split(".").pop() ?? "";

  return `assets/${year}/${month}/${asset.type}/${random}.${ext}`;
}

// Sample assets for development
export const SAMPLE_ASSETS: Asset[] = [
  {
    id: "asset-1",
    name: "jung-portrait.jpg",
    type: "image",
    url: "/images/jung-portrait.jpg",
    size: 245000,
    mimeType: "image/jpeg",
    width: 800,
    height: 1000,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    alt: "Carl Gustav Jung",
    caption: "ภาพถ่ายของคาร์ล กุสตาฟ จุง",
    tags: ["jung", "portrait", "thinker"],
  },
  {
    id: "asset-2",
    name: "freud-office.jpg",
    type: "image",
    url: "/images/freud-office.jpg",
    size: 180000,
    mimeType: "image/jpeg",
    width: 1200,
    height: 800,
    createdAt: "2024-01-20T14:30:00Z",
    updatedAt: "2024-01-20T14:30:00Z",
    alt: "Sigmund Freud's office",
    caption: "ห้องทำงานของซิคมุนด์ ฟรอยด์",
    tags: ["freud", "office", "history"],
  },
  {
    id: "asset-3",
    name: "archetype-diagram.svg",
    type: "image",
    url: "/images/archetype-diagram.svg",
    size: 12000,
    mimeType: "image/svg+xml",
    width: 600,
    height: 400,
    createdAt: "2024-02-01T09:15:00Z",
    updatedAt: "2024-02-01T09:15:00Z",
    alt: "Archetype diagram",
    caption: "แผนภาพแสดงความสัมพันธ์ของ Archetypes",
    tags: ["archetype", "diagram", "jung"],
  },
  {
    id: "asset-4",
    name: "interpretation-of-dreams.pdf",
    type: "document",
    url: "/documents/interpretation-of-dreams.pdf",
    size: 5200000,
    mimeType: "application/pdf",
    createdAt: "2024-01-10T08:00:00Z",
    updatedAt: "2024-01-10T08:00:00Z",
    alt: "The Interpretation of Dreams",
    caption: "The Interpretation of Dreams โดย Sigmund Freud",
    tags: ["freud", "dreams", "primary-source"],
  },
];
