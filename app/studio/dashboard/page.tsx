"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useAuth, useUser } from "@clerk/nextjs";
import { roleFromMetadata, canWrite, isAdmin } from "@/lib/content/roles";
import {
  listMyDraftsAction,
  listMyEntriesAction,
  listAllPublishedEntriesAction,
} from "./actions";

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
  author_name?: string | null;
}

interface AllEntryItem extends EntryItem {
  author_id: string;
  author_name: string | null;
}

type Tab = "my" | "all";

export default function StudioDashboardPage() {
  const { userId } = useAuth();
  const { user } = useUser();
  const role = roleFromMetadata(user?.publicMetadata);
  const writer = canWrite(role);
  const admin = isAdmin(role);

  const [drafts, setDrafts] = useState<DraftItem[]>([]);
  const [entries, setEntries] = useState<EntryItem[]>([]);
  const [allEntries, setAllEntries] = useState<AllEntryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("my");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  // Filtered entries for "บทความของฉัน"
  const myFilteredEntries = useMemo(() => {
    let result = [...entries];
    if (statusFilter !== "all") {
      result = result.filter((e) => e.status === statusFilter);
    }
    if (typeFilter !== "all") {
      result = result.filter((e) => e.content_type === typeFilter);
    }
    return result.sort((a, b) => b.published_at.localeCompare(a.published_at));
  }, [entries, statusFilter, typeFilter]);

  // Filtered entries for "บทความทั้งหมด"
  const allFilteredEntries = useMemo(() => {
    let result = [...allEntries];
    if (typeFilter !== "all") {
      result = result.filter((e) => e.content_type === typeFilter);
    }
    return result;
  }, [allEntries, typeFilter]);

  // Unique types for filter
  const availableTypes = useMemo(() => {
    const types = new Set(allEntries.map((e) => e.content_type));
    return Array.from(types).sort();
  }, [allEntries]);

  useEffect(() => {
    if (!userId || !writer) return;
    let active = true;
    (async () => {
      try {
        const [d, e, a] = await Promise.all([
          listMyDraftsAction(),
          listMyEntriesAction(),
          listAllPublishedEntriesAction(),
        ]);
        if (active) {
          setDrafts(d);
          setEntries(e);
          setAllEntries(a);
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
        <span className="material-symbols-outlined text-[64px] text-text-secondary">lock</span>
        <h1 className="mt-4 font-serif text-2xl text-text-heading">ต้องมีสิทธิ์นักเขียน</h1>
        <p className="mt-2 text-sm text-text-secondary/70">
          ขอเป็นนักเขียนได้จากหน้าโปรไฟล์
        </p>
        <Link
          href="/studio/profile"
          className="mt-6 inline-flex items-center gap-2 rounded-sm bg-gradient-to-br from-accent to-accent px-6 py-2.5 text-sm font-semibold text-text-inverse"
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

  const statusLabel = (s: string) => {
    const map: Record<string, string> = {
      draft: "ฉบับร่าง",
      "needs-source-check": "รอตรวจ",
      "ready-to-publish": "พร้อมเผยแพร่",
      published: "เผยแพร่แล้ว",
      archived: "เก็บถาวร",
    };
    return map[s] ?? s;
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
    <main className="px-4 sm:px-6 pb-24 pt-10">
      <div className="mx-auto max-w-[1200px]">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-[0.2em] text-accent/70">
                Studio · Dashboard
              </span>
              <h1 className="mt-2 font-serif text-3xl text-text-heading">
                สตูดิโอของ{user?.firstName ?? "ฉัน"}
              </h1>
            </div>
            <Link
              href="/studio/editor"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-accent to-accent px-5 py-2.5 text-sm font-semibold text-text-inverse shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/20"
            >
              <span className="material-symbols-outlined text-[18px]">edit_note</span>
              เขียนใหม่
            </Link>
          </div>
        </header>

        {/* Stats Cards — compact */}
        <section className="mb-8">
          <div className="grid grid-cols-3 gap-3">
            <div className="archron-card p-4" style={{ "--cosmology-accent": "#9A948A" } as React.CSSProperties}>
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg"
                  style={{ backgroundColor: "color-mix(in srgb, #9A948A 12%, transparent)", color: "#9A948A" }}
                >
                  <span className="material-symbols-outlined text-[16px]">edit</span>
                </span>
                <span className="text-xs text-text-secondary/60">ฉบับร่าง</span>
              </div>
              <p className="mt-2 font-serif text-3xl text-text-heading">{drafts.length}</p>
            </div>

            <div className="archron-card p-4" style={{ "--cosmology-accent": "#7FB08A" } as React.CSSProperties}>
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg"
                  style={{ backgroundColor: "color-mix(in srgb, #7FB08A 12%, transparent)", color: "#7FB08A" }}
                >
                  <span className="material-symbols-outlined text-[16px]">publish</span>
                </span>
                <span className="text-xs text-text-secondary/60">เผยแพร่แล้ว</span>
              </div>
              <p className="mt-2 font-serif text-3xl text-text-heading">{published.length}</p>
            </div>

            <div className="archron-card p-4" style={{ "--cosmology-accent": "#8A857D" } as React.CSSProperties}>
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg"
                  style={{ backgroundColor: "color-mix(in srgb, #8A857D 12%, transparent)", color: "#8A857D" }}
                >
                  <span className="material-symbols-outlined text-[16px]">archive</span>
                </span>
                <span className="text-xs text-text-secondary/60">เก็บถาวร</span>
              </div>
              <p className="mt-2 font-serif text-3xl text-text-heading">{archived.length}</p>
            </div>
          </div>
        </section>

        {/* Quick Drafts — ฉบับร่างล่าสุด */}
        {recentDrafts.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-secondary/50">
              ฉบับร่างล่าสุด
            </h2>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {recentDrafts.map((d) => (
                <Link
                  key={d.id}
                  href={`/studio/editor?slug=${d.slug}`}
                  className="archron-card archron-card--link group flex items-center justify-between p-4"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-text-heading group-hover:text-accent transition-colors">
                      {d.title || d.slug}
                    </p>
                    <p className="mt-0.5 text-[11px] text-text-secondary/50">
                      {new Date(d.updated_at).toLocaleDateString("th-TH")}
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
          </section>
        )}

        {/* Tabs: บทความของฉัน / บทความทั้งหมด */}
        <section>
          <div className="mb-4 flex items-center gap-1 rounded-xl border border-border/30 bg-bg/40 p-1">
            <button
              onClick={() => setTab("my")}
              className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                tab === "my"
                  ? "bg-accent/15 text-accent shadow-sm"
                  : "text-text-secondary/60 hover:text-text-heading"
              }`}
            >
              บทความของฉัน
              <span className="ml-1.5 text-[11px] opacity-60">({entries.length})</span>
            </button>
            {admin && (
              <button
                onClick={() => setTab("all")}
                className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  tab === "all"
                    ? "bg-accent/15 text-accent shadow-sm"
                    : "text-text-secondary/60 hover:text-text-heading"
                }`}
              >
                บทความทั้งหมด
                <span className="ml-1.5 text-[11px] opacity-60">({allEntries.length})</span>
              </button>
            )}
          </div>

          {/* Filter bar */}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {tab === "my" && (
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border border-border/40 bg-bg/60 px-3 py-1.5 text-xs text-text-heading outline-none focus:border-accent/50"
              >
                <option value="all">ทุกสถานะ</option>
                <option value="draft">ฉบับร่าง</option>
                <option value="published">เผยแพร่แล้ว</option>
                <option value="archived">เก็บถาวร</option>
              </select>
            )}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="rounded-lg border border-border/40 bg-bg/60 px-3 py-1.5 text-xs text-text-heading outline-none focus:border-accent/50"
            >
              <option value="all">ทุกประเภท</option>
              {availableTypes.map((t) => (
                <option key={t} value={t}>{typeLabel(t)}</option>
              ))}
            </select>
            <span className="text-[11px] text-text-secondary/40">
              แสดง {(tab === "my" ? myFilteredEntries : allFilteredEntries).length} รายการ
            </span>
          </div>

          {/* Entry list */}
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="archron-card h-16 animate-pulse" />
              ))}
            </div>
          ) : (tab === "my" ? myFilteredEntries : allFilteredEntries).length === 0 ? (
            <div className="archron-card p-12 text-center">
              <span className="material-symbols-outlined text-[48px] text-text-secondary">
                {tab === "my" ? "note_add" : "search_off"}
              </span>
              <p className="mt-3 text-sm text-text-secondary/60">
                {tab === "my" ? "ยังไม่มีบทความ" : "ไม่พบรายการที่ตรงกับตัวกรอง"}
              </p>
              {tab === "my" && (
                <Link
                  href="/studio/editor"
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:underline"
                >
                  เริ่มเขียน
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-1.5">
              {(tab === "my" ? myFilteredEntries : allFilteredEntries).map((e) => (
                <Link
                  key={e.id}
                  href={tab === "all" ? `/studio/editor?slug=${e.slug}` : (e.status === "published" ? `/articles/${e.slug}` : `/studio/editor?slug=${e.slug}`)}
                  className="archron-card archron-card--link group flex items-center gap-4 p-4"
                >
                  <span
                    className="inline-flex shrink-0 rounded-lg px-2.5 py-1 text-[10px] font-semibold"
                    style={{
                      backgroundColor: `${typeAccent(e.content_type)}15`,
                      color: typeAccent(e.content_type),
                    }}
                  >
                    {typeLabel(e.content_type)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-text-heading group-hover:text-accent transition-colors">
                      {e.title}
                    </p>
                    <p className="mt-0.5 text-[11px] text-text-secondary/50">
                      {e.published_at ? new Date(e.published_at).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                      {tab === "all" && e.author_name ? ` · ${e.author_name}` : ""}
                    </p>
                  </div>
                  {tab === "my" && (
                    <span
                      className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold"
                      style={{
                        backgroundColor: `${statusAccent(e.status)}15`,
                        color: statusAccent(e.status),
                      }}
                    >
                      {statusLabel(e.status)}
                    </span>
                  )}
                  <span className="material-symbols-outlined text-[16px] text-text-secondary group-hover:text-accent transition-colors">
                    {tab === "all" ? "edit" : "open_in_new"}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
