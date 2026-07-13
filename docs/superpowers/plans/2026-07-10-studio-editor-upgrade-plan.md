# Studio Editor Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Upgrade Studio Editor with SVG icons, content-type-aware validation, color/contrast improvements, and better feedback.

**Architecture:** Create 8 new components for icon mapping, header, form, sidebar, feedback, status, section indicator, and publish checklist. Refactor 726-line page.tsx into an orchestrator. Replace emoji with SVG icons across all studio pages. Make publish validation content-type-aware.

**Tech Stack:** Next.js 16, React 19, Tailwind v4, TypeScript

## Global Constraints

- All icons from `src/components/icons.tsx` (60+ SVG icons, 1.5px stroke, round caps/joins, currentColor, no fill)
- EditorIcon maps Material Symbols names (from cosmology.ts) to actual SVG components — not Material Symbols font/ligatures
- No changes to global chrome (site-header, site-footer, app/layout, app/template)
- Editor draft state, server actions, URL params remain in orchestrator (page.tsx)
- All UI text in Thai (ยกเว้น proper nouns และศัพท์วิชาการ)
- Fallback สำหรับชื่อ icon ที่ไม่มี mapping → ◆ diamond

---

### Task 1: EditorIcon Component

**Files:**
- Create: `src/components/studio/editor-icon.tsx`

**Interfaces:**
- Produces: `<EditorIcon name="psychology" accent="#xxx" className="w-5 h-5" />`

- [ ] **Step 1: Create EditorIcon with full mapping**

```tsx
"use client";

import {
  ConceptIcon, PersonIcon, BookIcon, SchoolIcon, SymbolIcon,
  TermIcon, SourceIcon, QuoteIcon, EditIcon, CheckIcon,
  ClockIcon, ArrowLeftIcon,
} from "@/components/icons";

type Props = {
  name: string;
  accent?: string;
  className?: string;
};

const ICON_MAP: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  psychology: ConceptIcon,
  person: PersonIcon,
  menu_book: BookIcon,
  groups_2: SchoolIcon,
  category: SymbolIcon,
  tag: TermIcon,
  newspaper: SourceIcon,
  article: SourceIcon,
  format_quote: QuoteIcon,
  edit_note: EditIcon,
  check_circle: CheckIcon,
  verified: CheckIcon,
  schedule: ClockIcon,
  report: ClockIcon,
  inventory_2: ClockIcon,
  eco: ConceptIcon,
  language: SourceIcon,
  layers: BookIcon,
  arrow_left: ArrowLeftIcon,
};

export function EditorIcon({ name, accent, className = "h-5 w-5" }: Props) {
  const IconComponent = ICON_MAP[name];
  if (!IconComponent) {
    return (
      <span
        className={`inline-flex items-center justify-center ${className}`}
        style={{ color: accent }}
        aria-hidden="true"
      >
        ◆
      </span>
    );
  }
  return <IconComponent className={className} style={accent ? { color: accent } : undefined} />;
}
```

- [ ] **Step 2: Verify file is saved correctly**

Read the created file and confirm no syntax errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/studio/editor-icon.tsx
git commit -m "feat(studio): add EditorIcon component mapping cosmology names to SVG icons"
```

---

### Task 2: Editor CSS Variables

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Add editor CSS variables**

Find the `@theme` block in `globals.css` and add editor-specific tokens:

```css
/* Editor */
--editor-input-bg: color-mix(in srgb, var(--color-text-heading) 25%, transparent);
--editor-input-border: color-mix(in srgb, var(--color-text-heading) 20%, transparent);
--editor-input-focus: var(--color-accent);
--editor-label: var(--color-text-body);
```

- [ ] **Step 2: Commit**

```bash
git add src/app/globals.css
git commit -m "feat(studio): add editor CSS variables for input/contrast theming"
```

---

### Task 3: Content-Type-Aware Publish Validation

**Files:**
- Modify: `src/lib/content/publish-validation.ts`

**Interfaces:**
- Consumes: `getPublishChecklist(d: EditorDraft)` — old signature
- Produces: `getPublishChecklist(d: EditorDraft, contentType: string)` — new signature

- [ ] **Step 1: Update `getPublishChecklist` to accept `contentType` and return type-aware items**

```typescript
export function getPublishChecklist(d: EditorDraft, contentType?: string): ChecklistItem[] {
  const ct = contentType || d.contentType;
  const hasRefsOrNeedsCheck =
    d.references.length > 0 || d.status === "needs-source-check";
  const hasRoots =
    d.rootsEtymology.trim() !== "" || d.rootsCaution.trim() !== "";
  const isArticle = ct === "article";
  const isConcept = ct === "concept";
  const isPerson = ct === "person";
  const isBook = ct === "book";
  const isTerm = ct === "term";
  const isSymbol = ct === "symbol";
  const isSchool = ct === "school";

  return [
    { label: "มี Title", ok: d.title.trim() !== "" },
    { label: "มี Slug", ok: d.slug.trim() !== "" },
    { label: "มี Content Type", ok: d.contentType !== "" },
    {
      label: "มี Framework",
      ok: isTerm || isSymbol ? true : d.framework.trim() !== "",
    },
    {
      label: "มีคำอธิบายให้เห็นภาพ",
      ok: isArticle || isConcept || isSymbol || isTerm ? d.visualExplanation.trim() !== "" : true,
    },
    {
      label: "มีความหมายทางวิชาการ / เทคนิค",
      ok: isArticle || isConcept || isPerson ? d.technicalMeaning.trim() !== "" : true,
    },
    {
      label: "มี Related Concepts อย่างน้อย 1",
      ok: isTerm || isSymbol ? true : d.relatedConcepts.length > 0,
    },
    {
      label: "มี References หรือ Status = Needs Source Check",
      ok: hasRefsOrNeedsCheck,
    },
    {
      label: "มี Roots หรือเหตุผลที่ยังไม่ใส่",
      ok: isArticle || isConcept ? hasRoots : true,
    },
    {
      label: "มีเนื้อหา (Body Markdown)",
      ok: isArticle ? d.bodyMarkdown.trim() !== "" : true,
    },
  ];
}
```

Also update the callers. Find `canPublish(getPublishChecklist(draft))` in `page.tsx` and add content-type:

```typescript
if (!canPublish(getPublishChecklist(draft, draft.contentType))) {
```

And update the `checklist` variable on the same component:

```typescript
const checklist = getPublishChecklist(draft, draft.contentType);
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/content/publish-validation.ts
git commit -m "refactor(studio): make publish checklist content-type-aware"
```

---

### Task 4: EditorStatusBar

**Files:**
- Create: `src/components/studio/editor-status-bar.tsx`

**Interfaces:**
- Consumes: `autoState: "idle"|"saving"|"saved"`, `savedAt: string|null`
- Produces: rendered status bar inline component

- [ ] **Step 1: Create EditorStatusBar component**

```tsx
"use client";

import { EditorIcon } from "@/components/studio/editor-icon";

type Props = {
  autoState: "idle" | "saving" | "saved";
  savedAt: string | null;
};

export function EditorStatusBar({ autoState, savedAt }: Props) {
  if (autoState === "idle" && !savedAt) return null;

  if (autoState === "saving") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-2.5 py-0.5 text-xs text-accent">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
        </span>
        กำลังบันทึกอัตโนมัติ...
      </span>
    );
  }

  if (autoState === "saved" && savedAt) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-0.5 text-xs text-success">
        <EditorIcon name="check_circle" className="h-3 w-3" />
        บันทึกแล้ว {savedAt}
      </span>
    );
  }

  return null;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/studio/editor-status-bar.tsx
