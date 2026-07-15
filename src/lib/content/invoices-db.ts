// ARCHRON — Service Invoices & Bookings Database Helper via Supabase
// รองรับการบันทึก ดึงข้อมูล และอัปเดตสถานะใบแจ้งยอด Jungian Type Analysis

import type { SupabaseClient } from "@supabase/supabase-js";
import type { InvoiceData, PaymentStatus } from "@/components/guide/types";

export interface ServiceInvoiceRow {
  id: string;
  invoice_number: string;
  issue_date: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  service_name: string;
  appointment_date: string;
  appointment_time: string;
  amount: number;
  status: PaymentStatus;
  payment_method: string;
  promptpay_number: string;
  slip_image_url: string | null;
  report_pdf_url: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// Map database row to InvoiceData UI type
export function rowToInvoiceData(row: ServiceInvoiceRow): InvoiceData {
  return {
    invoiceNumber: row.invoice_number,
    issueDate: row.issue_date,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    customerPhone: row.customer_phone,
    serviceName: row.service_name,
    appointmentDate: row.appointment_date,
    appointmentTime: row.appointment_time,
    amount: Number(row.amount) || 399.00,
    status: row.status || "pending",
    paymentMethod: row.payment_method || "PromptPay QR Code",
    promptPayNumber: row.promptpay_number || "xxx-x-x6727-x (นาย พศิน พสุมาตร)",
    slipImageUrl: row.slip_image_url || undefined,
    reportPdfUrl: row.report_pdf_url || undefined,
    notes: row.notes || undefined,
  };
}

// Fetch all service invoices from Supabase
export async function listServiceInvoices(
  supabase: SupabaseClient
): Promise<InvoiceData[] | null> {
  try {
    const { data, error } = await supabase
      .from("service_invoices")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data) return null;
    return (data as ServiceInvoiceRow[]).map(rowToInvoiceData);
  } catch {
    return null;
  }
}

// Upsert (insert or update) a service invoice
export async function upsertServiceInvoice(
  supabase: SupabaseClient,
  invoice: InvoiceData,
  notes?: string
): Promise<boolean> {
  try {
    const payload: Record<string, unknown> = {
      invoice_number: invoice.invoiceNumber,
      issue_date: invoice.issueDate,
      customer_name: invoice.customerName,
      customer_email: invoice.customerEmail,
      customer_phone: invoice.customerPhone,
      service_name: invoice.serviceName,
      appointment_date: invoice.appointmentDate,
      appointment_time: invoice.appointmentTime,
      amount: invoice.amount,
      status: invoice.status,
      payment_method: invoice.paymentMethod || "PromptPay QR Code",
      promptpay_number: invoice.promptPayNumber || "xxx-x-x6727-x (นาย พศิน พสุมาตร)",
      updated_at: new Date().toISOString(),
    };

    if (invoice.slipImageUrl) payload.slip_image_url = invoice.slipImageUrl;
    if (invoice.reportPdfUrl) payload.report_pdf_url = invoice.reportPdfUrl;
    if (notes !== undefined) payload.notes = notes;
    else if (invoice.notes) payload.notes = invoice.notes;

    const { error } = await supabase
      .from("service_invoices")
      .upsert(payload, { onConflict: "invoice_number" });

    return !error;
  } catch {
    return false;
  }
}

// Update payment status for a specific invoice
export async function updateServiceInvoiceStatus(
  supabase: SupabaseClient,
  invoiceNumber: string,
  status: PaymentStatus
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("service_invoices")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("invoice_number", invoiceNumber);

    return !error;
  } catch {
    return false;
  }
}

// Update R2 URLs (slip image or report pdf) for a specific invoice
export async function updateServiceInvoiceUrls(
  supabase: SupabaseClient,
  invoiceNumber: string,
  urls: { slipImageUrl?: string; reportPdfUrl?: string; status?: PaymentStatus }
): Promise<boolean> {
  try {
    const updatePayload: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (urls.slipImageUrl !== undefined) updatePayload.slip_image_url = urls.slipImageUrl;
    if (urls.reportPdfUrl !== undefined) updatePayload.report_pdf_url = urls.reportPdfUrl;
    if (urls.status !== undefined) updatePayload.status = urls.status;

    const { error } = await supabase
      .from("service_invoices")
      .update(updatePayload)
      .eq("invoice_number", invoiceNumber);

    return !error;
  } catch {
    return false;
  }
}
