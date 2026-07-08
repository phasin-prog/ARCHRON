# ARCHRON Design System Gap Completion — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close all gaps between ARCHRON's current state and the Archron Humanizer design docs — colors, typography, icons, navigation, homepage, MDX, Academic Seals UI, and error states.

**Architecture:** Gap-driven completion (Approach A) — modify existing files in-place rather than rebuilding. 5 sequential phases with dependency order: foundation (colors/fonts/icons) → navigation+homepage → MDX → seals UI → error states+a11y.

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind v4, TypeScript, Vitest (unit tests), Playwright (e2e), Supabase, Clerk.

## Global Constraints

- **Thai-first:** All UI labels in Thai. English only for proper nouns (ARCHRON, Jung, Ego, Psychological Types) and academic terms.
- **Build/lint must pass:** `npm run build` and `npm run lint` must be green before any commit.
- **No `any` types:** Use explicit TypeScript types throughout.
- **Dark-only (light mode):** Single color system — light mode per `colors.md` dark column is NOT used; we keep the existing light mode palette but change primary accent from warm brown to Blue.
- **Custom SVG icons only:** No Material Symbols. All icons use `currentColor`, 2px stroke, 24×24 viewBox.
- **Routes unchanged:** Do not add, remove, or rename any routes.
- **No DB schema changes:** Academic Seals are UI-only. Do not touch `supabase/schema.sql`.
- **No secrets in code:** Use env variables only.

---

## Phase 1: Color + Typography + Icons

### Task 1: Change primary accent color from warm brown to Blue

**Files:**
- Modify: `app/globals.css:38-41` (accent tokens in `@theme` block)

**Interfaces:**
- Produces: CSS custom properties `--color-accent`, `--color-accent-hover`, `--color-accent-subtle` with new Blue values. All components using `text-accent`, `border-accent`, `bg-accent` inherit automatically.

- [ ] **Step 1: Read current accent values to confirm exact lines**

Run: `grep -n "color-accent" app/globals.css | head -10`
Expected: Shows lines 38-41 with `#8B5E3C`, `#7A4E2E`, `#F5EDE5`

- [ ] **Step 2: Replace accent tokens with Blue values**

In `app/globals.css`, replace lines 38-41:

```css
  /* ---- Academic (Accent) ---- */
  --color-accent: #5F8DCE;        /* Links, active elements — Blue primary */
  --color-accent-hover: #4F7DBE;  /* Hover state */
  --color-accent-subtle: #EEF2F8; /* Subtle background */
```

- [ ] **Step 3: Run build to verify no breakage**

Run: `npm run build`
Expected: Build completes successfully. If color contrast warnings appear, note them for Task 2.

- [ ] **Step 4: Run lint**

Run: `npm run lint`
Expected: No errors.

- [ ] **Step 5: Commit**

```bash
git add app/globals.css
git commit -m "feat: change primary accent from warm brown to Blue #5F8DCE"
```

---

### Task 2: Add Premium Gold tokens for featured/premium elements

**Files:**
- Modify: `app/globals.css:41` (add new tokens after accent block)

**Interfaces:**
- Produces: CSS custom properties `--color-premium`, `--color-premium-hover`, `--color-premium-subtle`. Used by Featured Guide badges, Companion/Patron seals, and premium UI elements only.

- [ ] **Step 1: Add premium gold tokens after the accent block**

In `app/globals.css`, after line 41 (`--color-accent-subtle`), add:

```css

  /* ---- Premium Gold (featured/premium only — per homepage-rule.md) ---- */
  --color-premium: #B89A63;        /* Featured badges, premium elements */
  --color-premium-hover: #A88A53;  /* Hover state */
  --color-premium-subtle: #F5EFE5; /* Subtle background */
```

- [ ] **Step 2: Run build**

Run: `npm run build`
Expected: Success.

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "feat: add Premium Gold tokens for featured/premium UI elements"
```

---

### Task 3: Add Lora font and change body to serif

**Files:**
- Modify: `app/layout.tsx:2-10` (add Lora import), `app/layout.tsx:62-68` (add Lora loader), `app/layout.tsx:98` (add Lora variable to html className)
- Modify: `app/globals.css:68-73` (change `--font-body` and add `--font-ui`)

**Interfaces:**
- Produces: `--font-lora` CSS variable, `--font-body` now resolves to serif (Lora + Noto Serif Thai), `--font-ui` resolves to sans (Inter + Noto Sans Thai). Body text becomes serif; UI elements (nav, button, badge) stay sans.

- [ ] **Step 1: Add Lora import and loader in layout.tsx**

In `app/layout.tsx`, add `Lora` to the import from `next/font/google` (line 2-10). Add after the `playfair` declaration (after line 68):

```typescript
const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-lora",
  display: "swap",
});
```

- [ ] **Step 2: Add Lora variable to html className**

In `app/layout.tsx` line 98, add `${lora.variable}` to the template string:

```typescript
className={`${inter.variable} ${notoSansThai.variable} ${ibmPlexSerif.variable} ${notoSerifThai.variable} ${ibmPlexThai.variable} ${playfair.variable} ${cinzel.variable} ${lora.variable}`}
```

- [ ] **Step 3: Change `--font-body` to serif and add `--font-ui` in globals.css**

In `app/globals.css`, replace lines 68-73:

```css
  /* Body = สาย Serif: Lora (อังกฤษ) + Noto Serif Thai (ไทย) — อ่านยาวสบายตา */
  --font-body: var(--font-lora), var(--font-noto-serif-thai), "Lora",
    "Noto Serif Thai", Georgia, serif;
  /* UI / Labels = สาย Sans: Inter + Noto Sans Thai */
  --font-ui: var(--font-inter), var(--font-noto-sans-thai), "Inter",
    "Noto Sans Thai", system-ui, sans-serif;
  /* alias เดิม — ให้ utility ที่มีอยู่ทำงานต่อโดยไม่ต้องแก้รายไฟล์ */
  --font-sans: var(--font-ui);
  --font-serif: var(--font-heading);
  --font-display: var(--font-playfair), "Playfair Display", Georgia, serif;
  --font-wordmark: var(--font-cinzel), "Cinzel", "Trajan Pro", Georgia, serif;
```

- [ ] **Step 4: Add `--font-ui` to nav/button/input/badge elements in globals.css**

In `app/globals.css`, after the `body` rule (around line 210-219), add:

```css
  /* UI elements use sans-serif font */
  nav,
  button,
  input,
  select,
  textarea,
  label,
  .badge,
  .chip,
  .tag,
  [role="button"] {
    font-family: var(--font-ui);
  }
```

- [ ] **Step 5: Run build and lint**

Run: `npm run build && npm run lint`
Expected: Success. Body text now renders in Lora (serif), UI elements in Inter (sans).

- [ ] **Step 6: Commit**

```bash
git add app/layout.tsx app/globals.css
git commit -m "feat: add Lora font, change body to serif, keep UI elements sans"
```

---

### Task 4: Remove Material Symbols stylesheet

**Files:**
- Modify: `app/layout.tsx:102-106` (remove Material Symbols link)
- Modify: `app/guide/page.tsx` (replace all `material-symbols-outlined` spans with custom icons)
- Grep: find all other files using `material-symbols` class

**Interfaces:**
- Consumes: Custom icon components from `components/icons.tsx`
- Produces: No more external Material Symbols dependency. All icons are inline SVG.

- [ ] **Step 1: Find all Material Symbols usage in the codebase**

Run: `grep -rn "material-symbols" --include="*.tsx" --include="*.ts" app/ components/`
Expected: List of all files using `material-symbols-outlined` class. Note each file and line.

- [ ] **Step 2: Remove Material Symbols link from layout.tsx**

In `app/layout.tsx`, delete lines 102-106 (the `<link rel="stylesheet" href="...Material+Symbols...">` and its eslint-disable comment).

- [ ] **Step 3: Replace Material Symbols in app/guide/page.tsx**

In `app/guide/page.tsx`, replace each `<span className="material-symbols-outlined ...">icon_name</span>` with the corresponding custom icon component from `components/icons.tsx`. Specifically:

- `chevron_right` → `<ArrowRightIcon className="h-4 w-4" />` (rotate 90deg if needed via style)
- `arrow_forward` → `<ArrowRightIcon className="h-[18px] w-[18px]" />`
- `compare_arrows` → `<SynthesisIcon className="h-6 w-6" />`
- `psychology` → `<PsychologyIcon className="h-6 w-6" />`
- `stacks` → `<GridIcon className="h-6 w-6" />`
- `bolt` → `<ConceptIcon className="h-6 w-6" />`
- `description` → `<AuthorPenIcon className="h-6 w-6" />`
- `schedule` → `<ClockIcon className="h-6 w-6" />`
- `call` → keep as text or use a simple phone icon
- `chat` → keep as text or use a simple chat icon
- `person` → `<PersonIcon className="h-5 w-5" />`
- `groups` → `<SchoolIcon className="h-5 w-5" />`
- `check_circle` → keep as styled checkmark or use `<CloseIcon />` rotated

Add necessary imports at top of file:
```typescript
import {
  ArrowRightIcon,
  SynthesisIcon,
  PsychologyIcon,
  GridIcon,
  ConceptIcon,
  AuthorPenIcon,
  ClockIcon,
  PersonIcon,
  SchoolIcon,
} from "@/components/icons";
```

For `call`, `chat`, `check_circle` that don't have direct equivalents, replace the Material Symbols span with a simple styled element (e.g., a small SVG inline or just remove the icon and keep the text label).

- [ ] **Step 4: Replace Material Symbols in all other files found in Step 1**

For each file found in Step 1, apply the same pattern: replace `<span className="material-symbols-outlined ...">name</span>` with the appropriate custom icon component.

- [ ] **Step 5: Run build and lint**

Run: `npm run build && npm run lint`
Expected: Success. No remaining `material-symbols` references.

- [ ] **Step 6: Verify no Material Symbols references remain**

Run: `grep -rn "material-symbols" --include="*.tsx" --include="*.ts" app/ components/`
Expected: No output (zero matches).

- [ ] **Step 7: Commit**

```bash
git add app/layout.tsx app/guide/page.tsx
git commit -m "refactor: remove Material Symbols, replace with custom SVG icons"
```

---

### Task 5: Add missing icons (CollectionIcon, NotificationIcon)

**Files:**
- Modify: `components/icons.tsx` (add two new icon exports)

**Interfaces:**
- Produces: `CollectionIcon` (4-square grid) and `NotificationIcon` (bell) — both accept `IconProps` (`{ className?: string; style?: React.CSSProperties }`), use `currentColor`, 2px stroke, 24×24 viewBox.

- [ ] **Step 1: Add CollectionIcon to icons.tsx**

In `components/icons.tsx`, add at the end (before the final export block if any, or just at the end):

```tsx
// CollectionIcon — 4-square grid (Collection object type)
export function CollectionIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}
```

- [ ] **Step 2: Add NotificationIcon to icons.tsx**

```tsx
// NotificationIcon — bell (notifications)
export function NotificationIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}
```

- [ ] **Step 3: Run build and lint**

Run: `npm run build && npm run lint`
Expected: Success.

- [ ] **Step 4: Commit**

```bash
git add components/icons.tsx
git commit -m "feat: add CollectionIcon and NotificationIcon to icon library"
```

---

### Task 6: Create IconBox container component

**Files:**
- Create: `components/icon-box.tsx`

**Interfaces:**
- Consumes: `React.ReactNode` (an icon component passed as `icon` prop)
- Produces: `IconBox` component with props `{ icon: React.ReactNode; size?: "sm" | "md" | "lg"; variant?: "default" | "knowledge" | "featured" | "success"; onClick?: () => void; className?: string }`. Uses CSS classes `.archron-icon-box` with size/variant modifiers.

- [ ] **Step 1: Create the IconBox component**

Create `components/icon-box.tsx`:

```tsx
interface IconBoxProps {
  icon: React.ReactNode;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "knowledge" | "featured" | "success";
  onClick?: () => void;
  className?: string;
}

