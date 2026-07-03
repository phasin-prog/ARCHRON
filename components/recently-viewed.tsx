"use client";

import { useEffect, useState } from "react";
import type { ComponentType } from "react";
import Link from "next/link";
import { BookIcon, ConceptIcon, ClockIcon, ArrowRightIcon } from "@/components/icons";

type Section = "articles" | "concepts";

type RecentItem = {
  slug: string;
  title: string;
  section: Section;
  timestamp: number;
};

const STORAGE_KEY = "archron-recently-viewed";
const MAX_ITEMS = 3;

// meta ต่อหมวด — ไอคอนเส้น + สี cosmology + ป้าย
const SECTION_META: Record<Section, { label: string; accent: string; Icon: ComponentType<{ className?: string }> }> = {
  articles: { label: "บทความ", accent: "#C79A4A", Icon: BookIcon },
  concepts: { label: "คลังแนวคิด", accent: "#6E93A8", Icon: ConceptIcon },
};

// อ่านรายการที่ดูล่าสุดจาก localStorage
function loadRecent(): RecentItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: RecentItem[] = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.slice(0, MAX_ITEMS) : [];
  } catch {
    return [];
  }
}

// บันทึกรายการที่ดูล่าสุด (call from reading pages)
export function recordView(slug: string, title: string, section: Section) {
  try {
    const current = loadRecent();
    const filtered = current.filter((r) => r.slug !== slug);
    filtered.unshift({ slug, title, section, timestamp: Date.now() });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered.slice(0, MAX_ITEMS)));
  } catch {
    /* localStorage อาจไม่พร้อมใช้งาน */
  }
}

// RecentlyViewed — แสดงรายการล่าสุดที่ผู้ใช้เคยอ่าน (สูงสุด 3) · ซ่อนถ้าไม่มีประวัติ
export function RecentlyViewed() {
  const [items, setItems] = useState<RecentItem[]>([]);

  useEffect(() => {
    setItems(loadRecent());
  }, []);

  useEffect(() => {
    const onStorage = () => setItems(loadRecent());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="scroll-reveal mx-auto max-w-[1200px] px-6 py-16">
      <div className="mb-8 flex items-center gap-3">
        <span className="text-burnished-gold/70">
          <ClockIcon className="h-[18px] w-[18px]" />
        </span>
        <h2 className="font-serif text-xl text-on-surface">อ่านต่อ</h2>
        <span className="text-xs text-on-surface-variant/50">— ล่าสุดที่คุณเปิดอ่าน</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const meta = SECTION_META[item.section];
          const Icon = meta.Icon;
          return (
            <Link
              key={item.slug}
              href={`/${item.section}/${item.slug}`}
              className="group relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-slate-boundary/25 bg-white/[0.02] p-[18px] transition-all duration-300 hover:-translate-y-1 hover:border-burnished-gold/40 focus-visible:ring-2 focus-visible:ring-burnished-gold focus-visible:outline-none"
            >
              {/* แถบ accent บน — ขึ้นตอน hover */}
              <span
                className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
                style={{ backgroundColor: meta.accent }}
                aria-hidden="true"
              />
              <div className="flex items-center gap-2.5">
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-[9px] border"
                  style={{
                    color: meta.accent,
                    borderColor: `color-mix(in srgb, ${meta.accent} 30%, transparent)`,
                    backgroundColor: `color-mix(in srgb, ${meta.accent} 10%, transparent)`,
                  }}
                >
                  <Icon className="h-[18px] w-[18px]" />
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: meta.accent }}>
                  {meta.label}
                </span>
              </div>

              <span className="font-serif text-xl leading-snug text-ivory transition-colors group-hover:text-soft-gold">
                {item.title}
              </span>

              <div className="mt-auto flex items-center justify-between border-t border-slate-boundary/20 pt-3">
                <span className="text-[11.5px] text-on-surface-variant/60">{timeAgo(item.timestamp)}</span>
                <span
                  className="inline-flex items-center gap-1 font-mono text-[11px] transition-all group-hover:gap-2"
                  style={{ color: meta.accent }}
                >
                  อ่านต่อ
                  <ArrowRightIcon className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const min = Math.floor(diff / 60000);
  if (min < 1) return "เมื่อสักครู่";
  if (min < 60) return `${min} นาทีก่อน`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} ชม. ก่อน`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day} วันที่แล้ว`;
  return `${Math.floor(day / 7)} สัปดาห์ก่อน`;
}
