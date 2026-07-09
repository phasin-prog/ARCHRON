// Delete file from Cloudflare R2
// Server-side only

import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getR2Client, getR2Bucket } from "./r2-client";

export type DeleteResult = {
  ok: true;
} | {
  ok: false;
  error: string;
};

export async function deleteFromR2(key: string): Promise<DeleteResult> {
  // Only allow deleting files in the uploads/ prefix
  if (!key.startsWith("uploads/")) {
    return { ok: false, error: "ลบได้เฉพาะไฟล์ใน uploads/ เท่านั้น" };
  }

  try {
    const client = getR2Client();
    const bucket = getR2Bucket();

    await client.send(
      new DeleteObjectCommand({
        Bucket: bucket,
        Key: key,
      }),
    );

    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "ลบไฟล์ไม่สำเร็จ";
    return { ok: false, error: msg };
  }
}

// Extract the object key from a public URL
export function keyFromUrl(url: string): string | null {
  try {
    const u = new URL(url);
    // The key is the path without leading slash
    return u.pathname.replace(/^\//, "");
  } catch {
    return null;
  }
}
