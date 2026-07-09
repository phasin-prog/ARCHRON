import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { Breadcrumb } from "@/components/breadcrumb";
import { ArrowRightIcon } from "@/components/icons";
import { PageScaffold } from "@/components/page-scaffold";
import { COSMOLOGY_ACCENT, type Cosmology } from "@/lib/content/cosmology";
import { conceptRegistry } from "@/lib/content/concept-registry";
import {
  getPublicEntries,
  getPublicReadingSets,
  getPublicSchools,
} from "@/lib/content/public-source";
import { THEMES } from "@/lib/content/themes";
import { DISCIPLINE_META } from "@/components/discipline-meta";

// ตัวเลขบนการ์ดมาจากข้อมูลจริง (DB → cache → seed) — รีเฟรชตามรอบ ISR เดียวกับหน้าเนื้อหา (§3)
export const revalidate = 300;

export const metadata: Metadata = {
  title: "เข้าสู่คลังความรู้ — ARCHRON",
  description:
    "สารบัญนำทางคลังความรู้ของ ARCHRON — งานเขียน คลังแนวคิด สำนักคิด แผนที่ความสัมพันธ์ เส้นทางการอ่าน แก่นเรื่อง และศาสตร์ที่เราศึกษา",
};

// ไอคอนเส้นเฉพาะของหน้านี้ (ตาม mockup ที่อนุมัติ) — currentColor คุมด้วยสี accent
function Ico({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">
      {children}
    </svg>
  );
}

type KnowledgeCard = {
  title: string;
  engTitle: string;
  description: string;
  href: string;
  icon: ReactNode;
  /** สีการ์ดอ้าง Colour Cosmology จาก lib/content/cosmology.ts เท่านั้น (single source of truth) */
  cosmology: Cosmology;
  isNew?: boolean;
};

