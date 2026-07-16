"use client";

import { ArrowRightIcon, CheckIcon, EditIcon } from "@/components/icons";
import { useAuth, useUser } from "@clerk/nextjs";
import { roleFromMetadata, canWrite } from "@/lib/content/utils/roles";
import Link from "next/link";
import type { PricingPageData } from "@/lib/content/guide/pricing-data";

interface PricingSectionProps {
  data: PricingPageData;
  onBookClick: () => void;
}

export function PricingSection({ data, onBookClick }: PricingSectionProps) {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const role = roleFromMetadata(user?.publicMetadata);
  const showEdit = isSignedIn && canWrite(role);

  return (
    <section id="pricing" className="border-b border-border/30 bg-bg py-20 lg:py-24">
      <div className="tpl-reference">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-accent/85">
            Transparent & Consulting Rates
          </span>
          <h2 className="mt-3 font-serif text-3xl font-bold text-text-heading md:text-4xl">
            ค่าบริการและเงื่อนไขการวิเคราะห์
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-text-secondary/85 md:text-base">
            อัตราค่าบริการมาตรฐานที่โปร่งใส ครอบคลุมการสัมภาษณ์ 90 นาที และรายงานสรุปรายบุคคล พร้อมสิทธิพิเศษในโอกาสพิเศษ
          </p>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-12 lg:items-stretch">
          {/* Primary Rate Card */}
          <div className="group relative flex flex-col justify-between rounded-xl border-2 border-accent bg-bg-card p-8 shadow-[0_16px_50px_rgba(140,21,21,0.08)] lg:col-span-6 md:p-10">
            {showEdit && (
              <Link
                href="/studio/editor?slug=guide-pricing"
                className="absolute right-3 top-3 z-10 flex items-center gap-1 rounded-md border border-accent/30 bg-bg-card px-2.5 py-1.5 text-[11px] font-semibold text-accent opacity-0 shadow-sm transition-all hover:bg-accent hover:text-text-inverse group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <EditIcon className="h-3 w-3" />
                Edit
              </Link>
            )}

            <div>
              <div className="flex items-center justify-between">
                <span className="rounded bg-accent/10 px-3 py-1 font-mono text-[11px] font-bold tracking-wider text-accent uppercase">
                  STANDARD CONSULTING RATE
                </span>
                <span className="text-xs font-semibold text-success">
                  {"\u2022"} ว่างรับคิวประจำสัปดาห์นี้
                </span>
              </div>

              <h3 className="mt-6 font-serif text-2xl font-bold text-text-heading">
                {data.standard.title}
              </h3>
              <p className="mt-1.5 text-xs text-text-secondary/80">
                {data.standard.subtitle}
              </p>

              <div className="mt-8 flex items-baseline gap-2 border-y border-border/40 py-6">
                <span className="font-serif text-5xl font-bold text-text-heading md:text-6xl">
                  {data.standard.price}
                </span>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-text-heading">{data.standard.priceLabel}</span>
                  <span className="text-[11px] text-text-secondary/70">
                    {data.standard.priceNote}
                  </span>
                </div>
              </div>

              <div className="mt-6 space-y-3.5">
                <span className="block text-xs font-semibold tracking-wider text-text-secondary/80 uppercase">
                  สิ่งที่รวมอยู่ในอัตราบริการนี้ (What&apos;s Included):
                </span>
                {data.standard.includedItems.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 text-xs leading-relaxed text-text-body">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                      <CheckIcon className="h-3 w-3" />
                    </span>
                    <span><strong>{item.bold}</strong> {item.detail}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10">
              <button
                type="button"
                onClick={onBookClick}
                className="group flex w-full items-center justify-center gap-2 rounded-md bg-accent py-4 text-sm font-semibold text-text-inverse shadow-[0_4px_14px_rgba(140,21,21,0.25)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              >
                <span>{data.standard.cta}</span>
                <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>

              <div className="mt-5 text-center text-[11px] text-text-secondary/75">
                <span className="font-semibold text-accent/90">ไม่มีค่าใช้จ่ายแฝงใดๆ ทั้งสิ้น</span> {"\u00B7"} {data.standard.footer.split("\u00B7")[1]?.trim() || data.standard.footer.split("·")[1]?.trim() || data.standard.footer}
              </div>
            </div>
          </div>

          {/* Special Brand Promotion Card */}
          <div className="group relative flex flex-col justify-between rounded-xl border border-border/60 bg-gradient-to-br from-bg-card via-bg-card/70 to-bg-elevated/40 p-8 lg:col-span-6 md:p-10">
            {showEdit && (
              <Link
                href="/studio/editor?slug=guide-pricing"
                className="absolute right-3 top-3 z-10 flex items-center gap-1 rounded-md border border-accent/30 bg-bg-card px-2.5 py-1.5 text-[11px] font-semibold text-accent opacity-0 shadow-sm transition-all hover:bg-accent hover:text-text-inverse group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <EditIcon className="h-3 w-3" />
                Edit
              </Link>
            )}

            <div>
              <div className="flex items-center justify-between">
                <span className="rounded bg-premium/15 px-3 py-1 font-mono text-[11px] font-bold tracking-wider text-premium uppercase">
                  {data.specialEvent.badge}
                </span>
                <span className="font-serif text-xs italic text-premium">
                  {data.specialEvent.date}
                </span>
              </div>

              <h3 className="mt-6 font-serif text-2xl font-bold text-text-heading">
                {data.specialEvent.title}
              </h3>
              <p className="mt-1.5 font-serif text-sm italic text-premium">
                {data.specialEvent.subtitle}
              </p>

              <p
                className="mt-4 text-xs leading-relaxed text-text-secondary/90"
                dangerouslySetInnerHTML={{ __html: data.specialEvent.description }}
              />

              <div className="mt-6 space-y-3.5 border-t border-border/30 pt-6">
                {data.specialEvent.conditions.map((cond) => (
                  <div key={cond.step} className="flex items-start gap-3 text-xs leading-relaxed text-text-body">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-premium/20 font-bold text-premium">{cond.step}</span>
                    <span dangerouslySetInnerHTML={{ __html: cond.text }} />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10 rounded-lg border border-border/40 bg-bg/60 p-4 text-xs leading-relaxed text-text-secondary/80 italic">
              {data.specialEvent.disclaimer}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
