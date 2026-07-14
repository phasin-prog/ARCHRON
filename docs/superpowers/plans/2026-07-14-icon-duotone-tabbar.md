# Icon Duotone + Facebook-Style Tabbar — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace 17 standard stroke icons with Phosphor duotone, rewrite 7 Archron-identity icons as filled duotone SVG, and redesign mobile tabbar to Facebook-style clean.

**Architecture:** Hybrid approach — 7 custom icons rewritten inline in `icons.tsx` using filled duotone SVG, 17 standard icons delegated to `@phosphor-icons/react` via `phosphor-map.tsx`. Consumer API unchanged (`import { X } from "@/components/icons"`). Tabbar gets minimal Facebook-style redesign.

**Tech Stack:** React 19, TypeScript, Tailwind v4, `@phosphor-icons/react` (MIT, tree-shakeable)

## Global Constraints

- Thai-first UI — all labels in Thai
- Duotone icon: primary shape fill 100% opacity, detail shape fill ~40% opacity, both `currentColor`
- 51 consumer files must NOT change — imports stay `from "@/components/icons"`
- TypeScript strict — no `any`
- ESLint flat config pass
- Build must pass: `npm run build`
- Commit: push to `main`, concise Thai/English commit messages
- `pb-28` on body stays (tabbar height unchanged)
- Tabbar: `max-lg:flex lg:hidden` — visible only on mobile

---

### Task 1: Install Phosphor dependency

**Files:**
- Modify: `package.json`

**Interfaces:**
- Produces: `@phosphor-icons/react` available as import

- [ ] **Step 1: Install package**

```bash
npm install @phosphor-icons/react
```

- [ ] **Step 2: Verify installation**

```bash
node -e "require('@phosphor-icons/react')" && echo "OK"
```

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install @phosphor-icons/react for duotone icons"
```

---

### Task 2: Create phosphor-map.tsx

**Files:**
- Create: `src/components/phosphor-map.tsx`

**Interfaces:**
- Consumes: `@phosphor-icons/react` (Task 1)
- Produces: 17 named exports matching current `icons.tsx` export names, each accepting `IconProps` (`{ className?: string; style?: React.CSSProperties }`)

- [ ] **Step 1: Create the file**

Create `src/components/phosphor-map.tsx`:

```tsx
// Phosphor duotone icon mappings — standard UI icons
// Each maps an Archron icon name to a Phosphor duotone variant
// Props passthrough: className, style — consumer API unchanged

import type { IconProps } from "@/components/icons";
import {
  ArrowRight,
  ArrowSquareOut,
  BookOpen,
  CaretDown,
  ClockCounterClockwise,
  Graph,
  Heart,
  List,
  MagnifyingGlass,
  PencilSimple,
  Question,
  Quotes,
  Scroll,
  SignIn,
  SignOut,
  User,
  X,
} from "@phosphor-icons/react";

export function SearchIcon({ className = "h-5 w-5", style }: IconProps) {
  return <MagnifyingGlass className={className} style={style} weight="duotone" aria-hidden="true" />;
}

export function MenuIcon({ className = "h-5 w-5", style }: IconProps) {
  return <List className={className} style={style} weight="duotone" aria-hidden="true" />;
}

export function ArrowRightIcon({ className = "h-5 w-5", style }: IconProps) {
  return <ArrowRight className={className} style={style} weight="duotone" aria-hidden="true" />;
}

export function CloseIcon({ className = "h-5 w-5", style }: IconProps) {
  return <X className={className} style={style} weight="duotone" aria-hidden="true" />;
}

export function LoginIcon({ className = "h-5 w-5", style }: IconProps) {
  return <SignIn className={className} style={style} weight="duotone" aria-hidden="true" />;
}

export function EditIcon({ className = "h-5 w-5", style }: IconProps) {
  return <PencilSimple className={className} style={style} weight="duotone" aria-hidden="true" />;
}

export function LogoutIcon({ className = "h-5 w-5", style }: IconProps) {
  return <SignOut className={className} style={style} weight="duotone" aria-hidden="true" />;
}

export function ExternalLinkIcon({ className = "h-5 w-5", style }: IconProps) {
  return <ArrowSquareOut className={className} style={style} weight="duotone" aria-hidden="true" />;
}

