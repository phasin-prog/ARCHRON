"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";
import { roleFromMetadata, canWrite } from "@/lib/content/roles";
import {
  EMPTY_DRAFT, getPublishChecklist, canPublish, slugify, type EditorDraft, type EditorReference,
} from "@/lib/content/publish-validation";
import {
  saveDraftAction, saveDraftWithRevisionAction, loadDraftAction,
  publishAction,
} from "@/features/editor/actions";
import { listMyDraftsAction, listMyEntriesAction } from "@/features/studio/actions/dashboard-actions";
import { findDeadLinks } from "@/lib/content/internal-links";
import { getMyProfileAction } from "@/features/studio/actions/profile-actions";
import { EditorHeader } from "@/components/studio/editor-header";
import { EditorForm } from "@/components/studio/editor-form";
import { EditorSidebar } from "@/components/studio/editor-sidebar";
import { EditorFeedback, type EditorFeedbackData } from "@/components/studio/editor-feedback";
import { EditorIcon } from "@/components/studio/editor-icon";

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

export default function StudioEditorPage() {
  const { userId } = useAuth();
  const { user } = useUser();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [draft, setDraft] = useState<EditorDraft>(EMPTY_DRAFT);
  const [entryId, setEntryId] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [autoState, setAutoState] = useState<"idle" | "saving" | "saved">("idle");
  const [feedback, setFeedback] = useState<EditorFeedbackData | null>(null);
  const [preview, setPreview] = useState(false);
  const [publishTried, setPublishTried] = useState(false);
  const [newRef, setNewRef] = useState<EditorReference>({ sourceType: "primary-source", title: "", relatedClaim: "" });
  const [publishing, setPublishing] = useState(false);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [loadingDraft, setLoadingDraft] = useState(false);
  const [showDashboard, setShowDashboard] = useState(true);
  const [entries, setEntries] = useState<EntryItem[]>([]);
  const [drafts, setDrafts] = useState<DraftItem[]>([]);
  const [loadingEntries, setLoadingEntries] = useState(true);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [originalAuthorId, setOriginalAuthorId] = useState<string | null>(null);
  const [originalAuthorName, setOriginalAuthorName] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState("basic");

  const canSave = draft.slug.trim() !== "" && draft.title.trim() !== "";
  const role = roleFromMetadata(user?.publicMetadata);
  const ct = draft.contentType;

  const show = {
    shortDesc: true, status: true, contentType: true,
    framework: ["article", "concept", "person", "book"].includes(ct),
    difficulty: ["article", "concept"].includes(ct),
    mainThinker: ["article", "concept", "person", "book"].includes(ct),
    school: ["article", "concept"].includes(ct),
    tags: true, visualExplanation: true,
    technicalMeaning: ["article", "concept", "person"].includes(ct),
    bodyMarkdown: ct === "article",
    coverImage: ct === "article",
    relatedConcepts: ["article", "concept", "person", "school", "book"].includes(ct),
    references: true,
    roots: ["article", "concept"].includes(ct),
  };

  useEffect(() => {
    if (!userId) return;
    let active = true;
    (async () => {
      const p = await getMyProfileAction();
      if (active && p?.display_name) setDisplayName(p.display_name);
    })();
    return () => { active = false; };
  }, [userId]);

  useEffect(() => {
    const slug = searchParams.get("slug");
    const type = searchParams.get("type");
    if (slug) {
      setShowDashboard(false);
      let active = true;
      setLoadingDraft(true);
      (async () => {
        try {
          const { draft: loaded, authorId, authorName } = await loadDraftAction(slug);
          if (active && loaded) {
            setDraft(loaded);
            setOriginalAuthorId(authorId);
            setOriginalAuthorName(authorName);
          }
        } catch (err) {
          if (active) showError(`โหลดเนื้อหาไม่สำเร็จ: ${err instanceof Error ? err.message : "ข้อผิดพลาด"}`);
        } finally {
          if (active) setLoadingDraft(false);
        }
      })();
      return () => { active = false; };
    }
    if (type) {
      setShowDashboard(false);
      setDraft((d) => ({ ...d, id: crypto.randomUUID(), contentType: type }));
    }
  }, [searchParams]);

  useEffect(() => {
    if (!userId || !showDashboard) return;
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
        if (active) setLoadingEntries(false);
      }
    })();
    return () => { active = false; };
  }, [userId, showDashboard]);

  function set<K extends keyof EditorDraft>(key: K, value: EditorDraft[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  function showError(text: string) { setFeedback({ type: "error", title: "เกิดข้อผิดพลาด", message: text }); }
  function showSuccess(text: string) { setFeedback({ type: "success", title: "สำเร็จ", message: text }); }

  async function persist(snapshot: boolean): Promise<boolean> {
    if (!userId || !canSave) return false;
    const action = snapshot ? saveDraftWithRevisionAction : saveDraftAction;
    const result = await action(draft);
    if (result.error) { showError(`บันทึกไม่สำเร็จ: ${result.error}`); return false; }
    setFeedback(null);
    const row = result.data as { id?: string } | null;
    const id = row?.id ?? entryId;
    if (id && id !== entryId) setEntryId(id);
    setSavedAt(new Date().toLocaleString("th-TH"));
    if (snapshot) setReloadKey((k) => k + 1);
    return true;
  }

  useEffect(() => {
    if (!userId || !canSave) return;
    const t = setTimeout(async () => {
      setAutoState("saving");
      const ok = await persist(false);
      setAutoState(ok ? "saved" : "idle");
    }, 2500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft, userId]);

  async function handleManualSave() {
    if (!userId) { showError("ยังไม่ได้เข้าสู่ระบบ"); return; }
    if (!canSave) { showError("ต้องมี Title และ Slug ก่อนบันทึก"); return; }
    const ok = await persist(true);
    if (ok) showSuccess("บันทึก + เวอร์ชันแล้ว");
  }

  const deadLinks = useMemo(
    () => Array.from(new Set(findDeadLinks(`${draft.visualExplanation} ${draft.technicalMeaning} ${draft.bodyMarkdown}`))),
    [draft.visualExplanation, draft.technicalMeaning, draft.bodyMarkdown],
  );

  async function handlePublish() {
    setPublishTried(true);
    if (!userId) { showError("ยังไม่ได้เข้าสู่ระบบ"); return; }
    if (!canSave) { showError("ต้องมี Title และ Slug ก่อนเผยแพร่"); return; }
    if (!canPublish(getPublishChecklist(draft, draft.contentType))) {
      showError("ยังเผยแพร่ไม่ได้ — ทำรายการใน Publish Checklist ให้ครบก่อน");
      return;
    }
    if (deadLinks.length > 0) {
      showError(`พบลิงก์เสีย ${deadLinks.length} รายการ: ${deadLinks.join(", ")}`);
      return;
    }
    setPublishing(true);
    const result = await publishAction(draft);
    if (result.error) { setPublishing(false); showError(`เผยแพร่ไม่สำเร็จ: ${result.error}`); return; }
    const row = result.data as { id?: string } | null;
    const id = row?.id ?? entryId;
    if (id && id !== entryId) setEntryId(id);
    setDraft((d) => ({ ...d, status: "published" }));
    setSavedAt(new Date().toLocaleString("th-TH"));
    setPublishing(false);
    showSuccess("เผยแพร่แล้ว");
  }

  const checklist = getPublishChecklist(draft, draft.contentType);
  const canPreview = draft.title.trim() !== "" && draft.contentType !== "";

  useEffect(() => {
    const els = document.querySelectorAll("[data-section]");
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          const top = visible.reduce((prev, curr) =>
            curr.boundingClientRect.top < prev.boundingClientRect.top ? curr : prev
          );
          const el = top.target as HTMLElement;
          setActiveSection(el.getAttribute("data-section") || "basic");
        }
      },
      { rootMargin: "-80px 0px -60% 0px" }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  function scrollToSection(id: string) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (user && !canWrite(role)) {
    return (
      <main className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-6 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full border border-accent/30 text-accent">
          <EditorIcon name="edit_note" className="h-6 w-6" accent="var(--color-accent)" />
        </span>
        <h1 className="mt-6 font-serif text-2xl text-text-heading">ห้องเขียนสำหรับนักเขียน</h1>
        <p className="mt-3 text-sm leading-relaxed text-text-secondary/70">
          บัญชีของคุณเป็นผู้ใช้ทั่วไป (อ่านอย่างเดียว) หากต้องการเขียนและเรียบเรียงเนื้อหา
          กรุณาส่งคำขอเป็นนักเขียนเพื่อให้แอดมินพิจารณา
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link href="/studio/profile" className="inline-flex min-h-[44px] items-center justify-center gap-2 bg-accent px-6 py-2.5 text-sm font-semibold text-text-inverse hover:brightness-110 transition-all">
            <EditorIcon name="edit_note" className="h-4 w-4" />
            ขอเป็นนักเขียน
          </Link>
          <Link href="/studio" className="inline-flex min-h-[44px] items-center justify-center gap-2 border border-accent/40 px-6 py-2.5 text-sm text-accent hover:bg-accent/10">
            กลับห้องเขียน
          </Link>
        </div>
      </main>
    );
  }

  if (showDashboard) {
    const published = entries.filter((e) => e.status === "published");
    const recent = [...drafts, ...entries.filter((e) => e.status !== "published")]
      .sort((a, b) => ((b as DraftItem).updated_at ?? (b as EntryItem).published_at ?? "").localeCompare((a as DraftItem).updated_at ?? (a as EntryItem).published_at ?? ""))
      .slice(0, 8);
    const filtered = typeFilter === "all" ? entries : entries.filter((e) => e.content_type === typeFilter);
    const availableTypes = Array.from(new Set(entries.map((e) => e.content_type))).sort();

    return (
      <main className="px-4 sm:px-6 pb-24 pt-10">
        <div className="mx-auto max-w-4xl">
          <header className="mb-8 flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-text-secondary/80">Studio · Editor</span>
              <h1 className="mt-2 font-serif text-3xl text-text-heading">เนื้อหาของ{user?.firstName ?? "ฉัน"}</h1>
            </div>
            <Link
              href="/studio/editor?type=article"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-accent to-accent px-5 py-2.5 text-sm font-semibold text-text-inverse shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/20"
            >
              <EditorIcon name="edit_note" className="h-[18px] w-[18px]" />
              เขียนใหม่
            </Link>
          </header>

          {/* Stats */}
          <section className="mb-8 grid grid-cols-3 gap-3">
            <div className="archron-card p-4">
              <span className="text-xs text-text-secondary/60">ฉบับร่าง</span>
              <p className="mt-1 font-serif text-3xl text-text-heading">{drafts.length}</p>
            </div>
            <div className="archron-card p-4">
              <span className="text-xs text-text-secondary/60">เผยแพร่แล้ว</span>
              <p className="mt-1 font-serif text-3xl text-text-heading">{published.length}</p>
            </div>
            <div className="archron-card p-4">
              <span className="text-xs text-text-secondary/60">ทั้งหมด</span>
              <p className="mt-1 font-serif text-3xl text-text-heading">{entries.length}</p>
            </div>
          </section>

          {/* Recent */}
          {recent.length > 0 && (
            <section className="mb-8">
              <h2 className="mb-3 text-sm font-medium text-text-secondary/80">ล่าสุด</h2>
              <div className="grid gap-2 sm:grid-cols-2">
                {recent.map((e) => (
                  <button
                    key={e.id}
                    onClick={() => router.push(`/studio/editor?slug=${e.slug}`)}
                    className="archron-card group flex items-center justify-between p-4 text-left"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-text-heading group-hover:text-accent transition-colors">
                        {e.title || e.slug}
                      </p>
                      <p className="mt-0.5 text-[11px] text-text-secondary/50">
                        {("updated_at" in e ? (e as DraftItem).updated_at : (e as EntryItem).published_at)
                          ? new Date(("updated_at" in e ? (e as DraftItem).updated_at : (e as EntryItem).published_at)!).toLocaleDateString("th-TH")
                          : "—"}
                      </p>
                    </div>
                    <span
                      className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold"
                      style={{ backgroundColor: `${e.status === "published" ? "var(--color-accent)" : "var(--color-premium)"}20`, color: e.status === "published" ? "var(--color-accent)" : "var(--color-premium)" }}
                    >
                      {e.status === "published" ? "เผยแพร่แล้ว" : e.status === "draft" ? "ฉบับร่าง" : e.status}
                    </span>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* All entries with filter */}
          <section>
            <div className="mb-4 flex items-center gap-2">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="rounded-lg border border-border/40 bg-bg/60 px-3 py-1.5 text-xs text-text-heading outline-none focus:border-accent/50"
              >
                <option value="all">ทุกประเภท</option>
                {availableTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <span className="text-[11px] text-text-secondary/40">ทั้งหมด {filtered.length} รายการ</span>
            </div>
            {loadingEntries ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => <div key={i} className="archron-card h-14 animate-pulse" />)}
              </div>
            ) : filtered.length === 0 ? (
              <div className="archron-card p-12 text-center">
                <p className="text-sm text-text-secondary/60">ยังไม่มีเนื้อหา</p>
                <Link href="/studio/editor?type=article" className="mt-3 inline-flex text-xs font-semibold text-accent hover:underline">เริ่มเขียน →</Link>
              </div>
            ) : (
              <div className="space-y-1.5">
                {filtered.map((e) => (
                  <button
                    key={e.id}
                    onClick={() => router.push(`/studio/editor?slug=${e.slug}`)}
                    className="archron-card group flex w-full items-center gap-4 p-4 text-left"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-text-heading group-hover:text-accent transition-colors">{e.title}</p>
                      <p className="mt-0.5 text-[11px] text-text-secondary/50">{e.content_type} · {e.published_at ? new Date(e.published_at).toLocaleDateString("th-TH") : "—"}</p>
                    </div>
                    <span className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold"
                      style={{ backgroundColor: `${e.status === "published" ? "var(--color-accent)" : "var(--color-premium)"}20`, color: e.status === "published" ? "var(--color-accent)" : "var(--color-premium)" }}>
                      {e.status === "published" ? "เผยแพร่แล้ว" : e.status === "draft" ? "ฉบับร่าง" : e.status}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen">
      <EditorHeader
        draft={draft} autoState={autoState} savedAt={savedAt}
        loadingDraft={loadingDraft} publishing={publishing}
        preview={preview} canPreview={canPreview}
        onSave={handleManualSave} onPublish={handlePublish}
        onTogglePreview={() => setPreview((v) => !v)}
        role={role} originalAuthorId={originalAuthorId}
        originalAuthorName={originalAuthorName}
        userId={userId ?? null} displayName={displayName}
      />

      <EditorFeedback feedback={feedback} onClose={() => setFeedback(null)} />

      {loadingDraft ? (
        <div className="mx-auto max-w-6xl gap-8 px-6 py-10 pb-28 md:grid md:grid-cols-[1fr_320px] lg:pb-10">
          <main className="space-y-10">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-4 w-full animate-pulse rounded bg-text-heading/10" />
            ))}
          </main>
          <aside className="space-y-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-20 w-full animate-pulse rounded bg-text-heading/10" />
            ))}
          </aside>
        </div>
      ) : (
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 pb-28 md:grid-cols-[1fr_320px] lg:pb-10">
          <EditorForm
            draft={draft} onChange={set} show={show}
            preview={preview}
            newRef={newRef} setNewRef={setNewRef}
            onAddRef={() => {
              if (newRef.title.trim() === "") return;
              set("references", [...draft.references, newRef]);
              setNewRef({ sourceType: "primary-source", title: "", relatedClaim: "" });
            }}
            onRemoveRef={(i) => set("references", draft.references.filter((_, j) => j !== i))}
            activeSection={activeSection}
            onSectionClick={scrollToSection}
          />
          <EditorSidebar
            checklist={checklist} deadLinks={deadLinks}
            publishTried={publishTried} entryId={entryId}
            reloadKey={reloadKey}
            onRestore={(d) => setDraft(d)}
            userId={userId ?? null}
            linkSuggestionText={`${draft.visualExplanation} ${draft.technicalMeaning}`}
            onInsertLink={(term) => set("technicalMeaning", draft.technicalMeaning + (draft.technicalMeaning ? " " : "") + `[[${term}]]`)}
          />
        </div>
      )}

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-accent/15 bg-bg/90 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-3xl items-center gap-2">
          <button onClick={handleManualSave} disabled={loadingDraft || publishing}
            className="flex-1 min-h-[44px] rounded-md border border-text-heading/20 px-3 py-2 text-sm text-text-heading hover:border-accent hover:bg-accent/5 transition-colors disabled:opacity-40">
            บันทึก
          </button>
          <button onClick={() => setPreview((v) => !v)} disabled={!canPreview || loadingDraft}
            className="flex-1 min-h-[44px] rounded-md border border-text-heading/20 px-3 py-2 text-sm text-text-heading hover:border-accent hover:bg-accent/5 transition-colors disabled:opacity-40">
            {preview ? "ปิดพรีวิว" : "พรีวิว"}
          </button>
          <button onClick={handlePublish} disabled={publishing || loadingDraft}
            className="flex-1 min-h-[44px] rounded-md bg-accent px-3 py-2 text-sm font-semibold text-text-inverse hover:brightness-110 transition-all disabled:opacity-50">
            {publishing ? "..." : "เผยแพร่"}
          </button>
        </div>
      </div>
    </div>
  );
}