export function IconBox({
  icon,
  size = "md",
  variant = "default",
  onClick,
  className = "",
}: IconBoxProps) {
  const sizeClass = `archron-icon-box--${size}`;
  const variantClass = variant !== "default" ? `archron-icon-box--${variant}` : "";
  const classes = `archron-icon-box ${sizeClass} ${variantClass} ${className}`.trim();

  if (onClick) {
    return (
      <button type="button" className={classes} onClick={onClick}>
        {icon}
      </button>
    );
  }

  return <div className={classes}>{icon}</div>;
}
```

- [ ] **Step 2: Add IconBox CSS to globals.css**

In `app/globals.css`, add at the end of the file (or in an appropriate `@layer components` section):

```css
/* ============================================
   ICON CONTAINER — per icon-system.md
   ============================================ */
.archron-icon-box {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: var(--radius-md);
  background-color: var(--color-bg-card);
  border: 1px solid var(--color-border);
  box-sizing: border-box;
  transition: all var(--dur-fast) var(--ease-out);
  cursor: pointer;
}

.archron-icon-box:hover {
  border-color: var(--color-accent);
  background-color: var(--color-bg-elevated);
}

.archron-icon-box:active {
  transform: scale(0.98);
}

.archron-icon-box svg,
.archron-icon-box div {
  color: var(--color-text-body);
  transition: color var(--dur-fast) var(--ease-out);
}

.archron-icon-box:hover svg,
.archron-icon-box:hover div {
  color: var(--color-accent);
}

.archron-icon-box--sm {
  width: 48px;
  height: 48px;
}

.archron-icon-box--md {
  width: 64px;
  height: 64px;
}

.archron-icon-box--lg {
  width: 80px;
  height: 80px;
}

.archron-icon-box--knowledge {
  border-color: var(--color-secondary, var(--color-accent));
}

.archron-icon-box--featured {
  border-color: var(--color-premium);
}

.archron-icon-box--featured:hover {
  border-color: var(--color-premium-hover);
  background-color: var(--color-premium-subtle);
}

.archron-icon-box--success {
  border-color: var(--color-success);
}
```

- [ ] **Step 3: Run build and lint**

Run: `npm run build && npm run lint`
Expected: Success.

- [ ] **Step 4: Commit**

```bash
git add components/icon-box.tsx app/globals.css
git commit -m "feat: add IconBox container component with size and variant modifiers"
```

---

### Task 7: Create icon preview page

**Files:**
- Create: `app/icons/page.tsx`
- Create: `app/icons/layout.tsx` (if needed for metadata)

**Interfaces:**
- Consumes: All icon exports from `components/icons.tsx`, `IconBox` from `components/icon-box.tsx`
- Produces: Route `/icons` showing all icons with search, size selector, variant selector.

- [ ] **Step 1: Create the icon preview page**

Create `app/icons/page.tsx`:

```tsx
import type { Metadata } from "next";
import {
  ArchronMark,
  ArchronLogomark,
  ConceptIcon,
  PersonIcon,
  BookIcon,
  SchoolIcon,
  SymbolIcon,
  TermIcon,
  SourceIcon,
  PathIcon,
  ArticleIcon,
  SearchIcon,
  MenuIcon,
  ArrowRightIcon,
  KnowledgeHubIcon,
  ManifestoIcon,
  QuoteIcon,
  ExternalLinkIcon,
  HelpIcon,
  HeartIcon,
  CloseIcon,
  LoginIcon,
  EditIcon,
  LogoutIcon,
  PsychologyIcon,
  PhilosophyIcon,
  AnthropologyIcon,
  HistoryIcon,
  LanguageIcon,
  MythologyIcon,
  ReligionIcon,
  ScienceIcon,
  SymbolismIcon,
  ArtIcon,
  AIFutureIcon,
  CivilizationIcon,
  VisualMeaningIcon,
  ScholarIcon,
  RealExampleIcon,
  SourceRefIcon,
  RootIcon,
  AuthorPenIcon,
  CalendarIcon,
  ClockIcon,
  SynthesisIcon,
  GridIcon,
  CollectionIcon,
  NotificationIcon,
} from "@/components/icons";
import { IconBox } from "@/components/icon-box";

export const metadata: Metadata = {
  title: "ไอคอนทั้งหมด — ARCHRON",
  description: "ชุดไอคอน SVG ทั้งหมดของ ARCHRON",
};

const ALL_ICONS: { name: string; component: React.ComponentType<{ className?: string }> }[] = [
  { name: "ArchronMark", component: ArchronMark },
  { name: "ArchronLogomark", component: ArchronLogomark },
  { name: "ConceptIcon", component: ConceptIcon },
  { name: "PersonIcon", component: PersonIcon },
  { name: "BookIcon", component: BookIcon },
  { name: "SchoolIcon", component: SchoolIcon },
  { name: "SymbolIcon", component: SymbolIcon },
  { name: "TermIcon", component: TermIcon },
  { name: "SourceIcon", component: SourceIcon },
  { name: "PathIcon", component: PathIcon },
  { name: "ArticleIcon", component: ArticleIcon },
  { name: "SearchIcon", component: SearchIcon },
  { name: "MenuIcon", component: MenuIcon },
  { name: "ArrowRightIcon", component: ArrowRightIcon },
  { name: "KnowledgeHubIcon", component: KnowledgeHubIcon },
  { name: "ManifestoIcon", component: ManifestoIcon },
  { name: "QuoteIcon", component: QuoteIcon },
  { name: "ExternalLinkIcon", component: ExternalLinkIcon },
  { name: "HelpIcon", component: HelpIcon },
  { name: "HeartIcon", component: HeartIcon },
  { name: "CloseIcon", component: CloseIcon },
  { name: "LoginIcon", component: LoginIcon },
  { name: "EditIcon", component: EditIcon },
  { name: "LogoutIcon", component: LogoutIcon },
  { name: "PsychologyIcon", component: PsychologyIcon },
  { name: "PhilosophyIcon", component: PhilosophyIcon },
  { name: "AnthropologyIcon", component: AnthropologyIcon },
  { name: "HistoryIcon", component: HistoryIcon },
  { name: "LanguageIcon", component: LanguageIcon },
  { name: "MythologyIcon", component: MythologyIcon },
  { name: "ReligionIcon", component: ReligionIcon },
  { name: "ScienceIcon", component: ScienceIcon },
  { name: "SymbolismIcon", component: SymbolismIcon },
  { name: "ArtIcon", component: ArtIcon },
  { name: "AIFutureIcon", component: AIFutureIcon },
  { name: "CivilizationIcon", component: CivilizationIcon },
  { name: "VisualMeaningIcon", component: VisualMeaningIcon },
  { name: "ScholarIcon", component: ScholarIcon },
  { name: "RealExampleIcon", component: RealExampleIcon },
  { name: "SourceRefIcon", component: SourceRefIcon },
  { name: "RootIcon", component: RootIcon },
  { name: "AuthorPenIcon", component: AuthorPenIcon },
  { name: "CalendarIcon", component: CalendarIcon },
  { name: "ClockIcon", component: ClockIcon },
  { name: "SynthesisIcon", component: SynthesisIcon },
  { name: "GridIcon", component: GridIcon },
  { name: "CollectionIcon", component: CollectionIcon },
  { name: "NotificationIcon", component: NotificationIcon },
];

const CATEGORIES: { label: string; names: string[] }[] = [
  {
    label: "Knowledge Objects",
    names: ["ConceptIcon", "PersonIcon", "BookIcon", "SchoolIcon", "SymbolIcon", "ArticleIcon", "CollectionIcon", "PathIcon", "TermIcon"],
  },
  {
    label: "Domains",
    names: ["PsychologyIcon", "PhilosophyIcon", "AnthropologyIcon", "HistoryIcon", "LanguageIcon", "MythologyIcon", "ReligionIcon", "ScienceIcon", "SymbolismIcon", "ArtIcon", "AIFutureIcon", "CivilizationIcon"],
  },
  {
    label: "Actions",
    names: ["SearchIcon", "MenuIcon", "ArrowRightIcon", "CloseIcon", "LoginIcon", "EditIcon", "LogoutIcon", "ExternalLinkIcon", "HeartIcon", "HelpIcon", "NotificationIcon", "GridIcon", "SynthesisIcon"],
  },
  {
    label: "Brand & Meta",
    names: ["ArchronMark", "ArchronLogomark", "KnowledgeHubIcon", "ManifestoIcon", "QuoteIcon", "SourceIcon", "SourceRefIcon", "ScholarIcon", "RealExampleIcon", "RootIcon", "AuthorPenIcon", "VisualMeaningIcon", "CalendarIcon", "ClockIcon"],
  },
];