export function HelpIcon({ className = "h-5 w-5", style }: IconProps) {
  return <Question className={className} style={style} weight="duotone" aria-hidden="true" />;
}

export function HeartIcon({ className = "h-5 w-5", style }: IconProps) {
  return <Heart className={className} style={style} weight="duotone" aria-hidden="true" />;
}

export function ManifestoIcon({ className = "h-5 w-5", style }: IconProps) {
  return <Scroll className={className} style={style} weight="duotone" aria-hidden="true" />;
}

export function QuoteIcon({ className = "h-5 w-5", style }: IconProps) {
  return <Quotes className={className} style={style} weight="duotone" aria-hidden="true" />;
}

export function BookIcon({ className = "h-5 w-5", style }: IconProps) {
  return <BookOpen className={className} style={style} weight="duotone" aria-hidden="true" />;
}

export function ConceptIcon({ className = "h-5 w-5", style }: IconProps) {
  return <Graph className={className} style={style} weight="duotone" aria-hidden="true" />;
}

export function PersonIcon({ className = "h-5 w-5", style }: IconProps) {
  return <User className={className} style={style} weight="duotone" aria-hidden="true" />;
}

export function ChevronDownIcon({ className = "h-5 w-5", style }: IconProps) {
  return <CaretDown className={className} style={style} weight="duotone" aria-hidden="true" />;
}

