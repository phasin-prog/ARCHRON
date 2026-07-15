"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  listServiceInvoices,
  upsertServiceInvoice,
  updateServiceInvoiceStatus,
} from "@/lib/content/invoices-db";
import { HeroSection } from "@/components/guide/hero-section";
import { IntroductionSection } from "@/components/guide/introduction-section";
import { FeatureCards } from "@/components/guide/feature-cards";
import { AnalysisCards } from "@/components/guide/analysis-cards";
import { AnalysisTimeline } from "@/components/guide/timeline";
import { SampleReportPreview } from "@/components/guide/sample-report";
import { PricingSection } from "@/components/guide/pricing-card";
import { FAQSection } from "@/components/guide/faq-accordion";
import { AcademicDisclaimer } from "@/components/guide/academic-disclaimer";
import { ContactSection } from "@/components/guide/contact-card";
import { BookingDialog } from "@/components/guide/booking-dialog";
import { InvoicePreview } from "@/components/guide/invoice-preview";
import { ClientDashboard } from "@/components/guide/client-dashboard";
import {
  generateInvoiceNumber,
  generateInvoiceData,
  SAMPLE_INVOICE,
  SAMPLE_PENDING_INVOICE,
  type BookingFormData,
  type InvoiceData,
  type AppointmentItem,
  type ReportItem,
} from "@/components/guide/types";
import { PersonIcon, ExplorerIcon } from "@/components/icons";