git commit -m "feat(studio): add EditorStatusBar for persistent save state indicator"
```

---

### Task 5: SectionIndicator

**Files:**
- Create: `src/components/studio/section-indicator.tsx`

**Interfaces:**
- Consumes: `sections: { id: string; label: string; visible: boolean; active: boolean }[]`
- Produces: rendered breadcrumb nav

- [ ] **Step 1: Create SectionIndicator component**

```tsx
"use client";

import { useCallback, useEffect, useState } from "react";

type Section = {
  id: string;
  label: string;
  visible: boolean;
};

type Props = {
  sections: Section[];
  activeSection: string;
  onSectionClick?: (id: string) => void;
};

export function SectionIndicator({ sections, activeSection, onSectionClick }: Props) {
  const visible = sections.filter((s) => s.visible);
  if (visible.length <= 1) return null;

  return (
    <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-xs" aria-label="ส่วนของฟอร์ม">
      {visible.map((s, i) => (
        <span key={s.id} className="flex items-center gap-1.5">
          {i > 0 ? <span className="text-text-secondary/40 mx-0.5">›</span> : null}
          <button
            type="button"
            onClick={() => onSectionClick?.(s.id)}
            className={`rounded-full px-2.5 py-0.5 transition-all ${
              s.id === activeSection
                ? "bg-accent/10 text-accent font-medium"
                : "text-text-secondary/60 hover:text-text-body"
            }`}
          >
            {s.label}
          </button>
        </span>
      ))}
    </nav>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/studio/section-indicator.tsx
git commit -m "feat(studio): add SectionIndicator for form navigation breadcrumb"
```

---

### Task 6: EditorFeedback

**Files:**
- Create: `src/components/studio/editor-feedback.tsx`

**Interfaces:**
- Consumes: `feedback: { type: "success"|"error"|"info"; title: string; message: string } | null`, `onClose: () => void`
- Produces: glass-effect center modal

- [ ] **Step 1: Create EditorFeedback component**

```tsx
"use client";

import { useEffect, useState } from "react";
import { EditorIcon } from "@/components/studio/editor-icon";

export type EditorFeedbackData = {
  type: "success" | "error" | "info";
  title: string;
  message: string;
};

type Props = {
  feedback: EditorFeedbackData | null;
  onClose: () => void;
};

export function EditorFeedback({ feedback, onClose }: Props) {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (!feedback) { setVisible(false); return; }
    setVisible(true);
    setLeaving(false);
    const t = setTimeout(() => {
      setLeaving(true);
      setTimeout(onClose, 300);
    }, feedback.type === "success" ? 3000 : 6000);
    return () => clearTimeout(t);
  }, [feedback, onClose]);

  useEffect(() => {
    if (!visible) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") { setLeaving(true); setTimeout(onClose, 300); }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [visible, onClose]);

  if (!visible || !feedback) return null;

  const accentMap = {
    success: "var(--color-success)",
    error: "var(--color-error)",
    info: "var(--color-accent)",
  };
  const iconMap = {
    success: "check_circle" as const,
    error: "report" as const,
    info: "edit_note" as const,
  };
  const accent = accentMap[feedback.type];
  const iconName = iconMap[feedback.type];

  return (
    <div
      className="fixed inset-0 z-toast flex items-center justify-center bg-bg/60 backdrop-blur-sm"
      onClick={() => { setLeaving(true); setTimeout(onClose, 300); }}
    >
      <div
        className={`pointer-events-auto mx-4 flex w-full max-w-sm flex-col items-center gap-4 rounded-xl border px-8 py-10 text-center shadow-[0_24px_80px_-16px_rgba(0,0,0,0.5)] backdrop-blur-2xl transition-all duration-300 ${
          leaving ? "scale-90 opacity-0" : "scale-100 opacity-100"
        }`}
        style={{ borderColor: `${accent}40`, backgroundColor: `color-mix(in srgb, ${accent} 6%, var(--color-bg))` }}
        onClick={(e) => e.stopPropagation()}
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-full" style={{ backgroundColor: `${accent}18` }}>
          <EditorIcon name={iconName} className="h-7 w-7" accent={accent} />
        </span>
        <div>
          <h3 className="text-base font-semibold" style={{ color: accent }}>{feedback.title}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">{feedback.message}</p>
        </div>
        <button
          type="button"
          onClick={() => { setLeaving(true); setTimeout(onClose, 300); }}
          className="mt-2 rounded-md px-5 py-2 text-sm font-medium text-text-inverse transition-all hover:brightness-110"
          style={{ backgroundColor: accent }}
        >
          ปิด
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/studio/editor-feedback.tsx
git commit -m "feat(studio): add EditorFeedback glass-effect center modal for publish/save feedback"
```

---

### Task 7: PublishChecklist

**Files:**
- Create: `src/components/studio/publish-checklist.tsx`

**Interfaces:**
- Consumes: `items: ChecklistItem[]`, `deadLinks: string[]`, `publishTried: boolean`
- Produces: rendered checklist panel

- [ ] **Step 1: Create PublishChecklist component**

```tsx
"use client";

import { EditorIcon } from "@/components/studio/editor-icon";
import type { ChecklistItem } from "@/lib/content/publish-validation";

type Props = {
  items: ChecklistItem[];
  deadLinks: string[];
  publishTried: boolean;
};

export function PublishChecklist({ items, deadLinks, publishTried }: Props) {
  const ready = items.every((i) => i.ok);

  return (
    <div className="archron-panel p-5">
      <h3 className="font-serif text-base text-text-heading">Publish Checklist</h3>
      <ul className="mt-3 space-y-2 text-sm">
        {items.map((c) => (
          <li key={c.label} className={`flex items-center gap-2 ${c.ok ? "text-text-body" : "text-text-secondary"}`}>
            <span className={c.ok ? "text-success" : "text-error"}>
              <EditorIcon name={c.ok ? "check_circle" : "report"} className="h-3.5 w-3.5" />
            </span>
            {c.label}
          </li>
        ))}
      </ul>
      {deadLinks.length > 0 && (
        <p className="mt-3 text-xs text-error">
          ลิงก์เสีย {deadLinks.length}: {deadLinks.join(", ")}
        </p>
      )}
      {publishTried && (
        <p className={`mt-4 text-sm ${ready && deadLinks.length === 0 ? "text-success" : "text-error"}`}>
          {ready && deadLinks.length === 0
            ? "พร้อมเผยแพร่ — กดปุ่ม \"เผยแพร่\" ด้านบน"
            : "ยังเผยแพร่ไม่ได้ — ทำรายการที่ยังไม่ผ่าน / แก้ลิงก์เสียให้ครบ"}
        </p>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/studio/publish-checklist.tsx
git commit -m "feat(studio): add PublishChecklist component with icon support"
```

---

### Task 8: EditorHeader

**Files:**
- Create: `src/components/studio/editor-header.tsx`

**Interfaces:**
- Consumes: `draft: EditorDraft`, `autoState, savedAt, loadingDraft, publishing, preview, canPreview, onSave, onPublish, onTogglePreview, role, originalAuthorId, originalAuthorName, userId, displayName`
- Produces: sticky header bar

- [ ] **Step 1: Create EditorHeader component**

```tsx
"use client";

import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { EditorStatusBar } from "@/components/studio/editor-status-bar";
import { EditorIcon } from "@/components/studio/editor-icon";
import { statusMeta } from "@/lib/content/cosmology";
import { isAdmin } from "@/lib/content/roles";
import type { EditorDraft } from "@/lib/content/publish-validation";

type Props = {
  draft: EditorDraft;
  autoState: "idle" | "saving" | "saved";
  savedAt: string | null;
  loadingDraft: boolean;
  publishing: boolean;
  preview: boolean;
  canPreview: boolean;
  onSave: () => void;
  onPublish: () => void;
  onTogglePreview: () => void;
  role: string;
  originalAuthorId: string | null;
  originalAuthorName: string | null;
  userId: string | null;
  displayName: string | null;
};

export function EditorHeader({
  draft, autoState, savedAt, loadingDraft, publishing,
  preview, canPreview, onSave, onPublish, onTogglePreview,
  role, originalAuthorId, originalAuthorName, userId, displayName,
}: Props) {
  const status = statusMeta(draft.status);

  return (
    <div className="sticky top-0 z-40 border-b border-accent/15 bg-bg/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-6 py-3">
        <Link href="/studio" className="flex items-center gap-1.5 text-sm text-text-body hover:text-accent">
          <EditorIcon name="arrow_left" className="h-4 w-4" />
          กลับห้องเขียน
        </Link>

        <div className="flex items-center gap-3">
          <span className="flex items-center text-xs text-text-secondary">
            {displayName || "นักเขียน"}
          </span>
          <span
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold leading-[1.4]"
            style={{ backgroundColor: `${status.accent}1f`, color: status.accent }}
          >
            <EditorIcon name={draft.status === "published" ? "check_circle" : "edit_note"} className="h-3 w-3" />
            {draft.status}
          </span>
          <EditorStatusBar autoState={autoState} savedAt={savedAt} />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onSave}
            disabled={loadingDraft || publishing}
            className="rounded-md border border-text-heading/20 px-4 py-2 text-sm text-text-heading hover:border-accent hover:bg-accent/5 transition-colors disabled:opacity-40"
          >
            บันทึก + เวอร์ชัน
          </button>
          <button
            onClick={onTogglePreview}
            disabled={!canPreview || loadingDraft}
            className="rounded-md border border-text-heading/20 px-4 py-2 text-sm text-text-heading hover:border-accent hover:bg-accent/5 transition-colors disabled:opacity-40"
          >
            {preview ? "ปิดพรีวิว" : "พรีวิว"}
          </button>
          <button
            onClick={onPublish}
            disabled={publishing || loadingDraft}
            className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-text-inverse hover:brightness-110 transition-all disabled:opacity-50"
          >
            {publishing ? "กำลังเผยแพร่..." : "เผยแพร่"}
          </button>
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>

      {isAdmin(role) && originalAuthorId && originalAuthorId !== userId && (
        <div className="mx-auto max-w-6xl px-6 pb-2">
          <div className="rounded-md border border-accent/30 bg-accent/5 px-3 py-2 text-xs text-accent">
            <EditorIcon name="edit_note" className="mr-1 inline h-3.5 w-3.5 align-middle" />
            กำลังแก้ไขเนื้อหาของ: <span className="font-semibold">{originalAuthorName || originalAuthorId}</span>
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/studio/editor-header.tsx
git commit -m "feat(studio): add EditorHeader with status bar, icons, and admin notice"
```

---

### Task 9: EditorForm

**Files:**
- Create: `src/components/studio/editor-form.tsx`

**Interfaces:**
- Consumes: `draft: EditorDraft`, `onChange: (key, value) => void`, `show: Record<string, boolean>`, `ref, setRef`, `onAddRef, onRemoveRef`
- Produces: all form sections

- [ ] **Step 1: Create EditorForm with all sections**

```tsx
"use client";

import { EditorIcon } from "@/components/studio/editor-icon";
import { SectionIndicator } from "@/components/studio/section-indicator";
import { SearchableSelect } from "@/components/studio/searchable-select";
import { SearchableMultiSelect } from "@/components/studio/searchable-multi-select";
import { RelatedConceptPicker } from "@/components/studio/related-concept-picker";
import { ImagePicker } from "@/components/studio/image-picker";
import { MarkdownRenderer } from "@/components/reading/markdown-renderer";
import {
  contentTypeMeta, statusMeta, difficultyMeta,
  sourceTypeMeta, frameworkMeta,
} from "@/lib/content/cosmology";
import { slugify, type EditorDraft, type EditorReference } from "@/lib/content/publish-validation";
import { SCHOOLS } from "@/lib/content/schools";
import { THEME_TAG_SUGGESTIONS } from "@/lib/content/themes";
import { useEffect, useState } from "react";

const CONTENT_TYPES = [
  "article", "concept", "reading-set", "source-note",
  "person", "book", "school", "symbol", "term",
];
const STATUSES = [
  "draft", "needs-source-check", "ready-to-publish", "published", "archived",
];
const FRAMEWORKS = [
  "Analytical Psychology", "Depth Psychology", "Psychoanalysis", "Philosophy",
  "Existentialism", "Phenomenology", "Symbol / Myth", "Comparative Thought",
  "Editorial Interpretation",
];
const DIFFICULTIES = ["beginner", "intermediate", "advanced", "source-note"];
const SOURCE_TYPES = [
  "primary-source", "secondary-source", "commentary",
  "editorial-interpretation", "website", "dictionary-lexicon", "other",
];
const BASE_TAG_OPTIONS = [
  "jung", "freud", "lacan", "concept", "ego", "shadow", "persona", "self",
  "archetype", "unconscious", "collective-unconscious", "individuation",
  "complex", "projection", "symbol", "myth", "philosophy", "psychoanalysis",
  "depth-psychology", "source-note", "beginner", "intermediate", "advanced",
];
const TAG_OPTIONS = Array.from(new Set([...BASE_TAG_OPTIONS, ...THEME_TAG_SUGGESTIONS]));
const THINKER_OPTIONS = SCHOOLS.flatMap((s) =>
  s.thinkers.map((t) => ({ value: t.nameEn, label: `${t.nameTh} (${t.nameEn})` }))
);
const SCHOOL_OPTIONS = SCHOOLS.map((s) => ({
  value: s.id, label: `${s.nameTh} (${s.nameEn})`,
}));

function thinkerMeta() { return { icon: "person", accent: "var(--color-accent)" }; }
function schoolMeta() { return { icon: "groups_2", accent: "var(--color-accent)" }; }

function Label({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return <label htmlFor={htmlFor} className="mb-1 block text-sm font-medium text-text-body">{children}</label>;
}

const inputClass =
  "w-full rounded-md border border-text-heading/20 bg-text-heading/25 px-3 py-2 text-text-heading outline-none placeholder:text-text-secondary/60 focus:border-accent/50 focus:ring-2 focus:ring-accent/30 transition-colors";

const textareaClass = `${inputClass} resize-y`;

type Props = {
  draft: EditorDraft;
  onChange: <K extends keyof EditorDraft>(key: K, value: EditorDraft[K]) => void;
  show: Record<string, boolean>;
  preview: boolean;
  onTogglePreview: () => void;
  ref: EditorReference;
  setRef: (r: EditorReference) => void;
  onAddRef: () => void;
  onRemoveRef: (i: number) => void;
  activeSection: string;
  onSectionClick: (id: string) => void;
};

export function EditorForm({
  draft, onChange, show, preview, onTogglePreview,
  ref, setRef, onAddRef, onRemoveRef, activeSection, onSectionClick,
}: Props) {
  const typeMeta = contentTypeMeta(draft.contentType);
  const ct = draft.contentType;

  const sections = [
    { id: "basic", label: "ข้อมูลพื้นฐาน", visible: true },
    { id: "framework", label: "กรอบทฤษฎี", visible: show.framework },
    { id: "content", label: "เนื้อหา", visible: true },
    { id: "cover", label: "ภาพปก", visible: show.coverImage },
    { id: "related", label: "แนวคิดที่เกี่ยวข้อง", visible: show.relatedConcepts },
    { id: "references", label: "เอกสารอ้างอิง", visible: true },
    { id: "roots", label: "Roots", visible: show.roots },
  ];

  return (
    <main className="space-y-10">
      <SectionIndicator sections={sections} activeSection={activeSection} onSectionClick={onSectionClick} />

      {/* Basic Info */}
      <section id="basic" className="space-y-4" data-section="basic">
        <h2 className="font-serif text-xl text-text-heading">ข้อมูลพื้นฐาน</h2>
        <div>
          <Label htmlFor="entry-title">Title</Label>
          <input id="entry-title" className={inputClass} value={draft.title} onChange={(e) => onChange("title", e.target.value)} placeholder="เช่น Psyche ในจิตวิทยาเชิงลึก" />
        </div>
        <div>
          <Label htmlFor="entry-slug">Slug</Label>
          <div className="flex gap-2">
            <input id="entry-slug" className={inputClass} value={draft.slug} onChange={(e) => onChange("slug", e.target.value)} placeholder="concept" />
            <button onClick={() => onChange("slug", slugify(draft.title))} className="shrink-0 rounded-md border border-text-heading/20 px-3 py-2 text-sm text-text-body hover:border-accent hover:bg-accent/5 transition-colors">สร้างจากชื่อ</button>
          </div>
        </div>
        {show.shortDesc && (
          <div>
            <Label htmlFor="entry-short-description">คำอธิบายสั้น / นิยามย่อ</Label>
            <input id="entry-short-description" className={inputClass} value={draft.shortDescription} onChange={(e) => onChange("shortDescription", e.target.value)} placeholder="คำอธิบายสั้นๆ สำหรับแสดงบนการ์ด" />
          </div>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          {show.status && (
            <div>
              <Label htmlFor="entry-status">Status</Label>
              <SearchableSelect id="entry-status" value={draft.status} onChange={(v) => onChange("status", v)} options={STATUSES} placeholder="เลือกสถานะ" meta={statusMeta} placement="top" />
            </div>
          )}
          {show.contentType && (
            <div>
              <Label htmlFor="entry-content-type">Content Type</Label>
              <SearchableSelect id="entry-content-type" value={draft.contentType} onChange={(v) => onChange("contentType", v)} options={CONTENT_TYPES} placeholder="เลือกประเภทเนื้อหา" meta={contentTypeMeta} placement="top" />
              {draft.contentType ? (
                <span
                  className="mt-2 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold leading-[1.4]"
                  style={{ backgroundColor: `${typeMeta.accent}1f`, color: typeMeta.accent }}
                >
                  <EditorIcon name={typeMeta.icon} className="h-3 w-3" />
                  {typeMeta.label}
                </span>
              ) : null}
            </div>
          )}
        </div>
      </section>

      {/* Framework */}
      {show.framework && (
        <section id="framework" className="space-y-4" data-section="framework">
          <h2 className="font-serif text-xl text-text-heading">กรอบทฤษฎี</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="entry-framework">Framework</Label>
              <SearchableSelect id="entry-framework" value={draft.framework} onChange={(v) => onChange("framework", v)} options={FRAMEWORKS} placeholder="เลือกหรือสร้างกรอบทฤษฎี" meta={frameworkMeta} allowCustom placement="top" />
            </div>
            {show.difficulty && (
              <div>
                <Label htmlFor="entry-difficulty">Difficulty</Label>
                <SearchableSelect id="entry-difficulty" value={draft.difficulty} onChange={(v) => onChange("difficulty", v)} options={DIFFICULTIES} placeholder="เลือกระดับ" meta={difficultyMeta} placement="top" />
              </div>
            )}
          </div>
          {show.mainThinker && (
            <div>
              <Label htmlFor="entry-main-thinker">นักคิดหลัก</Label>
              <SearchableSelect id="entry-main-thinker" value={draft.mainThinker} onChange={(v) => onChange("mainThinker", v)} options={THINKER_OPTIONS} placeholder="เลือกหรือค้นหานักคิดที่เกี่ยวข้อง" meta={thinkerMeta} allowCustom placement="top" />
            </div>
          )}
          {show.school && (
            <div>
              <Label htmlFor="entry-school">สำนักคิดที่สังกัด</Label>
              <SearchableSelect id="entry-school" value={draft.school} onChange={(v) => onChange("school", v)} options={SCHOOL_OPTIONS} placeholder="เลือกหรือระบุสำนักคิด" meta={schoolMeta} allowCustom placement="top" />
            </div>
          )}
          <div>
            <Label>Tags</Label>
            <SearchableMultiSelect values={draft.tags} onChange={(v) => onChange("tags", v)} options={TAG_OPTIONS} />
          </div>
        </section>
      )}

      {!show.framework && show.tags && (
        <section className="space-y-4">
          <h2 className="font-serif text-xl text-text-heading">แท็ก</h2>
          <div>
            <Label>Tags</Label>
            <SearchableMultiSelect values={draft.tags} onChange={(v) => onChange("tags", v)} options={TAG_OPTIONS} />
          </div>
        </section>
      )}

      {/* Content */}
      <section id="content" className="space-y-4" data-section="content">
        <h2 className="font-serif text-xl text-text-heading">เนื้อหา</h2>
        {show.visualExplanation && (
          <div>
            <Label htmlFor="entry-visual-explanation">คำอธิบายให้เห็นภาพ</Label>
            <textarea id="entry-visual-explanation" className={textareaClass} rows={4} value={draft.visualExplanation} onChange={(e) => onChange("visualExplanation", e.target.value)} placeholder="อธิบายด้วยภาษาที่เห็นภาพ" />
          </div>
        )}
        {show.technicalMeaning && (
          <div>
            <Label htmlFor="entry-technical-meaning">ความหมายทางวิชาการ / เทคนิค</Label>
            <textarea id="entry-technical-meaning" className={textareaClass} rows={4} value={draft.technicalMeaning} onChange={(e) => onChange("technicalMeaning", e.target.value)} placeholder="นิยามเชิงทฤษฎี" />
          </div>
        )}
        {show.bodyMarkdown && (
          <div>
            <Label htmlFor="entry-body-markdown">เนื้อหาเต็ม (Markdown)</Label>
            <textarea
              id="entry-body-markdown"
              className={`${textareaClass} font-mono text-sm leading-relaxed`}
              rows={16}
              value={draft.bodyMarkdown}
              onChange={(e) => onChange("bodyMarkdown", e.target.value)}
              placeholder="เขียนเนื้อหาแบบ Markdown"
            />
            <p className="mt-1 text-xs text-text-secondary">{"รองรับ Markdown + GFM · กด \"พรีวิว\" เพื่อดูผลลัพธ์"}</p>
          </div>
        )}
      </section>

      {/* Cover Image */}
      {show.coverImage && (
        <section id="cover" className="space-y-4" data-section="cover">
          <h2 className="font-serif text-xl text-text-heading">ภาพปก</h2>
          <ImagePicker
            value={draft.coverImage}
            onChange={(url) => onChange("coverImage", url)}
            onRemove={() => onChange("coverImage", "")}
            entryId={draft.id || undefined}
          />
        </section>
      )}

      {/* Related Concepts */}
      {show.relatedConcepts && (
        <section id="related" className="space-y-3" data-section="related">
          <h2 className="font-serif text-xl text-text-heading">แนวคิดที่เกี่ยวข้อง</h2>
          <p className="text-sm text-text-secondary">ค้นหาจาก Concept Registry แล้วระบุความสัมพันธ์ + เหตุผล</p>
          <RelatedConceptPicker value={draft.relatedConcepts} onChange={(v) => onChange("relatedConcepts", v)} />
        </section>
      )}

      {/* References */}
      <section id="references" className="space-y-3" data-section="references">
        <h2 className="font-serif text-xl text-text-heading">เอกสารอ้างอิง</h2>
        {draft.references.map((r, i) => (
          <div key={i} className="flex items-start justify-between gap-3 rounded-md archron-panel p-3">
            <div className="text-sm text-text-body">
              <span className="inline-flex items-center gap-1 text-xs" style={{ color: sourceTypeMeta(r.sourceType).accent }}>
                <EditorIcon name={sourceTypeMeta(r.sourceType).icon} className="h-3 w-3" />
                {r.sourceType}
              </span>
              <span className="ml-2 text-text-heading">{r.title}</span>
              {r.relatedClaim ? <p className="mt-1 text-text-secondary">รองรับ: {r.relatedClaim}</p> : null}
            </div>
            <button onClick={() => onRemoveRef(i)} className="rounded-md px-2 py-1 text-xs text-error hover:bg-error/10 transition-colors">ลบ</button>
          </div>
        ))}
        <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_2fr_auto]">
          <SearchableSelect value={ref.sourceType} onChange={(v) => setRef({ ...ref, sourceType: v })} options={SOURCE_TYPES} placeholder="ชนิดแหล่ง" meta={sourceTypeMeta} placement="top" />
          <input className={inputClass} value={ref.title} onChange={(e) => setRef({ ...ref, title: e.target.value })} placeholder="ชื่อแหล่ง/งาน" aria-label="ชื่อแหล่ง/งาน" />
          <input className={inputClass} value={ref.relatedClaim} onChange={(e) => setRef({ ...ref, relatedClaim: e.target.value })} placeholder="รองรับ claim ใด" aria-label="รองรับ claim ใด" />
          <button onClick={onAddRef} className="rounded-md border border-text-heading/20 px-3 py-2 text-sm text-text-body hover:border-accent hover:bg-accent/5 transition-colors">เพิ่ม</button>
        </div>
      </section>

      {/* Roots */}
      {show.roots && (
        <section id="roots" className="space-y-4" data-section="roots">
          <h2 className="font-serif text-xl text-text-heading">Roots — ที่มาของคำ</h2>
          <div><Label htmlFor="entry-roots-etymology">รากศัพท์ (Etymology)</Label><textarea id="entry-roots-etymology" className={textareaClass} rows={2} value={draft.rootsEtymology} onChange={(e) => onChange("rootsEtymology", e.target.value)} /></div>
          <div><Label htmlFor="entry-roots-meaning-shift">การเปลี่ยนความหมาย</Label><textarea id="entry-roots-meaning-shift" className={textareaClass} rows={2} value={draft.rootsMeaningShift} onChange={(e) => onChange("rootsMeaningShift", e.target.value)} /></div>
          <div><Label htmlFor="entry-roots-caution">ข้อควรระวัง</Label><textarea id="entry-roots-caution" className={textareaClass} rows={2} value={draft.rootsCaution} onChange={(e) => onChange("rootsCaution", e.target.value)} placeholder="อย่าใช้รากศัพท์แทนนิยามทฤษฎี" /></div>
        </section>
      )}

      {/* Preview */}
      {preview && (
        <section className="archron-panel p-6 max-w-[var(--measure)]">
          <p className="text-xs tracking-widest text-accent">
            <EditorIcon name="visibility" className="mr-1 inline h-3 w-3 align-middle" />
            พรีวิว (ไม่เผยแพร่)
          </p>
          {draft.title && <h3 className="mt-2 font-serif text-2xl text-text-heading">{draft.title}</h3>}
          {draft.coverImage && (
            <div className="mt-4">
              <img src={draft.coverImage} alt={draft.title || "ภาพปก"} className="h-48 w-full rounded-md object-cover" />
            </div>
          )}
          {draft.visualExplanation && <p className="mt-4 whitespace-pre-line text-text-body">{draft.visualExplanation}</p>}
          {draft.technicalMeaning && <p className="mt-3 whitespace-pre-line text-text-body">{draft.technicalMeaning}</p>}
          {draft.bodyMarkdown && draft.bodyMarkdown.trim() !== "" && (
            <div className="mt-5 border-t border-text-heading/10 pt-5">
              <MarkdownRenderer content={draft.bodyMarkdown} />
            </div>
          )}
        </section>
      )}
    </main>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/studio/editor-form.tsx
git commit -m "feat(studio): add EditorForm with sections, icon support, and section indicator"
```

---

### Task 10: EditorSidebar

**Files:**
- Create: `src/components/studio/editor-sidebar.tsx`

**Interfaces:**
- Consumes: `checklist, deadLinks, publishTried, entryId, reloadKey, onRestore, userId, linkSuggestionText, onInsertLink`
- Produces: sidebar panel

- [ ] **Step 1: Create EditorSidebar component**

```tsx
"use client";

import { MyContentSearch } from "@/components/studio/my-content-search";
import { RevisionPanel } from "@/components/studio/revision-panel";
import { InternalLinkSuggestionPanel } from "@/components/studio/internal-link-suggestion-panel";
import { PublishChecklist } from "@/components/studio/publish-checklist";
import type { ChecklistItem } from "@/lib/content/publish-validation";

type Props = {
  checklist: ChecklistItem[];
  deadLinks: string[];
  publishTried: boolean;
  entryId: string | null;
  reloadKey: number;
  onRestore: (draft: any) => void;
  userId: string | null;
  linkSuggestionText: string;
  onInsertLink: (term: string) => void;
};

export function EditorSidebar({ checklist, deadLinks, publishTried, entryId, reloadKey, onRestore, userId, linkSuggestionText, onInsertLink }: Props) {
  return (
    <aside className="space-y-6 md:sticky md:top-20 md:self-start">
      <MyContentSearch userId={userId} />
      <div className="archron-panel p-5">
        <h3 className="font-serif text-base text-text-heading">คำแนะนำ</h3>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-text-secondary">
          <li>เขียนให้ชัด ไม่ลดทอนแนวคิดจนผิด</li>
          <li>เลี่ยงคำว่า ลึก/คม/ทรงพลัง ถ้าไม่อธิบายว่าอย่างไร</li>
          <li>แยกข้อเท็จจริง แหล่งที่มา และการตีความ</li>
          <li>{"autosave ทุก 2.5 วิ · กด \"บันทึก + เวอร์ชัน\" เพื่อเก็บ snapshot"}</li>
        </ul>
      </div>
      <PublishChecklist items={checklist} deadLinks={deadLinks} publishTried={publishTried} />
      <RevisionPanel entryId={entryId} reloadKey={reloadKey} onRestore={onRestore} />
      <InternalLinkSuggestionPanel
        text={linkSuggestionText}
        onInsert={onInsertLink}
      />
    </aside>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/studio/editor-sidebar.tsx
git commit -m "feat(studio): add EditorSidebar composing MyContentSearch, PublishChecklist, RevisionPanel"
```

---

### Task 11: Page Orchestrator Rewrite

**Files:**
- Modify: `src/app/studio/editor/page.tsx` (full rewrite)

**Interfaces:**
- Consumes: all components from Tasks 1-10
- Produces: working editor page

- [ ] **Step 1: Rewrite page.tsx as orchestrator**

```tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth, useUser, UserButton } from "@clerk/nextjs";
import { roleFromMetadata, canWrite, isAdmin } from "@/lib/content/roles";
import {
  EMPTY_DRAFT, getPublishChecklist, canPublish, slugify, type EditorDraft, type EditorReference,
} from "@/lib/content/publish-validation";
import {
  saveDraftAction, saveDraftWithRevisionAction, loadDraftAction,
  publishAction, revalidatePublic, listMyEntriesAction, loadRevisionsAction,
} from "@/features/editor/actions";
import { findDeadLinks } from "@/lib/content/internal-links";
import { getMyProfileAction } from "@/features/studio/actions/profile-actions";
import { ContentTypeSelector } from "@/components/studio/content-type-selector";
import { EditorHeader } from "@/components/studio/editor-header";
import { EditorForm } from "@/components/studio/editor-form";
import { EditorSidebar } from "@/components/studio/editor-sidebar";
import { EditorFeedback, type EditorFeedbackData } from "@/components/studio/editor-feedback";

export default function StudioEditorPage() {
  const { userId } = useAuth();
  const { user } = useUser();
  const searchParams = useSearchParams();

  const [draft, setDraft] = useState<EditorDraft>(EMPTY_DRAFT);
  const [entryId, setEntryId] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [autoState, setAutoState] = useState<"idle" | "saving" | "saved">("idle");
  const [feedback, setFeedback] = useState<EditorFeedbackData | null>(null);
  const [preview, setPreview] = useState(false);
  const [publishTried, setPublishTried] = useState(false);
  const [refState, setRefState] = useState<EditorReference>({ sourceType: "primary-source", title: "", relatedClaim: "" });
  const [publishing, setPublishing] = useState(false);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [loadingDraft, setLoadingDraft] = useState(false);
  const [showSelector, setShowSelector] = useState(true);
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

  // Load profile display name
  useEffect(() => {
    if (!userId) return;
    let active = true;
    (async () => {
      const p = await getMyProfileAction();
      if (active && p?.display_name) setDisplayName(p.display_name);
    })();
    return () => { active = false; };
  }, [userId]);

  // Load or create draft
  useEffect(() => {
    const slug = searchParams.get("slug");
    const type = searchParams.get("type");
    if (slug) {
      setShowSelector(false);
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
      setShowSelector(false);
      setDraft((d) => ({ ...d, id: crypto.randomUUID(), contentType: type }));
    }
  }, [searchParams]);

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
  const ready = canPublish(checklist);
  const canPreview = draft.title.trim() !== "" && draft.contentType !== "";

  // Scroll tracking for section indicator
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("[data-section]");
      let current = "basic";
      sections.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top <= 150) current = el.getAttribute("data-section") || current;
      });
      setActiveSection(current);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function scrollToSection(id: string) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // Role gate
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
          <Link href="/studio/profile" className="inline-flex items-center justify-center gap-2 bg-accent px-6 py-2.5 text-sm font-semibold text-text-inverse hover:brightness-110 transition-all">
            <EditorIcon name="edit_note" className="h-4 w-4" />
            ขอเป็นนักเขียน
          </Link>
          <Link href="/studio" className="inline-flex items-center justify-center gap-2 border border-accent/40 px-6 py-2.5 text-sm text-accent hover:bg-accent/10">
            กลับห้องเขียน
          </Link>
        </div>
      </main>
    );
  }

  // Content type selector
  if (showSelector) return <ContentTypeSelector />;

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
        userId={userId} displayName={displayName}
      />

      <EditorFeedback feedback={feedback} onClose={() => setFeedback(null)} />

      {loadingDraft ? (
        <div className="mx-auto max-w-6xl px-6 py-10 pb-28 md:grid-cols-[1fr_320px] lg:pb-10 md:grid gap-8">
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
            preview={preview} onTogglePreview={() => setPreview((v) => !v)}
            ref={refState} setRef={setRefState}
            onAddRef={() => {
              if (refState.title.trim() === "") return;
              set("references", [...draft.references, refState]);
              setRefState({ sourceType: "primary-source", title: "", relatedClaim: "" });
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
            userId={userId}
            linkSuggestionText={`${draft.visualExplanation} ${draft.technicalMeaning}`}
            onInsertLink={(term) => set("technicalMeaning", draft.technicalMeaning + (draft.technicalMeaning ? " " : "") + `[[${term}]]`)}
          />
        </div>
      )}

      {/* Mobile bottom bar */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-accent/15 bg-bg/90 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-3xl items-center gap-2">
          <button onClick={handleManualSave} disabled={loadingDraft || publishing}
            className="flex-1 rounded-md border border-text-heading/20 px-3 py-2 text-sm text-text-heading hover:border-accent hover:bg-accent/5 transition-colors disabled:opacity-40">
            บันทึก
          </button>
          <button onClick={() => setPreview((v) => !v)} disabled={!canPreview || loadingDraft}
            className="flex-1 rounded-md border border-text-heading/20 px-3 py-2 text-sm text-text-heading hover:border-accent hover:bg-accent/5 transition-colors disabled:opacity-40">
            {preview ? "ปิดพรีวิว" : "พรีวิว"}
          </button>
          <button onClick={handlePublish} disabled={publishing || loadingDraft}
            className="flex-1 rounded-md bg-accent px-3 py-2 text-sm font-semibold text-text-inverse hover:brightness-110 transition-all disabled:opacity-50">
            {publishing ? "..." : "เผยแพร่"}
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Build and lint check**

```bash
npm run lint
npm run build
```

Fix any errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/studio/editor/page.tsx
git commit -m "refactor(studio): rewrite editor page as orchestrator with decomposed components"
```

---

### Task 12: SearchableSelect — Use EditorIcon

**Files:**
- Modify: `src/components/studio/searchable-select.tsx`

- [ ] **Step 1: Replace ◆ with EditorIcon in searchable-select**

Replace the ◆ spans with `<EditorIcon>` in two places:

Line 94-101 (button display):
```tsx
{displayLabel && meta ? (
  <EditorIcon name={meta(value).icon} className="h-[1em] w-[1em] text-[18px]" />
) : null}
```

Line 148-155 (dropdown items):
```tsx
{meta ? <EditorIcon name={meta(o.value).icon} className="h-[1em] w-[1em] text-[18px]" /> : null}
```

Make sure to import `EditorIcon`:
```tsx
import { EditorIcon } from "@/components/studio/editor-icon";
```

Also remove the `OptionMeta` type's unused `icon` field if it's only used by EditorIcon now — actually keep it since `meta()` functions in `cosmology.ts` return it.

- [ ] **Step 2: Commit**

```bash
git add src/components/studio/searchable-select.tsx
git commit -m "feat(studio): replace diamond ◆ with EditorIcon in SearchableSelect"
```

---

### Task 13: SearchableMultiSelect — Use EditorIcon

**Files:**
- Modify: `src/components/studio/searchable-multi-select.tsx`

- [ ] **Step 1: Replace ✕ close button with EditorIcon**

Replace line 35:
```tsx
<EditorIcon name="close" className="h-3 w-3 text-accent/70 hover:text-accent" />
```

Wait — there's no CloseIcon in the icon map. Let me check... I'll add `close` to the EditorIcon map. Actually, let me add `✕` is just a text character. Let me keep it simple and just use a better ✕ or use the CloseIcon which is at `icons.tsx:277`.

Let me add `close` → CloseIcon mapping to EditorIcon.

Actually, I already have all the mapping in Task 1. Let me add `close` to the ICON_MAP in editor-icon.tsx. I'll do this as part of this task.

Edit `editor-icon.tsx`:
```tsx
import { ..., CloseIcon } from "@/components/icons";
// Add to ICON_MAP:
close: CloseIcon,
```

Then in searchable-multi-select.tsx:
```tsx
import { EditorIcon } from "@/components/studio/editor-icon";
// Replace:
<button type="button" ...>
  <EditorIcon name="close" className="h-3 w-3" />
</button>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/studio/searchable-multi-select.tsx src/components/studio/editor-icon.tsx
git commit -m "feat(studio): add close icon mapping, use EditorIcon in SearchableMultiSelect"
```

---

### Task 14: ContentTypeSelector — Use EditorIcon

**Files:**
- Modify: `src/components/studio/content-type-selector.tsx`

- [ ] **Step 1: Replace emoji/icons with EditorIcon**

Replace the inline emoji logic (lines 96-98):
```tsx
<EditorIcon name={meta.icon} className="h-6 w-6" />
```

Replace ✎ icon (line 71):
```tsx
<EditorIcon name="edit_note" className="h-12 w-12" />
```

Replace → arrow (line 130):
```tsx
<EditorIcon name="arrow_right" className="h-[1em] w-[1em]" />
```

Add `arrow_right` to EditorIcon ICON_MAP — use ArrowRightIcon from icons.tsx.

- [ ] **Step 2: Commit**

```bash
git add src/components/studio/content-type-selector.tsx src/components/studio/editor-icon.tsx
git commit -m "feat(studio): replace emoji with EditorIcon in ContentTypeSelector"
```

---

### Task 15: Studio Pages — Icon Migration

**Files:**
- Modify: `src/app/studio/page.tsx`
- Modify: `src/app/studio/dashboard/page.tsx`
- Modify: `src/app/studio/users/page.tsx`
- Modify: `src/app/studio/profile/page.tsx`

- [ ] **Step 1: Update studio home page**

Replace emoji in `app/studio/page.tsx`:
- `✎` → `<EditorIcon name="edit_note" />`
- `🛡` → `<EditorIcon name="edit_note" />` (admin badge)

- [ ] **Step 2: Update dashboard page**

Replace emoji in `app/studio/dashboard/page.tsx`:
- `🔒` → `<EditorIcon name="edit_note" />` (lock icon)
- `✎` → `<EditorIcon name="edit_note" />` (edit icon)

- [ ] **Step 3: Update users page**

Replace emoji in `app/studio/users/page.tsx`:
- `🛡` → `<EditorIcon name="edit_note" />`
- `✍` → `<EditorIcon name="edit_note" />`
- The line 149 emoji switch → use `EditorIcon name={meta.icon}`

- [ ] **Step 4: Update profile page**

Replace emoji in `app/studio/profile/page.tsx`:
- `✍` → `<EditorIcon name="edit_note" />`
- `✕` → `<EditorIcon name="close" />`

- [ ] **Step 5: Build and lint check**

```bash
npm run lint
npm run build
```

Fix any errors.

- [ ] **Step 6: Commit**

```bash
git add src/app/studio/page.tsx src/app/studio/dashboard/page.tsx src/app/studio/users/page.tsx src/app/studio/profile/page.tsx
git commit -m "feat(studio): migrate emoji to EditorIcon across all studio pages"
```

---

## Self-Review Checklist

- [ ] **Spec coverage**: Every section in the spec has at least one task (Icon → Task 1/12-15, Component decomposition → Tasks 8-11, Validation → Task 3, Color → Task 2, Feedback → Tasks 4-6)
- [ ] **Placeholder scan**: No TBD, TODO, "implement later" in any step
- [ ] **Type consistency**: EditorIcon name mapping uses same keys as cosmology.ts `icon` field values
