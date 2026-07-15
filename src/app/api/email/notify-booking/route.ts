// POST /api/email/notify-booking — Automated email trigger for newly created bookings
// Sends the PromptPay QR and Invoice details instantly to the customer's email via Resend

import { NextResponse } from "next/server";
import { sendJungianInvoiceEmail } from "@/lib/email/invoice-sender";
import type { InvoiceData } from "@/components/guide/types";

export async function POST(request: Request) {
  let body: { invoice?: InvoiceData };
  try {
    body = (await request.json()) as { invoice?: InvoiceData };
  } catch {
    return NextResponse.json({ error: "รูปแบบข้อมูล JSON ไม่ถูกต้อง" }, { status: 400 });
  }

  const { invoice } = body;
  if (!invoice || !invoice.invoiceNumber || !invoice.customerEmail) {
    return NextResponse.json({ error: "ข้อมูลใบแจ้งยอดหรืออีเมลผู้รับไม่ครบถ้วน" }, { status: 400 });
  }

  const result = await sendJungianInvoiceEmail(invoice, "invoice_created");
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ ok: true, id: result.id });
}
