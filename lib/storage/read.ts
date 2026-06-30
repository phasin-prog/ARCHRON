import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getR2Client, getR2Bucket } from "./r2-client";

/**
 * อ่านข้อมูลข้อความ (เช่น Markdown) จาก Cloudflare R2
 * @param key Key ของไฟล์บน R2 (เช่น 'uploads/contents/school-classical-greek.md')
 * @returns ข้อความในไฟล์ หรือ null หากเกิดข้อผิดพลาด
 */
export async function readFromR2(key: string): Promise<string | null> {
  try {
    const client = getR2Client();
    const bucket = getR2Bucket();
    
    const response = await client.send(
      new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      })
    );
    
    if (!response.Body) return null;
    return await response.Body.transformToString();
  } catch (e) {
    console.error(`[R2_READ_ERROR] Error reading key "${key}" from R2:`, e);
    return null;
  }
}
