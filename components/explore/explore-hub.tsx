"use client";

import { useState, useMemo } from "react";
import type { ContentEntry } from "@/types/content";
import { disciplineMeta, type DisciplineKey } from "@/components/discipline-meta";
import Link from "next/link";
import { BookIcon, SymbolIcon, SearchIcon, ArrowRightIcon } from "@/components/icons";

function frameworkToDiscipline(framework?: string): DisciplineKey {
  if (!framework) return "philosophy";
  const fw = framework.toLowerCase();
  if (fw.includes("psychology") || fw.includes("psychoanalysis")) return "psychology";
  if (fw.includes("philosophy") || fw.includes("existentialism") || fw.includes("phenomenology")) return "philosophy";
  if (fw.includes("symbol") || fw.includes("myth")) return "symbol";
  if (fw.includes("anthropology")) return "anthropology";
  if (fw.includes("history")) return "history";
  if (fw.includes("language")) return "language";
  if (fw.includes("religion")) return "religion";
  if (fw.includes("science")) return "science";
  if (fw.includes("art")) return "art";
  return "philosophy";
}

type ExploreTab = "trending" | "latest" | "popular" | "random";

export function ExploreHub({ entries }: { entries: ContentEntry[] }) {
  const [activeTab, setActiveTab] = useState<ExploreTab>("trending");
  const [randomSeed, setRandomSeed] = useState<number>(0);

  // คัดแยกตาม Tab
  const displayedEntries = useMemo(() => {
    if (entries.length === 0) return [];
    
    if (activeTab === "latest") {
      return [...entries].sort((a, b) => {
        const da = a.updatedAt || a.publishedAt || "";
        const db = b.updatedAt || b.publishedAt || "";
        return db.localeCompare(da);
      });
    }

    if (activeTab === "popular") {
      // คัดสรรเนื้อหาหลักหรือแนวคิดลึกซึ้ง
      return entries.filter((e) => e.difficulty === "intermediate" || e.difficulty === "advanced");
    }

    if (activeTab === "random") {
      // สุ่มสับเปลี่ยนโหนดความรู้ตามสุ่มซีดเพื่อกระตุ้น Curiosity Psychology
      const shuffled = [...entries];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.sin(randomSeed + i * 9999) * 10000) % (i + 1);
        const absJ = Math.abs(j);
        const temp = shuffled[i];
        shuffled[i] = shuffled[absJ];
        shuffled[absJ] = temp;
      }
      return shuffled.slice(0, 12);
    }

    // Default: trending (กระแสยอดนิยม)
    return entries.slice(0, 18);
  }, [entries, activeTab, randomSeed]);

  const handleRandomize = () => {
    setRandomSeed(Date.now());
  };

  return (
    <div className="space-y-8">
      {/* ส่วนควบคุม Tabs และ ปุ่มสุ่ม */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-ink/10 pb-4">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="หมวดหมู่การสำรวจ">
          {[
            { id: "trending", label: "กระแสยอดนิยม", icon: "trending_up" },
            { id: "latest", label: "เผยแพร่ล่าสุด", icon: "schedule" },
            { id: "popular", label: "คัดสรรอมตะ", icon: "auto_awesome" },
            { id: "random", label: "สุ่มค้นพบ", icon: "shuffle" },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => {
                  setActiveTab(tab.id as ExploreTab);
                  if (tab.id === "random") handleRandomize();
                }}
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-burnished-gold/15 text-soft-gold border border-burnished-gold/45 shadow-sm"
                    : "bg-surface-container/40 text-on-surface-variant hover:bg-surface-container hover:text-ivory border border-transparent"
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {activeTab === "random" && (
          <button
            onClick={handleRandomize}
            className="inline-flex items-center gap-2 rounded-lg border border-burnished-gold/30 bg-surface-container px-3.5 py-2 text-xs text-soft-gold hover:bg-burnished-gold/10 transition-colors self-start sm:self-auto"
          >
            <span className="material-symbols-outlined text-[16px]">refresh</span>
            <span>สุ่มความรู้อีกครั้ง</span>
          </button>
        )}
      </div>

      {/* คำอธิบายประจำ Tab */}
      <div className="text-xs text-muted">
        {activeTab === "trending" && "รวบรวมมโนทัศน์และบทความที่ได้รับความสนใจสูงในคลังความรู้ ARCHRON"}
        {activeTab === "latest" && "ลำดับการเผยแพร่งานเขียนและแนวคิดใหม่ล่าสุดจากกองบรรณาธิการ"}
        {activeTab === "popular" && "คัดสรรองค์ความรู้แก่นลึกและทฤษฎีสำคัญที่เป็นรากฐานทางปัญญา"}
        {activeTab === "random" && "เปิดประตูสู่การค้นพบโดยบังเอิญ (Serendipity) เพื่อกระตุ้นความอยากรู้ใคร่ครวญข้ามสายวิชา"}
      </div>

      {/* Grid การ์ดความรู้ */}
      {displayedEntries.length === 0 ? (
        <div className="rounded-xl border border-ink/10 bg-surface-container/30 p-12 text-center text-sm text-muted">
          ยังไม่มีข้อมูลในหมวดหมู่นี้
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayedEntries.map((e) => {
            const discKey = frameworkToDiscipline(e.framework);
            const meta = disciplineMeta(discKey);
            const href = e.contentType === "concept" ? `/concepts/${e.slug}` : `/articles/${e.slug}`;

            return (
              <Link
                key={e.slug}
                href={href}
                className="archron-card group relative flex flex-col justify-between p-6 transition-all duration-300 hover:-translate-y-1 hover:border-burnished-gold/50"
              >
                <span
                  aria-hidden
                  className="absolute inset-y-0 left-0 w-[3px] rounded-l"
                  style={{ backgroundColor: meta.accent }}
                />

                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 text-[11px] font-medium tracking-wider text-muted">
                    <span className="uppercase" style={{ color: meta.accent }}>
                      {e.framework ?? e.contentType}
                    </span>
                    <span className="rounded bg-surface-container/80 px-2 py-0.5 text-[10px] text-on-surface-variant">
                      {e.contentType === "concept" ? "แนวคิด" : "บทความ"}
                    </span>
                  </div>

                  <h3 className="font-serif text-lg leading-snug text-ivory transition-colors group-hover:text-soft-gold">
                    {e.title}
                  </h3>

                  {e.subtitle && (
                    <p className="line-clamp-2 text-xs leading-relaxed text-muted">
                      {e.subtitle}
                    </p>
                  )}
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-ink/10 pt-3 text-xs text-muted">
                  <span>{e.mainThinkers?.[0] ?? "ARCHRON Library"}</span>
                  <span className="inline-flex items-center gap-1 text-soft-gold opacity-80 group-hover:opacity-100 transition-opacity">
                    อ่านต่อ
                    <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
