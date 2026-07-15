"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { roleFromMetadata, isAdmin } from "@/lib/content/utils/roles";
import { getSupabaseClient } from "@/lib/supabase/client";
import {
  listServiceInvoices,
  upsertServiceInvoice,
  updateServiceInvoiceUrls,
} from "@/lib/content/invoices-db";
import { SAMPLE_INVOICE, SAMPLE_PENDING_INVOICE, type InvoiceData, type PaymentStatus } from "@/components/guide/types";
import {
  SearchIcon,
  CheckIcon,
  CloseIcon,
  ArrowRightIcon,
  AuthorPenIcon,
  ClockIcon,
  EyeIcon,
} from "@/components/icons";

export default function StudioInvoicesAdminPage() {
  const { user, isLoaded } = useUser();
  const role = roleFromMetadata(user?.publicMetadata);
  const admin = isAdmin(role);

  const [invoices, setInvoices] = useState<InvoiceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | PaymentStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal inspection & update states
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceData | null>(null);
  const [uploadingSlip, setUploadingSlip] = useState(false);
  const [uploadingReport, setUploadingReport] = useState(false);
  const [reportUrlInput, setReportUrlInput] = useState("");
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    if (!isLoaded || !admin) {
      setLoading(false);
      return;
    }

    let active = true;
    (async () => {
      try {
        const supabase = getSupabaseClient();
        const data = await listServiceInvoices(supabase);
        if (active) {
          if (data && data.length > 0) {
            setInvoices(data);
          } else {
            // Fallback sample data if table is currently empty
            setInvoices([
              { ...SAMPLE_PENDING_INVOICE, slipImageUrl: "/promptpay-qr.jpg" },
              { ...SAMPLE_INVOICE, reportPdfUrl: "https://pub-sample.r2.dev/reports/sample-jungian-report.pdf" },
            ]);
          }
        }
      } catch {
        if (active) {
          setInvoices([SAMPLE_PENDING_INVOICE, SAMPLE_INVOICE]);
        }
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [isLoaded, admin]);

  if (!isLoaded || loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center p-8">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-accent border-t-transparent" />
          <p className="font-serif text-sm text-text-secondary">กำลังโหลดคลังใบแจ้งยอดและระบบ R2...</p>
        </div>
      </main>
    );
  }

  if (!admin) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-warning/15 text-warning mb-6">
          <CloseIcon className="h-8 w-8" />
        </div>
        <h1 className="font-serif text-2xl font-bold text-text-heading md:text-3xl">
          พื้นที่สงวนเฉพาะผู้ดูแลระบบ (Admin Service Portal)
        </h1>
        <p className="mt-3 max-w-md text-sm text-text-secondary/80">
          หน้าจัดการคิวนัดหมาย ตรวจสอบสลิปโอนเงิน R2 และส่งมอบรายงาน PDF นี้สงวนไว้สำหรับผู้ดูแลระบบ Archron เท่านั้น
        </p>
        <Link
          href="/studio/dashboard"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-text-inverse shadow-md hover:bg-accent-hover"
        >
          กลับไปที่ห้องเขียนบทความหลัก
        </Link>
      </main>
    );
  }

  const filteredInvoices = invoices.filter((item) => {
    const matchesFilter = filter === "all" || item.status === filter;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      item.invoiceNumber.toLowerCase().includes(q) ||
      item.customerName.toLowerCase().includes(q) ||
      item.customerEmail.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  const pendingCount = invoices.filter((i) => i.status === "pending").length;
  const paidCount = invoices.filter((i) => i.status === "paid").length;
  const completedCount = invoices.filter((i) => i.status === "completed").length;

  const handleSendEmail = async (inv: InvoiceData, type: "payment_confirmed" | "report_delivered" | "invoice_created") => {
    try {
      setStatusMessage({ text: "⏳ กำลังส่งอีเมลแจ้งลูกค้าผ่านระบบ Resend API...", type: "success" });
      const res = await fetch("/api/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoice: inv, type }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "ไม่สามารถส่งอีเมลได้");
      }
      setStatusMessage({ text: `✉️ ส่งอีเมลแจ้งคุณ ${inv.customerName} (${inv.customerEmail}) ผ่าน Resend เรียบร้อยแล้ว!`, type: "success" });
    } catch (err) {
      setStatusMessage({
        text: err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการส่งอีเมล",
        type: "error",
      });
    }
  };

  const handleStatusChange = async (nextStatus: PaymentStatus) => {
    if (!selectedInvoice) return;
    try {
      const supabase = getSupabaseClient();
      await updateServiceInvoiceUrls(supabase, selectedInvoice.invoiceNumber, { status: nextStatus });
      
      const updated = { ...selectedInvoice, status: nextStatus };
      setSelectedInvoice(updated);
      setInvoices((prev) => prev.map((i) => (i.invoiceNumber === updated.invoiceNumber ? updated : i)));
      setStatusMessage({ text: `✓ อัปเดตสถานะเป็น ${nextStatus.toUpperCase()} เรียบร้อยแล้ว`, type: "success" });

      // Automatically trigger email notification based on new status
      if (nextStatus === "paid") {
        await handleSendEmail(updated, "payment_confirmed");
      } else if (nextStatus === "completed" && updated.reportPdfUrl) {
        await handleSendEmail(updated, "report_delivered");
      }
    } catch {
      setStatusMessage({ text: "เกิดข้อผิดพลาดในการอัปเดตสถานะ", type: "error" });
    }
  };

  const handleR2FileUpload = async (e: React.ChangeEvent<HTMLInputElement>, kind: "slip" | "report") => {
    if (!selectedInvoice || !e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    if (kind === "slip") setUploadingSlip(true);
    else setUploadingReport(true);
    setStatusMessage(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("entryId", `invoices/${selectedInvoice.invoiceNumber}`);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "อัปโหลดเข้า R2 ไม่สำเร็จ");
      }

      const r2Url = data.url;
      const supabase = getSupabaseClient();
      const payload: { slipImageUrl?: string; reportPdfUrl?: string } = {};
      if (kind === "slip") payload.slipImageUrl = r2Url;
      if (kind === "report") payload.reportPdfUrl = r2Url;

      await updateServiceInvoiceUrls(supabase, selectedInvoice.invoiceNumber, payload);

      const updated = {
        ...selectedInvoice,
        slipImageUrl: kind === "slip" ? r2Url : selectedInvoice.slipImageUrl,
        reportPdfUrl: kind === "report" ? r2Url : selectedInvoice.reportPdfUrl,
      };
      setSelectedInvoice(updated);
      setInvoices((prev) => prev.map((i) => (i.invoiceNumber === updated.invoiceNumber ? updated : i)));
      setStatusMessage({ text: `✓ อัปโหลดไฟล์ ${file.name} เข้า R2 เรียบร้อยแล้ว`, type: "success" });
    } catch (err) {
      setStatusMessage({
        text: err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการเชื่อมต่อ R2",
        type: "error",
      });
    } finally {
      setUploadingSlip(false);
      setUploadingReport(false);
    }
  };

  const handleReportUrlSave = async () => {
    if (!selectedInvoice || !reportUrlInput.trim()) return;
    try {
      const supabase = getSupabaseClient();
      await updateServiceInvoiceUrls(supabase, selectedInvoice.invoiceNumber, { reportPdfUrl: reportUrlInput.trim() });
      const updated = { ...selectedInvoice, reportPdfUrl: reportUrlInput.trim() };
      setSelectedInvoice(updated);
      setInvoices((prev) => prev.map((i) => (i.invoiceNumber === updated.invoiceNumber ? updated : i)));
      setStatusMessage({ text: "✓ บันทึกลิงก์รายงาน PDF เข้าสู่ระบบเรียบร้อยแล้ว", type: "success" });
    } catch {
      setStatusMessage({ text: "บันทึกลิงก์ไม่สำเร็จ", type: "error" });
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-28 pt-8">
      {/* 1. Admin Header & Quick Navigation */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href="/studio/dashboard"
            className="group inline-flex items-center gap-1.5 text-xs font-medium text-text-secondary/80 hover:text-accent transition-colors"
          >
            <span className="text-sm">←</span> กลับห้องเขียนบทความ (Studio Dashboard)
          </Link>
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3.5 py-1 text-[11px] font-bold text-accent uppercase tracking-wider">
            👑 Admin Service &amp; R2 Portal
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/40 pb-6">
          <div>
            <h1 className="font-serif text-3xl font-bold tracking-tight text-text-heading md:text-4xl">
              บริหารจัดการคิวและสลิปชำระเงิน (Cloudflare R2)
            </h1>
            <p className="mt-2 font-serif text-sm italic text-text-secondary">
              ศูนย์กลางตรวจสอบยอดโอน PromptPay, ดูภาพสลิปที่เก็บใน R2 Storage, และส่งมอบรายงาน PDF ให้ผู้รับคำปรึกษา
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/guide"
              target="_blank"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-bg-card px-4 py-2.5 text-xs font-semibold text-text-body hover:border-accent/40 hover:text-text-heading transition-colors"
            >
              <EyeIcon className="h-4 w-4 text-accent" />
              <span>เปิดดูหน้า Client Portal (มุมมองลูกค้า)</span>
            </Link>
          </div>
        </div>

        {/* 2. Stats Summary Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-border/60 bg-bg-card p-5 shadow-2xs">
            <span className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider">ยอดจองทั้งหมด</span>
            <div className="mt-2 flex items-baseline gap-2 font-serif text-2xl font-bold text-text-heading">
              {invoices.length} <span className="text-xs font-normal text-text-secondary">รายการ</span>
            </div>
          </div>
          <div
            onClick={() => setFilter("pending")}
            className={`cursor-pointer rounded-xl border p-5 transition-all ${
              filter === "pending" ? "border-amber-500 bg-amber-500/10 shadow-sm" : "border-border/60 bg-bg-card hover:border-amber-500/50"
            }`}
          >
            <span className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider">🟡 รอตรวจสลิป (Pending)</span>
            <div className="mt-2 flex items-baseline gap-2 font-serif text-2xl font-bold text-amber-600">
              {pendingCount} <span className="text-xs font-normal text-text-secondary">รายการ</span>
            </div>
          </div>
          <div
            onClick={() => setFilter("paid")}
            className={`cursor-pointer rounded-xl border p-5 transition-all ${
              filter === "paid" ? "border-accent bg-accent/10 shadow-sm" : "border-border/60 bg-bg-card hover:border-accent/50"
            }`}
          >
            <span className="text-[11px] font-semibold text-accent uppercase tracking-wider">🟢 อนุมัติแล้ว (Paid)</span>
            <div className="mt-2 flex items-baseline gap-2 font-serif text-2xl font-bold text-accent">
              {paidCount} <span className="text-xs font-normal text-text-secondary">รายการ</span>
            </div>
          </div>
          <div
            onClick={() => setFilter("completed")}
            className={`cursor-pointer rounded-xl border p-5 transition-all ${
              filter === "completed" ? "border-success bg-success/10 shadow-sm" : "border-border/60 bg-bg-card hover:border-success/50"
            }`}
          >
            <span className="text-[11px] font-semibold text-success uppercase tracking-wider">📑 ส่งมอบแล้ว (Completed)</span>
            <div className="mt-2 flex items-baseline gap-2 font-serif text-2xl font-bold text-success">
              {completedCount} <span className="text-xs font-normal text-text-secondary">รายการ</span>
            </div>
          </div>
        </div>

        {/* 3. Search & Filters Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4">
          <div className="flex items-center gap-2 border-b border-border/40 pb-2 sm:border-none sm:pb-0">
            {(["all", "pending", "paid", "completed"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilter(tab)}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  filter === tab
                    ? "bg-text-heading text-text-inverse shadow-2xs font-semibold"
                    : "text-text-secondary hover:bg-bg-card hover:text-text-heading"
                }`}
              >
                {tab === "all" && "ทั้งหมด"}
                {tab === "pending" && "รอตรวจสลิป"}
                {tab === "paid" && "ชำระแล้ว"}
                {tab === "completed" && "เสร็จสิ้น"}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary/60" />
            <input
              type="text"
              placeholder="ค้นหารหัส INV, ชื่อลูกค้า, อีเมล..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-border/60 bg-bg-card py-2 pl-9 pr-3 text-xs text-text-heading placeholder-text-secondary/60 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
        </div>

        {/* 4. Invoices Table */}
        <div className="overflow-hidden rounded-xl border border-border/60 bg-bg-card shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border/50 bg-bg/60 font-semibold text-text-secondary uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 pl-6 pr-4">รหัสใบแจ้งยอด</th>
                  <th className="py-3.5 px-4">ลูกค้า (Client)</th>
                  <th className="py-3.5 px-4">วันเวลานัดหมาย</th>
                  <th className="py-3.5 px-4 text-right">ยอดเงิน</th>
                  <th className="py-3.5 px-4 text-center">สถานะ (Status)</th>
                  <th className="py-3.5 px-4 text-center">สลิป (R2)</th>
                  <th className="py-3.5 pl-4 pr-6 text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {filteredInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-text-secondary">
                      ไม่พบรายการที่ตรงกับเงื่อนไขการค้นหา
                    </td>
                  </tr>
                ) : (
                  filteredInvoices.map((inv) => (
                    <tr key={inv.invoiceNumber} className="transition-colors hover:bg-bg/50">
                      <td className="py-4 pl-6 pr-4 font-mono font-bold text-text-heading">
                        {inv.invoiceNumber}
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-semibold text-text-heading">{inv.customerName}</div>
                        <div className="text-[11px] text-text-secondary">{inv.customerEmail}</div>
                        <div className="text-[11px] text-text-secondary/80 font-mono">{inv.customerPhone}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-medium text-text-body">{inv.appointmentDate}</div>
                        <div className="text-[11px] text-text-secondary">{inv.appointmentTime}</div>
                      </td>
                      <td className="py-4 px-4 text-right font-mono font-bold text-text-heading">
                        {inv.amount.toFixed(2)}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                            inv.status === "pending"
                              ? "border border-amber-500/30 bg-amber-500/10 text-amber-700"
                              : inv.status === "paid"
                                ? "border border-accent/30 bg-accent/10 text-accent"
                                : inv.status === "completed"
                                  ? "border border-success/30 bg-success/10 text-success"
                                  : "border border-border bg-bg text-text-secondary"
                          }`}
                        >
                          {inv.status === "pending" && "🟡 รอตรวจสลิป"}
                          {inv.status === "paid" && "🟢 อนุมัติแล้ว"}
                          {inv.status === "completed" && "📑 ส่งมอบแล้ว"}
                          {inv.status === "cancelled" && "⚪ ยกเลิก"}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        {inv.slipImageUrl ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-accent bg-accent/10 px-2 py-1 rounded">
                            <span>📎 มีสลิปใน R2</span>
                          </span>
                        ) : (
                          <span className="text-text-secondary/60 text-[11px]">- ยังไม่แนบ -</span>
                        )}
                      </td>
                      <td className="py-4 pl-4 pr-6 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedInvoice(inv);
                            setReportUrlInput(inv.reportPdfUrl || "");
                            setStatusMessage(null);
                          }}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-bg px-3 py-1.5 text-xs font-semibold text-text-heading hover:border-accent hover:bg-accent/10 hover:text-accent transition-all"
                        >
                          <EyeIcon className="h-3.5 w-3.5" />
                          <span>ตรวจสอบ &amp; R2</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 5. Inspection & R2 Management Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl rounded-2xl border border-border bg-bg-card p-6 shadow-2xl md:p-8">
            <button
              type="button"
              onClick={() => setSelectedInvoice(null)}
              className="absolute right-5 top-5 rounded-lg border border-border/40 p-2 text-text-secondary hover:bg-bg hover:text-text-heading"
            >
              <CloseIcon className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-border/40 pb-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 text-accent font-mono font-bold text-sm">
                R2
              </span>
              <div>
                <h3 className="font-serif text-lg font-bold text-text-heading">
                  ตรวจสอบใบแจ้งยอด &amp; บริหาร Cloudflare R2
                </h3>
                <p className="text-xs text-text-secondary font-mono">
                  {selectedInvoice.invoiceNumber} · {selectedInvoice.customerName}
                </p>
              </div>
            </div>

            {statusMessage && (
              <div
                className={`mt-4 rounded-lg border p-3 text-xs font-medium ${
                  statusMessage.type === "success"
                    ? "border-success/30 bg-success/10 text-success"
                    : "border-warning/30 bg-warning/10 text-warning"
                }`}
              >
                {statusMessage.text}
              </div>
            )}

            <div className="mt-6 space-y-6">
              {/* Slip Inspection & R2 Upload Section */}
              <div className="rounded-xl border border-border/70 bg-bg p-5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-text-heading">1. ตรวจสอบสลิปโอนเงิน (Cloudflare R2 Object Storage)</span>
                  <label className="cursor-pointer rounded-md bg-accent/10 border border-accent/40 px-3 py-1.5 text-[11px] font-semibold text-accent hover:bg-accent/20 transition-colors">
                    <span>{uploadingSlip ? "กำลังอัปโหลดเข้า R2..." : "📤 อัปโหลด/เปลี่ยนสลิป R2"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploadingSlip}
                      onChange={(e) => handleR2FileUpload(e, "slip")}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="mt-4 flex flex-col sm:flex-row items-center gap-4">
                  <div className="flex h-36 w-36 shrink-0 items-center justify-center rounded-lg border border-border bg-white p-2">
                    {selectedInvoice.slipImageUrl ? (
                      <a href={selectedInvoice.slipImageUrl} target="_blank" rel="noopener noreferrer" title="คลิกเพื่อเปิดสลิปขนาดเต็มใน R2">
                        <img
                          src={selectedInvoice.slipImageUrl}
                          alt="Payment Slip"
                          className="h-32 w-32 object-contain hover:scale-105 transition-transform"
                        />
                      </a>
                    ) : (
                      <span className="text-center text-[11px] text-text-secondary/70">ไม่มีรูปสลิปใน R2</span>
                    )}
                  </div>
                  <div className="text-xs text-text-body space-y-1.5">
                    <p>
                      <strong>สถานะสลิป :</strong>{" "}
                      {selectedInvoice.slipImageUrl ? (
                        <span className="text-success font-semibold">✓ แนบไฟล์บน Cloudflare R2 เรียบร้อยแล้ว</span>
                      ) : (
                        <span className="text-amber-600 font-semibold">⚠ รอการอัปโหลดหรือสแกนจากลูกค้า</span>
                      )}
                    </p>
                    {selectedInvoice.slipImageUrl && (
                      <p className="break-all font-mono text-[11px] text-text-secondary">
                        <strong>R2 URL :</strong> {selectedInvoice.slipImageUrl}
                      </p>
                    )}
                    <p className="text-[11px] text-text-secondary/85">
                      💡 เมื่อตรวจสอบยอดโอนถูกต้อง ให้กดเปลี่ยนสถานะด้านล่างเป็น &quot;🟢 อนุมัติแล้ว (Paid)&quot; เพื่อส่งลิงก์ห้องสนทนาให้ลูกค้า
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Switcher Bar */}
              <div className="rounded-xl border border-border/70 bg-bg p-5">
                <span className="font-semibold text-xs text-text-heading block mb-3">2. อัปเดตสถานะการชำระเงินและคิวนัดหมาย</span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleStatusChange("pending")}
                    className={`rounded-lg py-2.5 text-xs font-semibold transition-all ${
                      selectedInvoice.status === "pending"
                        ? "bg-amber-500 text-white shadow-sm"
                        : "border border-border bg-bg-card text-text-secondary hover:border-amber-500"
                    }`}
                  >
                    🟡 รอตรวจสลิป (Pending)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusChange("paid")}
                    className={`rounded-lg py-2.5 text-xs font-semibold transition-all ${
                      selectedInvoice.status === "paid"
                        ? "bg-accent text-white shadow-sm"
                        : "border border-border bg-bg-card text-text-secondary hover:border-accent"
                    }`}
                  >
                    🟢 อนุมัติแล้ว (Paid)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusChange("completed")}
                    className={`rounded-lg py-2.5 text-xs font-semibold transition-all ${
                      selectedInvoice.status === "completed"
                        ? "bg-success text-white shadow-sm"
                        : "border border-border bg-bg-card text-text-secondary hover:border-success"
                    }`}
                  >
                    📑 ส่งมอบแล้ว (Completed)
                  </button>
                </div>
              </div>

              {/* PDF Report Delivery to R2 */}
              <div className="rounded-xl border border-border/70 bg-bg p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-xs text-text-heading">3. ส่งมอบรายงาน PDF สรุปผล (Cloudflare R2 Storage)</span>
                  <label className="cursor-pointer rounded-md bg-success/15 border border-success/40 px-3 py-1.5 text-[11px] font-semibold text-success hover:bg-success/25 transition-colors">
                    <span>{uploadingReport ? "กำลังอัปโหลดรายงาน..." : "📑 อัปโหลดรายงาน PDF เข้า R2"}</span>
                    <input
                      type="file"
                      accept="application/pdf"
                      disabled={uploadingReport}
                      onChange={(e) => handleR2FileUpload(e, "report")}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={reportUrlInput}
                    onChange={(e) => setReportUrlInput(e.target.value)}
                    placeholder="วางลิงก์รายงาน PDF จาก R2 (เช่น https://pub-xxx.r2.dev/reports/INV-xxxx.pdf)"
                    className="flex-1 rounded-lg border border-border/60 bg-bg-card px-3 py-2 text-xs font-mono text-text-heading placeholder-text-secondary/60 focus:border-accent focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleReportUrlSave}
                    className="rounded-lg bg-text-heading px-4 py-2 text-xs font-semibold text-text-inverse hover:bg-accent transition-colors"
                  >
                    บันทึก
                  </button>
                </div>
                {selectedInvoice.reportPdfUrl && (
                  <div className="mt-2 text-[11px] text-success font-medium flex items-center gap-1.5">
                    <span>✓ ลิงก์รายงานนี้พร้อมแสดงให้ลูกค้าดาวน์โหลดใน Client Portal เรียบร้อยแล้ว</span>
                    <a
                      href={selectedInvoice.reportPdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline font-bold"
                    >
                      (เปิดดู PDF)
                    </a>
                  </div>
                )}
              </div>

              {/* Resend Manual Email Trigger Box */}
              <div className="rounded-xl border border-accent/40 bg-accent/5 p-5">
                <span className="font-semibold text-xs text-accent block mb-2">4. แจ้งเตือนอีเมลอัตโนมัติถึงลูกค้า (Resend API)</span>
                <p className="text-[11px] text-text-secondary mb-3">
                  ระบบจะส่งอีเมลให้อัตโนมัติเมื่อเปลี่ยนสถานะเป็น Paid หรือ Completed แต่คุณสามารถกดส่งเองได้ที่นี่
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleSendEmail(selectedInvoice, "payment_confirmed")}
                    className="rounded-lg bg-accent px-3.5 py-2 text-[11px] font-bold text-white shadow-2xs hover:bg-accent-hover transition-colors flex items-center gap-1"
                  >
                    <span>✉️ ส่งอีเมลยืนยันสลิป/นัดหมาย</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSendEmail(selectedInvoice, "report_delivered")}
                    className="rounded-lg bg-success px-3.5 py-2 text-[11px] font-bold text-white shadow-2xs hover:bg-success/90 transition-colors flex items-center gap-1"
                  >
                    <span>📑 ส่งอีเมลรายงาน PDF (R2)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSendEmail(selectedInvoice, "invoice_created")}
                    className="rounded-lg border border-border bg-bg-card px-3.5 py-2 text-[11px] font-semibold text-text-heading hover:border-accent transition-colors flex items-center gap-1"
                  >
                    <span>📄 ส่งอีเมลใบแจ้งยอดรอชำระ</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedInvoice(null)}
                className="rounded-xl bg-accent px-6 py-2.5 text-xs font-semibold text-text-inverse hover:bg-accent-hover shadow-sm transition-all"
              >
                เสร็จสิ้น / ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
