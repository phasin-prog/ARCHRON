import { NextRequest } from "next/server";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { r2Client } from "@/lib/r2";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key: string[] }> }
) {
  try {
    if (!r2Client) {
      return new Response("Storage client not initialized", { status: 500 });
    }

    const resolvedParams = await params;
    if (!resolvedParams.key || resolvedParams.key.length === 0) {
      return new Response("Key is required", { status: 400 });
    }

    const fileKey = resolvedParams.key.join("/");
    const bucketName = process.env.R2_BUCKET_NAME || "archron";

    const response = await r2Client.send(
      new GetObjectCommand({
        Bucket: bucketName,
        Key: fileKey,
      })
    );

    if (!response.Body) {
      return new Response("File empty", { status: 404 });
    }

    // แปลง S3 stream เป็น Buffer เพื่อเลี่ยงปัญหาไทป์ของ Response ใน Next.js
    const fileData = await response.Body.transformToByteArray();
    const fileBuffer = Buffer.from(fileData);

    return new Response(fileBuffer, {
      headers: {
        "Content-Type": response.ContentType || "application/octet-stream",
        "Content-Length": response.ContentLength?.toString() || fileBuffer.length.toString(),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error: any) {
    console.error("Error reading file from R2:", error);
    if (error.name === "NoSuchKey") {
      return new Response("File not found", { status: 404 });
    }
    return new Response("Internal Server Error", { status: 500 });
  }
}