export function JungianServicePlatform() {
  const [activeView, setActiveView] = useState<"platform" | "portal">("platform");
  const [platformTab, setPlatformTab] = useState<"overview" | "scope" | "process" | "pricing">("overview");
  const [bookingOpen, setBookingOpen] = useState(false);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceData | null>(null);

  // Dynamic state simulation for interactive end-to-end user workflow
  const [invoices, setInvoices] = useState<InvoiceData[]>([SAMPLE_PENDING_INVOICE, SAMPLE_INVOICE]);
  const [appointments, setAppointments] = useState<AppointmentItem[]>([
    {
      id: "APT-SAMPLE-PENDING",
      invoiceId: SAMPLE_PENDING_INVOICE.invoiceNumber,
      serviceName: "Jungian Type Analysis - เซสชัน 90 นาที (รอชำระเงิน)",
      date: SAMPLE_PENDING_INVOICE.appointmentDate,
      time: SAMPLE_PENDING_INVOICE.appointmentTime,
      status: "pending",
      notes: "ตัวอย่างรายการจองคิวใหม่ที่รอการสแกน QR Code หรือจำลองชำระเงิน",
    },
    {
      id: "APT-SAMPLE-01",
      invoiceId: SAMPLE_INVOICE.invoiceNumber,
      serviceName: "Jungian Type Analysis - เซสชัน 90 นาที",
      date: SAMPLE_INVOICE.appointmentDate,
      time: SAMPLE_INVOICE.appointmentTime,
      status: "confirmed",
      notes: "ต้องการปรึกษาเรื่องฟังก์ชัน Dominant และ Shadow ยามความเครียดจากงาน",
    },
  ]);
  const [reports] = useState<ReportItem[]>([
    {
      id: "REP-SAMPLE-01",
      title: "รายงานสรุปจิตวิเคราะห์ Jungian Type Analysis (ฉบับสมบูรณ์)",
      date: "14 กรกฎาคม 2569",
      pagesCount: 3,
      fileSize: "1.4 MB",
      status: "ready",
      downloadUrl: "/guide/sample-report",
    },
  ]);

  // Connect to Supabase for real database persistence if env keys exist
  const supabaseRef = useRef<ReturnType<typeof createClient> | null>(null);
  if (!supabaseRef.current) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
    if (supabaseUrl && supabaseKey) {
      supabaseRef.current = createClient(supabaseUrl, supabaseKey);
    }
  }

  useEffect(() => {
    const supabase = supabaseRef.current;
    if (!supabase) return;
    listServiceInvoices(supabase).then((dbInvoices) => {
      if (dbInvoices && dbInvoices.length > 0) {
        setInvoices((prev) => {
          const merged = [...dbInvoices];
          prev.forEach((inv) => {
            if (!merged.some((d) => d.invoiceNumber === inv.invoiceNumber)) {
              merged.push(inv);
            }
          });
          return merged;
        });

        const dbAppointments: AppointmentItem[] = dbInvoices.map((inv) => ({
          id: `APT-${inv.invoiceNumber.split("-")[1] || "DB"}`,
          invoiceId: inv.invoiceNumber,
          serviceName: inv.serviceName.split(" - ")[0],
          date: inv.appointmentDate,
          time: inv.appointmentTime,
          status: inv.status === "paid" ? "confirmed" : "pending",
          notes: "นัดหมายเข้ารับการวิเคราะห์จากระบบฐานข้อมูล",
        }));
        setAppointments((prev) => {
          const mergedApt = [...dbAppointments];
          prev.forEach((apt) => {
            if (!mergedApt.some((d) => d.invoiceId === apt.invoiceId)) {
              mergedApt.push(apt);
            }
          });
          return mergedApt;
        });
      }
    });
  }, []);

  const handleOpenBooking = () => {
    setBookingOpen(true);
  };

  const handleBookingSubmitSuccess = (formData: BookingFormData) => {
    setBookingOpen(false);

    // Generate new formal invoice ID & data object
    const newInvoiceId = generateInvoiceNumber();
    const newInvoice = generateInvoiceData(formData, newInvoiceId);

    // Add to invoice list
    setInvoices((prev) => [newInvoice, ...prev]);

    // Create a new pending appointment slot
    const newAppointment: AppointmentItem = {
      id: `APT-${newInvoiceId.split("-")[1] || "NEW"}`,
      invoiceId: newInvoiceId,
      serviceName: formData.service.split(" - ")[0],
      date: formData.preferredDate,
      time: formData.preferredTime,
      status: "pending",
      notes: formData.notes || "ไม่มีข้อความเพิ่มเติม",
    };
    setAppointments((prev) => [newAppointment, ...prev]);

    // Open invoice verification modal
    setSelectedInvoice(newInvoice);
    setInvoiceModalOpen(true);

    // Persist to Supabase Database asynchronously
    if (supabaseRef.current) {
      upsertServiceInvoice(supabaseRef.current, newInvoice, formData.notes);
    }

    // Trigger instant Resend automated email with Invoice & PromptPay QR
    fetch("/api/email/notify-booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ invoice: newInvoice }),
    }).catch(() => {
      /* ignore background notification errors */
    });
  };

  const handlePaymentVerified = (invoiceNumber: string) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.invoiceNumber === invoiceNumber ? { ...inv, status: "paid" } : inv))
    );
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.invoiceId === invoiceNumber ? { ...apt, status: "confirmed" } : apt
      )
    );

    // Update status inside Supabase Database asynchronously
    if (supabaseRef.current) {
      updateServiceInvoiceStatus(supabaseRef.current, invoiceNumber, "paid");
    }
  };

  const handleOpenInvoiceModal = (invoice: InvoiceData) => {
    setSelectedInvoice(invoice);
    setInvoiceModalOpen(true);
  };

  const handleScrollToPricing = () => {
    setPlatformTab("pricing");
    setTimeout(() => {
      document.getElementById("platform-tabs-anchor")?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  const handleSwitchTab = (tab: "overview" | "scope" | "process" | "pricing") => {
    setPlatformTab(tab);
    setTimeout(() => {
      document.getElementById("platform-tabs-anchor")?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  return (
    <div className="min-h-screen bg-bg text-text-body">
      {/* Sub-header Navigation Switcher (Service Platform vs Client Portal) */}
      <div className="sticky top-[4.5rem] z-30 border-b border-border/60 bg-bg/95 backdrop-blur-md px-6 py-3 shadow-xs">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-text-heading tracking-wider">ARCHRON GUIDE :</span>
            <span className="text-text-secondary/85 hidden sm:inline">
              ศูนย์บริการวิเคราะห์โครงสร้างจิต Jungian Type Analysis
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveView("platform")}
              className={`inline-flex items-center gap-1.5 rounded-md px-3.5 py-1.5 font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                activeView === "platform"
                  ? "bg-accent text-text-inverse shadow-xs"
                  : "bg-bg-card/80 text-text-body hover:bg-bg-card"
              }`}
            >
              <ExplorerIcon className="h-3.5 w-3.5" />
              <span>แพลตฟอร์มบริการหลัก</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveView("portal")}
              className={`inline-flex items-center gap-1.5 rounded-md px-3.5 py-1.5 font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                activeView === "portal"
                  ? "bg-text-heading text-text-inverse shadow-xs"
                  : "bg-bg-card/80 text-text-body hover:bg-bg-card"
              }`}
            >
              <PersonIcon className="h-3.5 w-3.5" />
              <span>Client Portal ({appointments.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {activeView === "platform" ? (
        <main className="pb-20">
          <HeroSection
            onBookClick={handleOpenBooking}
            onPricingClick={handleScrollToPricing}
            onPreviewInvoiceClick={() => handleOpenInvoiceModal(SAMPLE_PENDING_INVOICE)}
          />

          {/* Sticky Platform Navigation Tabs (Eliminates Cognitive Load & Scrolling) */}
          <div id="platform-tabs-anchor" className="sticky top-[7.75rem] z-20 border-b border-border/70 bg-bg-card/95 backdrop-blur-md px-6 py-3.5 shadow-sm">
            <div className="mx-auto max-w-5xl">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent hidden md:inline">
                  หมวดหมู่ข้อมูลบริการ :
                </span>
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => handleSwitchTab("overview")}
                    className={`rounded-lg px-4 py-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                      platformTab === "overview"
                        ? "bg-text-heading text-text-inverse shadow-sm"
                        : "bg-bg hover:bg-bg-elevated text-text-body"
                    }`}
                  >
                    1. ภาพรวมและคุณค่า
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSwitchTab("scope")}
                    className={`rounded-lg px-4 py-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                      platformTab === "scope"
                        ? "bg-text-heading text-text-inverse shadow-sm"
                        : "bg-bg hover:bg-bg-elevated text-text-body"
                    }`}
                  >
                    2. มิติวิเคราะห์ &amp; ตัวอย่างรายงาน
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSwitchTab("process")}
                    className={`rounded-lg px-4 py-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                      platformTab === "process"
                        ? "bg-text-heading text-text-inverse shadow-sm"
                        : "bg-bg hover:bg-bg-elevated text-text-body"
                    }`}
                  >
                    3. ขั้นตอนการเข้ารับบริการ
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSwitchTab("pricing")}
                    className={`rounded-lg px-4 py-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                      platformTab === "pricing"
                        ? "bg-accent text-text-inverse shadow-sm"
                        : "bg-bg hover:bg-bg-elevated text-text-body"
                    }`}
                  >
                    4. อัตราค่าบริการ &amp; การจอง
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic Mounted Sections based on Active Tab (Fast & Focused) */}
          <div className="animate-in fade-in duration-200">
            {platformTab === "overview" && (
              <>
                <IntroductionSection />
                <FeatureCards />
                
                {/* Next Tab Strip */}
                <div className="mx-auto max-w-5xl px-6 py-10">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-border/60 bg-bg-card p-6 shadow-xs">
                    <div>
                      <span className="text-xs font-semibold text-accent uppercase tracking-wider">NEXT STEP</span>
                      <p className="mt-1 font-serif text-base font-bold text-text-heading">
                        สำรวจขอบเขตมิติการวิเคราะห์ 6 ประการ และตัวอย่างเอกสารรายงานสรุป
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSwitchTab("scope")}
                      className="shrink-0 rounded-md bg-text-heading px-5 py-2.5 text-xs font-semibold text-text-inverse transition-colors hover:bg-text-body"
                    >
                      ดูมิติวิเคราะห์ &amp; ตัวอย่างรายงาน ➔
                    </button>
                  </div>
                </div>
              </>
            )}

            {platformTab === "scope" && (
              <>
                <AnalysisCards />
                <SampleReportPreview />

                {/* Next Tab Strip */}
                <div className="mx-auto max-w-5xl px-6 py-10">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-border/60 bg-bg-card p-6 shadow-xs">
                    <div>
                      <span className="text-xs font-semibold text-accent uppercase tracking-wider">NEXT STEP</span>
                      <p className="mt-1 font-serif text-base font-bold text-text-heading">
                        เรียนรู้ขั้นตอน 6 Phase ตั้งแต่การจองคิว ชำระเงิน สัมภาษณ์ จนถึงรับรายงาน
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSwitchTab("process")}
                      className="shrink-0 rounded-md bg-text-heading px-5 py-2.5 text-xs font-semibold text-text-inverse transition-colors hover:bg-text-body"
                    >
                      ศึกษากระบวนการบริการ ➔
                    </button>
                  </div>
                </div>
              </>
            )}

            {platformTab === "process" && (
              <>
                <AnalysisTimeline />

                {/* Next Tab Strip */}
                <div className="mx-auto max-w-5xl px-6 py-10">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-border/60 bg-bg-card p-6 shadow-xs">
                    <div>
                      <span className="text-xs font-semibold text-accent uppercase tracking-wider">READY TO BOOK</span>
                      <p className="mt-1 font-serif text-base font-bold text-text-heading">
                        ตรวจสอบอัตราค่าบริการมาตรฐาน เงื่อนไข และออกใบแจ้งยอดชำระเงินออนไลน์
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleSwitchTab("pricing")}
                        className="shrink-0 rounded-md bg-text-heading px-5 py-2.5 text-xs font-semibold text-text-inverse transition-colors hover:bg-text-body"
                      >
                        ตรวจสอบอัตราค่าบริการ ➔
                      </button>
                      <button
                        type="button"
                        onClick={handleOpenBooking}
                        className="shrink-0 rounded-md bg-accent px-5 py-2.5 text-xs font-semibold text-text-inverse transition-colors hover:bg-accent-hover"
                      >
                        + จองคิวทันที
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {platformTab === "pricing" && (
              <>
                <PricingSection
                  onBookClick={handleOpenBooking}
                  onPreviewInvoiceClick={() => handleOpenInvoiceModal(SAMPLE_PENDING_INVOICE)}
                />
                <FAQSection />
                <AcademicDisclaimer />
                <ContactSection />
              </>
            )}
          </div>
        </main>
      ) : (
        <main>
          <ClientDashboard
            appointments={appointments}
            invoices={invoices}
            reports={reports}
            onOpenInvoice={handleOpenInvoiceModal}
            onNewBookingClick={() => {
              setActiveView("platform");
              setPlatformTab("pricing");
              setBookingOpen(true);
            }}
          />
        </main>
      )}

      {/* Booking Dialog Modal */}
      <BookingDialog
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        onSubmitSuccess={handleBookingSubmitSuccess}
      />

      {/* Invoice Preview Modal */}
      <InvoicePreview
        open={invoiceModalOpen}
        onClose={() => setInvoiceModalOpen(false)}
        invoice={selectedInvoice}
        onPaymentVerified={handlePaymentVerified}
      />
    </div>
  );
}
