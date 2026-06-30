import { NextResponse } from "next/server";
import { uploadToR2 } from "@/lib/storage/upload";
import { createServiceSupabase } from "@/lib/supabase/server";

export async function POST(request: Request) {
  // 1. ตรวจสอบ API Secret เพื่อความปลอดภัย
  const secret = request.headers.get("x-api-secret");
  const systemSecret = process.env.API_SYNC_SECRET || "archron_secret_sync_key_2026";
  
  if (!secret || secret !== systemSecret) {
    return NextResponse.json({ error: "Unauthorized — Invalid sync secret key" }, { status: 401 });
  }

  // 2. แปลงข้อมูล JSON payload
  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { slug, content_type, body_markdown } = body;
  if (!slug || !content_type) {
    return NextResponse.json({ error: "Missing required fields: slug, content_type" }, { status: 400 });
  }

  // 3. เตรียมไฟล์ Markdown สำหรับอัปโหลด
  const markdownText = body_markdown || "";
  const buffer = Buffer.from(markdownText, "utf-8");
  const fileName = `${content_type}-${slug}.md`;
  const fileMime = "text/markdown";

  // 4. อัปโหลดขึ้น Cloudflare R2
  const result = await uploadToR2(buffer, fileName, fileMime);
  if (!result.ok) {
    console.error(`[SYNC_R2_ERROR] Failed to upload ${fileName} to R2:`, result.error);
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  // 5. บันทึกคีย์และ URL กลับลงในฐานข้อมูล
  const supabase = createServiceSupabase();
  const { error: dbError } = await supabase
    .from("entries")
    .update({
      r2_content_key: result.key,
      r2_content_url: result.url,
    })
    .eq("slug", slug)
    .eq("content_type", content_type);

  if (dbError) {
    console.error(`[SYNC_DB_ERROR] Failed to update entry schema for ${content_type}/${slug}:`, dbError);
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    message: "Content successfully synced to Cloudflare R2 and entry updated",
    key: result.key,
    url: result.url
  });
}