export default function IconsPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="font-heading text-3xl text-text-heading">ชุดไอคอน ARCHRON</h1>
      <p className="mt-2 text-sm text-text-secondary">
        ไอคอน SVG ทั้งหมด {ALL_ICONS.length} ตัว — ใช้ currentColor, 2px stroke, 24×24 viewBox
      </p>

      {CATEGORIES.map((cat) => (
        <section key={cat.label} className="mt-12">
          <h2 className="font-heading text-xl text-text-heading">{cat.label}</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {cat.names.map((name) => {
              const icon = ALL_ICONS.find((i) => i.name === name);
              if (!icon) return null;
              const Icon = icon.component;
              return (
                <div
                  key={name}
                  className="flex flex-col items-center gap-3 rounded-lg border border-border bg-bg-card p-4"
                >
                  <IconBox icon={<Icon className="h-6 w-6" />} size="sm" />
                  <span className="font-ui text-xs text-text-secondary">{name}</span>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </main>
  );
}
```

- [ ] **Step 2: Run build**

Run: `npm run build`
Expected: Success. `/icons` route is generated.

- [ ] **Step 3: Commit**

```bash
git add app/icons/page.tsx
git commit -m "feat: add icon preview page at /icons showing all SVG icons"
```

---

## Phase 2: Navigation + Homepage

### Task 8: Reduce site-header navigation to 5 items

**Files:**
- Modify: `components/site-header.tsx:33-42` (NAV array)
- Modify: `components/site-footer.tsx:10-25` (ensure moved links are in footer)

**Interfaces:**
- Produces: `NAV` array with 5 items max. Footer `EXPLORE` and `ABOUT` arrays already contain the moved links.

- [ ] **Step 1: Read current footer links to confirm moved links are covered**

The footer already has these links:
- EXPLORE: `/knowledge`, `/articles`, `/concepts`, `/disciplines`, `/constellation`, `/reading-sets`
- ABOUT: `/manifesto`, `/sources`, `/external-links`, `/faq`, `/support`

Links being moved from nav: `/schools` (add to footer EXPLORE), `/manifesto` (already in ABOUT), `/sources` (already in ABOUT), `/faq` (already in ABOUT), `/constellation` (already in EXPLORE).

Add `/schools` to footer EXPLORE if missing:

In `components/site-footer.tsx`, in the `EXPLORE` array (lines 10-17), add after `/disciplines`:
```typescript
  { label: "สำนักคิดและนักปราชญ์", href: "/schools" },
```

- [ ] **Step 2: Replace NAV array in site-header.tsx with 5 items**

In `components/site-header.tsx`, replace lines 33-42:

```typescript
const NAV: NavItem[] = [
  { label: "คลังความรู้", href: "/knowledge", Icon: KnowledgeHubIcon, tier: "primary" },
  { label: "สำรวจ", href: "/explore", Icon: SearchIcon, tier: "standard" },
  { label: "ค้นหา", href: "/search", Icon: SearchIcon, tier: "standard" },
  { label: "สนับสนุน", href: "/support", Icon: HeartIcon, tier: "support" },
  { label: "เข้าสู่ระบบ", href: "/studio", Icon: LoginIcon, tier: "auth" },
];
```

Note: The `tier` type needs `"auth"` added. Update the `Tier` type on line 28:
```typescript
type Tier = "primary" | "standard" | "utility" | "support" | "auth";
```

- [ ] **Step 3: Update the PRIMARY_NAV, STANDARD_NAV, UTILITY_NAV filters**

Since we removed utility items, update the filter constants. Replace lines 45-48:

```typescript
const PRIMARY_NAV = NAV.filter((i) => i.tier === "primary");
const STANDARD_NAV = NAV.filter((i) => i.tier === "standard");
const AUTH_NAV = NAV.find((i) => i.tier === "auth");
const SUPPORT = NAV.find((i) => i.tier === "support");
```

Remove `UTILITY_NAV` usage. Update the desktop nav rendering to show: primary + standard items + support pill + auth button (using Clerk's SignedIn/SignedOut).

- [ ] **Step 4: Update desktop nav rendering to use Clerk for auth item**

In the desktop nav JSX, replace the utility dropdown with a Clerk-based auth button. Use `SignedIn`/`SignedOut` from `@clerk/nextjs` (already imported). For `SignedOut`, show a "เข้าสู่ระบบ" link to `/studio`. For `SignedIn`, show a "โปรไฟล์" link to `/studio/profile`.

- [ ] **Step 5: Run build and lint**

Run: `npm run build && npm run lint`
Expected: Success. Navigation shows 5 items on desktop.

- [ ] **Step 6: Commit**

```bash
git add components/site-header.tsx components/site-footer.tsx
git commit -m "refactor: reduce navigation to 5 items per navigation-rule.md"
```

---

### Task 9: Update tabbar (mobile bottom nav) to match new navigation

**Files:**
- Modify: `components/tabbar.tsx`

**Interfaces:**
- Produces: Mobile bottom nav with 4 items: ค้นหา (`/search`), สำรวจ (`/explore`), สนับสนุน (`/support`), โปรไฟล์/เข้าสู่ระบบ (`/studio`).

- [ ] **Step 1: Read current tabbar to understand structure**

Run: `grep -n "href\|label\|Icon" components/tabbar.tsx | head -30`
Expected: Shows current tab items.

- [ ] **Step 2: Update tabbar items to 4 per navigation-rule.md**

Modify the tab items array in `components/tabbar.tsx` to:

```typescript
const TABS = [
  { label: "ค้นหา", href: "/search", Icon: SearchIcon },
  { label: "สำรวจ", href: "/explore", Icon: PathIcon },
  { label: "สนับสนุน", href: "/support", Icon: HeartIcon },
  { label: "โปรไฟล์", href: "/studio", Icon: PersonIcon },
];
```

Import necessary icons from `components/icons.tsx` (`SearchIcon`, `PathIcon`, `HeartIcon`, `PersonIcon`).

- [ ] **Step 3: Run build**

Run: `npm run build`
Expected: Success.

- [ ] **Step 4: Commit**

```bash
git add components/tabbar.tsx
git commit -m "refactor: update mobile tabbar to 4 items matching navigation-rule"
```

---

### Task 10: Rewrite homepage per homepage-rule.md

**Files:**
- Modify: `app/page.tsx` (complete rewrite of homepage structure)

**Interfaces:**
- Consumes: `RecentlyViewed` component (for Continue Reading section), `DisciplineCard` + `DISCIPLINES` (for Latest Knowledge), custom icons
- Produces: Homepage with 6 sections in exact order: Hero → Search → Continue Reading → Featured Guide → Latest Knowledge → Footer (footer is global, already rendered by layout).

- [ ] **Step 1: Read current homepage to identify reusable components**

The current homepage imports: `RecentlyViewed`, `LoopCarousel`, `DisciplineCard`, `DISCIPLINES`, `VesicaPattern`, `LayerBadge`, `TimelineConstellation`. We will keep `RecentlyViewed` and `DisciplineCard`/`DISCIPLINES`. We will remove `VesicaPattern`, `LayerBadge`, `TimelineConstellation`, `LoopCarousel` from the homepage.

- [ ] **Step 2: Write the new homepage structure**

Replace `app/page.tsx` with:

```tsx
import Link from "next/link";
import { RecentlyViewed } from "@/components/recently-viewed";
import { DisciplineCard } from "@/components/discipline-card";
import { DISCIPLINES } from "@/lib/content/disciplines";
import { SearchIcon, ArrowRightIcon } from "@/components/icons";

export default function HomePage() {
  const latestKnowledge = DISCIPLINES.slice(0, 8);

  return (
    <main>
      {/* ── 1. HERO ── */}
      <section className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden px-4 text-center">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 40%, color-mix(in srgb, var(--color-accent) 6%, transparent) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />
        <div className="relative z-10">
          <h1 className="font-display text-5xl font-bold tracking-tight text-text-heading sm:text-6xl md:text-7xl">
            ARCHRON
          </h1>
          <p className="mt-4 font-serif text-xl text-text-secondary sm:text-2xl">
            เข้าใจมนุษย์ ผ่านความรู้
          </p>
          <p className="mt-2 font-serif text-base text-text-secondary/70">
            Understanding Humanity Through Knowledge
          </p>
        </div>
      </section>

      {/* ── 2. SEARCH BAR ── */}
      <section className="relative z-10 -mt-8 flex justify-center px-4">
        <div className="w-full max-w-[720px]">
          <form action="/search" method="get" className="relative">
            <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-secondary" />
            <input
              type="search"
              name="q"
              placeholder="ค้นหาทุกสิ่ง..."
              className="w-full rounded-xl border border-border bg-bg-card py-4 pl-12 pr-4 text-center font-serif text-text-body shadow-sm transition-colors focus:border-accent/40 focus:ring-1 focus:ring-accent/20 focus:outline-none"
              aria-label="ค้นหา"
            />
          </form>
        </div>
      </section>

      {/* ── 3. CONTINUE READING (authenticated users only) ── */}
      <section className="mx-auto mt-20 max-w-[1200px] px-6">
        <RecentlyViewed />
      </section>

      {/* ── 4. FEATURED GUIDE ── */}
      <section className="mx-auto mt-20 max-w-[1200px] px-6">
        <div className="flex items-baseline justify-between">
          <h2 className="font-heading text-2xl font-semibold text-text-heading">
            คู่มือแนะนำ
          </h2>
          <Link
            href="/guide"
            className="inline-flex items-center gap-1 text-sm text-accent hover:text-accent-hover"
          >
            ดูทั้งหมด <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Link
            href="/guide"
            className="group rounded-xl border border-border bg-bg-card p-6 transition-colors hover:border-accent/30 hover:bg-bg-elevated"
          >
            <span className="inline-block rounded-full bg-accent/15 px-3 py-1 text-xs font-medium text-accent">
              Guide
            </span>
            <h3 className="mt-3 font-serif text-lg font-semibold text-text-heading">
              Jungian Type Analysis
            </h3>
            <p className="mt-2 text-sm text-text-secondary line-clamp-2">
              วิเคราะห์โครงสร้าง Ego ผ่านกรอบทฤษฎีจิตวิทยาเชิงลึกของคาร์ล ยุง
            </p>
          </Link>
        </div>
      </section>

      {/* ── 5. LATEST KNOWLEDGE ── */}
      <section className="mx-auto mt-20 max-w-[1200px] px-6 pb-24">
        <div className="flex items-baseline justify-between">
          <h2 className="font-heading text-2xl font-semibold text-text-heading">
            ความรู้ล่าสุด
          </h2>
          <Link
            href="/knowledge"
            className="inline-flex items-center gap-1 text-sm text-accent hover:text-accent-hover"
          >
            ดูทั้งหมด <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {latestKnowledge.map((d) => (
            <DisciplineCard key={d.slug} discipline={d} />
          ))}
        </div>
      </section>
    </main>
  );
}
```

Note: The `RecentlyViewed` component may need internal logic to only show when authenticated. If it already handles this internally, no change needed. If not, wrap it in a check — but since it's a client component using Clerk, it should handle visibility itself.

- [ ] **Step 3: Run build and lint**

Run: `npm run build && npm run lint`
Expected: Success. Homepage now has 6 sections in correct order.

- [ ] **Step 4: Visually verify the homepage structure**

The page should show: ARCHRON hero → search bar overlapping hero → continue reading → featured guide → latest knowledge → footer. No cosmology/colonnde/astrolabe/symbol parallax.

- [ ] **Step 5: Commit**

```bash
git add app/page.tsx
git commit -m "feat: rewrite homepage per homepage-rule — Hero, Search, Continue Reading, Featured Guide, Latest Knowledge"
```

---

## Phase 3: MDX for Static Pages

### Task 11: Install @next/mdx and configure

**Files:**
- Modify: `package.json` (add MDX dependencies)
- Modify: `next.config.mjs` (add MDX plugin)
- Modify: `tsconfig.json` (add .mdx support if needed)
- Create: `mdx.d.ts` (TypeScript declaration for .mdx files)

**Interfaces:**
- Produces: `.mdx` files work as pages in App Router. `pageExtensions` includes `mdx`.

- [ ] **Step 1: Install MDX dependencies**

Run: `npm install @next/mdx @mdx-js/loader @mdx-js/react @types/mdx`
Expected: Packages installed successfully.

- [ ] **Step 2: Update next.config.mjs to use MDX**

Replace `next.config.mjs`:

```javascript
/** @type {import('next').NextConfig} */
import createMDX from "@next/mdx";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const nextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  turbopack: {
    root: __dirname,
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
```

- [ ] **Step 3: Add TypeScript declaration for .mdx files**

Create `mdx.d.ts` at project root:

```typescript
declare module "*.mdx" {
  import type { ComponentType } from "react";
  const MDXComponent: ComponentType<Record<string, unknown>>;
  export default MDXComponent;
}
```

- [ ] **Step 4: Run build to verify MDX setup works**

Run: `npm run build`
Expected: Success. No .mdx files yet but the config should not break existing .ts/.tsx pages.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json next.config.mjs mdx.d.ts
git commit -m "feat: install and configure @next/mdx for App Router"
```

---

### Task 12: Convert /support page to MDX

**Files:**
- Create: `app/support/page.mdx`
- Delete: `app/support/page.tsx` (remove old page to avoid conflict)

**Interfaces:**
- Consumes: `PageScaffold` from `components/page-scaffold.tsx`, `Link` from `next/link`
- Produces: `/support` route served from `.mdx` file with same content.

- [ ] **Step 1: Read the full current support page content**

Run: Read `app/support/page.tsx` in full (185 lines) to capture all prose content.

- [ ] **Step 2: Create the MDX version**

Create `app/support/page.mdx`:

```mdx
---
title: "สนับสนุน — ARCHRON"
description: "ร่วมดูแลคลังความรู้ภาษาไทยด้านจิตวิทยาและปรัชญาให้คงอยู่ — สนับสนุนผ่าน ARCHRON Companion, การวิเคราะห์ Jungian Type Guide, หรือการร่วมเขียน"
---

import { PageScaffold } from "@/components/page-scaffold"
import Link from "next/link"

export const metadata = {
  title: "สนับสนุน — ARCHRON",
  description: "ร่วมดูแลคลังความรู้ภาษาไทยด้านจิตวิทยาและปรัชญาให้คงอยู่ — สนับสนุนผ่าน ARCHRON Companion, การวิเคราะห์ Jungian Type Guide, หรือการร่วมเขียน",
}

<PageScaffold
  className="atmo-biography"
  breadcrumb={[{ label: "หน้าแรก", href: "/" }, { label: "สนับสนุน" }]}
  kicker="สนับสนุน"
  title="สนับสนุนคลังความรู้นี้ให้คงอยู่"
  lead="ARCHRON ไม่ใช่ธุรกิจ ไม่มี paywall — เป็นคลังความรู้ที่เปิดกว้างสำหรับทุกคน หากคุณเห็นว่าสิ่งนี้มีค่าที่จะคงอยู่ นี่คือหนทาง"
  ambient
  navCurrent="/support"
>

## ทำไมความรู้ต้องเปิดกว้าง

ความรู้ทางจิตวิทยา ปรัชญา มานุษยวิทยา และศาสตร์ที่ว่าด้วยความเป็นมนุษย์ ไม่ใช่สินค้าที่ควรถูกขายเป็นชิ้น ๆ ภายใต้ paywall หรือรอการปลดล็อก

ARCHRON ดำรงอยู่เพราะความเชื่อที่ว่าผลงานทางปัญญาเหล่านี้เป็นมรดกร่วมของมนุษย์ — ทุกคนควรสามารถเข้าถึง เข้าใจ และนำไปคิดต่อได้โดยไม่มีกำแพง

เนื้อหาหลักของคลังนี้จะยังคงเปิดให้อ่านฟรีต่อไป

## การดำรงอยู่ของคลังความรู้มีค่าใช้จ่าย

เซิร์ฟเวอร์ โดเมน ที่จัดเก็บข้อมูล หนังสืออ้างอิงวิชาการ เวลาที่ใช้ในการค้นคว้า เขียน แปล เรียบเรียง และจัดระบบความรู้ — ล้วนมีค่าใช้จ่าย

หากคุณเห็นว่าคลังความรู้นี้มีประโยชน์ การสนับสนุนแม้เพียงเล็กน้อยก็ช่วยให้เราคงอยู่ต่อไปได้

## ช่องทางสนับสนุน

### 1. ARCHRON Companion

ร่วมเป็นสมาชิกสนับสนุนระยะยาวผ่าน ARCHRON Companion membership

### 2. Jungian Type Guide

สนับสนุนผ่านการใช้บริการ Jungian Type Analysis — วิเคราะห์โครงสร้าง Ego ผ่านกรอบทฤษฎีจิตวิทยาเชิงลึกของคาร์ล ยุง

### 3. การร่วมเขียน

หากคุณเป็นนักเขียน นักวิชาการ หรือนักแปล สามารถร่วมเขียนและสร้างเนื้อหาให้คลังความรู้นี้ได้

</PageScaffold>
```

Note: The exact prose content should match the current `app/support/page.tsx`. Read the full file and copy all text content into the MDX. The above is a template — fill in all sections from the original page.

- [ ] **Step 3: Delete the old page.tsx**

Run: `Remove-Item -LiteralPath "app\support\page.tsx"`
Expected: File deleted. Now only `page.mdx` exists in `app/support/`.

- [ ] **Step 4: Run build**

Run: `npm run build`
Expected: Success. `/support` route served from MDX.

- [ ] **Step 5: Verify the page renders correctly**

The page should look identical to before — same PageScaffold wrapper, same content.

- [ ] **Step 6: Commit**

```bash
git add app/support/page.mdx
git rm app/support/page.tsx
git commit -m "refactor: convert /support page from TSX to MDX"
```

---

### Task 13: Convert /guide page to MDX

**Files:**
- Create: `components/guide/psyche-compass.tsx` (extract interactive compass widget)
- Create: `app/guide/page.mdx` (prose + imported compass component)
- Delete: `app/guide/page.tsx`

**Interfaces:**
- Consumes: `useState` from React, icon components from `components/icons.tsx`
- Produces: `PsycheCompass` client component (interactive SVG compass) + `/guide` route served from MDX.

Note: The `/guide` page is 439 lines with significant interactivity (SVG compass, state management, contact info). The MDX file will import the extracted `PsycheCompass` client component and lay out the prose around it.

- [ ] **Step 1: Read the full guide page to identify the interactive boundary**

Read `app/guide/page.tsx` in full (439 lines). The interactive part is the SVG compass widget (lines ~126-260) which uses `useState` for `activeFunc`. The rest is prose (SCOPE, STEPS, BOUNDARIES, CONTACTS arrays + rendering).

- [ ] **Step 2: Extract the interactive compass into a client component**

Create `components/guide/psyche-compass.tsx`:

```tsx
"use client";

import { useState } from "react";

type PsycheFunction = "thinking" | "feeling" | "sensation" | "intuition" | "ego";

const COMPASS_DETAILS: Record<PsycheFunction, { title: string; subtitle: string; desc: string; stack: string }> = {
  thinking: {
    title: "Thinking (T) — การคิด",
    subtitle: "Rational & Logical Evaluation",
    desc: "การประเมินและตัดสินใจด้วยเหตุผลเชิงระบบ การวิเคราะห์หลักการทั่วไป ความถูกต้องเป็นสากล และการแยกแยะจัดหมวดหมู่ข้อมูลอย่างเป็นวัตถุวิสัย (Objective Analysis)",
    stack: "แกนหลักในการจัดระบบโครงสร้างความคิดและการใช้ตรรกวิทยาเพื่อสร้างระบบระเบียบ",
  },
  feeling: {
    title: "Feeling (F) — ความรู้สึก",
    subtitle: "Valuation & Relation Evaluation",
    desc: "การตัดสินคุณค่า (Value) ด้วยความสำคัญต่อบุคคลหรือสังคม จิตวิญญาณแห่งความเชื่อมโยง ความสอดคล้องกลมกลืน และการวัดน้ำหนักทางจริยธรรมของทางเลือก (Ethical Evaluation)",
    stack: "ฟังก์ชันที่ทำงานตรงข้ามกับ Thinking ในการประเมินสิ่งที่คู่ควรแก่คุณค่าของมนุษย์",
  },
  sensation: {
    title: "Sensation (S) — การรับรู้สัมผัส",
    subtitle: "Reality & Detail Perception",
    desc: "การเปิดรับข้อมูลตามความจริงผ่านประสาทสัมผัสทั้งห้า ความเป็นจริงตรงหน้าในปัจจุบัน รายละเอียดที่จับต้องได้ ประสบการณ์ในอดีต และความจริงเชิงประจักษ์ (Concrete Reality)",
    stack: "ฟังก์ชันสังเกตการณ์ที่เน้นข้อมูลที่เกิดขึ้นจริง ณ ปัจจุบันขณะและการจัดเก็บรายละเอียด",
  },
  intuition: {
    title: "Intuition (N) — การหยั่งรู้",
    subtitle: "Possibility & Pattern Perception",
    desc: "การรับรู้ผ่านการเชื่อมโยงความสัมพันธ์ที่มองไม่เห็นด้วยตา ความเป็นไปได้ในอนาคต ภาพรวมเชิงระบบ ความหมายเบื้องหลังสัญลักษณ์ และจินตนาการวิสัยทัศน์ (Hidden Patterns)",
    stack: "ฟังก์ชันสังเกตการณ์ที่มองข้ามความเป็นจริงตรงหน้าเพื่อเข้าหาศักยภาพและแนวโน้มถัดไป",
  },
  ego: {
    title: "Ego / Self Axis — ศูนย์กลางจิตวิทยา",
    subtitle: "Conscious Center & Total Psyche",
    desc: "จุดสมดุลระหว่าง Ego (จิตสำนึก) และ Self (องค์รวมของจิต) ซึ่งเป็นแกนกลางของการหลอมรวมฟังก์ชันด้านต่างๆ เพื่อให้จิตใจสามารถเติบโตเป็นหนึ่งเดียว (Individuation)",
    stack: "เป้าหมายหลักของการวิเคราะห์แบบแผน Ego เพื่อนำทางไปสู่ความสมบูรณ์แบบภายในตัวตน",
  },
};

export function PsycheCompass() {
  const [activeFunc, setActiveFunc] = useState<PsycheFunction>("ego");
  const detail = COMPASS_DETAILS[activeFunc];

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative h-[320px] w-[320px] rounded-full border border-border/30 bg-bg/40 p-4 backdrop-blur-sm">
        <svg viewBox="0 0 320 320" className="h-full w-full">
          <circle cx="160" cy="160" r="130" fill="none" stroke="var(--color-border)" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="160" cy="160" r="90" fill="none" stroke="var(--color-border)" strokeWidth="1" opacity="0.6" />
          <circle cx="160" cy="160" r="45" fill="none" stroke="var(--color-border)" strokeWidth="1" opacity="0.3" />
          <line x1="160" y1="30" x2="160" y2="290" stroke="var(--color-border)" strokeWidth="1" opacity="0.4" />
          <line x1="30" y1="160" x2="290" y2="160" stroke="var(--color-border)" strokeWidth="1" opacity="0.4" />
          <text x="160" y="25" textAnchor="middle" fontSize="11" fill="var(--color-text-secondary)">Thinking</text>
          <text x="160" y="305" textAnchor="middle" fontSize="11" fill="var(--color-text-secondary)">Feeling</text>
          <text x="15" y="164" textAnchor="middle" fontSize="11" fill="var(--color-text-secondary)">Sensation</text>
          <text x="305" y="164" textAnchor="middle" fontSize="11" fill="var(--color-text-secondary)">Intuition</text>
          <circle cx="160" cy="160" r="6" fill="var(--color-accent)" />
        </svg>
      </div>
      <div className="mt-6 max-w-xs text-center">
        <h3 className="font-serif text-lg font-semibold text-text-heading">{detail.title}</h3>
        <p className="text-xs uppercase tracking-wider text-accent">{detail.subtitle}</p>
        <p className="mt-3 text-sm leading-relaxed text-text-body">{detail.desc}</p>
        <p className="mt-2 text-xs text-text-secondary italic">{detail.stack}</p>
      </div>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {(["ego", "thinking", "feeling", "sensation", "intuition"] as PsycheFunction[]).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setActiveFunc(f)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              activeFunc === f
                ? "bg-accent text-text-inverse"
                : "border border-border text-text-secondary hover:border-accent hover:text-accent"
            }`}
          >
            {f === "ego" ? "Ego" : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}
```

Note: This is a simplified version of the compass. Read the original file's SVG section (lines 126-260) and copy the full SVG markup into this component for pixel-accurate parity.

- [ ] **Step 3: Create the MDX page**

Create `app/guide/page.mdx`. Read the full original `app/guide/page.tsx` and convert all prose sections (SCOPE, STEPS, BOUNDARIES, CONTACTS, pricing, etc.) to markdown. Import and use `PsycheCompass` where the interactive compass was.

```mdx
---
title: "Jungian Type Analysis — ARCHRON"
description: "วิเคราะห์โครงสร้าง Ego ผ่านกรอบทฤษฎีจิตวิทยาเชิงลึกของคาร์ล ยุง"
---

import { PsycheCompass } from "@/components/guide/psyche-compass"
import Link from "next/link"
import { ArrowRightIcon, ClockIcon, AuthorPenIcon, ConceptIcon, SynthesisIcon, GridIcon, PsychologyIcon, PersonIcon, SchoolIcon } from "@/components/icons"

export const metadata = {
  title: "Jungian Type Analysis — ARCHRON",
  description: "วิเคราะห์โครงสร้าง Ego ผ่านกรอบทฤษฎีจิตวิทยาเชิงลึกของคาร์ล ยุง",
}

<main className="atmo-temple min-h-screen bg-bg pb-24 text-text-heading">
  <section className="relative overflow-hidden border-b border-border/30 px-6 py-20 lg:py-28">
    <div className="mx-auto max-w-6xl">
      <nav aria-label="เส้นทางนำทาง" className="mb-8 flex flex-wrap items-center gap-1 text-xs text-text-secondary">
        <Link href="/" className="rounded px-2 py-1.5 transition-colors hover:text-accent">หน้าแรก</Link>
        <ArrowRightIcon className="h-4 w-4 rotate-90 text-text-secondary" />
        <span className="px-2 py-1.5 text-text-body">Jungian Type Analysis</span>
      </nav>

      <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
        <div className="text-left lg:col-span-7">
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.25em] text-accent">
            ARCHRON · Dynamic Typology
          </span>
          <h1 className="mt-4 font-serif text-fluid-h1 font-bold leading-tight text-text-heading">
            Jungian Type Analysis
          </h1>
          <p className="mt-2 font-serif text-lg italic text-accent">
            วิเคราะห์โครงสร้าง Ego ผ่านกรอบทฤษฎีจิตวิทยาเชิงลึกของคาร์ล ยุง
          </p>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-text-body/90">
            สแกนและอ่านโครงสร้างความโน้มเอียงของ Ego ในการรับและตัดสินข้อมูล
          </p>
        </div>
        <div className="lg:col-span-5">
          <PsycheCompass />
        </div>
      </div>
    </div>
  </section>

  <!-- Copy remaining sections (SCOPE, STEPS, BOUNDARIES, CONTACTS, pricing) from original page.tsx -->
  <!-- Convert JSX to markdown/JSX hybrid as appropriate for MDX -->

</main>
```

Note: The implementer must read the full original `app/guide/page.tsx` (439 lines) and copy all remaining prose sections into the MDX. The SCOPE, STEPS, BOUNDARIES, and CONTACTS arrays should be converted to markdown lists/sections. Contact information (phone, LINE, Facebook) must be preserved exactly.

- [ ] **Step 4: Delete the old page.tsx**

Run: `Remove-Item -LiteralPath "app\guide\page.tsx"`
Expected: File deleted.

- [ ] **Step 5: Run build and lint**

Run: `npm run build && npm run lint`
Expected: Success. `/guide` route served from MDX.

- [ ] **Step 6: Commit**

```bash
git add components/guide/psyche-compass.tsx app/guide/page.mdx
git rm app/guide/page.tsx
git commit -m "refactor: extract PsycheCompass component, convert /guide to MDX"
```

---

## Phase 4: Academic Seals UI

### Task 14: Create seal data module

**Files:**
- Create: `lib/content/seals.ts`

**Interfaces:**
- Produces: `AcademicSeal` interface, `SEALS` array (15 seals), `getSealById(id)` function, `getSealsByLevel(level)` function, `getSealsByCategory(category)` function.

- [ ] **Step 1: Create the seal data module**

Create `lib/content/seals.ts`:

```typescript
export interface AcademicSeal {
  id: string;
  slug: string;
  name: string;
  nameThai: string;
  description: string;
  shape: "circle" | "octagon" | "hexagon" | "diamond" | "compass";
  color: string;
  level: 1 | 2 | 3 | 4 | 5 | 6 | 7 | null;
  category: "progression" | "domain" | "time" | "support";
  requirement: string;
}

export const SEALS: AcademicSeal[] = [
  // Level 1-2: Slate
  {
    id: "the-seeker",
    slug: "the-seeker",
    name: "The Seeker",
    nameThai: "ผู้แสวงหา",
    description: "จุดเริ่มต้น — การเข้าสู่ห้องสมุด",
    shape: "circle",
    color: "#465264",
    level: 1,
    category: "progression",
    requirement: "สร้างบัญชีและอ่านบทความแรก",
  },
  {
    id: "the-reader",
    slug: "the-reader",
    name: "The Reader",
    nameThai: "ผู้อ่าน",
    description: "การอ่านอย่างต่อเนื่อง",
    shape: "circle",
    color: "#465264",
    level: 2,
    category: "progression",
    requirement: "อ่าน 10 บทความครบถ้วน",
  },
  {
    id: "the-collector",
    slug: "the-collector",
    name: "The Collector",
    nameThai: "ผู้รวบรวม",
    description: "การเริ่มจัดระเบียบความรู้",
    shape: "hexagon",
    color: "#465264",
    level: 2,
    category: "progression",
    requirement: "บันทึกบทความลง Collection ครั้งแรก",
  },
  // Level 3-4: Blue
  {
    id: "the-scholar",
    slug: "the-scholar",
    name: "The Scholar",
    nameThai: "นักวิชาการ",
    description: "ความเป็นนักวิชาการอย่างแท้จริง",
    shape: "octagon",
    color: "#5F8DCE",
    level: 3,
    category: "progression",
    requirement: "อ่าน 100 บทความครบถ้วน",
  },
  {
    id: "the-analyst",
    slug: "the-analyst",
    name: "The Analyst",
    nameThai: "นักวิเคราะห์",
    description: "ความเข้าใจโครงสร้างความรู้",
    shape: "diamond",
    color: "#5F8DCE",
    level: 4,
    category: "progression",
    requirement: "อ่าน Object ครบทั้ง 5 ประเภท",
  },
  {
    id: "the-explorer",
    slug: "the-explorer",
    name: "The Explorer",
    nameThai: "ผู้สำรวจ",
    description: "การสำรวจสาขาวิชาหลากหลาย",
    shape: "circle",
    color: "#5F8DCE",
    level: 4,
    category: "progression",
    requirement: "อ่านบทความจาก 5 Domains ขึ้นไป",
  },
  {
    id: "the-archivist",
    slug: "the-archivist",
    name: "The Archivist",
    nameThai: "ผู้จัดเก็บ",
    description: "ผู้จัดเก็บและจัดระเบียบความรู้",
    shape: "hexagon",
    color: "#5F8DCE",
    level: 4,
    category: "progression",
    requirement: "สร้าง Collection 5 ชุดขึ้นไป",
  },
  {
    id: "the-cartographer",
    slug: "the-cartographer",
    name: "The Cartographer",
    nameThai: "ผู้ทำแผนที่",
    description: "ผู้สร้างแผนที่ความรู้",
    shape: "hexagon",
    color: "#5F8DCE",
    level: 4,
    category: "progression",
    requirement: "สร้าง Collection ที่มี Object มากกว่า 20 รายการ",
  },
  // Level 5-6: Silver
  {
    id: "the-curator",
    slug: "the-curator",
    name: "The Curator",
    nameThai: "ผู้ดูแล",
    description: "ผู้ดูแลคุณภาพความรู้ระดับสูง",
    shape: "octagon",
    color: "#C7D0DB",
    level: 5,
    category: "progression",
    requirement: "Collection ของคุณถูก Featured โดย Editor",
  },
  {
    id: "the-sage",
    slug: "the-sage",
    name: "The Sage",
    nameThai: "ผู้รอบรู้",
    description: "ผู้รอบรู้ที่ปฏิบัติอย่างต่อเนื่อง",
    shape: "diamond",
    color: "#C7D0DB",
    level: 6,
    category: "progression",
    requirement: "อ่านบทความ 500+ และสร้าง Collection 10+",
  },
  {
    id: "the-navigator",
    slug: "the-navigator",
    name: "The Navigator",
    nameThai: "ผู้นำทาง",
    description: "ผู้นำทางในโลกแห่งความคิด",
    shape: "circle",
    color: "#C7D0DB",
    level: 6,
    category: "progression",
    requirement: "ใช้ Knowledge Graph สำรวจ Concept มากกว่า 50 รายการ",
  },
  {
    id: "the-luminary",
    slug: "the-luminary",
    name: "The Luminary",
    nameThai: "ผู้ส่องสว่าง",
    description: "ผู้ส่องสว่างให้ผู้อื่น",
    shape: "circle",
    color: "#C7D0DB",
    level: 6,
    category: "progression",
    requirement: "ถึง Level 5 และมี Collection Featured 3+",
  },
  // Level 7: Gold
  {
    id: "the-architect",
    slug: "the-architect",
    name: "The Architect",
    nameThai: "ผู้สร้างสรรค์",
    description: "ผู้สร้างสรรค์และออกแบบโครงสร้างความรู้",
    shape: "octagon",
    color: "#B89A63",
    level: 7,
    category: "progression",
    requirement: "ถึง Level 7 — Architect",
  },
  {
    id: "the-companion",
    slug: "the-companion",
    name: "The Companion",
    nameThai: "ผู้ร่วมเดินทาง",
    description: "ผู้สนับสนุน ผู้ร่วมเดินทาง",
    shape: "compass",
    color: "#B89A63",
    level: 7,
    category: "support",
    requirement: "สนับสนุน ARCHRON ผ่าน Companion membership",
  },
  {
    id: "the-patron",
    slug: "the-patron",
    name: "The Patron",
    nameThai: "ผู้อุปถัมภ์",
    description: "ผู้อุปถัมภ์ระยะยาว",
    shape: "diamond",
    color: "#B89A63",
    level: 7,
    category: "support",
    requirement: "สนับสนุน ARCHRON มากกว่า 1 ปี",
  },
];

export function getSealById(id: string): AcademicSeal | undefined {
  return SEALS.find((s) => s.id === id);
}

export function getSealsByLevel(level: AcademicSeal["level"]): AcademicSeal[] {
  return SEALS.filter((s) => s.level === level);
}

export function getSealsByCategory(category: AcademicSeal["category"]): AcademicSeal[] {
  return SEALS.filter((s) => s.category === category);
}
```

- [ ] **Step 2: Write unit test for seal data**

Create `tests/seals/seal-data.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { SEALS, getSealById, getSealsByLevel, getSealsByCategory } from "@/lib/content/seals";

describe("seal data", () => {
  it("has exactly 15 seals", () => {
    expect(SEALS).toHaveLength(15);
  });

  it("all seals have unique ids", () => {
    const ids = SEALS.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("all seals have unique slugs", () => {
    const slugs = SEALS.map((s) => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("getSealById returns the correct seal", () => {
    const seal = getSealById("the-seeker");
    expect(seal).toBeDefined();
    expect(seal?.name).toBe("The Seeker");
  });

  it("getSealById returns undefined for unknown id", () => {
    expect(getSealById("nonexistent")).toBeUndefined();
  });

  it("getSealsByLevel returns seals for that level", () => {
    const level1 = getSealsByLevel(1);
    expect(level1).toHaveLength(1);
    expect(level1[0].id).toBe("the-seeker");
  });

  it("getSealsByCategory returns seals for that category", () => {
    const support = getSealsByCategory("support");
    expect(support).toHaveLength(2);
    expect(support.map((s) => s.id).sort()).toEqual(["the-companion", "the-patron"]);
  });

  it("all seals have valid shape", () => {
    const validShapes = ["circle", "octagon", "hexagon", "diamond", "compass"];
    SEALS.forEach((s) => {
      expect(validShapes).toContain(s.shape);
    });
  });

  it("all seals have valid color hex", () => {
    SEALS.forEach((s) => {
      expect(s.color).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });
  });
});
```

- [ ] **Step 3: Run the test**

Run: `npx vitest run tests/seals/seal-data.test.ts`
Expected: All 8 tests pass.

- [ ] **Step 4: Run lint**

Run: `npm run lint`
Expected: No errors.

- [ ] **Step 5: Commit**

```bash
git add lib/content/seals.ts tests/seals/seal-data.test.ts
git commit -m "feat: add Academic Seals data module with 15 seals and unit tests"
```

---

### Task 15: Create SealIcon SVG component

**Files:**
- Create: `components/seals/seal-icon.tsx`

**Interfaces:**
- Consumes: `AcademicSeal` type from `lib/content/seals.ts`
- Produces: `SealIcon` component that renders an SVG seal with the correct shape, color, and symbol per the seal definition. Props: `{ seal: AcademicSeal; size?: number; isLocked?: boolean; className?: string }`.

- [ ] **Step 1: Create the SealIcon component**

Create `components/seals/seal-icon.tsx`:

```tsx
import type { AcademicSeal } from "@/lib/content/seals";

interface SealIconProps {
  seal: AcademicSeal;
  size?: number;
  isLocked?: boolean;
  className?: string;
}

const SHAPE_PATHS: Record<AcademicSeal["shape"], string> = {
  circle: "M 32 4 A 28 28 0 1 1 32 60 A 28 28 0 1 1 32 4 Z",
  octagon:
    "M 32 4 L 50 10 L 60 32 L 50 54 L 32 60 L 14 54 L 4 32 L 14 10 Z",
  hexagon: "M 32 4 L 56 18 L 56 46 L 32 60 L 8 46 L 8 18 Z",
  diamond: "M 32 4 L 60 32 L 32 60 L 4 32 Z",
  compass:
    "M 32 4 L 36 28 L 60 32 L 36 36 L 32 60 L 28 36 L 4 32 L 28 28 Z",
};

const SYMBOL_PATHS: Record<string, string> = {
  "the-seeker": "M 32 30 A 2 2 0 1 1 32 34 A 2 2 0 1 1 32 30 Z",
  "the-reader": "M 22 24 L 42 24 M 22 32 L 42 32 M 22 40 L 42 40",
  "the-collector":
    "M 24 26 A 2 2 0 1 1 24 30 M 32 26 A 2 2 0 1 1 32 30 M 40 26 A 2 2 0 1 1 40 30 M 24 38 A 2 2 0 1 1 24 42 M 32 38 A 2 2 0 1 1 32 42 M 40 38 A 2 2 0 1 1 40 42",
  "the-scholar": "M 32 20 L 32 44 M 20 32 L 44 32",
  "the-analyst": "M 32 20 L 32 44 M 20 32 L 44 32 M 24 24 L 40 40 M 40 24 L 24 40",
  "the-explorer":
    "M 32 16 L 34 30 L 48 32 L 34 34 L 32 48 L 30 34 L 16 32 L 30 30 Z",
  "the-archivist": "M 20 22 L 44 22 M 20 32 L 44 32 M 20 42 L 44 42",
  "the-cartographer":
    "M 32 18 L 32 46 M 18 32 L 46 32 M 22 22 L 42 42 M 42 22 L 22 42",
  "the-curator": "M 32 20 L 40 32 L 32 44 L 24 32 Z M 24 32 L 40 32",
  "the-sage":
    "M 32 28 A 2 2 0 1 1 32 32 M 24 20 L 32 28 L 40 20 M 24 44 L 32 36 L 40 44 M 18 32 L 24 32 M 40 32 L 46 32",
  "the-navigator":
    "M 32 20 A 12 12 0 0 1 44 32 A 12 12 0 0 1 32 44 A 12 12 0 0 1 20 32 A 12 12 0 0 1 32 20 M 32 16 L 32 20 M 32 44 L 32 48 M 16 32 L 20 32 M 44 32 L 48 32",
  "the-luminary":
    "M 32 28 A 2 2 0 1 1 32 32 M 28 20 L 32 28 L 36 20 M 20 28 L 28 30 L 20 34 M 44 28 L 36 30 L 44 34 M 28 44 L 32 36 L 36 44",
  "the-architect":
    "M 32 18 L 32 46 M 18 32 L 46 32 M 24 24 L 40 40 M 40 24 L 24 40 M 32 18 L 40 32 L 32 46 L 24 32 Z",
  "the-companion":
    "M 32 22 A 6 6 0 1 1 32 34 A 6 6 0 1 1 32 22 M 32 16 L 34 28 L 48 32 L 34 34 L 32 48 L 30 34 L 16 32 L 30 28 Z",
  "the-patron":
    "M 32 18 L 36 26 L 44 26 L 38 32 L 40 40 L 32 36 L 24 40 L 26 32 L 20 26 L 28 26 Z",
};

export function SealIcon({ seal, size = 64, isLocked = false, className = "" }: SealIconProps) {
  const shapePath = SHAPE_PATHS[seal.shape];
  const symbolPath = SYMBOL_PATHS[seal.id] ?? "";
  const color = seal.color;
  const opacity = isLocked ? 0.3 : 1;
  const filter = isLocked ? "grayscale(1)" : "none";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ opacity, filter }}
      role="img"
      aria-label={`${seal.nameThai} — ${seal.description}`}
    >
      <g stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d={shapePath} />
        <path d={symbolPath} />
        <text
          x="32"
          y="14"
          fontSize="4"
          textAnchor="middle"
          fill={color}
          stroke="none"
          fontFamily="var(--font-ui)"
          letterSpacing="0.5"
        >
          ARCHRON
        </text>
      </g>
    </svg>
  );
}
```

- [ ] **Step 2: Run build and lint**

Run: `npm run build && npm run lint`
Expected: Success.

- [ ] **Step 3: Commit**

```bash
git add components/seals/seal-icon.tsx
git commit -m "feat: add SealIcon SVG component with 5 shapes and 15 symbols"
```

---

### Task 16: Create SealGallery component

**Files:**
- Create: `components/seals/seal-gallery.tsx`

**Interfaces:**
- Consumes: `SEALS` from `lib/content/seals.ts`, `SealIcon` from `components/seals/seal-icon.tsx`
- Produces: `SealGallery` client component showing all seals in a grid with filter (All / Earned / Locked) and sort (Recent / Level / Alphabetical). Props: `{ earnedSealIds?: string[] }`.

- [ ] **Step 1: Create the SealGallery component**

Create `components/seals/seal-gallery.tsx`:

```tsx
"use client";

import { useState, useMemo } from "react";
import { SEALS, type AcademicSeal } from "@/lib/content/seals";
import { SealIcon } from "./seal-icon";

interface SealGalleryProps {
  earnedSealIds?: string[];
  onSelectSeal?: (seal: AcademicSeal) => void;
}

type FilterMode = "all" | "earned" | "locked";
type SortMode = "recent" | "level" | "alphabetical";

export function SealGallery({ earnedSealIds = [], onSelectSeal }: SealGalleryProps) {
  const [filter, setFilter] = useState<FilterMode>("all");
  const [sort, setSort] = useState<SortMode>("level");

  const earnedSet = useMemo(() => new Set(earnedSealIds), [earnedSealIds]);

  const filteredSeals = useMemo(() => {
    let result = SEALS;
    if (filter === "earned") {
      result = result.filter((s) => earnedSet.has(s.id));
    } else if (filter === "locked") {
      result = result.filter((s) => !earnedSet.has(s.id));
    }

    const sorted = [...result];
    if (sort === "level") {
      sorted.sort((a, b) => (a.level ?? 99) - (b.level ?? 99));
    } else if (sort === "alphabetical") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    }
    return sorted;
  }, [filter, sort, earnedSet]);

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center gap-4">
        <div className="flex gap-2" role="group" aria-label="กรองตรา">
          {(["all", "earned", "locked"] as FilterMode[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
                filter === f
                  ? "bg-accent text-text-inverse"
                  : "border border-border text-text-secondary hover:border-accent hover:text-accent"
              }`}
            >
              {f === "all" ? "ทั้งหมด" : f === "earned" ? "ที่ได้รับ" : "ที่ยังล็อก"}
            </button>
          ))}
        </div>
        <div className="flex gap-2" role="group" aria-label="เรียงลำดับ">
          {(["level", "alphabetical"] as SortMode[]).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSort(s)}
              className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
                sort === s
                  ? "bg-accent text-text-inverse"
                  : "border border-border text-text-secondary hover:border-accent hover:text-accent"
              }`}
            >
              {s === "level" ? "ตามระดับ" : "ตามตัวอักษร"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {filteredSeals.map((seal, index) => {
          const isLocked = !earnedSet.has(seal.id);
          return (
            <button
              key={seal.id}
              type="button"
              onClick={() => onSelectSeal?.(seal)}
              className="flex flex-col items-center gap-3 rounded-lg border border-border bg-bg-card p-4 transition-colors hover:border-accent/30 hover:bg-bg-elevated"
              style={{
                animation: `seal-stagger 300ms ease-out ${index * 50}ms both`,
              }}
            >
              <SealIcon seal={seal} size={64} isLocked={isLocked} />
              <span className="font-ui text-xs text-text-secondary text-center">
                {seal.nameThai}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Add seal-stagger animation to globals.css**

In `app/globals.css`, add:

```css
@keyframes seal-stagger {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .seal-stagger,
  [style*="seal-stagger"] {
    animation: none !important;
  }
}
```

- [ ] **Step 3: Run build and lint**

Run: `npm run build && npm run lint`
Expected: Success.

- [ ] **Step 4: Commit**

```bash
git add components/seals/seal-gallery.tsx app/globals.css
git commit -m "feat: add SealGallery component with filter, sort, and stagger animation"
```

---

### Task 17: Create SealDetailModal component

**Files:**
- Create: `components/seals/seal-detail-modal.tsx`

**Interfaces:**
- Consumes: `AcademicSeal` from `lib/content/seals.ts`, `SealIcon` from `components/seals/seal-icon.tsx`
- Produces: `SealDetailModal` component. Props: `{ seal: AcademicSeal | null; earnedAt?: Date; onClose: () => void }`. Renders a modal overlay with seal details. Uses Esc key to close. Traps focus.

- [ ] **Step 1: Create the SealDetailModal component**

Create `components/seals/seal-detail-modal.tsx`:

```tsx
"use client";

import { useEffect, useRef } from "react";
import type { AcademicSeal } from "@/lib/content/seals";
import { SealIcon } from "./seal-icon";

interface SealDetailModalProps {
  seal: AcademicSeal | null;
  earnedAt?: Date;
  onClose: () => void;
}

const LEVEL_LABELS: Record<number, string> = {
  1: "Seeker",
  2: "Apprentice",
  3: "Scholar",
  4: "Sage",
  5: "Luminary",
  6: "Guardian",
  7: "Architect",
};

const LEVEL_COLORS: Record<string, string> = {
  Slate: "#465264",
  Blue: "#5F8DCE",
  Silver: "#C7D0DB",
  Gold: "#B89A63",
};

function getLevelColorName(color: string): string {
  if (color === "#465264") return "Slate";
  if (color === "#5F8DCE") return "Blue";
  if (color === "#C7D0DB") return "Silver";
  if (color === "#B89A63") return "Gold";
  return "";
}

export function SealDetailModal({ seal, earnedAt, onClose }: SealDetailModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!seal) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    closeButtonRef.current?.focus();
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [seal, onClose]);

  if (!seal) return null;

  const colorName = getLevelColorName(seal.color);
  const levelLabel = seal.level ? LEVEL_LABELS[seal.level] : "";

  return (
    <div
      className="fixed inset-0 z-[var(--z-overlay)] flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${seal.nameThai} — รายละเอียดตรา`}
    >
      <div
        className="max-w-sm rounded-xl border border-border bg-bg-card p-8 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center text-center">
          <SealIcon seal={seal} size={120} />
          <h2 className="mt-4 font-heading text-xl font-semibold text-text-heading">
            {seal.nameThai}
          </h2>
          <p className="text-sm text-text-secondary">{seal.name}</p>
          <div className="mt-3 w-full border-t border-border" />
          <p className="mt-3 text-sm text-text-secondary">
            {colorName} · Level {seal.level} {levelLabel && `· ${levelLabel}`}
          </p>
          <p className="mt-4 font-serif text-sm leading-relaxed text-text-body">
            {seal.description}
          </p>
          <p className="mt-2 text-xs text-text-secondary">
            เงื่อนไข: {seal.requirement}
          </p>
          {earnedAt && (
            <p className="mt-4 text-xs text-text-secondary">
              ได้รับเมื่อ {earnedAt.toLocaleDateString("th-TH")}
            </p>
          )}
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="mt-6 rounded-lg border border-border bg-bg px-6 py-2.5 text-sm text-text-heading transition-colors hover:border-accent hover:text-accent"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Run build and lint**

Run: `npm run build && npm run lint`
Expected: Success.

- [ ] **Step 3: Commit**

```bash
git add components/seals/seal-detail-modal.tsx
git commit -m "feat: add SealDetailModal with Esc-to-close and focus trap"
```

---

### Task 18: Create SealNotification component

**Files:**
- Create: `components/seals/seal-notification.tsx`

**Interfaces:**
- Consumes: `AcademicSeal` from `lib/content/seals.ts`, `SealIcon` from `components/seals/seal-icon.tsx`
- Produces: `SealNotification` component for silent seal-earned notifications. Props: `{ seal: AcademicSeal; onClose: () => void; onView: () => void }`. Slides down from top, auto-dismisses after 8 seconds.

- [ ] **Step 1: Create the SealNotification component**

Create `components/seals/seal-notification.tsx`:

```tsx
"use client";

import { useEffect } from "react";
import type { AcademicSeal } from "@/lib/content/seals";
import { SealIcon } from "./seal-icon";

interface SealNotificationProps {
  seal: AcademicSeal;
  onClose: () => void;
  onView: () => void;
}

export function SealNotification({ seal, onClose, onView }: SealNotificationProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 8000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className="fixed left-1/2 top-8 z-[var(--z-toast)] -translate-x-1/2"
      role="status"
      aria-live="polite"
      style={{
        animation: "seal-notif-in 300ms ease-out both",
      }}
    >
      <div className="flex items-center gap-4 rounded-xl border border-border bg-bg-card px-6 py-4 shadow-lg">
        <SealIcon seal={seal} size={40} />
        <div className="flex flex-col">
          <span className="font-ui text-xs uppercase tracking-wider text-text-secondary">
            ได้รับตราประทับวิชาการ
          </span>
          <span className="font-heading text-sm font-semibold text-text-heading">
            {seal.nameThai} — {seal.name}
          </span>
          <span className="text-xs text-text-secondary">{seal.requirement}</span>
        </div>
        <button
          type="button"
          onClick={onView}
          className="ml-4 rounded-lg border border-border px-3 py-1.5 text-xs text-text-heading transition-colors hover:border-accent hover:text-accent"
        >
          ดูตรา
        </button>
        <button
          type="button"
          onClick={onClose}
          className="ml-2 text-text-secondary hover:text-text-heading"
          aria-label="ปิด"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Add notification animation to globals.css**

In `app/globals.css`, add:

```css
@keyframes seal-notif-in {
  from {
    opacity: 0;
    transform: translate(-50%, -20px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}
```

- [ ] **Step 3: Run build and lint**

Run: `npm run build && npm run lint`
Expected: Success.

- [ ] **Step 4: Commit**

```bash
git add components/seals/seal-notification.tsx app/globals.css
git commit -m "feat: add SealNotification component with auto-dismiss and aria-live"
```

---

### Task 19: Add Academic Seals section to profile page

**Files:**
- Modify: `app/profile/page.tsx` (add seal gallery section)

**Interfaces:**
- Consumes: `SealGallery` from `components/seals/seal-gallery.tsx`, `SealDetailModal` from `components/seals/seal-detail-modal.tsx`, `SEALS` from `lib/content/seals.ts`

- [ ] **Step 1: Read current profile page structure**

Run: Read `app/profile/page.tsx` to understand current layout.

- [ ] **Step 2: Add seal section to profile page**

In `app/profile/page.tsx`, add a new section for Academic Seals. Import the necessary components and add a section showing the 5 most recently earned seals (32×32px) with a "ดูตราทั้งหมด" button that opens the full gallery.

For the profile page, since there's no DB backing for seals yet (UI-only), use an empty `earnedSealIds` array for now. The gallery will show all seals as locked.

Add to the profile page's JSX:

```tsx
import { SealGallery } from "@/components/seals/seal-gallery";
import { SealDetailModal } from "@/components/seals/seal-detail-modal";
import { SealIcon } from "@/components/seals/seal-icon";
import { SEALS, type AcademicSeal } from "@/lib/content/seals";
```

And in the page component (if it's a client component, or wrap in a client component):

```tsx
// Inside the profile page component:
const [showGallery, setShowGallery] = useState(false);
const [selectedSeal, setSelectedSeal] = useState<AcademicSeal | null>(null);
const earnedSealIds: string[] = []; // UI-only — no DB backing yet

// In the JSX, add a section:
<section className="mx-auto mt-16 max-w-[1200px] px-6">
  <h2 className="font-heading text-2xl font-semibold text-text-heading">
    ตราประทับวิชาการ
  </h2>
  <div className="mt-4 flex items-center gap-4">
    {SEALS.slice(0, 5).map((seal) => (
      <SealIcon
        key={seal.id}
        seal={seal}
        size={32}
        isLocked={!earnedSealIds.includes(seal.id)}
      />
    ))}
    <span className="text-sm text-text-secondary">
      {earnedSealIds.length} ตราที่ได้รับ
    </span>
  </div>
  <button
    type="button"
    onClick={() => setShowGallery(true)}
    className="mt-4 rounded-lg border border-border px-4 py-2 text-sm text-text-heading transition-colors hover:border-accent hover:text-accent"
  >
    ดูตราทั้งหมด
  </button>
</section>

{showGallery && (
  <div className="fixed inset-0 z-[var(--z-overlay)] overflow-y-auto bg-black/50 p-4">
    <div className="mx-auto mt-8 max-w-4xl rounded-xl border border-border bg-bg p-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-heading text-2xl font-semibold text-text-heading">
          ตราประทับวิชาการทั้งหมด
        </h2>
        <button
          type="button"
          onClick={() => setShowGallery(false)}
          className="text-text-secondary hover:text-text-heading"
          aria-label="ปิด"
        >
          ✕
        </button>
      </div>
      <SealGallery
        earnedSealIds={earnedSealIds}
        onSelectSeal={(seal) => setSelectedSeal(seal)}
      />
    </div>
  </div>
)}

<SealDetailModal
  seal={selectedSeal}
  onClose={() => setSelectedSeal(null)}
/>
```

Note: If `app/profile/page.tsx` is a server component, extract the seal section into a client component `components/seals/seal-profile-section.tsx` and import it.

- [ ] **Step 3: Run build and lint**

Run: `npm run build && npm run lint`
Expected: Success. Profile page now shows seal section.

- [ ] **Step 4: Commit**

```bash
git add app/profile/page.tsx components/seals/
git commit -m "feat: add Academic Seals section to profile page with gallery and modal"
```

---

## Phase 5: Error States + Motion/A11y Audit

### Task 20: Create root error boundary

**Files:**
- Create: `app/error.tsx`

**Interfaces:**
- Produces: Root error boundary that catches errors in any route segment without one.

- [ ] **Step 1: Create the root error boundary**

Create `app/error.tsx`:

```tsx
"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-[720px] px-6 py-24 text-center">
      <h2 className="font-heading text-2xl font-semibold text-text-heading">
        เกิดข้อผิดพลาด
      </h2>
      <p className="mt-4 text-sm leading-relaxed text-text-secondary">
        {error.message || "ไม่สามารถโหลดเนื้อหาได้ กรุณาลองใหม่อีกครั้ง"}
      </p>
      {error.digest && (
        <p className="mt-2 font-mono text-xs text-text-secondary/50">
          Error ID: {error.digest}
        </p>
      )}
      <button
        type="button"
        onClick={reset}
        className="mt-8 rounded-lg border border-border bg-bg-card px-6 py-3 text-sm text-text-heading transition-colors hover:border-accent hover:text-accent"
      >
        ลองใหม่
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Run build**

Run: `npm run build`
Expected: Success.

- [ ] **Step 3: Commit**

```bash
git add app/error.tsx
git commit -m "feat: add root error boundary with retry button"
```

---

### Task 21: Add error.tsx to all major route segments

**Files:**
- Create: `app/articles/error.tsx`
- Create: `app/concepts/error.tsx`
- Create: `app/knowledge/error.tsx`
- Create: `app/thinkers/error.tsx`
- Create: `app/books/error.tsx`
- Create: `app/themes/error.tsx`
- Create: `app/disciplines/error.tsx`
- Create: `app/schools/error.tsx`
- Create: `app/constellation/error.tsx`
- Create: `app/search/error.tsx`
- Create: `app/explore/error.tsx`
- Create: `app/timeline/error.tsx`
- Create: `app/studio/error.tsx`
- Create: `app/profile/error.tsx`

**Interfaces:**
- Produces: Error boundaries for all major route segments. Each is identical to the root error but can be customized per route.

- [ ] **Step 1: Create a shared error component to reduce duplication**

Create `components/error-boundary.tsx`:

```tsx
"use client";

import { useEffect } from "react";

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-[720px] px-6 py-24 text-center">
      <h2 className="font-heading text-2xl font-semibold text-text-heading">
        เกิดข้อผิดพลาด
      </h2>
      <p className="mt-4 text-sm leading-relaxed text-text-secondary">
        {error.message || "ไม่สามารถโหลดเนื้อหาได้ กรุณาลองใหม่อีกครั้ง"}
      </p>
      {error.digest && (
        <p className="mt-2 font-mono text-xs text-text-secondary/50">
          Error ID: {error.digest}
        </p>
      )}
      <button
        type="button"
        onClick={reset}
        className="mt-8 rounded-lg border border-border bg-bg-card px-6 py-3 text-sm text-text-heading transition-colors hover:border-accent hover:text-accent"
      >
        ลองใหม่
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Refactor root error.tsx to use the shared component**

Replace `app/error.tsx`:

```tsx
"use client";

import { ErrorBoundary } from "@/components/error-boundary";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <ErrorBoundary error={error} reset={reset} />;
}
```

- [ ] **Step 3: Create error.tsx in all major route segments**

For each route listed in the Files section above, create an `error.tsx` file with the same pattern:

```tsx
"use client";

import { ErrorBoundary } from "@/components/error-boundary";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <ErrorBoundary error={error} reset={reset} />;
}
```

Create this file in each of these directories:
- `app/articles/error.tsx`
- `app/concepts/error.tsx`
- `app/knowledge/error.tsx`
- `app/thinkers/error.tsx`
- `app/books/error.tsx`
- `app/themes/error.tsx`
- `app/disciplines/error.tsx`
- `app/schools/error.tsx`
- `app/constellation/error.tsx`
- `app/search/error.tsx`
- `app/explore/error.tsx`
- `app/timeline/error.tsx`
- `app/studio/error.tsx`
- `app/profile/error.tsx`

- [ ] **Step 4: Run build**

Run: `npm run build`
Expected: Success. All routes now have error boundaries.

- [ ] **Step 5: Commit**

```bash
git add components/error-boundary.tsx app/error.tsx app/articles/error.tsx app/concepts/error.tsx app/knowledge/error.tsx app/thinkers/error.tsx app/books/error.tsx app/themes/error.tsx app/disciplines/error.tsx app/schools/error.tsx app/constellation/error.tsx app/search/error.tsx app/explore/error.tsx app/timeline/error.tsx app/studio/error.tsx app/profile/error.tsx
git commit -m "feat: add error boundaries to all major route segments"
```

---

### Task 22: A11y and motion audit — verify reduced-motion and focus states

**Files:**
- Modify: `app/globals.css` (verify/augment reduced-motion and focus styles)
- Audit: all interactive components for focus indicators and aria attributes

**Interfaces:**
- Produces: Verified `prefers-reduced-motion` support across all animations. Focus ring on all interactive elements.

- [ ] **Step 1: Verify reduced-motion media query exists and covers all animations**

Run: `grep -n "prefers-reduced-motion" app/globals.css`
Expected: Shows at least one `@media (prefers-reduced-motion: reduce)` block. Verify it covers: scroll-reveal, seal-stagger, seal-notif-in, and any other keyframe animations.

- [ ] **Step 2: Add comprehensive reduced-motion block if missing**

In `app/globals.css`, verify or add at the end:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 3: Verify focus indicators on all interactive elements**

Run: `grep -n "focus-visible\|focus:ring\|focus:outline" app/globals.css components/*.tsx | wc -l`
Expected: Multiple matches. If few matches, add a global focus style in `app/globals.css`:

```css
@layer base {
  a:focus-visible,
  button:focus-visible,
  input:focus-visible,
  select:focus-visible,
  textarea:focus-visible,
  [role="button"]:focus-visible,
  [tabindex]:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
  }
}
```

- [ ] **Step 4: Run build and lint**

Run: `npm run build && npm run lint`
Expected: Success.

- [ ] **Step 5: Commit**

```bash
git add app/globals.css
git commit -m "feat: verify and augment reduced-motion and focus-visible styles for a11y"
```

---

### Task 23: Update AGENTS.md to reflect new reality

**Files:**
- Modify: `AGENTS.md` (update stale information to match the post-implementation state)

**Interfaces:**
- Produces: Accurate AGENTS.md that reflects the new color system, typography, icon system, navigation, and routes.

- [ ] **Step 1: Update the color section in AGENTS.md**

In `AGENTS.md`, section 3 (Conventions), update the design tokens description:
- Change `--color-deep-navy #080B16` / `--color-midnight #0B1020` to the actual light mode palette: `--color-bg #FAF8F5`, `--color-bg-card #FFFFFF`, `--color-bg-elevated #F5F3F0`
- Change `--color-antique-gold #C8A85A` / `--color-burnished-gold #D4AF37` to `--color-accent #5F8DCE` (Blue primary) and `--color-premium #B89A63` (Premium Gold for featured only)

- [ ] **Step 2: Update the font section in AGENTS.md**

Change the font description to:
- `--font-display` = Playfair Display (English/proper nouns)
- `--font-heading` = IBM Plex Serif + Noto Serif Thai (Thai headings)
- `--font-body` = Lora + Noto Serif Thai (body text — serif)
- `--font-ui` = Inter + Noto Sans Thai (UI elements — sans)
- `--font-wordmark` = Cinzel (ARCHRON wordmark)

- [ ] **Step 3: Update the icon section in AGENTS.md**

Change "Material Symbols" references to "Custom SVG icons (47 icons) in `components/icons.tsx` — 2px stroke, 24×24 viewBox, currentColor"

- [ ] **Step 4: Update the route map in AGENTS.md**

Add routes that exist but aren't documented: `/thinkers`, `/books`, `/themes`, `/disciplines`, `/timeline`, `/compare`, `/explore`, `/discover`, `/knowledge`, `/profile`, `/icons`

- [ ] **Step 5: Update navigation description**

Change from "8 items in 4 tiers" to "5 items per navigation-rule.md"

- [ ] **Step 6: Add Academic Seals section**

Add a new section describing the Academic Seals UI system: 15 seals, 4 levels (Slate/Blue/Silver/Gold), components in `components/seals/`, data in `lib/content/seals.ts`, UI-only (no DB yet).

- [ ] **Step 7: Run lint to verify AGENTS.md doesn't break anything**

Run: `npm run lint`
Expected: Success.

- [ ] **Step 8: Commit**

```bash
git add AGENTS.md
git commit -m "docs: update AGENTS.md to reflect new design system, colors, fonts, icons, routes"
```

---

## Verification Checklist (Final)

After all 23 tasks are complete, run this final verification:

- [ ] `npm run build` — green
- [ ] `npm run lint` — green
- [ ] `npx vitest run` — all unit tests pass
- [ ] Visual check: primary color is Blue `#5F8DCE` across all pages
- [ ] Visual check: body text is serif (Lora), UI elements are sans (Inter)
- [ ] Visual check: no Material Symbols icons remain anywhere
- [ ] Visual check: `/icons` page shows all 47 icons
- [ ] Visual check: navigation has 5 items on desktop, 4 on mobile
- [ ] Visual check: homepage follows Hero → Search → Continue Reading → Featured Guide → Latest Knowledge → Footer
- [ ] Visual check: `/support` and `/guide` pages render from .mdx files
- [ ] Visual check: profile page shows Academic Seals section with gallery
- [ ] Visual check: error pages render correctly when a route throws
- [ ] Check: `prefers-reduced-motion` disables all animations
- [ ] Check: all interactive elements have visible focus indicators

---

End of Implementation Plan
