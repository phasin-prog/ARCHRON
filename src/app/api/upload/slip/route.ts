// POST /api/upload/slip — Public/Customer upload for PromptPay payment slips into Cloudflare R2
// Accepts: multipart/form-data with "file" (image) and "invoiceNumber"
// Returns: { ok: true, url: string } on success

import { NextResponse } from "next/server";
import { uploadToR2 } from "@/lib/storage/upload";
import { createServerSupabase } from "@/lib/supabase/server";
import { updateServiceInvoiceUrls } from "@/lib/content/invoices-db";

export async function POST(request: Request) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "ต้องส่งข้อมูลแบบ multipart/form-data" }, { status: 400 });
  }

  const file = formData.get("file");
  const invoiceNumber = formData.get("invoiceNumber")?.toString();

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "กรุณาแนบรูปภาพสลิปการโอนเงิน" }, { status: 400 });
  }

  if (!invoiceNumber) {
    return NextResponse.json({ error: "ไม่พบรหัสใบแจ้งยอด (invoiceNumber)" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const result = await uploadToR2(buffer, file.name, file.type, `slips/${invoiceNumber}`);

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  try {
    const supabase = createServerSupabase();
    await updateServiceInvoiceUrls(supabase, invoiceNumber, { slipImageUrl: result.url });
  } catch {
    // Continue even if DB update fails momentarily, as the R2 url is returned to client
  }

  return NextResponse.json({ ok: true, url: result.url, key: result.key });
}