const KNOWLEDGE_SECTIONS: KnowledgeCard[] = [
  {
    title: "อ่านงานเขียน",
    engTitle: "Articles",
    description: "บทความที่อธิบายและตีความแนวคิดสำคัญในบริบทของมัน",
    href: "/articles",
    cosmology: "sapientia",
    icon: (
      <Ico>
        <path d="M12 6C10.5 4.8 8.5 4 6 4v13c2.5 0 4.5.8 6 2 1.5-1.2 3.5-2 6-2V4c-2.5 0-4.5.8-6 2z" />
        <path d="M12 6v13" />
      </Ico>
    ),
  },
  {
    title: "คลังแนวคิด",
    engTitle: "Concepts",
    description: "ระบบความรู้แบบเชื่อมโยง รวบรวมพื้นฐานของแต่ละศาสตร์",
    href: "/concepts",
    cosmology: "psyche",
    icon: (
      <Ico>
        <circle cx="6" cy="7" r="2" />
        <circle cx="18" cy="9" r="2" />
        <circle cx="10.5" cy="18" r="2" />
        <path d="M7.7 8.4l1.6 7.8M11.9 16.7l4.7-6.2M8 7.2l8 1.5" />
      </Ico>
    ),
  },
  {
    title: "สำนักคิดและนักปราชญ์",
    engTitle: "Schools & Thinkers",
    description: "ประวัติ แนวคิดสำคัญ และคุณูปการของนักคิดผู้บุกเบิก",
    href: "/schools",
    cosmology: "mercurius",
    icon: (
      <Ico>
        <path d="M4 9l8-4 8 4-8 4z" />
        <path d="M6 11v5c0 1 2.7 2.5 6 2.5s6-1.5 6-2.5v-5" />
      </Ico>
    ),
  },
  {
    title: "แผนที่ความสัมพันธ์",
    engTitle: "Constellation",
    description: "สำรวจปฏิสัมพันธ์ระหว่างแนวคิดในรูปโครงข่ายความรู้",
    href: "/constellation",
    cosmology: "prima",
    icon: (
      <Ico>
        <circle cx="5" cy="6" r="1.6" />
        <circle cx="19" cy="8" r="1.6" />
        <circle cx="15" cy="18" r="1.6" />
        <circle cx="7" cy="15" r="1.6" />
        <path d="M6.4 6.6l7 1M17.7 9.2l-2.4 7.2M13.6 17.6l-5.5-2M6.6 13.7l6.7-4.8" />
      </Ico>
    ),
  },
  {
    title: "เส้นทางการอ่าน",
    engTitle: "Reading Paths",
    description: "ลำดับการอ่านที่เรียงจากพื้นฐานสู่ความเข้าใจระดับลึก",
    href: "/reading-sets",
    cosmology: "sapientia",
    icon: (
      <Ico>
        <path d="M6 4v11a3 3 0 0 0 3 3h6" />
        <circle cx="6" cy="4" r="1.6" />
        <path d="M18 15l-3 3 3 3" />
        <circle cx="15" cy="9" r="1.6" />
        <path d="M6 9h7.4" />
      </Ico>
    ),
  },
  {
    title: "แก่นเรื่อง",
    engTitle: "Themes",
    description: "แก่นความคิดข้ามศาสตร์ที่ปรากฏซ้ำ เช่น จิตไร้สำนึก เสรีภาพ ความหมาย",
    href: "/themes",
    cosmology: "prima",
    icon: (
      <Ico>
        <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z" />
        <path d="M12 8v8M8 10v4M16 10v4" />
      </Ico>
    ),
  },
  {
    title: "ศาสตร์ที่เราศึกษา",
    engTitle: "Disciplines",
    description: "สิบสองแขนงของการเข้าใจมนุษย์ — จิตวิทยา ปรัชญา ตำนาน วิทยาศาสตร์ และอื่น ๆ",
    href: "/disciplines",
    cosmology: "humanitas",
    isNew: true,
    icon: (
      <Ico>
        <rect x="4" y="4" width="7" height="7" rx="1.4" />
        <rect x="13" y="4" width="7" height="7" rx="1.4" />
        <rect x="4" y="13" width="7" height="7" rx="1.4" />
        <rect x="13" y="13" width="7" height="7" rx="1.4" />
      </Ico>
    ),
  },
];

