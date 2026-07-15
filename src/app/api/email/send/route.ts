// POST /api/email/send — Trigger automated transactional email via Resend
// Protected endpoint (requires write permission or system check)

import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { roleFromMetadata, canWrite } from "@/lib/content/utils/roles";
import { sendJungianInvoiceEmail } from "@/lib/email/invoice-sender";
import type { InvoiceData } from "@/components/guide/types";

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "ยังไม่ได้เข้าสู่ระบบ" }, { status: 401 });
  }

  const client = await clerkClient();
  const me = await client.users.getUser(userId);
  const role = roleFromMetadata(me.publicMetadata);
  if (!canWrite(role)) {
    return NextResponse.json({ error: "ต้องเป็นนักเขียนหรือแอดมินเท่านั้นจึงจะส่งอีเมลระบบได้" }, { status: 403 });
  }

  let body: { invoice?: InvoiceData; type?: "payment_confirmed" | "report_delivered" | "invoice_created" };
  try {
    body = (await request.json()) as { invoice?: InvoiceData; type?: "payment_confirmed" | "report_delivered" | "invoice_created" };
  } catch {
    return NextResponse.json({ error: "รูปแบบข้อมูล JSON ไม่ถูกต้อง" }, { status: 400 });
  }

  const { invoice, type } = body;
  if (!invoice || !invoice.invoiceNumber || !invoice.customerEmail) {
    return NextResponse.json({ error: "ข้อมูลใบแจ้งยอดหรืออีเมลผู้รับไม่ครบถ้วน" }, { status: 400 });
  }

  if (!type || !["payment_confirmed", "report_delivered", "invoice_created"].includes(type)) {
    return NextResponse.json({ error: "ประเภทการส่งอีเมลไม่ถูกต้อง" }, { status: 400 });
  }

  const result = await sendJungianInvoiceEmail(invoice, type);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ ok: true, id: result.id, message: `ส่งอีเมลถึง ${invoice.customerEmail} เรียบร้อยแล้ว` });
}
