"use client";

import { useState, useMemo } from "react";
import type { ContentEntry } from "@/types/content";
import { disciplineMeta, type DisciplineKey } from "@/components/discipline-meta";
import { contentEntryHref, isLibraryEntry } from "@/lib/content/routing";
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
  const libraryEntries = useMemo(() => entries.filter(isLibraryEntry), [entries]);
  const [slugA, setSlugA] = useState<string>(() => libraryEntries[0]?.slug ?? "");
  const [slugB, setSlugB] = useState<string>(
    () => libraryEntries[1]?.slug ?? libraryEntries[0]?.slug ?? "",
  );
  const [searchFilter, setSearchFilter] = useState<string>("");

  const itemA = useMemo(
    () => libraryEntries.find((entry) => entry.slug === slugA),
    [libraryEntries, slugA],
  );
  const itemB = useMemo(
    () => libraryEntries.find((entry) => entry.slug === slugB),
    [libraryEntries, slugB],
  );

  const filteredOptions = useMemo(() => {
    if (!searchFilter.trim()) return libraryEntries;
    const q = searchFilter.trim().toLowerCase();
    return libraryEntries.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        (e.subtitle && e.subtitle.toLowerCase().includes(q)) ||
        (e.framework && e.framework.toLowerCase().includes(q))
    );
  }, [libraryEntries, searchFilter]);

  const renderColumn = (item?: ContentEntry, sideLabel?: string, onSelect?: (slug: string) => void, currentSlug?: string) => {
    if (!item) return <div className="p-8 text-center text-text-secondary">กรุณาเลือกมโนทัศน์หรือบทความเพื่อเปรียบเทียบ</div>;

    const discKey = frameworkToDiscipline(item.framework);
    const meta = disciplineMeta(discKey);
    const href = contentEntryHref(item);

    return (
      <div className="archron-panel relative flex flex-col justify-between p-6 sm:p-8 space-y-6">
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-[3px] rounded-t"
          style={{ backgroundColor: meta.accent }}
        />

        {/* ตัวเลือกเปลี่ยนหัวข้อ */}
        <div className="border-b border-text-heading/10 pb-4">
          <label htmlFor={`compare-select-${currentSlug}`} className="block text-sm font-medium text-text-secondary/80 mb-2">
            {sideLabel}
          </label>
          <select
            id={`compare-select-${currentSlug}`}
            value={currentSlug}
            onChange={(e) => onSelect?.(e.target.value)}
            className="w-full rounded-md border border-text-heading/20 bg-bg-card px-3 py-2 text-sm text-text-heading outline-none focus:border-accent"
          >
            {libraryEntries.map((e) => (
              <option key={e.slug} value={e.slug}>
                {e.title} ({e.framework ?? e.contentType})
              </option>
            ))}
          </select>
        </div>

        {/* ข้อมูลประจำตัว Identity */}
        <div className="space-y-2">
          <span className="text-sm font-medium text-text-secondary/80" style={{ color: meta.accent }}>
            {item.framework ?? item.contentType}
          </span>
          <h2 className="font-serif text-2xl text-text-heading">{item.title}</h2>
          {item.subtitle && <p className="text-sm text-text-secondary">{item.subtitle}</p>}
        </div>

        {/* ตารางเปรียบเทียบบริบท Context & Relationship */}
        <dl className="grid grid-cols-1 gap-4 rounded-lg bg-bg-card/40 p-4 text-xs">
          <div>
            <dt className="flex items-center gap-1.5 font-semibold text-text-secondary">
              <span style={{ color: meta.accent }}>
                <PersonIcon className="h-4 w-4" />
              </span>
              นักคิดหลัก
            </dt>
            <dd className="mt-1 text-text-heading">{item.mainThinkers?.join(", ") || "ไม่ระบุเฉพาะเจาะจง"}</dd>
          </div>

          <div>
            <dt className="flex items-center gap-1.5 font-semibold text-text-secondary">
              <span style={{ color: meta.accent }}>
                <SchoolIcon className="h-4 w-4" />
              </span>
              สำนักคิด / กรอบแนวคิด
            </dt>
            <dd className="mt-1 text-text-heading">{item.school ?? item.framework ?? "ทั่วไป"}</dd>
          </div>

          <div>
            <dt className="font-semibold text-text-secondary">ระดับการอ่าน</dt>
            <dd className="mt-1 uppercase text-accent">{item.difficulty}</dd>
          </div>
        </dl>

        {/* เนื้อหาข้อความสรุป */}
        <div className="space-y-2 text-sm leading-relaxed text-text-body">
          <h3 className="text-sm font-medium text-text-secondary/80">คำอธิบายโดยย่อ</h3>
          <p className="line-clamp-6">{item.visualExplanation ?? item.technicalMeaning ?? "อ่านฉบับเต็มเพื่อดูรายละเอียดของรายการนี้"}</p>
        </div>

        {/* ปุ่มไปหน้าอ่านฉบับเต็ม */}
        <div className="pt-4 border-t border-text-heading/10">
          <Link
            href={href}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-accent/40 bg-accent/10 px-4 py-2.5 text-sm font-semibold text-accent transition-colors hover:bg-accent/20"
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl bg-bg-card/30 p-4 border border-text-heading/10">
        <div className="text-sm text-text-heading">
          <span className="font-serif text-base text-accent">เปรียบเทียบรายการในคลัง</span>
          <p className="text-xs text-text-secondary mt-0.5">เลือกสองรายการเพื่อดูข้อมูลที่เหมือนและต่างกัน</p>
        </div>
      </div>

      {/* Grid 2 คอลัมน์เปรียบเทียบ */}
      <div className="grid gap-6 lg:grid-cols-2 items-start">
        {renderColumn(itemA, "รายการที่หนึ่ง", setSlugA, slugA)}
        {renderColumn(itemB, "รายการที่สอง", setSlugB, slugB)}
      </div>
    </div>
  );
}
