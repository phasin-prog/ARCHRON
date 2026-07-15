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
import { BulkActionBar, SelectRow } from "@/components/studio/bulk-action-bar";
import { DashboardEmptyState } from "@/components/studio/dashboard-empty-state";
import {
  SearchIcon,
  GlobeIcon,
  BookmarkIcon,
  BookIcon,
  ArrowRightIcon,
} from "@/components/icons";

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
  const [selectScope, setSelectScope] = useState<"drafts" | "my" | "all" | null>(null);
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
    setSelectScope(null);
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
          setAllEntries((prev) => prev.filter((e) => !ids.includes(e.id)));
          setResult({ severity: "success", message: `ลบแล้ว ${res.count} รายการ` });
        } else {
          setEntries((prev) =>
            prev.map((e) =>
              ids.includes(e.id) ? { ...e, status: "archived" } : e,
            ),
          );
          setDrafts((prev) => prev.filter((d) => !ids.includes(d.id)));
          setAllEntries((prev) =>
            prev.map((e) =>
              ids.includes(e.id) ? { ...e, status: "archived" } : e,
            ),
          );
          setResult({
            severity: "success",
            message: `เก็บถาวรแล้ว ${res.count} รายการ`,
          });
        }
        setSelectedIds(new Set());
        setSelectMode(false);
        setSelectScope(null);
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
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2 text-sm font-semibold text-text-inverse shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md hover:shadow-accent/20"
            >
              <EditorIcon name="edit_note" className="h-[18px] w-[18px]" />
              เขียนใหม่
            </Link>
          </div>
        </header>

        {/* Search toolbar */}
        <div className="relative mb-6">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary/50">
            <SearchIcon className="h-4 w-4" />
          </span>
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setShowAllDrafts(false); }}
            placeholder="ค้นหาชื่อเรื่องหรือ slug..."
            aria-label="ค้นหาเนื้อหาใน Dashboard"
            className="w-full rounded-xl border border-border/40 bg-bg/60 pl-10 pr-4 py-2.5 text-sm text-text-heading outline-none transition-colors focus:border-accent/50 focus:bg-bg-card/80 placeholder:text-text-secondary/50"
          />
        </div>

        {/* Stats Cards */}
        <section className="mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="archron-card p-4" style={{ "--cosmology-accent": colors.neutralMuted } as React.CSSProperties}>
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `color-mix(in srgb, ${colors.neutralMuted} 12%, transparent)`, color: colors.neutralMuted }}
                >
                  <EditorIcon name="edit_note" className="h-4 w-4" />
                </span>
                <span className="text-xs text-text-secondary/80">ฉบับร่าง</span>
              </div>
              <p className="mt-2 font-serif text-3xl text-text-heading">{drafts.length}</p>
            </div>

            <div className="archron-card p-4" style={{ "--cosmology-accent": colors.success } as React.CSSProperties}>
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `color-mix(in srgb, ${colors.success} 12%, transparent)`, color: colors.success }}
                >
                  <GlobeIcon className="h-4 w-4" />
                </span>
                <span className="text-xs text-text-secondary/80">เผยแพร่แล้ว</span>
              </div>
              <p className="mt-2 font-serif text-3xl text-text-heading">{published.length}</p>
            </div>

            <div className="archron-card p-4" style={{ "--cosmology-accent": colors.mutedSlate } as React.CSSProperties}>
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `color-mix(in srgb, ${colors.mutedSlate} 12%, transparent)`, color: colors.mutedSlate }}
                >
                  <BookmarkIcon className="h-4 w-4" />
                </span>
                <span className="text-xs text-text-secondary/80">เก็บถาวร</span>
              </div>
              <p className="mt-2 font-serif text-3xl text-text-heading">{archived.length}</p>
            </div>
          </div>
        </section>

        {/* Continue Writing — latest draft hero */}
        {filteredDrafts.length > 0 && (() => {
          const latestDraft = filteredDrafts[0];
          return (
            <section className="mb-8">
              <Link
                href={`/studio/editor?slug=${latestDraft.slug}`}
                className="archron-card archron-card--link group flex items-center gap-5 p-5"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <EditorIcon name="edit_note" className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-text-secondary/80">เขียนต่อ</p>
                  <p className="truncate text-base font-medium text-text-heading group-hover:text-accent transition-colors">
                    {latestDraft.title || latestDraft.slug}
                  </p>
                  <p className="mt-0.5 text-[11px] text-text-secondary/70">
                    แก้ไขล่าสุด {latestDraft.updated_at ? new Date(latestDraft.updated_at).toLocaleDateString("th-TH") : "—"}
                  </p>
                </div>
                <span className="shrink-0 rounded-full px-3 py-1 text-xs font-semibold bg-accent/10 text-accent">
                  เขียนต่อ
                </span>
              </Link>
            </section>
          );
        })()}

        {/* Quick Drafts */}
        <section className="mb-8">
          <div className="mb-3 flex items-center justify-between gap-4">
            <h2 className="font-heading text-base font-semibold text-text-heading">
              ฉบับร่าง
            </h2>
            <div className="flex items-center gap-3">
              <span className="text-xs text-text-secondary/80">{filteredDrafts.length} รายการ</span>
              <button
                onClick={() => {
                  if (selectScope === "drafts") {
                    setSelectMode(false);
                    setSelectedIds(new Set());
                    setSelectScope(null);
                  } else {
                    setSelectMode(true);
                    setSelectScope("drafts");
                  }
                }}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  selectScope === "drafts"
                    ? "bg-error/15 text-error"
                    : "border border-border/40 text-text-secondary hover:text-text-heading"
                }`}
              >
                {selectScope === "drafts" ? "เลิกเลือก" : "เลือกเพื่อลบ"}
              </button>
              {drafts.length > 5 && (
                <button
                  onClick={() => setShowAllDrafts(!showAllDrafts)}
                  className="text-xs text-accent hover:underline"
                >
                  {showAllDrafts ? "แสดงน้อยลง" : `ดูทั้งหมด (${filteredDrafts.length})`}
                </button>
              )}
            </div>
          </div>

          {drafts.length === 0 ? (
            <DashboardEmptyState
              icon={<BookIcon className="h-6 w-6" />}
              title="ยังไม่มีฉบับร่าง"
              message="ฉบับร่างจะปรากฏที่นี่เมื่อคุณเริ่มเขียน"
              cta={{ label: "เริ่มเขียนบทความแรก", href: "/studio/editor" }}
            />
          ) : selectScope === "drafts" ? (
            <div className="space-y-3">
              <BulkActionBar
                totalItems={filteredDrafts.length}
                allSelected={
                  filteredDrafts.length > 0 &&
                  filteredDrafts.every((d) => selectedIds.has(d.id))
                }
                onSelectAllToggle={() => {
                  const ids = filteredDrafts.map((d) => d.id);
                  if (ids.every((id) => selectedIds.has(id))) {
                    setSelectedIds(new Set());
                  } else {
                    setSelectedIds(new Set(ids));
                  }
                }}
                selectedCount={selectedIds.size}
                acting={acting}
                onDelete={() => {
                  const ids = [...selectedIds];
                  const titles = ids
                    .map((id) => drafts.find((d) => d.id === id)?.title ?? "")
                    .filter(Boolean);
                  requestAction("delete", ids, titles);
                }}
                onCancel={() => {
                  setSelectMode(false);
                  setSelectedIds(new Set());
                  setSelectScope(null);
                }}
              />
              <div className="space-y-1.5">
                {displayDrafts.map((d) => (
                  <SelectRow
                    key={d.id}
                    checked={selectedIds.has(d.id)}
                    onToggle={() => toggleSelect(d.id)}
                    ariaLabel={`เลือก ${d.title || d.slug}`}
                    title={d.title || d.slug}
                    subtitle={d.updated_at ? new Date(d.updated_at).toLocaleDateString("th-TH") : "—"}
                    statusBadge={{ label: statusLabel(d.status), color: statusAccent(d.status) }}
                  />
                ))}
              </div>
            </div>
          ) : (
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
                    <p className="mt-0.5 text-[11px] text-text-secondary/70">
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
          )}
        </section>
        {/* Tabs: บทความของฉัน / บทความทั้งหมด */}
        <section>
          <div className="mb-4 flex items-center gap-1 rounded-xl border border-border/30 bg-bg/40 p-1">
            <button
              onClick={() => switchTab("my")}
              className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                tab === "my"
                  ? "bg-accent/15 text-accent shadow-sm"
                  : "text-text-secondary/70 hover:text-text-heading"
              }`}
            >
              บทความของฉัน
              <span className="ml-1.5 text-[11px] opacity-80">({entries.length})</span>
            </button>
            {admin && (
              <button
                onClick={() => switchTab("all")}
                className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  tab === "all"
                    ? "bg-accent/15 text-accent shadow-sm"
                  : "text-text-secondary/70 hover:text-text-heading"
              }`}
            >
              บทความทั้งหมด
                <span className="ml-1.5 text-[11px] opacity-80">({allEntries.length})</span>
              </button>
            )}
          </div>

          {/* Filter bar */}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {(tab === "my" || (tab === "all" && admin)) && (
              <button
                onClick={() => {
                  if (selectMode) {
                    setSelectMode(false);
                    setSelectedIds(new Set());
                    setSelectScope(null);
                  } else {
                    setSelectMode(true);
                    setSelectScope(tab);
                  }
                }}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                  selectMode
                    ? "bg-error text-text-inverse shadow-sm"
                    : "border-2 border-error/50 text-error hover:bg-error/10"
                }`}
              >
                {selectMode ? "✕ เลิกเลือก" : "🗑 เลือกเพื่อลบ"}
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
            <span className="text-[11px] text-text-secondary/70">
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
            <DashboardEmptyState
              icon={tab === "my" ? <BookIcon className="h-6 w-6" /> : <SearchIcon className="h-6 w-6" />}
              title={tab === "my" ? "ยังไม่มีบทความ" : "ไม่พบรายการที่ตรงกับตัวกรอง"}
              message={tab === "my" ? "เริ่มเขียนบทความแรกของคุณ" : "ลองเปลี่ยนคำค้นหาหรือตัวกรอง"}
              cta={tab === "my" ? { label: "เริ่มเขียน", href: "/studio/editor" } : undefined}
            />
          ) : tab === "my" && selectScope === "my" ? (
            <div className="space-y-3">
              <BulkActionBar
                totalItems={myFilteredEntries.length}
                allSelected={myFilteredEntries.length > 0 && myFilteredEntries.every((e) => selectedIds.has(e.id))}
                onSelectAllToggle={() => {
                  const ids = myFilteredEntries.map((e) => e.id);
                  if (ids.every((id) => selectedIds.has(id))) {
                    setSelectedIds(new Set());
                  } else {
                    setSelectedIds(new Set(ids));
                  }
                }}
                selectedCount={selectedIds.size}
                acting={acting}
                onArchive={() => {
                  const pubIds = [...selectedIds].filter((id) => {
                    const e = entries.find((en) => en.id === id);
                    return e?.status === "published";
                  });
                  const titles = pubIds
                    .map((id) => entries.find((e) => e.id === id)?.title ?? "")
                    .filter(Boolean);
                  requestAction("archive", pubIds, titles);
                }}
                archiveCount={[...selectedIds].filter((id) => {
                  const e = entries.find((en) => en.id === id);
                  return e?.status === "published";
                }).length}
                archiveDisabled={acting || [...selectedIds].filter((id) => {
                  const e = entries.find((en) => en.id === id);
                  return e?.status === "published";
                }).length === 0}
                onDelete={() => {
                  const ids = [...selectedIds];
                  const titles = ids
                    .map((id) => entries.find((e) => e.id === id)?.title ?? "")
                    .filter(Boolean);
                  requestAction("delete", ids, titles);
                }}
                onCancel={() => {
                  setSelectMode(false);
                  setSelectedIds(new Set());
                  setSelectScope(null);
                }}
              />
              <div className="space-y-1.5">
                {myFilteredEntries.map((e) => (
                  <SelectRow
                    key={e.id}
                    checked={selectedIds.has(e.id)}
                    onToggle={() => toggleSelect(e.id)}
                    ariaLabel={`เลือก ${e.title}`}
                    typeBadge={{ label: typeLabel(e.content_type), color: typeAccent(e.content_type) }}
                    title={e.title}
                    subtitle={e.published_at
                      ? new Date(e.published_at).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" })
                      : "—"
                    }
                    statusBadge={{ label: statusLabel(e.status), color: statusAccent(e.status) }}
                  />
                ))}
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
                    <p className="mt-0.5 text-[11px] text-text-secondary/70">
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
          ) : tab === "all" && selectScope === "all" ? (
            <div className="space-y-3">
              <BulkActionBar
                totalItems={allFilteredEntries.length}
                allSelected={allFilteredEntries.length > 0 && allFilteredEntries.every((e) => selectedIds.has(e.id))}
                onSelectAllToggle={() => {
                  const ids = allFilteredEntries.map((e) => e.id);
                  if (ids.every((id) => selectedIds.has(id))) {
                    setSelectedIds(new Set());
                  } else {
                    setSelectedIds(new Set(ids));
                  }
                }}
                selectedCount={selectedIds.size}
                acting={acting}
                onArchive={() => {
                  const pubIds = [...selectedIds].filter((id) => {
                    const e = allEntries.find((en) => en.id === id);
                    return e?.status === "published";
                  });
                  const titles = pubIds
                    .map((id) => allEntries.find((e) => e.id === id)?.title ?? "")
                    .filter(Boolean);
                  requestAction("archive", pubIds, titles);
                }}
                archiveCount={[...selectedIds].filter((id) => {
                  const e = allEntries.find((en) => en.id === id);
                  return e?.status === "published";
                }).length}
                archiveDisabled={acting || [...selectedIds].filter((id) => {
                  const e = allEntries.find((en) => en.id === id);
                  return e?.status === "published";
                }).length === 0}
                onDelete={() => {
                  const ids = [...selectedIds];
                  const titles = ids
                    .map((id) => allEntries.find((e) => e.id === id)?.title ?? "")
                    .filter(Boolean);
                  requestAction("delete", ids, titles);
                }}
                onCancel={() => {
                  setSelectMode(false);
                  setSelectedIds(new Set());
                  setSelectScope(null);
                }}
              />
              <div className="space-y-1.5">
                {allFilteredEntries.map((e) => (
                  <SelectRow
                    key={e.id}
                    checked={selectedIds.has(e.id)}
                    onToggle={() => toggleSelect(e.id)}
                    ariaLabel={`เลือก ${e.title}`}
                    typeBadge={{ label: typeLabel(e.content_type), color: typeAccent(e.content_type) }}
                    title={e.title}
                    subtitle={(e.published_at
                      ? new Date(e.published_at).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" })
                      : "—"
                    ) + (e.author_name ? ` · ${e.author_name}` : "")}
                    statusBadge={{ label: statusLabel(e.status), color: statusAccent(e.status) }}
                  />
                ))}
              </div>
            </div>
          ) : tab === "all" ? (
            <div className="space-y-1.5">
              {allFilteredEntries.map((e) => (
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
                    href={`/studio/editor?slug=${e.slug}`}
                    className="min-w-0 flex-1"
                  >
                    <p className="truncate text-sm font-medium text-text-heading group-hover:text-accent transition-colors">
                      {e.title}
                    </p>
                    <p className="mt-0.5 text-[11px] text-text-secondary/70">
                      {e.published_at ? new Date(e.published_at).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                      {e.author_name ? ` · ${e.author_name}` : ""}
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
                      onClick={() => requestAction("archive", [e.id], [e.title])}
                      disabled={acting}
                      className="shrink-0 rounded-md px-2 py-1 text-[11px] font-medium text-text-secondary hover:text-warning disabled:opacity-40 transition-colors"
                      aria-label={`เก็บถาวร ${e.title}`}
                    >
                      เก็บถาวร
                    </button>
                  )}
                  <button
                    onClick={() => requestAction("delete", [e.id], [e.title])}
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
            <div className="archron-card p-12 text-center">
              <p className="text-sm text-text-secondary/80">ไม่พบรายการ</p>
            </div>
          )}
        </section>

      </div>

      {/* Confirm modal */}
      <FeedbackModal
        open={confirm !== null}
        onClose={() => setConfirm(null)}
        severity={confirm?.kind === "delete" ? "error" : "warning"}
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
                <span className="mt-2 block text-xs text-text-secondary/80">
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
