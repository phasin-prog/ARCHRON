"use client";

import { useState } from "react";
import { SAMPLE_REPORT_PAGES } from "@/components/guide/types";
import { AuthorPenIcon, EyeIcon } from "@/components/icons";

export function ReportSample() {
  const [activeTab, setActiveTab] = useState("page-1");

  const currentPage =
    SAMPLE_REPORT_PAGES.find((p) => p.id === activeTab) || SAMPLE_REPORT_PAGES[0];

  return (
    <section className="border-b border-border/30 bg-bg py-20 lg:py-24">
      <div className="tpl-reference">
        <div className="text-center md:text-left">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-accent/85">
            Analytical Report Preview
          </span>
          <h2 className="mt-3 font-serif text-3xl font-bold text-text-heading md:text-4xl">
            ตัวอย่างเอกสารรายงานสรุปรายบุคคล
          </h2>
          <p className="mt-3 text-sm text-text-secondary/85 md:text-base">
            ตัวอย่างหน้าเอกสารรายงานวิเคราะห์ที่ลูกค้าจะได้รับหลังจากเสร็จสิ้นเซสชันสัมภาษณ์
          </p>
        </div>

        {/* Tab switcher */}
        <div className="mt-10 flex flex-wrap gap-2.5 border-b border-border/40 pb-4">
          {SAMPLE_REPORT_PAGES.map((page) => {
            const isActive = page.id === activeTab;
            return (
              <button
                key={page.id}
                type="button"
                onClick={() => setActiveTab(page.id)}
                className={`flex items-center gap-2.5 rounded-md px-5 py-3 text-xs font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                  isActive
                    ? "bg-accent text-text-inverse shadow-sm"
                    : "border border-border/50 bg-bg-card/70 text-text-body hover:border-accent/40 hover:bg-bg-card"
                }`}
              >
                <span className="font-mono opacity-80">PAGE {page.pageNumber}</span>
                <span>{page.title.split("&")[0].trim()}</span>
              </button>
            );
          })}
        </div>

        {/* Document simulation card */}
        <div className="mt-8 relative overflow-hidden rounded-xl border border-border/60 bg-bg-card p-8 shadow-[0_12px_40px_rgba(0,0,0,0.06)] md:p-12">
          {/* Top header strip simulating formal document */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/50 pb-6 text-xs text-text-secondary/70">
            <div className="flex items-center gap-2">
              <AuthorPenIcon className="h-4 w-4 text-accent" />
              <span className="font-serif font-bold tracking-wider text-text-heading uppercase">
                ARCHRON INSTITUTE OF TYPOLOGY
              </span>
            </div>

            <div className="font-mono text-[11px] text-text-secondary/70">
              DOC-ID: ARCH-REPORT-2026
            </div>
          </div>

          {/* Document Content */}
          <div className="mt-8">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
              <span className="font-mono text-xs font-semibold text-accent">
                SECTION 0{currentPage.pageNumber} OF 03
              </span>
              <span className="text-xs text-text-secondary/60">
                CONFIDENTIAL ANALYTICAL REPORT
              </span>
            </div>

            <h3 className="mt-2 font-serif text-2xl font-bold text-text-heading md:text-3xl">
              {currentPage.title}
            </h3>

            <p className="mt-1 font-serif text-sm italic text-accent/85">
              {currentPage.subtitle}
            </p>

            <div className="mt-8 whitespace-pre-line border-t border-border/30 pt-6 font-serif text-sm leading-relaxed text-text-body/95 md:text-base md:leading-[1.8]">
              {currentPage.content}
            </div>
          </div>

          {/* Page footer */}
          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-border/50 pt-6 text-xs text-text-secondary/70">
            <div className="flex items-center gap-2 text-accent/90">
              <EyeIcon className="h-4 w-4" />
              <span className="font-medium">
                เอกสารนี้เป็นลิขสิทธิ์ของ Archron Institute of Typology — สงวนไว้ซึ่งสิทธิ์ในการเผยแพร่
              </span>
            </div>

            <span className="font-mono text-[11px]">
              PAGE {currentPage.pageNumber} / 03
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
