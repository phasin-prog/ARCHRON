# Icon System Redesign — Filled Duotone (Phase 1: Navigation + Core)

**Date:** 2026-07-14  
**Status:** Design approved, pending implementation  
**Scope:** Phase 1 — 24 Navigation + Core icons (7 custom, 17 Phosphor)

---

## 1. Motivation

Current icons are **stroke-based outlines** (1.5px, fill="none"). User wants **Facebook-style filled duotone icons** — cleaner, more modern, consistent visual weight across the entire site.

## 2. Visual Design

### 2.1 Duotone Convention

Every icon has two visual layers:

| Layer | Opacity | Purpose |
|---|---|---|
| **Primary** | 100% | Main shape — the instantly recognizable silhouette |
| **Detail** | ~40% | Secondary elements — depth, context, nuance |

Both layers use `fill="currentColor"` — consumers control color via `text-*` or `style={{ color }}` on the parent.

### 2.2 Design Language

- **Rounded, soft geometry** — circles, rounded rects, smooth arcs
- **Consistent optical weight** — all primary shapes have similar visual density
- **No strokes** — pure fill, no outlines
- **24×24 viewBox** (custom icons)
- **currentColor** for everything

## 3. Architecture

### 3.1 File Structure

```
src/components/
├── icons.tsx           # barrel: 7 custom icon implementations + re-exports from phosphor-map
└── phosphor-map.tsx    # 17 standard icons mapped from @phosphor-icons/react
```

Note: `icons.tsx` remains a flat file (no directory restructuring needed). Consumers import `from "@/components/icons"` as before — resolves to `icons.tsx`. The file internally imports from `./phosphor-map` and re-exports.

### 3.2 Consumer API (Zero Breaking Changes)

All 51 consumer files continue to import the same named exports:

```tsx
// Before and after — identical import
import { SearchIcon, ArrowRightIcon, ConceptIcon } from "@/components/icons";

// Usage — identical
<SearchIcon className="h-5 w-5 text-accent" />
```

### 3.3 Phosphor Integration

- **Library:** `@phosphor-icons/react` — MIT license, tree-shakeable
- **Weight:** `"duotone"` — provides 2-layer opacity natively
- **Size:** Phosphor's 256×256 viewBox scales down to any size via className
- **Import map:**

```tsx
// phosphor-map.tsx
import { MagnifyingGlass } from "@phosphor-icons/react";
export const SearchIcon = (props) => <MagnifyingGlass weight="duotone" {...props} />;
```

No new component wrapping — just named re-exports.

## 4. Icon Registry

### 4.1 Custom Icons (7 — Archron Identity)

| Icon | Primary (100%) | Detail (40%) | Concept |
|---|---|---|---|
| `ArchronMark` | Inner circle + center dot | Outer ring | Open circle → center is the point of knowledge |
| `ArchronLogomark` | Vesica piscis (middle) + 2 polar dots | Outer ring + center dot | Sacred geometry, compressed |
| `KnowledgeHubIcon` | 5 nodes (circles) | 4 connecting lines | Star topology — nodes prominent, edges subtle |
| `SynthesisIcon` | Left circle | Right circle + overlap zone | Venn diagram — one side dominant, synthesis secondary |
| `PathIcon` | Center node | 2 endpoint nodes + connecting lines | Path — destination prominent, journey subtle |
| `RootIcon` | Trunk / solid base shape | Branches / leaves on sides | Root prominent, growth secondary |
| `SchoolIcon` | 2 central pillars | Outer columns + roof | Hall of wisdom — main pillars solid |

### 4.2 Phosphor Library Icons (17 — Standard)

> **Note:** Phosphor icon names verified during implementation. Some names may need adjustment if the exact icon or duotone variant differs from the Phosphor catalog.

| Archron Name | Phosphor Icon | Weight |
|---|---|---|
| `ArrowRightIcon` | `ArrowRight` | duotone |
| `BookIcon` | `BookOpen` | duotone |
| `ChevronDownIcon` | `CaretDown` | duotone |
| `CloseIcon` | `X` | duotone |
| `ConceptIcon` | `Graph` | duotone |
| `EditIcon` | `PencilSimple` | duotone |
| `ExternalLinkIcon` | `ArrowSquareOut` | duotone |
| `HeartIcon` | `Heart` | duotone |
| `HelpIcon` | `Question` | duotone |
| `HistoryIcon` | `ClockCounterClockwise` | duotone |
| `LoginIcon` | `SignIn` | duotone |
| `LogoutIcon` | `SignOut` | duotone |
| `ManifestoIcon` | `Scroll` | duotone |
| `MenuIcon` | `List` | duotone |
| `PersonIcon` | `User` | duotone |
| `QuoteIcon` | `Quotes` | duotone |
| `SearchIcon` | `MagnifyingGlass` | duotone |

## 5. Tabbar Redesign

As part of Phase 1, the mobile bottom tabbar is redesigned to Facebook-style:

```
┌─────────────────────────────────────────────────┐
│ [คลัง]   [แผนที่]   [หน้าแรก]   [ค้นหา]   [นักปราชญ์] │
└─────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Background | `#FFFFFF` |
| Top border | `1px solid accent/8` |
| Icon size | `h-6 w-6` (24px) |
| Label size | `text-[10px]` |
| Active color | `text-accent` (#8C1515) |
| Inactive color | `text-text-secondary/50` |
| Animation | None — static |
| Scroll behavior | Always visible (no scroll-hide) |
| Visibility | `max-lg:flex lg:hidden` |
| Safe area | `pb-[env(safe-area-inset-bottom)]` |

## 6. Files Changed

### New Files
| File | Content |
|---|---|
| `src/components/phosphor-map.tsx` | 17 Phosphor duotone icon re-exports |
| `docs/superpowers/specs/2026-07-14-icon-duotone-design.md` | This spec |

### Modified Files
| File | Changes |
|---|---|
| `src/components/icons.tsx` | Remove 17 standard icons, rewrite 7 custom SVG paths to filled duotone, re-export from phosphor-map |
| `src/components/tabbar.tsx` | Facebook-style: white bg, thin border, duotone icons, static |

### Unchanged
| Group | Count |
|---|---|
| All 51 consumer files | 0 changes needed |
| CSS, layout, config | 0 changes |
| Remaining 58 icons | Out of scope (Phase 2+) |

## 7. Dependencies

```bash
npm install @phosphor-icons/react
```

## 8. Verification

```bash
npx tsc --noEmit    # TypeScript check
npm run lint        # ESLint
npm run build       # Production build
```

Manual verification:
- [ ] All 24 icons render correctly at 24×24
- [ ] Duotone opacity visible (primary ~100%, detail ~40%)
- [ ] Icons recolor correctly via `text-accent`, `text-text-secondary`
- [ ] Tabbar renders correctly on mobile viewport (375×667)
- [ ] Tabbar hidden on desktop (1024px+)
- [ ] All 51 consumer pages load without import errors

## 9. Out of Scope (Future Phases)

- Phase 2: Discipline rings (12 icons) — PsychologyIcon, PhilosophyIcon, etc.
- Phase 3: Manifesto section icons (10) — PreambleIcon, WhyExistIcon, etc.
- Phase 4: Content type + badges — SymbolIcon, TermIcon, SourceIcon, CollectionIcon, etc.
- Phase 5: Remaining utility icons — ScrollToTop, Carousel, etc.
- `/icons` showcase page update
- `icon.css` refactor
- `ReadingPage` section icons redesign
