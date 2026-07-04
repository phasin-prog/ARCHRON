"use client";

import { useState, useMemo } from "react";
import type { ContentEntry } from "@/types/content";
import { disciplineMeta, type DisciplineKey } from "@/components/discipline-meta";
import Link from "next/link";
import { PersonIcon, SchoolIcon, SymbolIcon, ArrowRightIcon } from "@/components/icons";

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

export function CompareMatrix({ entries }: { entries: ContentEntry[] }) {
  const [slugA, setSlugA] = useState<string>(entries[0]?.slug ?? "");
  const [slugB, setSlugB] = useState<string>(entries[1]?.slug ?? entries[0]?.slug ?? "");
  const [searchFilter, setSearchFilter] = useState<string>("");

  const itemA = useMemo(() => entries.find((e) => e.slug === slugA), [entries, slugA]);
  const itemB = useMemo(() => entries.find((e) => e.slug === slugB), [entries, slugB]);

  const filteredOptions = useMemo(() => {
    if (!searchFilter.trim()) return entries;
    const q = searchFilter.trim().toLowerCase();
    return entries.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        (e.subtitle && e.subtitle.toLowerCase().includes(q)) ||
        (e.framework && e.framework.toLowerCase().includes(q))
    );
  }, [entries, searchFilter]);

  const renderColumn = (item?: ContentEntry, sideLabel?: string, onSelect?: (slug: string) => void, currentSlug?: string) => {
    if (!item) return <div className="p-8 text-center text-muted">กรุณาเลือกมโนทัศน์หรือบทความเพื่อเปรียบเทียบ</div>;

    const discKey = frameworkToDiscipline(item.framework);
    const meta = disciplineMeta(discKey);
    const href = item.contentType === "concept" ? `/concepts/${item.slug}` : `/articles/${item.slug}`;

    return (
      <div className="archron-panel relative flex flex-col justify-between p-6 sm:p-8 space-y-6">
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-[3px] rounded-t"
          style={{ backgroundColor: meta.accent }}
        />

        {/* ตัวเลือกเปลี่ยนหัวข้อ */}
        <div className="border-b border-ink/10 pb-4">
          <label className="block text-[11px] uppercase tracking-widest text-muted mb-2">
            {sideLabel}
          </label>
          <select
            value={currentSlug}
            onChange={(e) => onSelect?.(e.target.value)}
            className="w-full rounded-md border border-ink/20 bg-surface-container px-3 py-2 text-sm text-ivory outline-none focus:border-burnished-gold"
          >
            {entries.map((e) => (
              <option key={e.slug} value={e.slug}>
                {e.title} ({e.framework ?? e.contentType})
              </option>
            ))}
          </select>
        </div>

        {/* ข้อมูลประจำตัว Identity */}
        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: meta.accent }}>
            {item.framework ?? item.contentType}
          </span>
          <h2 className="font-serif text-2xl text-ivory">{item.title}</h2>
          {item.subtitle && <p className="text-sm text-muted">{item.subtitle}</p>}
        </div>

        {/* ตารางเปรียบเทียบบริบท Context & Relationship */}
        <dl className="grid grid-cols-1 gap-4 rounded-lg bg-surface-container/40 p-4 text-xs">
          <div>
            <dt className="flex items-center gap-1.5 font-semibold text-muted">
              <span style={{ color: meta.accent }}>
                <PersonIcon className="h-4 w-4" />
              </span>
              นักคิดหลัก
            </dt>
            <dd className="mt-1 text-ivory">{item.mainThinkers?.join(", ") || "ไม่ระบุเฉพาะเจาะจง"}</dd>
          </div>

          <div>
            <dt className="flex items-center gap-1.5 font-semibold text-muted">
              <span style={{ color: meta.accent }}>
                <SchoolIcon className="h-4 w-4" />
              </span>
              สำนักคิด / กรอบแนวคิด
            </dt>
            <dd className="mt-1 text-ivory">{item.school ?? item.framework ?? "ทั่วไป"}</dd>
          </div>

          <div>
            <dt className="font-semibold text-muted">ระดับการอ่าน</dt>
            <dd className="mt-1 uppercase text-soft-gold">{item.difficulty}</dd>
          </div>
        </dl>

        {/* เนื้อหาข้อความสรุป */}
        <div className="space-y-2 text-sm leading-relaxed text-soft-ivory">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">ความหมายทางจิตวิทยา/ปรัชญา</h3>
          <p className="line-clamp-6">{item.visualExplanation ?? item.technicalMeaning ?? "คลิกอ่านฉบับเต็มเพื่อดูรายละเอียดเชิงลึกของแนวคิดนี้"}</p>
        </div>

        {/* ปุ่มไปหน้าอ่านฉบับเต็ม */}
        <div className="pt-4 border-t border-ink/10">
          <Link
            href={href}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-burnished-gold/40 bg-burnished-gold/10 px-4 py-2.5 text-sm font-semibold text-burnished-gold transition-colors hover:bg-burnished-gold/20"
          >
            อ่านฉบับเต็ม
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* ส่วนกรองคำค้นหาในเมนูเปรียบเทียบ */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl bg-surface-container/30 p-4 border border-ink/10">
        <div className="text-sm text-ivory">
          <span className="font-serif text-base text-soft-gold">ระบบตารางเปรียบเทียบข้ามศาสตร์</span>
          <p className="text-xs text-muted mt-0.5">เลือกมโนทัศน์หรือบทความ 2 รายการเพื่อวิเคราะห์จุดร่วมและข้อแตกต่าง</p>
        </div>
      </div>

      {/* Grid 2 คอลัมน์เปรียบเทียบ */}
      <div className="grid gap-6 lg:grid-cols-2 items-start">
        {renderColumn(itemA, "ฝ่ายแรก (Subject A)", setSlugA, slugA)}
        {renderColumn(itemB, "ฝ่ายเปรียบเทียบ (Subject B)", setSlugB, slugB)}
      </div>
    </div>
  );
}
