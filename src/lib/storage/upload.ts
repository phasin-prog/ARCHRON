// Upload file to Cloudflare R2
// Server-side only (uses AWS SDK + R2 credentials)

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getR2Client, getR2Bucket, getR2PublicUrl } from "./r2-client";

// Allowed MIME types for upload
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "image/avif",
  "application/pdf",
  "text/markdown",
  "text/plain",
];

// Max file size: 10 MB
const MAX_SIZE = 10 * 1024 * 1024;

export type UploadResult = {
  ok: true;
  url: string;
  key: string;
} | {
  ok: false;
  error: string;
};

// Upload a file buffer to R2
// entryId: ถ้ามี จะใช้เป็น path (entries/{id}/...) แทน timestamp
export async function uploadToR2(
  file: Buffer,
  fileName: string,
  contentType: string,
  entryId?: string,
): Promise<UploadResult> {
  // Validate MIME type
  if (!ALLOWED_TYPES.includes(contentType)) {
    return { ok: false, error: `ไฟล์ประเภท ${contentType} ไม่อนุญาต — รองรับเฉพาะ JPEG, PNG, WebP, GIF, SVG, AVIF` };
  }

  // Validate size
  if (file.byteLength > MAX_SIZE) {
    return { ok: false, error: `ไฟล์ใหญ่เกิน 10 MB — กรุณาลดขนาดไฟล์` };
  }

  // Generate key — ใช้ entryId ถ้ามี
  const ext = fileName.split(".").pop()?.toLowerCase() || "jpg";
  const key = entryId
    ? `entries/${entryId}/${Date.now()}.${ext}`
    : `uploads/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;

  try {
    const client = getR2Client();
    const bucket = getR2Bucket();

    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: file,
        ContentType: contentType,
        CacheControl: "public, max-age=31536000, immutable",
      }),
    );

    const url = getR2PublicUrl(key);
    return { ok: true, url, key };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "อัปโหลดไม่สำเร็จ";
    return { ok: false, error: msg };
  }
}