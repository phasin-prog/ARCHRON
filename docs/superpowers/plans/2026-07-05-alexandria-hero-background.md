# Alexandria Colonnade & Esoteric Symbols Hero Background Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the homepage Hero Section background (`app/page.tsx`) into the Ancient Library of Alexandria with Hellenistic Colonnade lines, Esoteric Symbols Parallax (`Ψ`, `Φ`, `Ω`, `Α`, `Χ`), and Psyche/Sapientia color tokens without importing any "12 Layers" concepts.

**Architecture:** We add clean, reusable background CSS utility classes (`.symbol-parallax`, `.colonnade-pillar`, `.astrolabe-ring`) to `app/globals.css` that respect reduced motion and responsive breakpoints. Then we update the Hero Section container in `app/page.tsx` to include these background elements behind the existing content structure (`z-0` vs `z-10`).

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind CSS v4, Vanilla CSS (OKLCH & CSS Variables).

## Global Constraints

- **Thai-first accessibility:** UI text and structure remain in Thai as documented in `AGENTS.md`.
- **No "12 Layers" importation:** Do not add or reference any Layer 01-12 concepts or text from external sample files.
- **100% Content retention:** Do not remove or alter any existing text, badge, button, or structural wrapper in `app/page.tsx`.
- **Build & Lint safety:** Every task must pass `npm run lint` and `npm run build` cleanly before completion.

---

### Task 1: Alexandria Background & Glyph Styling in `app/globals.css`

**Files:**
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: `--color-sapientia` (`#C79A4A`), `--color-psyche` (`#6E93A8`), `--color-deep-navy` (`#080B16`), `--font-serif`.
- Produces: CSS utility classes `.symbol-parallax`, `.colonnade-pillar`, and `.astrolabe-ring` used by `app/page.tsx`.

- [ ] **Step 1: Write the failing check / baseline inspection**

Run: `npm run lint`
Expected: PASS (confirming clean starting state).

- [ ] **Step 2: Add Alexandria background classes to `app/globals.css`**

Append the following styles to `app/globals.css` just before the responsive section or at the end of utility rules:

```css
/* ============================================================================
   ARCHRON — Alexandria Library Hero Background Utilities (Phase 40)
   ============================================================================ */
.symbol-parallax {
  position: absolute;
  font-family: var(--font-serif);
  font-weight: 700;
  user-select: none;
  pointer-events: none;
  z-index: 0;
  line-height: 1;
  transition: opacity 1s ease-out, transform 1s ease-out;
}

.colonnade-pillar {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 1px;
  pointer-events: none;
  z-index: 0;
  background: linear-gradient(
    180deg,
    transparent 0%,
    color-mix(in srgb, var(--color-sapientia) 15%, transparent) 30%,
    color-mix(in srgb, var(--color-psyche) 15%, transparent) 70%,
    transparent 100%
  );
}

.astrolabe-ring {
  position: absolute;
  left: 50%;
  top: 45%;
  transform: translate(-50%, -50%);
  border-radius: 9999px;
  border: 1px solid color-mix(in srgb, var(--color-sapientia) 18%, transparent);
  pointer-events: none;
  z-index: 0;
}

@media (prefers-reduced-motion: reduce) {
  .symbol-parallax {
    transition: none !important;
    transform: none !important;
  }
}
```

- [ ] **Step 3: Verify syntax and build integrity**

Run: `npm run lint`
Expected: PASS with 0 errors.

- [ ] **Step 4: Commit changes**

```bash
git add app/globals.css
git commit -m "style: add Alexandria colonnade and symbol parallax css utilities"
```

---

### Task 2: Implement Alexandria Background in `app/page.tsx`

**Files:**
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `.symbol-parallax`, `.colonnade-pillar`, `.astrolabe-ring` from `app/globals.css`.
- Produces: The complete Alexandria Hero background in `HomePage()`.

- [ ] **Step 1: Check current Hero Section structure in `app/page.tsx`**

Verify that `section.relative` in `HomePage()` contains the background divs at lines 85-111 and content wrapper at line 112 (`div.relative.z-10`).

- [ ] **Step 2: Update Hero Section background elements in `app/page.tsx`**

