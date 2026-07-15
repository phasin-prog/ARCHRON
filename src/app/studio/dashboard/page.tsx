"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useAuth, useUser } from "@clerk/nextjs";
import { colors } from "@/lib/content/utils/colors";
import { roleFromMetadata, canWrite, isAdmin } from "@/lib/content/utils/roles";
import {
  listMyDraftsAction,
  listMyEntriesAction,
  listAllPublishedEntriesAction,
  deleteEntriesAction,
  archiveEntriesAction,
} from "@/features/studio/actions/dashboard-actions";
import { EditorIcon } from "@/components/studio/editor-icon";
import { FeedbackModal } from "@/components/feedback-modal";

interface DraftItem {
  id: string;
  slug: string;
  title: string;
  status: string;
  updated_at: string | null;
}

interface EntryItem {
  id: string;
  slug: string;
  title: string;
  status: string;
  content_type: string;
  published_at: string | null;
  author_name?: string | null;
}

interface AllEntryItem extends EntryItem {
  author_id: string;
  author_name: string | null;
  updated_at?: string | null;
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
  const [search, setSearch] = useState("");
  const [showAllDrafts, setShowAllDrafts] = useState(false);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [confirm, setConfirm] = useState<null | {
    kind: "delete" | "archive";
    ids: string[];
    titles: string[];
  }>(null);
  const [result, setResult] = useState<null | {
    severity: "success" | "error";
    message: string;
  }>(null);
  const [acting, setActing] = useState(false);

