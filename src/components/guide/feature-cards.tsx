"use client";

import { FEATURE_ITEMS, type FeatureCardItem } from "@/components/guide/types";
import {
  AuthorPenIcon,
  ClockIcon,
  GridIcon,
  ConceptIcon,
  PsychologyIcon,
  ExplorerIcon,
} from "@/components/icons";

function renderFeatureIcon(iconType: FeatureCardItem["icon"]) {
  switch (iconType) {
    case "report":
      return <AuthorPenIcon className="h-6 w-6" />;
    case "session":
      return <ClockIcon className="h-6 w-6" />;
    case "stack":
      return <GridIcon className="h-6 w-6" />;
    case "stress":
      return <ConceptIcon className="h-6 w-6" />;
    case "discussion":
      return <PsychologyIcon className="h-6 w-6" />;
    case "pdf":
      return <ExplorerIcon className="h-6 w-6" />;
  }
}

export function FeatureCards() {
  return (
    <section className="border-b border-border/30 bg-bg px-6 py-20 lg:py-24">
      <div className="mx-auto max-w-5xl">
        <div className="text-center md:text-left">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-accent/85">
            Deliverables & Experience
          </span>
          <h2 className="mt-3 font-serif text-3xl font-bold text-text-heading md:text-4xl">
            สิ่งที่คุณจะได้รับจากการวิเคราะห์
          </h2>
          <p className="mt-3 text-sm text-text-secondary/85 md:text-base">
            รายงานสรุปจิตวิเคราะห์และการสัมภาษณ์เชิงลึกที่ออกแบบมาเพื่อสะท้อนตัวตนของคุณโดยเฉพาะ
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURE_ITEMS.map((item) => (
            <div
              key={item.id}
              className="group flex flex-col justify-between rounded-lg border border-border/40 bg-bg-card/70 p-7 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-accent/40 hover:bg-bg-card hover:shadow-md"
            >
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-accent/20 bg-accent/5 text-accent transition-colors duration-200 group-hover:bg-accent group-hover:text-text-inverse">
                  {renderFeatureIcon(item.icon)}
                </div>

                <span className="mt-5 block text-[10px] font-semibold uppercase tracking-wider text-text-secondary/70">
                  {item.subtitle}
                </span>

                <h3 className="mt-1 font-serif text-lg font-semibold text-text-heading group-hover:text-accent">
                  {item.title}
                </h3>

                <p className="mt-3 text-xs leading-relaxed text-text-secondary/85">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 border-t border-border/20 pt-3 text-[11px] font-medium text-accent opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <span>อ่านรายละเอียดเพิ่มเติม →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
