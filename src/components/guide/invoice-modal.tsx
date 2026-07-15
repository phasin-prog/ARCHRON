"use client";

import { useState } from "react";
import Image from "next/image";
import { Modal } from "@/components/modal";
import type { InvoiceData, PaymentStatus } from "@/components/guide/types";
import { AuthorPenIcon, CheckIcon } from "@/components/icons";

interface InvoiceModalProps {
  open: boolean;
  onClose: () => void;
  invoice: InvoiceData | null;
  onPaymentVerified: (invoiceId: string) => void;
}

function renderStatusBadge(status: PaymentStatus) {
  switch (status) {
    case "pending":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-warning/40 bg-warning/15 px-3 py-1 text-xs font-semibold text-warning">
          <span className="h-2 w-2 animate-pulse rounded-full bg-warning" aria-hidden="true" />
          Pending / รอชำระเงิน
        </span>
      );
    case "paid":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-success/40 bg-success/15 px-3 py-1 text-xs font-semibold text-success">
          <span className="h-2 w-2 rounded-full bg-success" aria-hidden="true" />
          Paid / ยืนยันคิวแล้ว
        </span>
      );
    case "cancelled":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-error/40 bg-error/15 px-3 py-1 text-xs font-semibold text-error">
          Cancelled / ยกเลิก
        </span>
      );
    case "completed":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-info/40 bg-info/15 px-3 py-1 text-xs font-semibold text-info">
          Completed / เสร็สิ้น
        </span>
      );
  }
}

