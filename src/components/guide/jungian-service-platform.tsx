"use client";

import { useState } from "react";
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
  type BookingFormData,
  type InvoiceData,
  type AppointmentItem,
  type ReportItem,
} from "@/components/guide/types";
import { PersonIcon, ExplorerIcon } from "@/components/icons";

export function JungianServicePlatform() {
  const [activeView, setActiveView] = useState<"platform" | "portal">("platform");
  const [bookingOpen, setBookingOpen] = useState(false);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceData | null>(null);

  // Dynamic state simulation for interactive end-to-end user workflow
  const [invoices, setInvoices] = useState<InvoiceData[]>([SAMPLE_INVOICE]);
  const [appointments, setAppointments] = useState<AppointmentItem[]>([
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
  };

  const handlePaymentVerified = (invoiceNumber: string) => {
    // Update invoice status to paid
    setInvoices((prev) =>
      prev.map((inv) => (inv.invoiceNumber === invoiceNumber ? { ...inv, status: "paid" } : inv))
    );
    // Update matching appointment to confirmed
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.invoiceId === invoiceNumber ? { ...apt, status: "confirmed" } : apt
      )
    );
  };

  const handleOpenInvoiceModal = (invoice: InvoiceData) => {
    setSelectedInvoice(invoice);
    setInvoiceModalOpen(true);
  };

  const handleScrollToPricing = () => {
    document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
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
        <main>
          <HeroSection onBookClick={handleOpenBooking} onPricingClick={handleScrollToPricing} />
          <IntroductionSection />
          <FeatureCards />
          <AnalysisCards />
          <AnalysisTimeline />
          <SampleReportPreview />
          <PricingSection onBookClick={handleOpenBooking} />
          <FAQSection />
          <AcademicDisclaimer />
          <ContactSection />
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
