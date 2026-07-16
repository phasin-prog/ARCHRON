"use client";

import { useState, useEffect, useMemo } from "react";
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
import { ReportSample } from "@/components/guide/report-sample";
import { PricingSection } from "@/components/guide/pricing-card";
import { FAQSection } from "@/components/guide/faq-accordion";
import { AcademicDisclaimer } from "@/components/guide/academic-disclaimer";
import { ContactSection } from "@/components/guide/contact-card";
import { BookingSection } from "@/components/guide/booking-section";
import { InvoiceModal } from "@/components/guide/invoice-modal";
import {
  generateInvoiceNumber,
  generateInvoiceData,
  type BookingFormData,
  type InvoiceData,
  type AppointmentItem,
  type ReportItem,
} from "@/components/guide/types";

export function JungianServicePlatform() {
  const [platformTab, setPlatformTab] = useState<"overview" | "scope" | "process" | "pricing">("overview");
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceData | null>(null);

  const [invoices, setInvoices] = useState<InvoiceData[]>([]);
  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);
  const [reports] = useState<ReportItem[]>([]);

  const supabase = useMemo(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
    if (supabaseUrl && supabaseKey) {
      return createClient(supabaseUrl, supabaseKey);
    }
    return null;
  }, []);

  useEffect(() => {
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
  }, [supabase]);

  const handleBookingSubmitSuccess = async (formData: BookingFormData, slipFile?: File) => {
    const newInvoiceId = generateInvoiceNumber();
    const newInvoice = generateInvoiceData(formData, newInvoiceId);

    // Upload slip first if provided
    if (slipFile) {
      try {
        const fd = new FormData();
        fd.append("file", slipFile);
        fd.append("invoiceNumber", newInvoiceId);
        await fetch("/api/upload/slip", { method: "POST", body: fd });
      } catch {
        // silent — user can upload later in InvoiceModal
      }
    }

    setInvoices((prev) => [newInvoice, ...prev]);

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

    setSelectedInvoice(newInvoice);
    setInvoiceModalOpen(true);

    if (supabase) {
      upsertServiceInvoice(supabase, newInvoice, formData.notes);
    }

    fetch("/api/email/notify-booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ invoice: newInvoice }),
    }).catch(() => {});
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

    if (supabase) {
      updateServiceInvoiceStatus(supabase, invoiceNumber, "paid");
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
      <main className="pb-20">
          <HeroSection
            onBookClick={handleScrollToPricing}
            onPricingClick={handleScrollToPricing}
          />

          {/* Sticky Platform Navigation Tabs (Eliminates Cognitive Load & Scrolling) */}
          <div id="platform-tabs-anchor" className="sticky top-14 lg:top-[7.5rem] z-20 border-b border-border/70 bg-bg-card/95 backdrop-blur-md px-6 py-3.5 shadow-sm">
            <div className="mx-auto max-w-5xl">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent hidden md:inline">
                  หมวดหมู่ข้อมูลบริการ :
                </span>
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => handleSwitchTab("overview")}
                    className={`rounded-lg px-3 py-2.5 text-[11px] sm:px-4 sm:py-2.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                      platformTab === "overview"
                        ? "bg-text-heading text-text-inverse shadow-sm"
                        : "bg-bg hover:bg-bg-elevated text-text-body"
                    }`}
                  >
                    1. ภาพรวม
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSwitchTab("scope")}
                    className={`rounded-lg px-3 py-2.5 text-[11px] sm:px-4 sm:py-2.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                      platformTab === "scope"
                        ? "bg-text-heading text-text-inverse shadow-sm"
                        : "bg-bg hover:bg-bg-elevated text-text-body"
                    }`}
                  >
                    2. มิติวิเคราะห์
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSwitchTab("process")}
                    className={`rounded-lg px-3 py-2.5 text-[11px] sm:px-4 sm:py-2.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                      platformTab === "process"
                        ? "bg-text-heading text-text-inverse shadow-sm"
                        : "bg-bg hover:bg-bg-elevated text-text-body"
                    }`}
                  >
                    3. ขั้นตอน
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSwitchTab("pricing")}
                    className={`rounded-lg px-3 py-2.5 text-[11px] sm:px-4 sm:py-2.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                      platformTab === "pricing"
                        ? "bg-accent text-text-inverse shadow-sm"
                        : "bg-bg hover:bg-bg-elevated text-text-body"
                    }`}
                  >
                    4. ราคา &amp; จอง
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
                      className="shrink-0 rounded-md bg-text-heading px-5 py-3 text-xs font-semibold text-text-inverse transition-colors hover:bg-text-body"
                    >
                      ดูมิติวิเคราะห์ ➔
                    </button>
                  </div>
                </div>
              </>
            )}

            {platformTab === "scope" && (
              <>
                <AnalysisCards />
                <ReportSample />

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
                      className="shrink-0 rounded-md bg-text-heading px-5 py-3 text-xs font-semibold text-text-inverse transition-colors hover:bg-text-body"
                    >
                      ศึกษากระบวนการ ➔
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
                        className="shrink-0 rounded-md bg-text-heading px-5 py-3 text-xs font-semibold text-text-inverse transition-colors hover:bg-text-body"
                      >
                        ตรวจสอบราคา ➔
                      </button>
                      <button
                        type="button"
                        onClick={handleScrollToPricing}
                        className="shrink-0 rounded-md bg-accent px-5 py-3 text-xs font-semibold text-text-inverse transition-colors hover:bg-accent-hover"
                      >
                        + จองคิว
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {platformTab === "pricing" && (
              <>
                <PricingSection
                  onBookClick={handleScrollToPricing}
                />
                <BookingSection
                  onSubmitSuccess={handleBookingSubmitSuccess}
                />
                <FAQSection />
                <AcademicDisclaimer />
                <ContactSection />
              </>
            )}
        </div>
      </main>

      {/* Invoice Modal */}
      <InvoiceModal
        open={invoiceModalOpen}
        onClose={() => setInvoiceModalOpen(false)}
        invoice={selectedInvoice}
        onPaymentVerified={handlePaymentVerified}
      />
    </div>
  );
}