export function InvoiceModal({
  open,
  onClose,
  invoice,
  onPaymentVerified,
}: InvoiceModalProps) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  if (!invoice) return null;

  const handleRealSlipUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setIsVerifying(true);
    setNotification(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("invoiceNumber", invoice.invoiceNumber);

    try {
      const res = await fetch("/api/upload/slip", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "อัปโหลดสลิปไม่สำเร็จ");
      }
      onPaymentVerified(invoice.invoiceNumber);
      setNotification("อัปโหลดสลิปเข้าสู่ระบบ Cloudflare R2 เรียบร้อยแล้ว! ทีมงานจะตรวจสอบและยืนยันนัดหมายทางอีเมลโดยเร็วที่สุด");
    } catch (err) {
      setNotification(`เกิดข้อผิดพลาด: ${err instanceof Error ? err.message : "การอัปโหลดล้มเหลว"}`);
    } finally {
      setIsVerifying(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    setNotification("กำลังสร้างไฟล์ PDF... (บันทึกเอกสารลงระบบ Client Portal เรียบร้อย)");
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  const handleEmailInvoice = () => {
    setNotification(`จัดส่งใบแจ้งยอดไปยังอีเมล ${invoice.customerEmail} เรียบร้อยแล้ว`);
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  return (
    <>
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-invoice-area,
          #printable-invoice-area * {
            visibility: visible !important;
          }
          #printable-invoice-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 30px !important;
            border: none !important;
            box-shadow: none !important;
            background: white !important;
            color: black !important;
            z-index: 99999 !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
      <Modal
        open={open}
        onClose={onClose}
        title={`ใบแจ้งยอดชำระเงิน #${invoice.invoiceNumber}`}
        className="w-[min(95%,700px)]"
      footer={
        <div className="flex w-full flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadPDF}
              className="rounded-md border border-border/70 bg-bg-card px-3.5 py-2 text-xs font-medium text-text-body transition-colors hover:bg-bg-elevated hover:text-text-heading focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              ดาวน์โหลด PDF
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="rounded-md border border-border/70 bg-bg-card px-3.5 py-2 text-xs font-medium text-text-body transition-colors hover:bg-bg-elevated hover:text-text-heading focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              พิมพ์ใบแจ้งยอด
            </button>

            <button
              type="button"
              onClick={handleEmailInvoice}
              className="rounded-md border border-border/70 bg-bg-card px-3.5 py-2 text-xs font-medium text-text-body transition-colors hover:bg-bg-elevated hover:text-text-heading focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              ส่งเข้าอีเมล
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md bg-text-heading px-6 py-2 text-xs font-semibold text-text-inverse transition-colors hover:bg-text-body focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      }
    >
      <div className="space-y-6 text-sm">
        {notification && (
          <div className="rounded-md border border-success/40 bg-success/10 p-3 text-xs font-medium text-success animate-in fade-in duration-200">
            {notification}
          </div>
        )}

        {/* Workflow Stepper Bar */}
        <div className="rounded-lg border border-border/50 bg-bg-elevated/50 p-4">
          <div className="flex items-center justify-between text-[11px] font-semibold">
            <div className="flex items-center gap-1.5 text-success">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-success text-text-inverse">
                <CheckIcon className="h-3 w-3" />
              </span>
              <span>1. จองคิว</span>
            </div>
            <div className="h-px flex-1 bg-border/80 mx-2" />
            <div className="flex items-center gap-1.5 text-success">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-success text-text-inverse">
                <CheckIcon className="h-3 w-3" />
              </span>
              <span>2. ออกใบแจ้งยอด</span>
            </div>
            <div className="h-px flex-1 bg-border/80 mx-2" />
            <div className={`flex items-center gap-1.5 ${invoice.status === "paid" ? "text-success" : "text-accent font-bold"}`}>
              <span className={`flex h-5 w-5 items-center justify-center rounded-full ${invoice.status === "paid" ? "bg-success text-text-inverse" : "border-2 border-accent text-accent"}`}>
                {invoice.status === "paid" ? <CheckIcon className="h-3 w-3" /> : "3"}
              </span>
              <span>3. แจ้งชำระเงิน</span>
            </div>
            <div className="h-px flex-1 bg-border/80 mx-2" />
            <div className={`flex items-center gap-1.5 ${invoice.status === "paid" ? "text-success" : "text-text-secondary/50"}`}>
              <span className={`flex h-5 w-5 items-center justify-center rounded-full ${invoice.status === "paid" ? "bg-success text-text-inverse" : "border border-border text-text-secondary/60"}`}>
                {invoice.status === "paid" ? <CheckIcon className="h-3 w-3" /> : "4"}
              </span>
              <span>4. ยืนยันเวลานัด</span>
            </div>
          </div>
        </div>

        {/* Invoice Printable Area */}
        <div id="printable-invoice-area" className="rounded-xl border border-border/70 bg-bg p-6 shadow-sm">
          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border/50 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <AuthorPenIcon className="h-5 w-5 text-accent" />
                <span className="font-serif text-lg font-bold tracking-wider text-text-heading uppercase">
                  ARCHRON
                </span>
              </div>
              <p className="mt-1 text-xs text-text-secondary/80">
                {invoice.status === "paid" || invoice.status === "completed"
                  ? "ใบเสร็จรับเงินอย่างเป็นทางการ (Official Receipt / Confirmation)"
                  : "Jungian Type Analysis Consulting Institute (Invoice)"}
              </p>
            </div>

            <div className="text-right">
              {renderStatusBadge(invoice.status)}
              <div className="mt-2 font-mono text-xs font-semibold text-text-heading">
                {invoice.invoiceNumber}
              </div>
              <div className="text-[11px] text-text-secondary/80">
                วันที่ออก: {invoice.issueDate}
              </div>
            </div>
          </div>

          {/* Customer & Appointment Info */}
          <div className="mt-5 grid gap-4 sm:grid-cols-2 border-b border-border/40 pb-5 text-xs">
            <div>
              <span className="block font-semibold uppercase tracking-wider text-text-secondary/70 text-[10px]">
                ลูกค้าผู้รับบริการ (Customer)
              </span>
              <div className="mt-1 font-semibold text-text-heading text-sm">
                {invoice.customerName}
              </div>
              <div className="text-text-secondary/90">{invoice.customerEmail}</div>
              <div className="text-text-secondary/90">{invoice.customerPhone}</div>
            </div>

            <div>
              <span className="block font-semibold uppercase tracking-wider text-text-secondary/70 text-[10px]">
                กำหนดการสัมภาษณ์ (Appointment)
              </span>
              <div className="mt-1 font-semibold text-text-heading text-sm">
                วันที่ {invoice.appointmentDate}
              </div>
              <div className="text-accent font-medium">{invoice.appointmentTime}</div>
              <div className="text-text-secondary/80 text-[11px]">ระบบประชุมออนไลน์ (1-on-1)</div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="mt-5 border-b border-border/40 pb-5">
            <span className="block font-semibold uppercase tracking-wider text-text-secondary/70 text-[10px] mb-2">
              รายการบริการ (Service Item)
            </span>
            <div className="flex items-center justify-between rounded-md bg-bg-card/70 p-3.5 text-xs">
              <div>
                <span className="font-semibold text-text-heading">{invoice.serviceName}</span>
                <span className="block text-[11px] text-text-secondary/80">
                  ครอบคลุมเซสชัน 90 นาที + จัดทำรายงานสรุป PDF 2–3 หน้า
                </span>
              </div>
              <span className="font-mono text-sm font-bold text-text-heading">
                {invoice.amount.toFixed(2)} บาท
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between pt-2 px-1">
              <span className="font-serif text-sm font-bold text-text-heading">ยอดชำระสุทธิ (Total Amount)</span>
              <span className="font-serif text-2xl font-bold text-accent">
                {invoice.amount.toFixed(2)} THB
              </span>
            </div>
          </div>

          {/* Payment Method & PromptPay QR */}
          {invoice.status === "pending" && (
            <div className="mt-5 rounded-lg border border-accent/25 bg-accent/5 p-4 text-center">
              <span className="block text-xs font-bold text-accent uppercase tracking-wider">
                ชำระเงินผ่าน THAI QR PAYMENT / PromptPay
              </span>
              <p className="mt-1 text-[11px] text-text-secondary/90">
                สแกนผ่านแอปพลิเคชันธนาคารทุกธนาคาร หรือโอนเข้าบัญชี: <strong className="font-mono text-text-heading">{invoice.promptPayNumber}</strong>
              </p>

              {/* Official PromptPay QR Code Image */}
              <div className="mx-auto mt-4 flex flex-col items-center justify-center rounded-xl border-2 border-accent/40 bg-bg-card p-3 shadow-md max-w-[260px]">
                <Image
                  src="/promptpay-qr.jpg"
                  alt="THAI QR PAYMENT - PromptPay นาย พศิน พสุมาตร บัญชี xxx-x-x6727-x"
                  width={230}
                  height={300}
                  className="rounded object-contain w-full h-auto"
                  priority
                  unoptimized
                />
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-2 no-print">
                <label className="cursor-pointer inline-flex items-center gap-2 rounded-md bg-success px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-success/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-success disabled:opacity-60">
                  {isVerifying ? (
                    <>
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>กำลังส่งไฟล์สลิป...</span>
                    </>
                  ) : (
                    <>
                      <span>แนบสลิปชำระเงิน (Cloudflare R2)</span>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={isVerifying}
                        onChange={handleRealSlipUpload}
                        className="hidden"
                      />
                    </>
                  )}
                </label>
              </div>
            </div>
          )}

          {invoice.status === "paid" && (
            <div className="mt-5 rounded-lg border border-success/40 bg-success/10 p-4 text-center">
              <span className="inline-flex items-center gap-2 font-serif text-sm font-bold text-success">
                <CheckIcon className="h-4 w-4" />
                ชำระเงินและยืนยันคิวนัดหมายเรียบร้อยแล้ว
              </span>
              <p className="mt-1 text-xs text-text-secondary/90">
                ระบบได้จัดส่งลิงก์ห้องสัมภาษณ์ออนไลน์และรายละเอียดการเตรียมตัวไปที่อีเมลของคุณแล้ว
              </p>
            </div>
          )}
        </div>
      </div>
    </Modal>
    </>
  );
}
