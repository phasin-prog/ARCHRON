"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type RecentItem = {
  slug: string;
  title: string;
  section: "articles" | "concepts";
  timestamp: number;
};

const STORAGE_KEY = "archron-recently-viewed";
const MAX_ITEMS = 3;

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
export function recordView(slug: string, title: string, section: "articles" | "concepts") {
  try {
    const current = loadRecent();
    // remove existing entry for same slug
    const filtered = current.filter((r) => r.slug !== slug);
    // add to front
    filtered.unshift({ slug, title, section, timestamp: Date.now() });
    // keep max items
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered.slice(0, MAX_ITEMS)));
  } catch {
    /* localStorage อาจไม่พร้อมใช้งาน */
  }
}

// RecentlyViewed — แสดงรายการล่าสุดที่ผู้ใช้เคยอ่าน บนหน้าแรก
// ซ่อนถ้าไม่มีประวัติ
export function RecentlyViewed() {
  const [items, setItems] = useState<RecentItem[]>([]);

  useEffect(() => {
    setItems(loadRecent());
  }, []);

  // ฟัง storage event (sync ข้ามแท็บ)
  useEffect(() => {
    const onStorage = () => setItems(loadRecent());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="scroll-reveal mx-auto max-w-[1200px] px-6 py-16">
      <div className="mb-8 flex items-center gap-3">
        <span className="material-symbols-outlined text-[20px] text-burnished-gold/60">
          history
        </span>
        <h2 className="font-serif text-xl text-on-surface">
          อ่านต่อ
        </h2>
        <span className="text-xs text-on-surface-variant/50">
          — ล่าสุดที่คุณเคยเปิดอ่าน
        </span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Link
            key={item.slug}
            href={`/${item.section}/${item.slug}`}
            className="group flex items-center gap-4 rounded-lg border border-slate-boundary/30 bg-surface-container-low px-5 py-4 transition-all duration-300 hover:border-burnished-gold/40 hover:bg-surface-container focus-visible:ring-2 focus-visible:ring-burnished-gold focus-visible:outline-none"
          >
            <span className="material-symbols-outlined shrink-0 text-[24px] text-burnished-gold/50 transition-colors group-hover:text-burnished-gold">
              {item.section === "articles" ? "article" : "neurology"}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-on-surface group-hover:text-burnished-gold">
                {item.title}
              </p>
              <p className="mt-0.5 text-[11px] text-on-surface-variant/50">
                {item.section === "articles" ? "บทความ" : "คลังแนวคิด"} ·{" "}
                {timeAgo(item.timestamp)}
              </p>
            </div>
            <span className="material-symbols-outlined shrink-0 text-[18px] text-on-surface-variant/40 opacity-0 transition-all duration-300 group-hover:opacity-100">
              arrow_forward
            </span>
          </Link>
        ))}
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
