"use client";

import { useEffect, useState } from "react";
import { createClerkSupabaseClient } from "@/lib/supabase/client";
import { incrementPageView, getPageView } from "@/lib/content/community/views-db";
import { recordView } from "@/components/recently-viewed";

// ตัวนับผู้เยี่ยมชมต่อบทความ — เพิ่ม +1 ครั้งเดียวต่อ session ต่อ slug
// ใช้ anon client (ไม่ต้องล็อกอิน) · ถ้าตาราง/RPC ยังไม่พร้อม จะซ่อนตัวเองอย่างนุ่มนวล
export function ViewCounter({ slug, title, section }: { slug: string; title: string; section: "articles" | "concepts" | "books" }) {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    // บันทึกประวัติการเปิดอ่านอัตโนมัติลง localStorage เพื่อใช้แสดงในหน้าแรก
    recordView(slug, title, section);
  }, [slug, title, section]);

  useEffect(() => {
    const supabase = createClerkSupabaseClient(async () => null);
    let active = true;
    (async () => {
      const key = `archron:viewed:${slug}`;
      let v: number | null = null;
      try {
        if (!sessionStorage.getItem(key)) {
          v = await incrementPageView(supabase, slug);
          if (v !== null) sessionStorage.setItem(key, "1");
        }
      } catch {
        /* sessionStorage อาจถูกปิด — ข้ามไป */
      }
      if (v === null) v = await getPageView(supabase, slug);
      if (active) setViews(v);
    })();
    return () => {
      active = false;
    };
  }, [slug]);

  if (views === null) return null;

  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-text-secondary/60">
      <span className="inline-flex items-center justify-center w-[1em] h-[1em] text-[16px] text-accent/70" aria-hidden="true">👁</span>
      ผู้เยี่ยมชม {views.toLocaleString("th-TH")} ครั้ง
    </span>
  );
}