  // Filtered entries for "บทความของฉัน"
  const filteredDrafts = useMemo(() => {
    let result = [...drafts];
    const q = search.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.slug.toLowerCase().includes(q),
      );
    }
    if (typeFilter !== "all") {
      // Drafts don't have content_type, skip type filter for drafts
    }
    return result.sort((a, b) => (b.updated_at ?? "").localeCompare(a.updated_at ?? ""));
  }, [drafts, search, typeFilter]);

  const recentDrafts = filteredDrafts.slice(0, 5);
  const displayDrafts = showAllDrafts ? filteredDrafts : recentDrafts;

  // Filtered entries for "บทความของฉัน"
  const myFilteredEntries = useMemo(() => {
    let result = [...entries];
    const q = search.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.slug.toLowerCase().includes(q),
      );
    }
    if (statusFilter !== "all") {
      result = result.filter((e) => e.status === statusFilter);
    }
    if (typeFilter !== "all") {
      result = result.filter((e) => e.content_type === typeFilter);
    }
    return result.sort((a, b) => (b.published_at ?? "").localeCompare(a.published_at ?? ""));
  }, [entries, search, statusFilter, typeFilter]);

  // Filtered entries for "บทความทั้งหมด"
  const allFilteredEntries = useMemo(() => {
    let result = [...allEntries];
    const q = search.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.slug.toLowerCase().includes(q),
      );
    }
    if (typeFilter !== "all") {
      result = result.filter((e) => e.content_type === typeFilter);
    }
    return result;
  }, [allEntries, search, typeFilter]);

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

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const switchTab = (next: Tab) => {
    setTab(next);
    setSelectMode(false);
    setSelectedIds(new Set());
  };

  const requestAction = (
    kind: "delete" | "archive",
    ids: string[],
    titles: string[],
  ) => {
    if (ids.length === 0) return;
    setConfirm({ kind, ids, titles });
  };

  const executeAction = async () => {
    if (!confirm) return;
    const { kind, ids } = confirm;
    setActing(true);
    setConfirm(null);
    try {
      const action =
        kind === "delete" ? deleteEntriesAction : archiveEntriesAction;
      const res = await action(ids);
      if (!res.ok) {
        setResult({
          severity: "error",
          message: res.error ?? "ทำรายการไม่สำเร็จ",
        });
      } else {
        if (kind === "delete") {
          setEntries((prev) => prev.filter((e) => !ids.includes(e.id)));
          setDrafts((prev) => prev.filter((d) => !ids.includes(d.id)));
          setResult({ severity: "success", message: `ลบแล้ว ${res.count} รายการ` });
        } else {
          setEntries((prev) =>
            prev.map((e) =>
              ids.includes(e.id) ? { ...e, status: "archived" } : e,
            ),
          );
          setDrafts((prev) => prev.filter((d) => !ids.includes(d.id)));
          setResult({
            severity: "success",
            message: `เก็บถาวรแล้ว ${res.count} รายการ`,
          });
        }
        setSelectedIds(new Set());
        setSelectMode(false);
      }
    } catch (e) {
      setResult({
        severity: "error",
        message: e instanceof Error ? e.message : "เกิดข้อผิดพลาด",
      });
    } finally {
      setActing(false);
    }
  };

  if (!writer) {
    return (
      <main className="tpl-reference py-20 text-center">
        <EditorIcon name="edit_note" className="h-16 w-16 text-text-secondary" />
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
      draft: colors.neutralMuted,
      "needs-source-check": colors.article,
      "ready-to-publish": colors.book,
      published: colors.success,
      archived: colors.mutedSlate,
    };
    return map[s] ?? colors.neutralMuted;
  };

  const typeLabel = (t: string) => {
    const map: Record<string, string> = {
      article: "บทความ",
      concept: "แนวคิด",
      "reading-set": "เส้นทางอ่าน",
      "source-note": "บันทึกอ้างอิง",
      person: "นักคิด",
      book: "หนังสือ",
      symbol: "สัญลักษณ์",
      term: "ศัพท์",
    };
    return map[t] ?? t;
  };

  const typeAccent = (t: string) => {
    const map: Record<string, string> = {
      article: colors.goldAccent,
      concept: colors.concept,
      person: colors.quote,
      book: colors.book,
      symbol: colors.symbol,
      term: colors.neutralMuted,
    };
    return map[t] ?? colors.goldAccent;
  };

  return (
    <main className="px-4 sm:px-6 pb-24 pt-10">
      <div className="tpl-dashboard">
        {/* Header */}
        <header className="mb-8">
          <Link href="/" className="inline-block mb-3 text-sm text-text-secondary hover:text-accent">
            ← กลับหน้าแรก
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-text-secondary/80">
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
              <EditorIcon name="edit_note" className="h-[18px] w-[18px]" />
              เขียนใหม่
            </Link>
          </div>
        </header>

        {/* Stats Cards — compact */}
        <section className="mb-6">
          {/* Search */}
          <div className="mb-4">
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setShowAllDrafts(false); }}
              placeholder="ค้นหาชื่อเรื่องหรือ slug..."
              aria-label="ค้นหาชื่อเรื่องหรือ slug"
              className="w-full rounded-lg border border-border/40 bg-bg/60 px-4 py-2.5 text-sm text-text-heading outline-none focus:border-accent/50 placeholder:text-text-secondary/40"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="archron-card p-4" style={{ "--cosmology-accent": colors.neutralMuted } as React.CSSProperties}>
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `color-mix(in srgb, ${colors.neutralMuted} 12%, transparent)`, color: colors.neutralMuted }}
                >
                  <EditorIcon name="edit_note" className="h-4 w-4" />
                </span>
                <span className="text-xs text-text-secondary/60">ฉบับร่าง</span>
              </div>
              <p className="mt-2 font-serif text-3xl text-text-heading">{drafts.length}</p>
            </div>

            <div className="archron-card p-4" style={{ "--cosmology-accent": colors.success } as React.CSSProperties}>
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `color-mix(in srgb, ${colors.success} 12%, transparent)`, color: colors.success }}
                >
                  <span className="inline-flex items-center justify-center w-4 h-4 text-[16px]" aria-hidden="true">📤</span>
                </span>
                <span className="text-xs text-text-secondary/60">เผยแพร่แล้ว</span>
              </div>
              <p className="mt-2 font-serif text-3xl text-text-heading">{published.length}</p>
            </div>

            <div className="archron-card p-4" style={{ "--cosmology-accent": colors.mutedSlate } as React.CSSProperties}>
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `color-mix(in srgb, ${colors.mutedSlate} 12%, transparent)`, color: colors.mutedSlate }}
                >
                  <span className="inline-flex items-center justify-center w-4 h-4 text-[16px]" aria-hidden="true">📦</span>
                </span>
                <span className="text-xs text-text-secondary/60">เก็บถาวร</span>
              </div>
              <p className="mt-2 font-serif text-3xl text-text-heading">{archived.length}</p>
            </div>
          </div>
        </section>

        {/* Quick Drafts */}
        {drafts.length > 0 && (
          <section className="mb-8">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-medium text-text-secondary/80">
                ฉบับร่าง — {filteredDrafts.length} รายการ
              </h2>
              {filteredDrafts.length > 5 && (
                <button
                  onClick={() => setShowAllDrafts(!showAllDrafts)}
                  className="text-xs text-accent hover:underline"
                >
                  {showAllDrafts ? "แสดงน้อยลง" : `ดูทั้งหมด (${filteredDrafts.length})`}
                </button>
              )}
            </div>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {displayDrafts.map((d) => (
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
                      {d.updated_at ? new Date(d.updated_at).toLocaleDateString("th-TH") : "—"}
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
              onClick={() => switchTab("my")}
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
                onClick={() => switchTab("all")}
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
              <button
                onClick={() => {
                  setSelectMode(!selectMode);
                  setSelectedIds(new Set());
                }}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  selectMode
                    ? "bg-error/15 text-error"
                    : "border border-border/40 text-text-secondary hover:text-text-heading"
                }`}
              >
                {selectMode ? "เลิกเลือก" : "เลือกเพื่อลบ"}
              </button>
            )}
            {tab === "my" && (
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label="กรองตามสถานะ"
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
              aria-label="กรองตามประเภท"
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
              <span className="inline-flex items-center justify-center w-12 h-12 text-[48px] text-text-secondary" aria-hidden="true">
                {tab === "my" ? "📝" : "⊘"}
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
                  <span className="inline-flex items-center justify-center w-[1em] h-[1em] text-[14px]" aria-hidden="true">→</span>
                </Link>
              )}
            </div>
          ) : tab === "my" && selectMode ? (
            <div className="space-y-3">
              {/* Bulk action bar */}
              <div className="sticky top-2 z-20 flex flex-wrap items-center gap-2 rounded-xl border border-border/50 bg-bg-card/95 p-2.5 shadow-sm backdrop-blur">
                <button
                  onClick={() => {
                    const ids = myFilteredEntries.map((e) => e.id);
                    if (ids.every((id) => selectedIds.has(id))) {
                      setSelectedIds(new Set());
                    } else {
                      setSelectedIds(new Set(ids));
                    }
                  }}
                  className="rounded-md px-2.5 py-1 text-xs font-medium text-text-secondary hover:text-text-heading transition-colors"
                >
                  {myFilteredEntries.length > 0 &&
                  myFilteredEntries.every((e) => selectedIds.has(e.id))
                    ? "ยกเลิกการเลือก"
                    : "เลือกทั้งหมด"}
                </button>
                <span className="text-xs text-text-secondary/60">
                  {selectedIds.size} รายการที่เลือก
                </span>
                <div className="ml-auto flex items-center gap-2">
                  {(() => {
                    const hasPublished = [...selectedIds].some((id) => {
                      const e = entries.find((en) => en.id === id);
                      return e?.status === "published";
                    });
                    if (!hasPublished) return null;
                    const pubIds = [...selectedIds].filter((id) => {
                      const e = entries.find((en) => en.id === id);
                      return e?.status === "published";
                    });
                    return (
                      <button
                        onClick={() =>
                          requestAction(
                            "archive",
                            pubIds,
                            pubIds
                              .map((id) => entries.find((e) => e.id === id)?.title ?? "")
                              .filter(Boolean),
                          )
                        }
                        disabled={acting || pubIds.length === 0}
                        className="rounded-md border border-text-heading/20 px-3 py-1.5 text-xs font-medium text-text-heading hover:border-warning hover:bg-warning/5 disabled:opacity-40 transition-colors"
                      >
                        เก็บถาวร ({pubIds.length})
                      </button>
                    );
                  })()}
                  <button
                    onClick={() => {
                      const ids = [...selectedIds];
                      const titles = ids
                        .map((id) => entries.find((e) => e.id === id)?.title ?? "")
                        .filter(Boolean);
                      requestAction("delete", ids, titles);
                    }}
                    disabled={acting || selectedIds.size === 0}
                    className="rounded-md bg-error px-3 py-1.5 text-xs font-semibold text-text-inverse hover:brightness-110 disabled:opacity-40 transition-all"
                  >
                    ลบถาวร ({selectedIds.size})
                  </button>
                  <button
                    onClick={() => {
                      setSelectMode(false);
                      setSelectedIds(new Set());
                    }}
                    className="rounded-md px-2.5 py-1 text-xs text-text-secondary hover:text-text-heading transition-colors"
                  >
                    เลิกเลือก
                  </button>
                </div>
              </div>

              {/* Checkbox rows */}
              <div className="space-y-1.5">
                {myFilteredEntries.map((e) => {
                  const checked = selectedIds.has(e.id);
                  return (
                    <button
                      key={e.id}
                      onClick={() => toggleSelect(e.id)}
                      className={`archron-card group flex w-full items-center gap-4 p-4 text-left transition-all ${
                        checked
                          ? "ring-2 ring-accent/40 bg-accent/5"
                          : "hover:border-accent/30"
                      }`}
                    >
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-all ${
                          checked
                            ? "border-accent bg-accent text-text-inverse"
                            : "border-border text-transparent"
                        }`}
                        aria-hidden="true"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      </span>
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
                        <p className="truncate text-sm font-medium text-text-heading">
                          {e.title}
                        </p>
                        <p className="mt-0.5 text-[11px] text-text-secondary/50">
                          {e.published_at
                            ? new Date(e.published_at).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" })
                            : "—"}
                        </p>
                      </div>
                      <span
                        className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold"
                        style={{
                          backgroundColor: `${statusAccent(e.status)}15`,
                          color: statusAccent(e.status),
                        }}
                      >
                        {statusLabel(e.status)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : tab === "my" ? (
            <div className="space-y-1.5">
              {myFilteredEntries.map((e) => (
                <div
                  key={e.id}
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
                  <Link
                    href={e.status === "published" ? `/articles/${e.slug}` : `/studio/editor?slug=${e.slug}`}
                    className="min-w-0 flex-1"
                  >
                    <p className="truncate text-sm font-medium text-text-heading group-hover:text-accent transition-colors">
                      {e.title}
                    </p>
                    <p className="mt-0.5 text-[11px] text-text-secondary/50">
                      {e.published_at
                        ? new Date(e.published_at).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" })
                        : "—"}
                    </p>
                  </Link>
                  <span
                    className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold"
                    style={{
                      backgroundColor: `${statusAccent(e.status)}15`,
                      color: statusAccent(e.status),
                    }}
                  >
                    {statusLabel(e.status)}
                  </span>
                  {e.status === "published" && (
                    <button
                      onClick={(ev) => {
                        ev.preventDefault();
                        ev.stopPropagation();
                        requestAction("archive", [e.id], [e.title]);
                      }}
                      disabled={acting}
                      className="shrink-0 rounded-md px-2 py-1 text-[11px] font-medium text-text-secondary hover:text-warning disabled:opacity-40 transition-colors"
                      aria-label={`เก็บถาวร ${e.title}`}
                    >
                      เก็บถาวร
                    </button>
                  )}
                  <button
                    onClick={(ev) => {
                      ev.preventDefault();
                      ev.stopPropagation();
                      requestAction("delete", [e.id], [e.title]);
                    }}
                    disabled={acting}
                    className="shrink-0 rounded-md px-2 py-1 text-[11px] font-medium text-error/80 hover:text-error hover:bg-error/5 disabled:opacity-40 transition-colors"
                    aria-label={`ลบ ${e.title}`}
                  >
                    ลบ
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-1.5">
              {allFilteredEntries.map((e) => (
                <Link
                  key={e.id}
                  href={`/studio/editor?slug=${e.slug}`}
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
                      {e.author_name ? ` · ${e.author_name}` : ""}
                    </p>
                  </div>
                  <EditorIcon name="edit_note" className="h-4 w-4 text-text-secondary group-hover:text-accent" />
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Confirm modal */}
      <FeedbackModal
        open={confirm !== null}
        onClose={() => setConfirm(null)}
        severity="warning"
        title={confirm?.kind === "delete" ? "ยืนยันการลบถาวร" : "ยืนยันการเก็บถาวร"}
        message={
          confirm ? (
            <>
              {confirm.kind === "delete" ? (
                <p>
                  กำลังลบถาวร <strong>{confirm.ids.length}</strong> รายการ — การลบไม่สามารถย้อนกลับได้
                </p>
              ) : (
                <p>
                  เนื้อหา <strong>{confirm.ids.length}</strong> รายการจะไม่แสดงต่อสาธารณะ แต่ยังอยู่ในระบบ (ไม่ถูกลบถาวร)
                </p>
              )}
              {confirm.titles.length > 0 && (
                <span className="mt-2 block text-xs text-text-secondary/60">
                  {confirm.titles.slice(0, 3).join(" · ")}
                  {confirm.titles.length > 3 && ` และอีก ${confirm.titles.length - 3} รายการ`}
                </span>
              )}
            </>
          ) : ""
        }
        primaryActionText={confirm?.kind === "delete" ? "ลบถาวร" : "เก็บถาวร"}
        onPrimaryAction={executeAction}
        secondaryActionText="ยกเลิก"
        allowOutsideClick={false}
      />

      {/* Result modal */}
      <FeedbackModal
        open={result !== null}
        onClose={() => setResult(null)}
        severity={result?.severity ?? "info"}
        message={result?.message ?? ""}
        primaryActionText="ตกลง"
      />
    </main>
  );
}
