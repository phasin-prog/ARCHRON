"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth, useUser } from "@clerk/nextjs";
import { roleFromMetadata, canWrite, isAdmin } from "@/lib/content/roles";
import { listMyDraftsAction, listMyEntriesAction } from "./actions";

interface DraftItem {
  id: string;
  slug: string;
  title: string;
  status: string;
  updated_at: string;
}

interface EntryItem {
  id: string;
  slug: string;
  title: string;
  status: string;
  content_type: string;
  published_at: string;
}

export default function StudioDashboardPage() {
  const { userId } = useAuth();
  const { user } = useUser();
  const role = roleFromMetadata(user?.publicMetadata);
  const writer = canWrite(role);
  const admin = isAdmin(role);

  const [drafts, setDrafts] = useState<DraftItem[]>([]);
  const [entries, setEntries] = useState<EntryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId || !writer) return;
    let active = true;
    (async () => {
      try {
        const [d, e] = await Promise.all([
          listMyDraftsAction(),
          listMyEntriesAction(),
        ]);
        if (active) {
          setDrafts(d);
          setEntries(e);
        }
      } catch {
        /* ignore */
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [userId, writer]);

  if (!writer) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-20 text-center">
        <span className="material-symbols-outlined text-[64px] text-muted">lock</span>
        <h1 className="mt-4 font-serif text-2xl text-ivory">ต้องมีสิทธิ์นักเขียน</h1>
        <p className="mt-2 text-sm text-on-surface-variant/70">
          ขอเป็นนักเขียนได้จากหน้าโปรไฟล์
        </p>
        <Link
          href="/studio/profile"
          className="mt-6 inline-flex items-center gap-2 rounded-sm bg-gradient-to-br from-antique-gold to-burnished-gold px-6 py-2.5 text-sm font-semibold text-prima"
        >
          ไปที่โปรไฟล์
        </Link>
      </main>
    );
  }

  const published = entries.filter((e) => e.status === "published");
  const archived = entries.filter((e) => e.status === "archived");

  const recentDrafts = drafts
    .sort((a, b) => b.updated_at.localeCompare(a.updated_at))
    .slice(0, 5);
  const recentEntries = entries
    .sort((a, b) => b.published_at.localeCompare(a.published_at))
    .slice(0, 5);

  const statusLabel = (s: string) => {
    const map: Record<string, string> = {
      draft: "ฉบับร่าง",
      "needs-source-check": "รอตรวจแหล่งอ้างอิง",
      "ready-to-publish": "พร้อมเผยแพร่",
      published: "เผยแพร่แล้ว",
      archived: "เก็บถาวร",
    };
    return map[s] ?? s;
  };

  const statusColor = (s: string) => {
    const map: Record<string, string> = {
      draft: "text-on-surface-variant/60",
      "needs-source-check": "text-warning",
      "ready-to-publish": "text-info",
      published: "text-success",
      archived: "text-muted",
    };
    return map[s] ?? "text-muted";
  };

  const statusAccent = (s: string) => {
    const map: Record<string, string> = {
      draft: "#9A948A",
      "needs-source-check": "#C9776A",
      "ready-to-publish": "#D8B56A",
      published: "#7FB08A",
      archived: "#8A857D",
    };
    return map[s] ?? "#9A948A";
  };

  const typeLabel = (t: string) => {
    const map: Record<string, string> = {
      article: "บทความ",
      concept: "แนวคิด",
      "reading-set": "เส้นทางอ่าน",
      "source-note": "บันทึกอ้างอิง",
      person: "นักคิด",
      book: "หนังสือ",
      school: "สำนักคิด",
      symbol: "สัญลักษณ์",
      term: "ศัพท์",
    };
    return map[t] ?? t;
  };

  const typeAccent = (t: string) => {
    const map: Record<string, string> = {
      article: "#CBA45A",
      concept: "#6E93A8",
      person: "#8AA395",
      school: "#7FB08A",
      book: "#C9A24A",
      symbol: "#B9C2CE",
      term: "#9A948A",
    };
    return map[t] ?? "#CBA45A";
  };

  return (
    <main className="px-6 pb-24 pt-10">
      <div className="mx-auto max-w-[1200px]">
        {/* Header */}
        <header className="mb-10">
          <span className="text-[11px] uppercase tracking-[0.2em] text-burnished-gold/70">
            Studio · Dashboard
          </span>
          <h1 className="mt-2 font-serif text-3xl text-ivory">
            สตูดิโอของ{user?.firstName ?? "ฉัน"}
          </h1>
          <p className="mt-2 text-sm text-on-surface-variant/70">
            ภาพรวมเนื้อหา ฉบับร่าง และสถิติการอ่าน
          </p>
        </header>

        {/* Quick Actions */}
        <section className="mb-10">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-on-surface-variant/50">
            การดำเนินการด่วน
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Link
              href="/studio/editor"
              className="archron-card archron-card--sapientia group flex items-center gap-4 p-5"
              style={{ "--cosmology-accent": "#CBA45A" } as React.CSSProperties}
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
                style={{ backgroundColor: "color-mix(in srgb, #CBA45A 12%, transparent)", color: "#CBA45A" }}
              >
                <span className="material-symbols-outlined text-[24px]">edit_note</span>
              </span>
              <div>
                <p className="text-sm font-semibold text-ivory group-hover:text-soft-gold transition-colors">เขียนใหม่</p>
                <p className="text-[11px] text-on-surface-variant/60">ฉบับร่างใหม่</p>
              </div>
            </Link>

            <Link
              href="/studio/editor"
              className="archron-card archron-card--psyche group flex items-center gap-4 p-5"
              style={{ "--cosmology-accent": "#6E93A8" } as React.CSSProperties}
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
                style={{ backgroundColor: "color-mix(in srgb, #6E93A8 12%, transparent)", color: "#6E93A8" }}
              >
                <span className="material-symbols-outlined text-[24px]">description</span>
              </span>
              <div>
                <p className="text-sm font-semibold text-ivory group-hover:text-soft-gold transition-colors">เขียนต่อ</p>
                <p className="text-[11px] text-on-surface-variant/60">{drafts.length} ฉบับรออยู่</p>
              </div>
            </Link>

            <Link
              href="/studio/profile"
              className="archron-card archron-card--mercurius group flex items-center gap-4 p-5"
              style={{ "--cosmology-accent": "#8AA395" } as React.CSSProperties}
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
                style={{ backgroundColor: "color-mix(in srgb, #8AA395 12%, transparent)", color: "#8AA395" }}
              >
                <span className="material-symbols-outlined text-[24px]">person</span>
              </span>
              <div>
                <p className="text-sm font-semibold text-ivory group-hover:text-soft-gold transition-colors">โปรไฟล์</p>
                <p className="text-[11px] text-on-surface-variant/60">จัดการข้อมูล</p>
              </div>
            </Link>

            {admin && (
              <Link
                href="/studio/users"
                className="archron-card archron-card--lumen group flex items-center gap-4 p-5"
                style={{ "--cosmology-accent": "#E7D7A6" } as React.CSSProperties}
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
                  style={{ backgroundColor: "color-mix(in srgb, #E7D7A6 12%, transparent)", color: "#E7D7A6" }}
                >
                  <span className="material-symbols-outlined text-[24px]">shield_person</span>
                </span>
                <div>
                  <p className="text-sm font-semibold text-ivory group-hover:text-soft-gold transition-colors">จัดการผู้ใช้</p>
                  <p className="text-[11px] text-on-surface-variant/60">บทบาทและสิทธิ์</p>
                </div>
              </Link>
            )}
          </div>
        </section>

        {/* Stats Cards */}
        <section className="mb-10">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-on-surface-variant/50">
            สถิติภาพรวม
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div className="archron-card p-5" style={{ "--cosmology-accent": "#9A948A" } as React.CSSProperties}>
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg"
                  style={{ backgroundColor: "color-mix(in srgb, #9A948A 12%, transparent)", color: "#9A948A" }}
                >
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                </span>
                <span className="text-xs text-on-surface-variant/60">ฉบับร่าง</span>
              </div>
              <p className="mt-3 font-serif text-4xl text-ivory">{drafts.length}</p>
            </div>

            <div className="archron-card p-5" style={{ "--cosmology-accent": "#7FB08A" } as React.CSSProperties}>
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg"
                  style={{ backgroundColor: "color-mix(in srgb, #7FB08A 12%, transparent)", color: "#7FB08A" }}
                >
                  <span className="material-symbols-outlined text-[18px]">publish</span>
                </span>
                <span className="text-xs text-on-surface-variant/60">เผยแพร่แล้ว</span>
              </div>
              <p className="mt-3 font-serif text-4xl text-ivory">{published.length}</p>
            </div>

            <div className="archron-card p-5" style={{ "--cosmology-accent": "#8A857D" } as React.CSSProperties}>
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg"
                  style={{ backgroundColor: "color-mix(in srgb, #8A857D 12%, transparent)", color: "#8A857D" }}
                >
                  <span className="material-symbols-outlined text-[18px]">archive</span>
                </span>
                <span className="text-xs text-on-surface-variant/60">เก็บถาวร</span>
              </div>
              <p className="mt-3 font-serif text-4xl text-ivory">{archived.length}</p>
            </div>
          </div>
        </section>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="archron-card h-20 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Recent Drafts */}
            <section>
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-on-surface-variant/50">
                ฉบับร่างล่าสุด
              </h2>
              {recentDrafts.length === 0 ? (
                <div className="archron-card p-8 text-center" style={{ "--cosmology-accent": "#9A948A" } as React.CSSProperties}>
                  <span className="material-symbols-outlined text-[40px] text-muted">
                    note_add
                  </span>
                  <p className="mt-2 text-sm text-on-surface-variant/60">ยังไม่มีฉบับร่าง</p>
                  <Link
                    href="/studio/editor"
                    className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-burnished-gold hover:underline"
                  >
                    เริ่มเขียน
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {recentDrafts.map((d) => (
                    <Link
                      key={d.id}
                      href={`/studio/editor?slug=${d.slug}`}
                      className="archron-card archron-card--link group flex items-center justify-between p-4"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-on-surface group-hover:text-soft-gold transition-colors">
                          {d.title || d.slug}
                        </p>
                        <p className="mt-0.5 text-[11px] text-on-surface-variant/50">
                          อัปเดต {new Date(d.updated_at).toLocaleDateString("th-TH")}
                        </p>
                      </div>
                      <span
                        className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold"
                        style={{
                          backgroundColor: `${statusAccent(d.status)}15`,
                          color: statusAccent(d.status),
                        }}
                      >
                        {statusLabel(d.status)}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </section>

            {/* Recent Published */}
            <section>
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-on-surface-variant/50">
                เผยแพร่ล่าสุด
              </h2>
              {recentEntries.length === 0 ? (
                <div className="archron-card p-8 text-center" style={{ "--cosmology-accent": "#CBA45A" } as React.CSSProperties}>
                  <span className="material-symbols-outlined text-[40px] text-muted">
                    article
                  </span>
                  <p className="mt-2 text-sm text-on-surface-variant/60">ยังไม่มีบทความเผยแพร่</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {recentEntries.map((e) => (
                    <Link
                      key={e.id}
                      href={`/articles/${e.slug}`}
                      className="archron-card archron-card--link group flex items-center justify-between p-4"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className="inline-flex shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold"
                            style={{
                              backgroundColor: `${typeAccent(e.content_type)}15`,
                              color: typeAccent(e.content_type),
                            }}
                          >
                            {typeLabel(e.content_type)}
                          </span>
                          <p className="truncate text-sm font-medium text-on-surface group-hover:text-soft-gold transition-colors">
                            {e.title}
                          </p>
                        </div>
                        <p className="mt-0.5 text-[11px] text-on-surface-variant/50">
                          เผยแพร่ {new Date(e.published_at).toLocaleDateString("th-TH")}
                        </p>
                      </div>
                      <span className="material-symbols-outlined text-[16px] text-muted group-hover:text-burnished-gold transition-colors">
                        open_in_new
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