Replace the background container section (around lines 85-111) inside `<section className="relative ...">` with the new Alexandria Colonnade, Esoteric Symbols Parallax, and Astrolabe Centerpiece:

```tsx
          {/* Ambient Glow: แสงเรืองรองจางๆ จากศูนย์กลางหอสมุด */}
          <div
            className="pointer-events-none absolute left-1/2 top-[42%] z-0 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(199, 154, 74, 0.08) 0%, rgba(110, 147, 168, 0.03) 50%, rgba(199, 154, 74, 0) 70%)",
            }}
          />

          {/* Layer A: Hellenistic Colonnade (เสมหินระเบียงหอสมุดอเล็กซานเดรีย) */}
          <div className="colonnade-pillar left-[10%] hidden md:block" />
          <div className="colonnade-pillar left-[25%] hidden lg:block" />
          <div className="colonnade-pillar right-[25%] hidden lg:block" />
          <div className="colonnade-pillar right-[10%] hidden md:block" />

          {/* Layer B: Esoteric Symbols Parallax (สัญลักษณ์ปรัชญาฉากหลังสี Psyche & Sapientia) */}
          <div 
            className="symbol-parallax text-7xl sm:text-8xl md:text-[14rem] lg:text-[18rem] text-psyche opacity-[0.035]"
            style={{ top: "10%", left: "4%" }}
            aria-hidden="true"
          >
            Ψ
          </div>
          <div 
            className="symbol-parallax text-8xl sm:text-9xl md:text-[16rem] lg:text-[22rem] text-sapientia opacity-[0.035]"
            style={{ bottom: "8%", right: "5%" }}
            aria-hidden="true"
          >
            Φ
          </div>
          <div 
            className="symbol-parallax text-6xl sm:text-7xl md:text-[12rem] lg:text-[14rem] text-psyche opacity-[0.025]"
            style={{ top: "55%", right: "12%" }}
            aria-hidden="true"
          >
            Ω
          </div>
          <div 
            className="symbol-parallax text-6xl sm:text-7xl md:text-[12rem] lg:text-[16rem] text-sapientia opacity-[0.03]"
            style={{ bottom: "20%", left: "12%" }}
            aria-hidden="true"
          >
            Α
          </div>
          <div 
            className="symbol-parallax text-7xl sm:text-8xl md:text-[14rem] lg:text-[20rem] text-sapientia opacity-[0.02]"
            style={{ top: "6%", left: "45%" }}
            aria-hidden="true"
          >
            Χ
          </div>

          {/* Layer C: The Astrolabe Centerpiece (วงแหวนดาราศาสตร์โบราณและคัมภีร์) */}
          <div className="pointer-events-none absolute left-1/2 top-[45%] z-0 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2">
            <div className="astrolabe-ring h-[280px] w-[280px] opacity-25" />
            <div className="astrolabe-ring h-[220px] w-[220px] opacity-20 border-dashed" />
            <div className="astrolabe-ring h-[160px] w-[160px] opacity-30 border-[var(--color-soft-gold)]" />
            
            {/* หนังสือโบราณ — สัญลักษณ์ living library */}
            <svg
              className="absolute left-1/2 top-1/2 h-[118px] w-[118px] -translate-x-1/2 -translate-y-1/2 opacity-35"
              viewBox="0 0 120 120"
              fill="none"
              stroke="var(--color-soft-gold)"
              strokeWidth={1.4}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M60 40C50 32 36 29 22 31v54c14-2 28 1 38 9 10-8 24-11 38-9V31c-14-2-28 1-38 9z" />
              <path d="M60 40v54" />
            </svg>
          </div>
```

- [ ] **Step 3: Run lint and verify TypeScript types**

Run: `npm run lint`
Expected: PASS with 0 errors.

- [ ] **Step 4: Commit changes**

```bash
git add app/page.tsx
git commit -m "feat: implement Alexandria library background with symbol parallax in Hero section"
```

---

### Task 3: Final Production Build Verification

**Files:**
- Test: All route generations across `app/` via `npm run build`.

- [ ] **Step 1: Execute production build**

Run: `npm run build`
Expected: Successful compilation and static generation of all 150 routes with zero errors.

- [ ] **Step 2: Final git verification**

Run: `git status`
Expected: Clean working tree on current branch.
