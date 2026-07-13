// POST /api/upload — Upload image to Cloudflare R2
// Protected: only authenticated users with write permission (admin/writer)
// Accepts: multipart/form-data with a single "file" field
// Returns: { url: string } on success

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";
import { roleFromMetadata, canWrite } from "@/lib/content/utils/roles";
import { uploadToR2 } from "@/lib/storage/upload";

export async function POST(request: Request) {
  // --- Auth check ---
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "ยังไม่ได้เข้าสู่ระบบ" }, { status: 401 });
  }

  const client = await clerkClient();
  const me = await client.users.getUser(userId);
  const role = roleFromMetadata(me.publicMetadata);
  if (!canWrite(role)) {
    return NextResponse.json({ error: "ต้องเป็นนักเขียนหรือแอดมินเท่านั้น" }, { status: 403 });
  }

  // --- Parse form data ---
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "ต้องส่งไฟล์แบบ multipart/form-data" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "ไม่พบไฟล์ — กรุณาส่งไฟล์ในช่อง file" }, { status: 400 });
  }

  // entryId — ถ้าส่งมา จะใช้เป็น path แทน timestamp
  const entryId = formData.get("entryId")?.toString() || undefined;

  // --- Upload ---
  const buffer = Buffer.from(await file.arrayBuffer());
  const result = await uploadToR2(buffer, file.name, file.type, entryId);

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ url: result.url, key: result.key });
}

