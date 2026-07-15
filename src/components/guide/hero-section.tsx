"use client";

import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";
import { PsycheCompass } from "@/components/guide/psyche-compass";

interface HeroSectionProps {
  onBookClick: () => void;
  onPricingClick: () => void;
}

export function HeroSection({ onBookClick, onPricingClick }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden border-b border-border/40 bg-bg px-6 py-20 lg:py-28">
      {/* Subtle academic background glow */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(140,21,21,0.05)_0%,transparent_65%)]"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-6xl">
        <nav
          aria-label="เส้นทางนำทาง"
          className="mb-8 flex flex-wrap items-center gap-1.5 text-xs text-text-secondary"
        >
          <Link
            href="/"
            className="rounded px-2 py-1 transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
          >
            หน้าแรก
          </Link>
          <ArrowRightIcon className="h-3.5 w-3.5 text-text-secondary/60" />
          <span className="px-2 py-1 font-medium text-text-heading">
            Jungian Type Analysis
          </span>
        </nav>

        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="text-left lg:col-span-7">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
              ARCHRON · Dynamic Typology
            </span>

            <h1 className="mt-5 font-serif text-fluid-h1 font-bold leading-[1.12] text-text-heading">
              Jungian Type Analysis
            </h1>

            <p className="mt-3.5 font-serif text-lg italic text-accent/90 md:text-xl">
              วิเคราะห์โครงสร้าง Ego ผ่านกรอบทฤษฎีจิตวิทยาเชิงลึกของคาร์ล ยุง
            </p>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-text-body">
              สแกนและอ่านโครงสร้างความโน้มเอียงของ Ego ในการรับและตัดสินข้อมูล เพื่อทำความเข้าใจทิศทางพลังงานจิต (Introversion / Extraversion) พร้อมประเมิน Function Stack ค้นหากลไกป้องกันตัวและการตอบสนองยามตกอยู่ภายใต้ความเครียดเชิงลึกอย่างมีสติ
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onBookClick}
                className="group inline-flex items-center gap-2.5 rounded-md bg-accent px-8 py-4 text-sm font-semibold tracking-[0.04em] text-text-inverse shadow-[0_4px_14px_rgba(140,21,21,0.25)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              >
                <span>จองเซสชันวิเคราะห์</span>
                <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>

              <button
                type="button"
                onClick={onPricingClick}
                className="rounded-md border border-border bg-bg-card/70 px-7 py-4 text-sm font-medium text-text-body transition-colors duration-200 hover:border-border/80 hover:bg-bg-card hover:text-text-heading focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              >
                ตรวจสอบราคาและเงื่อนไข
              </button>
            </div>

            <div className="mt-8 flex items-center gap-6 border-t border-border/30 pt-6 text-xs text-text-secondary/80">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-success/15 text-[11px] font-bold text-success">✓</span>
                <span>เซสชันส่วนตัว 90 นาที</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-success/15 text-[11px] font-bold text-success">✓</span>
                <span>รายงานสรุปรายบุคคล 2–3 หน้า</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-success/15 text-[11px] font-bold text-success">✓</span>
                <span>คลังดิจิทัล Client Portal</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center lg:col-span-5">
            <div className="relative w-full max-w-[420px] p-2">
              <PsycheCompass />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