export function HistoryIcon({ className = "h-5 w-5", style }: IconProps) {
  return <ClockCounterClockwise className={className} style={style} weight="duotone" aria-hidden="true" />;
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/phosphor-map.tsx
git commit -m "feat: add phosphor-map — 17 standard icons as Phosphor duotone"
```

---

### Task 3: Update icons.tsx — remove 17 standard, rewrite 7 custom to filled duotone, re-export phosphor

**Files:**
- Modify: `src/components/icons.tsx`

**Interfaces:**
- Consumes: `@/components/phosphor-map` (Task 2)
- Produces: Same 82 named exports as before (17 now re-exported from phosphor-map, 7 rewritten, ~58 unchanged)

**Removals from icons.tsx (17 functions to delete):**
`SearchIcon`, `MenuIcon`, `ArrowRightIcon`, `CloseIcon`, `LoginIcon`, `EditIcon`, `LogoutIcon`, `ExternalLinkIcon`, `HelpIcon`, `HeartIcon`, `ManifestoIcon`, `QuoteIcon`, `BookIcon`, `ConceptIcon`, `PersonIcon`, `ChevronDownIcon`, `HistoryIcon`

**Rewrites (7 functions to replace body):**
`ArchronMark`, `ArchronLogomark`, `KnowledgeHubIcon`, `SynthesisIcon`, `PathIcon`, `RootIcon`, `SchoolIcon`

- [ ] **Step 1: Delete 17 icon function bodies from icons.tsx**

Delete the following functions:
- `ConceptIcon` (lines 71–82)
- `PersonIcon` (lines 84–92)
- `BookIcon` (lines 94–102)
- `SearchIcon` (lines 163–171)
- `MenuIcon` (lines 173–182)
- `ArrowRightIcon` (lines 184–200)
- `ManifestoIcon` (lines 220–232)
- `QuoteIcon` (lines 234–243)
- `ExternalLinkIcon` (lines 245–255)
- `HelpIcon` (lines 257–267)
- `HeartIcon` (lines 269–275)
- `CloseIcon` (lines 277–286)
- `LoginIcon` (lines 288–298)
- `EditIcon` (lines 300–309)
- `LogoutIcon` (lines 311–323)
- `ChevronDownIcon` (lines 654–659)
- `HistoryIcon` (lines 380–389)

- [ ] **Step 2: Add re-export block at top of icons.tsx**

Insert after the `IconProps` type export (after line 4), before any function:

```tsx
// Standard UI icons — delegated to Phosphor duotone
export {
  SearchIcon,
  MenuIcon,
  ArrowRightIcon,
  CloseIcon,
  LoginIcon,
  EditIcon,
  LogoutIcon,
  ExternalLinkIcon,
  HelpIcon,
  HeartIcon,
  ManifestoIcon,
  QuoteIcon,
  BookIcon,
  ConceptIcon,
  PersonIcon,
  ChevronDownIcon,
  HistoryIcon,
} from "@/components/phosphor-map";
```

- [ ] **Step 3: Rewrite ArchronMark to filled duotone**

Replace the `ArchronMark` function body (lines 24–46) with:

```tsx
export function ArchronMark({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth={1.5} fill="currentColor" opacity={0.4} />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}
```

- [ ] **Step 4: Rewrite ArchronLogomark to filled duotone**

Replace the `ArchronLogomark` function body (lines 50–69) with:

```tsx
export function ArchronLogomark({ className = "h-7 w-7" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <circle cx="24" cy="24" r="21" stroke="currentColor" strokeWidth={1.1} fill="currentColor" opacity={0.4} />
      <circle cx="17.5" cy="24" r="12.5" fill="currentColor" />
      <circle cx="30.5" cy="24" r="12.5" fill="currentColor" />
      <circle cx="24" cy="3.5" r="1.4" fill="currentColor" />
      <circle cx="24" cy="44.5" r="1.4" fill="currentColor" />
      <circle cx="24" cy="24" r="2.6" fill="currentColor" />
    </svg>
  );
}
```

- [ ] **Step 5: Rewrite KnowledgeHubIcon to filled duotone**

Replace the `KnowledgeHubIcon` function body (lines 202–218) with:

```tsx
export function KnowledgeHubIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="5" cy="5" r="2.5" fill="currentColor" />
      <circle cx="19" cy="5" r="2.5" fill="currentColor" />
      <circle cx="5" cy="19" r="2.5" fill="currentColor" />
      <circle cx="12" cy="12" r="2.5" fill="currentColor" />
      <circle cx="19" cy="19" r="2.5" fill="currentColor" />
      <line x1="7.5" y1="5" x2="9.5" y2="12" stroke="currentColor" strokeWidth={1.5} opacity={0.4} />
      <line x1="16.5" y1="5" x2="14.5" y2="12" stroke="currentColor" strokeWidth={1.5} opacity={0.4} />
      <line x1="7.5" y1="19" x2="9.5" y2="12" stroke="currentColor" strokeWidth={1.5} opacity={0.4} />
      <line x1="16.5" y1="19" x2="14.5" y2="12" stroke="currentColor" strokeWidth={1.5} opacity={0.4} />
    </svg>
  );
}
```

- [ ] **Step 6: Rewrite SynthesisIcon to filled duotone**

Replace the `SynthesisIcon` function body (lines 590–599) with:

```tsx
export function SynthesisIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="7" cy="12" r="4.5" fill="currentColor" opacity={0.4} />
      <circle cx="17" cy="12" r="4.5" fill="currentColor" opacity={0.4} />
      <circle cx="12" cy="12" r="4.5" fill="currentColor" />
    </svg>
  );
}
```

- [ ] **Step 7: Rewrite PathIcon to filled duotone**

Replace the `PathIcon` function body (lines 150–161) with:

```tsx
export function PathIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="4" cy="4" r="2" fill="currentColor" opacity={0.4} />
      <circle cx="12" cy="12" r="2.5" fill="currentColor" />
      <circle cx="20" cy="20" r="2" fill="currentColor" opacity={0.4} />
      <line x1="6" y1="6" x2="9.5" y2="9.5" stroke="currentColor" strokeWidth={1.5} opacity={0.4} />
      <line x1="14.5" y1="14.5" x2="18" y2="22" stroke="currentColor" strokeWidth={1.5} opacity={0.4} />
    </svg>
  );
}
```

- [ ] **Step 8: Rewrite RootIcon to filled duotone**

Replace the `RootIcon` function body (lines 544–555) with:

```tsx
export function RootIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 22V10" stroke="currentColor" strokeWidth={2} opacity={0.4} />
      <path d="M12 10C12 10 8 6 12 2C12 2 16 6 12 10Z" fill="currentColor" />
      <circle cx="12" cy="22" r="1.5" fill="currentColor" />
    </svg>
  );
}
```

- [ ] **Step 9: Rewrite SchoolIcon to filled duotone**

Replace the `SchoolIcon` function body (lines 104–116) with:

```tsx
export function SchoolIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 20V7L12 3L21 7V20" fill="currentColor" opacity={0.4} />
      <rect x="7" y="9" width="3" height="12" fill="currentColor" />
      <rect x="14" y="9" width="3" height="12" fill="currentColor" />
    </svg>
  );
}
```

- [ ] **Step 10: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 11: Verify no missing export references**

Search for any consumer of the 17 deleted icons to confirm the re-export path works:

```bash
npx tsc --noEmit
```

Expected: no import errors.

- [ ] **Step 12: Commit**

```bash
git add src/components/icons.tsx
git commit -m "refactor: rewrite 7 custom icons to filled duotone, delegate 17 standard icons to Phosphor"
```

---

### Task 4: Rewrite tabbar.tsx — Facebook-style clean

**Files:**
- Modify: `src/components/tabbar.tsx`

**Interfaces:**
- Consumes: Duotone icons from `@/components/icons` (Task 3)
- Produces: Facebook-style tabbar — white background, thin top border, duotone icons with labels, static (no scroll-hide, no tap animation)

- [ ] **Step 1: Rewrite tabbar.tsx**

Write `src/components/tabbar.tsx`:

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArchronMark,
  KnowledgeHubIcon,
  PathIcon,
  SearchIcon,
  SchoolIcon,
} from "@/components/icons";

type Item = { href: string; label: string; Icon: React.ComponentType<{ className?: string }> };

const ITEMS: Item[] = [
  { href: "/knowledge", label: "คลัง", Icon: KnowledgeHubIcon },
  { href: "/constellation", label: "แผนที่", Icon: PathIcon },
  { href: "/", label: "หน้าแรก", Icon: ArchronMark },
  { href: "/search", label: "ค้นหา", Icon: SearchIcon },
  { href: "/thinkers", label: "นักปราชญ์", Icon: SchoolIcon },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Tabbar() {
  const pathname = usePathname() || "/";

  if (pathname.startsWith("/studio")) return null;

  return (
    <nav
      aria-label="นำทางหลัก"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-accent/8 bg-white pb-[calc(env(safe-area-inset-bottom,0px)+2px)] max-lg:flex lg:hidden"
    >
      {ITEMS.map((it) => {
        const active = isActive(pathname, it.href);
        return (
          <Link
            key={it.href}
            href={it.href}
            aria-label={it.label}
            aria-current={active ? "page" : undefined}
            className="flex flex-1 flex-col items-center justify-center gap-0.5 py-2"
          >
            <it.Icon
              className={`h-6 w-6 transition-colors duration-200 ${
                active ? "text-accent" : "text-text-secondary/55"
              }`}
            />
            <span
              className={`text-[10px] font-medium leading-none transition-colors duration-200 ${
                active ? "text-accent" : "text-text-secondary/50"
              }`}
            >
              {it.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
```

- [ ] **Step 2: Delete nb-* CSS if still present**

Remove any remaining `.nb-pill`, `.nb-item`, `.nb-icon` CSS blocks from `src/app/globals.css` if they still exist after the earlier revert.

Check: `rg -n "nb-pill|nb-item|nb-icon" src/app/globals.css`
If found, delete those blocks.

- [ ] **Step 3: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Verify ESLint**

```bash
npm run lint
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/tabbar.tsx
git commit -m "refactor: Facebook-style mobile tabbar — white bg, thin border, duotone icons, static"
```

---

### Task 5: Final verification

**Files:**
- Modify: `src/app/globals.css` (if nb-* cleanup needed)

**Interfaces:**
- Consumes: All previous tasks
- Produces: Clean build, clean lint

- [ ] **Step 1: TypeScript check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 2: ESLint**

```bash
npm run lint
```

Expected: no errors.

- [ ] **Step 3: Production build**

```bash
npm run build
```

Expected: compilation success, all static pages generated.

- [ ] **Step 4: Commit any final cleanup**

```bash
git status
# If nb-* CSS blocks were removed from globals.css
git add src/app/globals.css
git commit -m "chore: remove legacy nb-* CSS after tabbar redesign"
```
