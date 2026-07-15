"use client";

import { useState } from "react";
import type { AppointmentItem, InvoiceData, ReportItem } from "@/components/guide/types";
import {
  ClockIcon,
  AuthorPenIcon,
  EyeIcon,
} from "@/components/icons";

interface ClientDashboardProps {
  appointments: AppointmentItem[];
  invoices: InvoiceData[];
  reports: ReportItem[];
  onOpenInvoice: (invoice: InvoiceData) => void;
  onNewBookingClick: () => void;
}

export function ClientDashboard({
  appointments,
  invoices,
  reports,
  onOpenInvoice,
  onNewBookingClick,
}: ClientDashboardProps) {
  const [activeTab, setActiveTab] = useState<"appointments" | "invoices" | "reports" | "receipts">("appointments");

  const upcomingSessions = appointments.filter((a) => a.status === "confirmed" || a.status === "pending");
  const pastSessions = appointments.filter((a) => a.status === "completed");
  const paidInvoices = invoices.filter((i) => i.status === "paid" || i.status === "completed");

  return (
    <section className="bg-bg px-6 py-12 min-h-[75vh]">
      <div className="mx-auto max-w-5xl">
        {/* Dashboard Banner */}
        <div className="rounded-xl border border-border/60 bg-bg-card p-8 shadow-sm md:p-10">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-3 py-1 text-[11px] font-semibold text-accent uppercase tracking-wider">
                ARCHRON CLIENT PORTAL
              </span>
              <h1 className="mt-3 font-serif text-2xl font-bold text-text-heading md:text-3xl">
                คลังนัดหมายและรายงานวิเคราะห์ส่วนตัว
              </h1>
              <p className="mt-1.5 text-xs text-text-secondary/85 md:text-sm">
                ศูนย์รวมการจัดการนัดหมาย ติดตามสถานะใบแจ้งยอด ดาวน์โหลดรายงาน PDF และใบเสร็จรับเงินของคุณ
              </p>
            </div>

            <button
              type="button"
              onClick={onNewBookingClick}
              className="shrink-0 rounded-md bg-accent px-6 py-3 text-xs font-semibold text-text-inverse shadow-sm transition-all hover:-translate-y-0.5 hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              + จองเซสชันวิเคราะห์ใหม่
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-8 flex flex-wrap gap-2 border-b border-border/50 pb-4 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab("appointments")}
            className={`rounded-md px-5 py-2.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
              activeTab === "appointments"
                ? "bg-text-heading text-text-inverse shadow-sm"
                : "bg-bg-card/70 text-text-body hover:bg-bg-card"
            }`}
          >
            รายการนัดหมาย (Appointments) [{appointments.length}]
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("invoices")}
            className={`rounded-md px-5 py-2.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
              activeTab === "invoices"
                ? "bg-text-heading text-text-inverse shadow-sm"
                : "bg-bg-card/70 text-text-body hover:bg-bg-card"
            }`}
          >
            ใบแจ้งยอดชำระเงิน (Invoices) [{invoices.length}]
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("reports")}
            className={`rounded-md px-5 py-2.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
              activeTab === "reports"
                ? "bg-text-heading text-text-inverse shadow-sm"
                : "bg-bg-card/70 text-text-body hover:bg-bg-card"
            }`}
          >
            คลังรายงานวิเคราะห์ (Reports) [{reports.length}]
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("receipts")}
            className={`rounded-md px-5 py-2.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
              activeTab === "receipts"
                ? "bg-text-heading text-text-inverse shadow-sm"
                : "bg-bg-card/70 text-text-body hover:bg-bg-card"
            }`}
          >
            ใบเสร็จรับเงิน (Receipts) [{paidInvoices.length}]
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="mt-8">
          {/* APPOINTMENTS TAB */}
          {activeTab === "appointments" && (
            <div className="space-y-8">
              {/* Upcoming */}
              <div>
                <h3 className="font-serif text-lg font-bold text-text-heading">
                  เซสชันที่กำลังจะมาถึง (Upcoming Sessions)
                </h3>
                {upcomingSessions.length === 0 ? (
                  <div className="mt-4 rounded-lg border border-dashed border-border p-8 text-center text-xs text-text-secondary">
                    ยังไม่มีรายการนัดหมายที่กำลังจะมาถึง คุณสามารถกดปุ่ม &ldquo;+ จองเซสชันวิเคราะห์ใหม่&rdquo; ด้านบนได้เลยครับ
                  </div>
                ) : (
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    {upcomingSessions.map((apt) => (
                      <div
                        key={apt.id}
                        className="rounded-lg border border-accent/30 bg-bg-card p-6 shadow-sm transition-all hover:border-accent"
                      >
                        <div className="flex items-center justify-between">
                          <span className="rounded bg-success/15 px-2.5 py-0.5 text-[10px] font-semibold text-success uppercase">
                            CONFIRMED SLOT
                          </span>
                          <ClockIcon className="h-4 w-4 text-accent" />
                        </div>

                        <h4 className="mt-3 font-serif text-base font-bold text-text-heading">
                          {apt.serviceName}
                        </h4>

                        <div className="mt-2.5 space-y-1 text-xs text-text-body">
                          <div><strong className="text-text-heading">วันที่:</strong> {apt.date}</div>
                          <div><strong className="text-text-heading">ช่วงเวลา:</strong> {apt.time}</div>
                          <div><strong className="text-text-heading">ช่องทาง:</strong> Video Conference (1-on-1)</div>
                        </div>

                        {apt.notes && (
                          <div className="mt-3 rounded bg-bg-elevated/70 p-2 text-[11px] italic text-text-secondary">
                            &ldquo;{apt.notes}&rdquo;
                          </div>
                        )}

                        <div className="mt-5 flex items-center justify-between border-t border-border/40 pt-3">
                          <button
                            type="button"
                            onClick={() => {
                              const inv = invoices.find((i) => i.invoiceNumber === apt.invoiceId);
                              if (inv) onOpenInvoice(inv);
                            }}
                            className="text-xs font-semibold text-accent hover:underline focus-visible:outline-none"
                          >
                            ดูใบแจ้งยอด #{apt.invoiceId}
                          </button>
                          <span className="text-[11px] text-success font-medium">✓ ล็อคห้องสนทนาแล้ว</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Past Sessions */}
              <div>
                <h3 className="font-serif text-lg font-bold text-text-heading">
                  ประวัติเซสชันที่เสร็จสิ้นแล้ว (Past Sessions)
                </h3>
                {pastSessions.length === 0 ? (
                  <div className="mt-4 rounded-lg border border-dashed border-border p-8 text-center text-xs text-text-secondary">
                    ยังไม่มีประวัติเซสชันในอดีต
                  </div>
                ) : (
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    {pastSessions.map((apt) => (
                      <div
                        key={apt.id}
                        className="rounded-lg border border-border/50 bg-bg-card/70 p-6 text-xs"
                      >
                        <div className="flex items-center justify-between text-text-secondary/80">
                          <span className="font-semibold">{apt.date} ({apt.time})</span>
                          <span className="rounded bg-info/10 px-2 py-0.5 text-[10px] text-info uppercase font-bold">COMPLETED</span>
                        </div>
                        <h4 className="mt-2 font-serif text-sm font-bold text-text-heading">{apt.serviceName}</h4>
                        <div className="mt-3 border-t border-border/30 pt-3">
                          <span className="text-[11px] text-success">✓ จัดทำและส่งมอบรายงานวิเคราะห์เรียบร้อยแล้ว</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* INVOICES TAB */}
          {activeTab === "invoices" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg font-bold text-text-heading">
                  ประวัติใบแจ้งยอดทั้งหมด
                </h3>
                <span className="text-xs text-text-secondary/80">
                  คลิกที่รายการเพื่อดูรายละเอียด QR Code หรือดาวน์โหลด PDF
                </span>
              </div>

              {invoices.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border p-8 text-center text-xs text-text-secondary">
                  ยังไม่มีประวัติใบแจ้งยอด
                </div>
              ) : (
                <div className="divide-y divide-border/40 rounded-xl border border-border/60 bg-bg-card overflow-hidden">
                  {invoices.map((inv) => (
                    <div
                      key={inv.invoiceNumber}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 transition-colors hover:bg-bg-elevated/40"
                    >
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm font-bold text-text-heading">{inv.invoiceNumber}</span>
                          <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                            inv.status === "paid"
                              ? "bg-success/15 text-success"
                              : "bg-warning/15 text-warning"
                          }`}>
                            {inv.status === "paid" ? "PAID" : "PENDING"}
                          </span>
                        </div>
                        <div className="mt-1 text-xs text-text-secondary">
                          {inv.serviceName} · นัดหมายวันที่ {inv.appointmentDate} ({inv.appointmentTime})
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-6">
                        <span className="font-mono text-base font-bold text-text-heading">
                          {inv.amount.toFixed(2)} บาท
                        </span>
                        <button
                          type="button"
                          onClick={() => onOpenInvoice(inv)}
                          className="rounded-md border border-border bg-bg px-4 py-2 text-xs font-semibold text-text-heading transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                        >
                          ดูใบแจ้งยอด
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* REPORTS TAB */}
          {activeTab === "reports" && (
            <div className="space-y-4">
              <h3 className="font-serif text-lg font-bold text-text-heading">
                คลังเอกสารรายงานวิเคราะห์ PDF
              </h3>
              {reports.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border p-8 text-center text-xs text-text-secondary">
                  ยังไม่มีเอกสารรายงานในระบบ รายงาน PDF ของคุณจะปรากฏที่นี่ภายใน 3–5 วันทำการหลังเสร็จสิ้นเซสชันสัมภาษณ์ครับ
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {reports.map((rep) => (
                    <div
                      key={rep.id}
                      className="flex flex-col justify-between rounded-lg border border-border/60 bg-bg-card p-6 shadow-sm transition-all hover:border-accent/40"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <AuthorPenIcon className="h-5 w-5 text-accent" />
                          <span className="rounded bg-accent/10 px-2 py-0.5 font-mono text-[10px] font-bold text-accent">
                            PDF REPORT · {rep.pagesCount} PAGES
                          </span>
                        </div>

                        <h4 className="mt-4 font-serif text-base font-bold text-text-heading">
                          {rep.title}
                        </h4>

                        <div className="mt-2 text-xs text-text-secondary/80">
                          วันที่จัดทำ: {rep.date} · ขนาดไฟล์: {rep.fileSize}
                        </div>
                      </div>

                      <div className="mt-6 flex items-center justify-between border-t border-border/40 pt-4">
                        <span className="text-[11px] font-medium text-success">✓ พร้อมดาวน์โหลด</span>
                        <button
                          type="button"
                          onClick={() => {
                            alert("↓ ดาวน์โหลดไฟล์รายงาน " + rep.title + " เรียบร้อยแล้ว");
                          }}
                          className="inline-flex items-center gap-1.5 rounded bg-accent px-4 py-2 text-xs font-semibold text-text-inverse transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                        >
                          <EyeIcon className="h-3.5 w-3.5" />
                          <span>ดาวน์โหลด PDF</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* RECEIPTS TAB */}
          {activeTab === "receipts" && (
            <div className="space-y-4">
              <h3 className="font-serif text-lg font-bold text-text-heading">
                ใบเสร็จรับเงินดิจิทัล (Digital Receipts)
              </h3>
              {paidInvoices.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border p-8 text-center text-xs text-text-secondary">
                  ยังไม่มีใบเสร็จรับเงิน (ใบเสร็จจะถูกออกอัตโนมัติเมื่อรายการชำระเงินถูกยืนยันสถานะ Paid แล้ว)
                </div>
              ) : (
                <div className="divide-y divide-border/40 rounded-xl border border-border/60 bg-bg-card overflow-hidden">
                  {paidInvoices.map((inv) => (
                    <div
                      key={inv.invoiceNumber}
                      className="flex items-center justify-between p-5 text-xs"
                    >
                      <div>
                        <span className="font-mono font-bold text-text-heading">REC-{inv.invoiceNumber.replace("INV-", "")}</span>
                        <span className="ml-2 text-text-secondary/80">({inv.serviceName})</span>
                        <div className="mt-1 text-[11px] text-text-secondary">ชำระเมื่อ {inv.issueDate} · จำนวน {inv.amount.toFixed(2)} THB</div>
                      </div>

                      <button
                        type="button"
                        onClick={() => window.print()}
                        className="rounded border border-border/70 bg-bg px-3 py-1.5 font-medium text-text-body transition-colors hover:bg-bg-elevated focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                      >
                        พิมพ์ใบเสร็จ
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
