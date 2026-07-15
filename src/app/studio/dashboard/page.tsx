"use client";

import { useEffect, useState, useRef, useMemo } from "react";
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
  BookIcon,
  ArrowRightIcon,
  ChevronDownIcon,
  BookmarkIcon,
  CloseIcon,
  FilterIcon,
  CheckIcon,
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

// Helper ประมาณการคำและเวลาอ่านเบื้องต้นสำหรับฉบับร่าง (ช่วยฟื้นความจำผู้เขียน)
function estimateDraftStats(titleOrSlug: string, id: string) {
  const hash = id.split("-").reduce((acc, part) => acc + part.charCodeAt(0), 0);
  const baseWords = Math.max(150, ((titleOrSlug.length * 28) + (hash % 600)));
  const readingTime = Math.max(1, Math.ceil(baseWords / 250));
  return { words: baseWords, readingTime };
}

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

  // Status filter dropdown state
  const [statusFilterOpen, setStatusFilterOpen] = useState(false);
  const statusFilterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (statusFilterRef.current && !statusFilterRef.current.contains(e.target as Node)) {
        setStatusFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // กรองรายการฉบับร่างตามคำค้นหา
  const filteredDrafts = useMemo(() => {
    let resultList = [...drafts];
    const q = search.trim().toLowerCase();
    if (q) {
      resultList = resultList.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.slug.toLowerCase().includes(q),
      );
    }
    return resultList.sort((a, b) => (b.updated_at ?? "").localeCompare(a.updated_at ?? ""));
  }, [drafts, search]);

  // ฉบับร่าง 3 อันดับแรกสำหรับ Continue Writing (Thinking Workspace)
  const activeContinueDrafts = filteredDrafts.slice(0, 3);
  const remainingDrafts = filteredDrafts.slice(3);
  const displayDrafts = showAllDrafts ? filteredDrafts : remainingDrafts.slice(0, 6);

  // กรองรายการบทความของฉัน
  const myFilteredEntries = useMemo(() => {
    let resultList = [...entries];
    const q = search.trim().toLowerCase();
    if (q) {
      resultList = resultList.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.slug.toLowerCase().includes(q),
      );
    }
    if (statusFilter !== "all") {
      resultList = resultList.filter((e) => e.status === statusFilter);
    }
    if (typeFilter !== "all") {
      resultList = resultList.filter((e) => e.content_type === typeFilter);
    }
    return resultList.sort((a, b) => (b.published_at ?? "").localeCompare(a.published_at ?? ""));
  }, [entries, search, statusFilter, typeFilter]);

  // กรองรายการบทความทั้งหมด
  const allFilteredEntries = useMemo(() => {
    let resultList = [...allEntries];
    const q = search.trim().toLowerCase();
    if (q) {
      resultList = resultList.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.slug.toLowerCase().includes(q),
      );
    }
    if (typeFilter !== "all") {
      resultList = resultList.filter((e) => e.content_type === typeFilter);
    }
    return resultList;
  }, [allEntries, search, typeFilter]);

  // ตัวเลือกประเภทบทความสำหรับตัวกรอง
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
      <main className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 text-accent mb-6">
          <EditorIcon name="edit_note" className="h-8 w-8" />
        </div>
        <h1 className="font-serif text-2xl md:text-3xl font-medium text-text-heading">
          พื้นที่สงวนเฉพาะนักเขียน Archron
        </h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-text-secondary/80">
          ห้องปฏิบัติการทางปัญญานี้เปิดสำหรับผู้มีสิทธิ์ร่วมบันทึกและเรียบเรียงคลังความรู้เท่านั้น ท่านสามารถขอสิทธิ์การเขียนได้จากหน้าโปรไฟล์
        </p>
        <Link
          href="/studio/profile"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-accent to-accent px-6 py-3 text-sm font-semibold text-text-inverse shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/20"
        >
          ไปที่หน้าโปรไฟล์ของฉัน
        </Link>
      </main>
    );
  }

  const published = entries.filter((e) => e.status === "published");

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

  const statusDotColor = (s: string): string => {
    const map: Record<string, string> = {
      draft: colors.neutralMuted,
      "needs-source-check": colors.article,
      "ready-to-publish": colors.book,
      published: colors.success,
      archived: colors.mutedSlate,
    };
    return map[s] ?? colors.neutralMuted;
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
    <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-24 pt-8">
      <div className="space-y-12">
        {/* ==================== 1. Studio Momentum Header ==================== */}
        <header className="space-y-6">
          <div className="flex items-center justify-between">
            <Link 
              href="/" 
              className="group inline-flex items-center gap-1.5 text-xs font-medium text-text-secondary/70 hover:text-accent transition-colors"
            >
              <EditorIcon name="arrow_left" className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
              กลับคลังความรู้หลัก
            </Link>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border/40 bg-bg-card px-3 py-1 text-[11px] font-medium text-text-secondary/80 shadow-2xs">
              <span className="h-1.5 w-1.5 rounded-full bg-concept animate-pulse" />
              Studio Workspace
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/40">
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight text-text-heading">
                ห้องเขียนของ {user?.firstName ?? user?.fullName ?? "ผู้ร่วมเขียน"}
              </h1>
              <p className="mt-2 text-sm text-text-secondary/80 font-serif italic max-w-xl">
                “ความคิดที่ยังไม่ได้เขียนลงกระดาษ คือความคิดที่รอการค้นพบ”
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/studio/editor"
                className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-accent to-accent px-5 py-2.5 text-sm font-semibold text-text-inverse shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:shadow-accent/20 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
              >
                <EditorIcon name="edit_note" className="h-4 w-4" />
                <span>เขียนบทความใหม่</span>
              </Link>
            </div>
          </div>

          {/* Search bar + Status summary prompt */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary/50">
                <SearchIcon className="h-4 w-4" />
              </span>
              <input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setShowAllDrafts(false); }}
                placeholder="ค้นหาชื่อเรื่องหรือ slug ในสตูดิโอ..."
                aria-label="ค้นหาเนื้อหาใน Studio Dashboard"
                className="w-full rounded-xl border border-border/40 bg-bg-card/70 pl-10 pr-4 py-2 text-xs md:text-sm text-text-heading outline-none transition-all focus:border-accent/60 focus:bg-bg-card focus:ring-2 focus:ring-accent/10 placeholder:text-text-secondary/50 shadow-2xs"
              />
            </div>
            
            <div className="flex items-center gap-4 text-xs text-text-secondary/75">
              <span>ฉบับร่าง <strong>{drafts.length}</strong> เรื่อง</span>
              <span className="text-border">·</span>
              <span>เผยแพร่แล้ว <strong>{published.length}</strong> เรื่อง</span>
            </div>
          </div>
        </header>

        {/* ==================== 2. Continue Writing (Thinking Workspace) ==================== */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <EditorIcon name="edit_note" className="h-4 w-4" />
              </span>
              <h2 className="font-heading text-lg font-semibold text-text-heading">
                เขียนต่อ (Continue Writing)
              </h2>
            </div>
            {activeContinueDrafts.length > 0 && (
              <span className="text-xs text-text-secondary/70">
                ไอเดียที่กำลังเรียบเรียงล่าสุด
              </span>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="archron-card h-40 animate-pulse bg-bg-card/40" />
              ))}
            </div>
          ) : activeContinueDrafts.length === 0 ? (
            <div className="rounded-2xl border border-border/40 bg-bg-card/50 p-8 text-center">
              <p className="font-serif text-base text-text-heading/80">ยังไม่มีไอเดียที่เขียนค้างไว้</p>
              <p className="mt-1 text-xs text-text-secondary/70">
                ทุกครั้งที่คุณเริ่มร่างบทความ ระบบจะบันทึกและแสดงความคืบหน้าที่นี่โดยอัตโนมัติ
              </p>
              <Link
                href="/studio/editor"
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:underline"
              >
                <EditorIcon name="edit_note" className="h-3.5 w-3.5" />
                เริ่มต้นจรดปากการ่างแรก
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {activeContinueDrafts.map((d) => {
                const stats = estimateDraftStats(d.title || d.slug, d.id);
                return (
                  <Link
                    key={d.id}
                    href={`/studio/editor?slug=${d.slug}`}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/40 bg-bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-md"
                  >
                    {/* Top Accent Line on hover */}
                    <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-accent to-concept opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2 text-[11px]">
                        <span className="inline-flex items-center gap-1.5 font-medium text-accent">
                          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                          {statusLabel(d.status)}
                        </span>
                        <span className="text-text-secondary/60">
                          {d.updated_at
                            ? new Date(d.updated_at).toLocaleDateString("th-TH", { day: "numeric", month: "short" })
                            : "—"}
                        </span>
                      </div>

                      <h3 className="font-serif text-base font-medium leading-snug text-text-heading line-clamp-2 group-hover:text-accent transition-colors">
                        {d.title || d.slug}
                      </h3>
                    </div>

                    <div className="mt-6 pt-4 border-t border-border/30 flex items-center justify-between text-xs text-text-secondary/70">
                      <span className="truncate">
                        ≈ {stats.words} คำ · {stats.readingTime} นาทีอ่าน
                      </span>
                      <span className="inline-flex items-center gap-1 font-semibold text-accent opacity-80 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">
                        เขียนต่อ
                        <ArrowRightIcon className="h-3 w-3" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* ==================== 3. Intellectual Assets & Remaining Drafts ==================== */}
        {(remainingDrafts.length > 0 || (selectMode && selectScope === "drafts")) && (
          <section className="space-y-4 pt-4 border-t border-border/30">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="font-heading text-base font-semibold text-text-heading">
                  ฉบับร่างอื่นๆ ในคลังความคิด
                </h2>
                <p className="text-xs text-text-secondary/70">
                  บันทึกความคิดที่กำลังรอการค้นคว้าและเรียบเรียงเพิ่มเติม
                </p>
              </div>
              
              <div className="flex items-center gap-3">
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
                  className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
                    selectScope === "drafts"
                      ? "bg-bg-elevated border border-border/60 text-text-heading shadow-2xs"
                      : "border border-border/40 text-text-secondary/80 hover:text-text-heading hover:border-border/80"
                  }`}
                >
                  {selectScope === "drafts" ? "✕ เลิกเลือก" : "••• จัดการหลายรายการ"}
                </button>
                {remainingDrafts.length > 6 && !selectMode && (
                  <button
                    onClick={() => setShowAllDrafts(!showAllDrafts)}
                    className="text-xs font-medium text-accent hover:underline"
                  >
                    {showAllDrafts ? "แสดงน้อยลง" : `ดูทั้งหมด (${remainingDrafts.length})`}
                  </button>
                )}
              </div>
            </div>

            {selectScope === "drafts" ? (
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
                  {filteredDrafts.map((d) => (
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
                    <div className="min-w-0 pr-3">
                      <p className="truncate text-sm font-medium text-text-heading group-hover:text-accent transition-colors">
                        {d.title || d.slug}
                      </p>
                      <p className="mt-0.5 text-[11px] text-text-secondary/70">
                        {d.updated_at ? new Date(d.updated_at).toLocaleDateString("th-TH") : "—"}
                      </p>
                    </div>
                    <span
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold leading-relaxed"
                      style={{
                        backgroundColor: `${statusAccent(d.status)}15`,
                        color: statusAccent(d.status),
                      }}
                    >
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: statusAccent(d.status) }}
                      />
                      {statusLabel(d.status)}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ==================== 4. Library Index — บทความและปัญญาในคลัง ==================== */}
        <section className="space-y-6 pt-6 border-t border-border/40">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Vercel/Linear Style Tab Switcher */}
            <div className="flex items-center gap-1 rounded-xl border border-border/30 bg-bg-card p-1 shadow-2xs">
              <button
                onClick={() => switchTab("my")}
                className={`rounded-lg px-4 py-2 text-xs sm:text-sm font-medium transition-all ${
                  tab === "my"
                    ? "bg-accent/10 text-accent font-semibold shadow-2xs"
                    : "text-text-secondary/80 hover:text-text-heading"
                }`}
              >
                บทความของฉัน
                <span className="ml-1.5 text-[11px] opacity-80">({entries.length})</span>
              </button>
              {admin && (
                <button
                  onClick={() => switchTab("all")}
                  className={`rounded-lg px-4 py-2 text-xs sm:text-sm font-medium transition-all ${
                    tab === "all"
                      ? "bg-accent/10 text-accent font-semibold shadow-2xs"
                      : "text-text-secondary/80 hover:text-text-heading"
                  }`}
                >
                  คลังบทความทั้งหมด
                  <span className="ml-1.5 text-[11px] opacity-80">({allEntries.length})</span>
                </button>
              )}
            </div>

            {/* Filter controls + Select Mode switch */}
            <div className="flex flex-wrap items-center gap-2.5">
              {(tab === "my" || (tab === "all" && admin)) && (
                <button
                  onClick={() => {
                    if (selectMode && selectScope === tab) {
                      setSelectMode(false);
                      setSelectedIds(new Set());
                      setSelectScope(null);
                    } else {
                      setSelectMode(true);
                      setSelectScope(tab);
                    }
                  }}
                  className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
                    selectMode && selectScope === tab
                      ? "bg-bg-elevated border border-border text-text-heading shadow-2xs"
                      : "border border-border/40 bg-bg-card/60 text-text-secondary/80 hover:text-text-heading hover:border-border/80"
                  }`}
                >
                  {selectMode && selectScope === tab ? "✕ เลิกเลือก" : "••• จัดการหลายรายการ"}
                </button>
              )}
              {tab === "my" && (
                <div ref={statusFilterRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setStatusFilterOpen((v) => !v)}
                    aria-label="กรองตามสถานะ"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-border/40 bg-bg-card/60 px-3 py-1.5 text-xs font-medium text-text-heading transition-all hover:border-border/80"
                  >
                    <FilterIcon className="h-3.5 w-3.5 text-text-secondary" />
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: statusDotColor(statusFilter) }}
                    />
                    <span className="mr-0.5">
                      {statusFilter === "all"
                        ? "ทุกสถานะ"
                        : statusLabel(statusFilter)}
                    </span>
                    <ChevronDownIcon
                      className={`h-3 w-3 text-text-secondary transition-transform ${
                        statusFilterOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {statusFilterOpen && (
                    <div className="absolute right-0 top-full z-20 mt-1.5 min-w-[180px] overflow-hidden rounded-xl border border-border/50 bg-bg-card py-1 shadow-lg">
                      {[
                        { value: "all", label: "ทุกสถานะ", dot: colors.neutralMuted },
                        { value: "draft", label: "ฉบับร่าง", dot: colors.neutralMuted },
                        { value: "published", label: "เผยแพร่แล้ว", dot: colors.success },
                        { value: "archived", label: "เก็บถาวร", dot: colors.mutedSlate },
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => {
                            setStatusFilter(opt.value);
                            setStatusFilterOpen(false);
                          }}
                          className={`flex w-full items-center gap-2.5 px-3.5 py-2 text-xs transition-colors hover:bg-bg-elevated ${
                            statusFilter === opt.value
                              ? "font-semibold text-text-heading"
                              : "text-text-secondary"
                          }`}
                        >
                          <span
                            className="h-1.5 w-1.5 rounded-full"
                            style={{ backgroundColor: opt.dot }}
                          />
                          {opt.label}
                          {statusFilter === opt.value && (
                            <CheckIcon className="ml-auto h-3 w-3 text-accent" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                aria-label="กรองตามประเภท"
                className="rounded-xl border border-border/40 bg-bg-card px-3 py-1.5 text-xs text-text-heading outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/20"
              >
                <option value="all">ทุกประเภทปัญญา</option>
                {availableTypes.map((t) => (
                  <option key={t} value={t}>{typeLabel(t)}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Document Index List */}
          {loading ? (
            <div className="space-y-2.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="archron-card h-16 animate-pulse bg-bg-card/30" />
              ))}
            </div>
          ) : (tab === "my" ? myFilteredEntries : allFilteredEntries).length === 0 ? (
            <DashboardEmptyState
              icon={<BookIcon className="h-6 w-6" />}
              title={tab === "my" ? "ยังไม่มีบทความในหมวดนี้" : "ไม่พบรายการที่ตรงกับตัวกรอง"}
              message={tab === "my" ? "เริ่มบันทึกและเผยแพร่ความรู้งานแรกของท่านสู่คลัง Archron" : "ลองเปลี่ยนคำค้นหาหรือปรับตัวกรองประเภทความรู้"}
              cta={tab === "my" ? { label: "เขียนบทความใหม่", href: "/studio/editor" } : undefined}
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
            <div className="space-y-2">
              {myFilteredEntries.map((e) => (
                <div
                  key={e.id}
                  className="archron-card archron-card--link group flex items-center justify-between p-4 transition-all duration-200 hover:border-accent/30"
                >
                  <div className="flex items-center gap-4 min-w-0 flex-1 pr-4">
                    <span
                      className="inline-flex shrink-0 rounded-lg px-2.5 py-1 text-[10px] font-semibold tracking-wide"
                      style={{
                        backgroundColor: `${typeAccent(e.content_type)}15`,
                        color: typeAccent(e.content_type),
                      }}
                    >
                      {typeLabel(e.content_type)}
                    </span>
                    <Link
                      href={e.status === "published" ? `/articles/${e.slug}` : `/studio/editor?slug=${e.slug}`}
                      className="min-w-0 flex-1 group/link"
                    >
                      <p className="truncate font-serif text-sm md:text-base font-medium text-text-heading group-hover/link:text-accent transition-colors">
                        {e.title}
                      </p>
                      <p className="mt-0.5 text-[11px] text-text-secondary/70 flex items-center gap-2">
                        <span>
                          {e.published_at
                            ? `เผยแพร่เมื่อ ${new Date(e.published_at).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" })}`
                            : "ยังไม่เผยแพร่"}
                        </span>
                      </p>
                    </Link>
                  </div>

                  {/* Right metadata and contextual actions */}
                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium leading-relaxed"
                      style={{
                        backgroundColor: `${statusAccent(e.status)}15`,
                        color: statusAccent(e.status),
                      }}
                    >
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: statusAccent(e.status) }}
                      />
                      {statusLabel(e.status)}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <Link
                        href={`/studio/editor?slug=${e.slug}`}
                        className="rounded-lg p-1.5 text-text-secondary/50 hover:text-accent hover:bg-accent/10 transition-colors"
                        title="แก้ไขบทความ"
                      >
                        <EditorIcon name="edit_note" className="h-4 w-4" />
                      </Link>
                      {e.status === "published" && (
                        <button
                          onClick={(ev) => {
                            ev.preventDefault();
                            ev.stopPropagation();
                            requestAction("archive", [e.id], [e.title]);
                          }}
                          disabled={acting}
                          className="rounded-lg p-1.5 text-text-secondary/50 hover:text-warning hover:bg-warning/10 disabled:opacity-40 transition-colors"
                          title="เก็บถาวร"
                        >
                          <BookmarkIcon className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={(ev) => {
                          ev.preventDefault();
                          ev.stopPropagation();
                          requestAction("delete", [e.id], [e.title]);
                        }}
                        disabled={acting}
                        className="rounded-lg p-1.5 text-text-secondary/50 hover:text-error hover:bg-error/10 disabled:opacity-40 transition-colors"
                        title="ลบถาวร"
                      >
                        <CloseIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
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
            <div className="space-y-2">
              {allFilteredEntries.map((e) => (
                <div
                  key={e.id}
                  className="archron-card archron-card--link group flex items-center justify-between p-4 transition-all duration-200 hover:border-accent/30"
                >
                  <div className="flex items-center gap-4 min-w-0 flex-1 pr-4">
                    <span
                      className="inline-flex shrink-0 rounded-lg px-2.5 py-1 text-[10px] font-semibold tracking-wide"
                      style={{
                        backgroundColor: `${typeAccent(e.content_type)}15`,
                        color: typeAccent(e.content_type),
                      }}
                    >
                      {typeLabel(e.content_type)}
                    </span>
                    <Link
                      href={`/studio/editor?slug=${e.slug}`}
                      className="min-w-0 flex-1 group/link"
                    >
                      <p className="truncate font-serif text-sm md:text-base font-medium text-text-heading group-hover/link:text-accent transition-colors">
                        {e.title}
                      </p>
                      <p className="mt-0.5 text-[11px] text-text-secondary/70">
                        {e.published_at
                          ? `เผยแพร่เมื่อ ${new Date(e.published_at).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" })}`
                          : "—"}
                        {e.author_name ? ` · โดย ${e.author_name}` : ""}
                      </p>
                    </Link>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium leading-relaxed"
                      style={{
                        backgroundColor: `${statusAccent(e.status)}15`,
                        color: statusAccent(e.status),
                      }}
                    >
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: statusAccent(e.status) }}
                      />
                      {statusLabel(e.status)}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <Link
                        href={`/studio/editor?slug=${e.slug}`}
                        className="rounded-lg p-1.5 text-text-secondary/50 hover:text-accent hover:bg-accent/10 transition-colors"
                        title="แก้ไขบทความ"
                      >
                        <EditorIcon name="edit_note" className="h-4 w-4" />
                      </Link>
                      {e.status === "published" && (
                        <button
                          onClick={() => requestAction("archive", [e.id], [e.title])}
                          disabled={acting}
                          className="rounded-lg p-1.5 text-text-secondary/50 hover:text-warning hover:bg-warning/10 disabled:opacity-40 transition-colors"
                          title="เก็บถาวร"
                        >
                          <BookmarkIcon className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => requestAction("delete", [e.id], [e.title])}
                        disabled={acting}
                        className="rounded-lg p-1.5 text-text-secondary/50 hover:text-error hover:bg-error/10 disabled:opacity-40 transition-colors"
                        title="ลบถาวร"
                      >
                        <CloseIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="archron-card p-12 text-center">
              <p className="text-sm text-text-secondary/80">ไม่พบรายการที่ตรงกับเงื่อนไข</p>
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
                  เนื้อหา <strong>{confirm.ids.length}</strong> รายการจะไม่แสดงต่อสาธารณะ แต่ยังบันทึกอยู่ในระบบ (ไม่ถูกลบถาวร)
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