export default async function KnowledgeHubPage() {
  // นับจากแหล่งเดียวกับหน้าเนื้อหาจริง — Supabase (published) → cache → seed fallback
  const [entries, schools, readingSets] = await Promise.all([
    getPublicEntries(),
    getPublicSchools(),
    getPublicReadingSets(),
  ]);
  const articleCount = entries.filter((e) => e.contentType === "article").length;
  const thinkerCount = schools.reduce((n, s) => n + s.thinkers.length, 0);
  const nodeCount = conceptRegistry.length;

  // ป้ายจำนวนจริงต่อการ์ด — ส่วนที่ยังไม่มีข้อมูลบอกสถานะตรง ๆ ไม่โชว์ 0 ปลอม
  const CARD_STAT: Record<string, string> = {
    "/articles": articleCount > 0 ? `${articleCount} บทความ` : "เตรียมเผยแพร่",
    "/concepts": `${nodeCount} รายการ`,
    "/schools": `${schools.length} สำนัก · ${thinkerCount} นักคิด`,
    "/constellation": `${nodeCount} โหนดความรู้`,
    "/reading-sets":
      readingSets.length > 0 ? `${readingSets.length} ซีรีส์` : "เตรียมเปิดให้อ่าน",
    "/themes": `${THEMES.length} แก่นเรื่อง`,
    "/disciplines": `${Object.keys(DISCIPLINE_META).length} ศาสตร์`,
  };

  return (
    <PageScaffold ambient navCurrent="/knowledge">
      <div className="tpl-reference pt-24">
        <Breadcrumb
          items={[{ label: "หน้าแรก", href: "/" }, { label: "คลังความรู้" }]}
          className="mb-10"
        />

        {/* หัวข้อหน้าและบทนำ */}
        <header className="mb-14 space-y-5 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 px-4 py-1.5 text-[11px] uppercase tracking-[0.2em] text-accent">
            <span className="h-[5px] w-[5px] rounded-full bg-accent" aria-hidden="true" />
            Knowledge Atlas
          </span>
          <h1 className="font-serif text-4xl tracking-tight text-text-heading sm:text-5xl">
            เข้าสู่คลังความรู้
          </h1>
          <p className="mx-auto max-w-xl text-base leading-relaxed text-text-secondary/80">
            สารบัญนำทางสู่การทำความเข้าใจโลกภายในของมนุษย์ — เลือกเส้นทางที่อยากเริ่มต้น
            แต่ละส่วนมีสีประจำตาม Cosmology ของตัวเอง
          </p>
        </header>

        {/* การ์ดกลุ่มคลังความรู้ (ธีมมืด + accent จาก COSMOLOGY_ACCENT เท่านั้น) */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {KNOWLEDGE_SECTIONS.map((section) => {
            const accent = COSMOLOGY_ACCENT[section.cosmology];
            return (
              <Link
                key={section.href}
                href={section.href}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/25 bg-text-heading/[0.02] p-6 transition-all duration-500 hover:-translate-y-1.5 hover:border-accent/40 hover:shadow-[0_28px_56px_-30px_rgba(0,0,0,0.7)] focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
              >
                {/* แถบ accent บน — ขึ้นตอน hover */}
                <span
                  className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
                  style={{ backgroundColor: accent }}
                  aria-hidden="true"
                />
                {/* แสงเรืองมุมบนขวา */}
                <span
                  className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full opacity-40 transition-opacity duration-500 group-hover:opacity-90"
                  style={{ background: `radial-gradient(circle, color-mix(in srgb, ${accent} 18%, transparent), transparent 70%)` }}
                  aria-hidden="true"
                />
                <div className="flex items-center justify-between">
                  <span
                    className="flex h-12 w-12 items-center justify-center rounded-xl border"
                    style={{
                      color: accent,
                      borderColor: `color-mix(in srgb, ${accent} 30%, transparent)`,
                      backgroundColor: `color-mix(in srgb, ${accent} 10%, transparent)`,
                    }}
                  >
                    {section.icon}
                  </span>
                  {section.isNew ? (
                    <span className="rounded-md bg-accent px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.1em] text-text-inverse">
                      ใหม่
                    </span>
                  ) : (
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-text-secondary/45">
                      {section.engTitle}
                    </span>
                  )}
                </div>
                <h2 className="mt-5 font-serif text-xl text-text-heading">{section.title}</h2>
                <p className="mt-2.5 flex-1 text-sm leading-relaxed text-text-secondary/75">
                  {section.description}
                </p>
                {/* จำนวนจริงจาก data layer (รีเฟรชตาม ISR 300s) */}
                <span className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-text-secondary/50">
                  {CARD_STAT[section.href]}
                </span>
                <span
                  className="mt-3 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.08em] transition-all duration-300 group-hover:gap-2.5"
                  style={{ color: accent }}
                >
                  เข้าสู่ส่วนนี้
                  <ArrowRightIcon className="h-3.5 w-3.5" />
                </span>
              </Link>
            );
          })}
        </div>

        {/* ท้ายหน้า — เชื่อมไปปฏิญญา */}
        <footer className="mt-16 border-t border-border/40 pt-10 text-center">
          <Link
            href="/manifesto"
            className="inline-flex items-center gap-2 text-xs text-text-secondary/60 transition-colors duration-300 hover:text-accent"
          >
            อ่านปฏิญญาก่อตั้ง — เจตนารมณ์ของ ARCHRON
            <ArrowRightIcon className="h-3.5 w-3.5" />
          </Link>
        </footer>
      </div>
    </PageScaffold>
  );
}
