import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Thinker, School } from "@/lib/content/schools";
import { SCHOOLS } from "@/lib/content/schools";
import { getPublicEntries, getPublicSchools } from "@/lib/content/public-source";
import { readFromR2 } from "@/lib/storage";
import { disciplineMeta } from "@/components/discipline-meta";
import { InternalConceptLink } from "@/components/reading/internal-concept-link";
import { ArrowRightIcon } from "@/components/icons";

// mdComponents — ชุดเดียวกับ reading-page.tsx: แปลงลิงก์ /concepts/<slug> → glossary hover,
// เปิดลิงก์ภายนอกในแท็บใหม่ (Thai-first · noopener) · ลิงก์อื่น ๆ ผ่านตรง
const mdComponents: Components = {
  a({ href, children }) {
    const h = typeof href === "string" ? href : "";
    const m = h.match(/^\/concepts\/([^/#?]+)/);
    if (m) {
      const label = typeof children === "string" ? children : String(children ?? "");
      return <InternalConceptLink slug={m[1]} label={label} />;
    }
    if (/^https?:\/\//.test(h)) {
      return (
        <a href={h} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      );
    }
    return <a href={h}>{children}</a>;
  },
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

function findThinkerAndSchool(slug: string, schools: School[]): { thinker: Thinker; school: School } | null {
  for (const s of schools) {
    const t = s.thinkers.find((x) => x.nameEn.toLowerCase().replace(/\s+/g, "-") === slug);
    if (t) {
      return { thinker: t, school: s };
    }
  }
  return null;
}

export const revalidate = 300;

export async function generateStaticParams() {
  const params: { slug: string }[] = [];
  for (const s of SCHOOLS) {
    for (const t of s.thinkers) {
      params.push({ slug: t.nameEn.toLowerCase().replace(/\s+/g, "-") });
    }
  }
  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const schools = await getPublicSchools();
  const res = findThinkerAndSchool(slug, schools);
  if (!res) return { title: "ไม่พบข้อมูลนักคิด — ARCHRON" };
  return {
    title: `ประวัตินักปราชญ์: ${res.thinker.nameTh} (${res.thinker.nameEn}) — ARCHRON`,
    description: res.thinker.bio || `ประวัติ ผลงาน และความสัมพันธ์เชิงปรัชญาของ ${res.thinker.nameTh}`,
  };
}

export default async function ThinkerDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const schools = await getPublicSchools();
  const res = findThinkerAndSchool(slug, schools);
  if (!res) notFound();

  const { thinker: t, school: s } = res;
  const meta = disciplineMeta(s.field);

  // ดึงประวัติชีวประวัติฉบับเต็มจาก R2 (ถ้ามี) — เนื้อหาใน R2 เป็น Markdown
  // ใช้ react-markdown pipeline เดียวกับ reading-page; t.bio (seed) เป็น plain text
  let bioContent = t.bio;
  let bioIsMarkdown = false;
  if (t.r2ContentKey) {
    const r2Content = await readFromR2(t.r2ContentKey);
    if (r2Content) {
      bioContent = r2Content;
      bioIsMarkdown = true;
    }
  }

  // ค้นหาบทความและแนวคิดที่เกี่ยวข้องกับนักคิดคนนี้
  // ลำดับความสำคัญ: (1) ความสัมพันธ์ mainThinkers (canonical) → (2) ปรากฏชื่อในเนื้อหา
  // เก็บ fallback (2) ไว้ เพราะ seed ปัจจุบันแท็ก mainThinkers เฉพาะ Carl Jung —
  // นักคิดคนอื่นยังพึ่งการปรากฏชื่อใน bodyMarkdown อยู่
  const allEntries = await getPublicEntries();
  const relatedEntries = allEntries.filter(
    (e) => {
      if (e.status !== "published") return false;
      const mainThinkers = "mainThinkers" in e ? e.mainThinkers : undefined;
      return (
        mainThinkers?.includes(t.nameEn) ||
        mainThinkers?.includes(t.nameTh) ||
        e.bodyMarkdown?.includes(t.nameTh) ||
        e.bodyMarkdown?.includes(t.nameEn)
      );
    },
  );

  return (
    <main className="atmo-biography px-4 sm:px-6 pb-24 pt-10">
      <div className="tpl-reference">
        {/* Breadcrumb */}
        <nav aria-label="เส้นทางนำทาง" className="text-xs text-text-secondary">
          <ol className="flex flex-wrap items-center gap-1">
            <li className="inline-flex items-center gap-0.5">
              <Link href="/" className="rounded px-2 py-1.5 transition-colors hover:text-accent focus-visible:ring-1 focus-visible:ring-accent/60 focus-visible:outline-none">หน้าแรก</Link>
              <ArrowRightIcon className="h-4 w-4" />
            </li>
            <li className="inline-flex items-center gap-0.5">
              <Link href="/schools" className="rounded px-2 py-1.5 transition-colors hover:text-accent focus-visible:ring-1 focus-visible:ring-accent/60 focus-visible:outline-none">สำนักคิดและนักปราชญ์</Link>
              <ArrowRightIcon className="h-4 w-4" />
            </li>
            <li className="inline-flex items-center gap-0.5">
              <Link href={`/schools/${s.id}`} className="rounded px-2 py-1.5 transition-colors hover:text-accent focus-visible:ring-1 focus-visible:ring-accent/60 focus-visible:outline-none">{s.nameTh}</Link>
              <ArrowRightIcon className="h-4 w-4" />
            </li>
            <li className="px-2 py-1.5 text-text-body" aria-current="page">{t.nameTh}</li>
          </ol>
        </nav>

        {/* Thinker Header */}
        <header
          className="mt-8 rounded-md border border-border/40 bg-bg-card/20 p-8 relative overflow-hidden"
          style={{ "--discipline-accent": meta.accent } as CSSProperties}
        >
          <div
            aria-hidden="true"
            className="absolute -right-20 -top-20 h-44 w-44 rounded-full blur-[80px]"
            style={{ backgroundColor: "color-mix(in srgb, var(--discipline-accent) 12%, transparent)" }}
          />

          <div className="relative z-10">
            <span className="text-xs font-semibold tracking-wider text-accent/80 block mb-1">
              นักปราชญ์ / ผู้สร้างสรรค์แนวคิด
            </span>
            <h1 className="font-serif text-3xl font-bold text-text-heading md:text-4xl">
              {t.nameTh}
            </h1>
            <p className="mt-1 text-sm text-text-secondary/60">
              {t.nameEn} · {t.era} · สังกัดสำนัก{" "}
              <Link href={`/schools/${s.id}`} className="text-accent hover:underline transition-colors focus-visible:ring-1 focus-visible:ring-accent/60 focus-visible:outline-none rounded px-0.5">
                {s.nameTh} ({s.nameEn})
              </Link>
            </p>
          </div>

          {t.quote && (
            <blockquote className="mt-8 border-l border-accent/50 pl-5 font-serif text-lg italic leading-relaxed text-accent">
              “{t.quote}”
            </blockquote>
          )}
        </header>

        {/* Bio Section */}
        <section className="mt-12">
          <h2 className="font-serif text-2xl font-semibold text-text-heading border-b border-border/20 pb-3">
            ประวัติและชีวิตเบื้องต้น
          </h2>
          {bioContent ? (
            bioIsMarkdown ? (
              <div className="md-body mt-6">
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
                  {bioContent}
                </ReactMarkdown>
              </div>
            ) : (
              <p className="mt-6 text-base leading-relaxed text-text-body whitespace-pre-line">
                {bioContent}
              </p>
            )
          ) : (
            <p className="mt-6 text-base leading-relaxed text-text-body whitespace-pre-line">
              — ไม่มีข้อมูลประวัติชีวิตเพิ่มเติมในขณะนี้ —
            </p>
          )}
        </section>

        {/* Relations Section */}
        {t.relationships && (
          <section className="mt-12">
            <h2 className="font-serif text-2xl font-semibold text-text-heading border-b border-border/20 pb-3">
              ความสัมพันธ์และอิทธิพลทางความคิด
            </h2>
            <p className="mt-6 text-base leading-relaxed text-text-body whitespace-pre-line">
              {t.relationships}
            </p>
          </section>
        )}

        {/* Masterpieces Section */}
        <section className="mt-12">
          <h2 className="font-serif text-2xl font-semibold text-text-heading border-b border-border/20 pb-3">
            ผลงานและเอกสารวิชาการสำคัญ
          </h2>
          <div className="archron-panel mt-6 p-6">
            <ul className="space-y-3">
              {t.masterpieces.map((m) => (
                <li key={m} className="flex items-start gap-2.5 text-sm leading-relaxed text-text-body">
                  {m}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Timeline Section */}
        {t.timeline && t.timeline.length > 0 && (
          <section className="mt-12">
            <h2 className="font-serif text-2xl font-semibold text-text-heading border-b border-border/20 pb-3">
              เส้นเวลาชีวิต
            </h2>
            <div className="mt-6 relative">
              {/* Vertical Line */}
              <div className="absolute left-4 top-0 bottom-0 w-px bg-border/30" />
              
              <div className="space-y-6">
                {t.timeline.map((event, idx) => (
                  <div key={idx} className="relative pl-10">
                    {/* Dot */}
                    <div className="absolute left-2.5 top-1.5 h-3 w-3 rounded-full border-2 border-accent bg-bg" />
                    
                    <div className="archron-panel p-4">
                      <span className="text-xs font-semibold text-accent/80">
                        {event.year}
                      </span>
                      <h3 className="mt-1 font-serif text-base font-medium text-text-heading">
                        {event.title}
                      </h3>
                      {event.description && (
                        <p className="mt-2 text-sm text-text-secondary/70 leading-relaxed">
                          {event.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Related Thinkers */}
        {(() => {
          const relatedThinkers = schools
            .flatMap((sch) => sch.thinkers.map((th) => ({ ...th, schoolId: sch.id, schoolNameTh: sch.nameTh })))
            .filter((other) => {
              if (other.nameEn === t.nameEn) return false;
              return (
                other.schoolId === s.id ||
                t.relationships?.includes(other.nameEn) ||
                other.relationships?.includes(t.nameEn)
              );
            })
            .slice(0, 4);
          
          if (relatedThinkers.length === 0) return null;
          
          return (
            <section className="mt-12">
              <h2 className="font-serif text-2xl font-semibold text-text-heading border-b border-border/20 pb-3">
                นักคิดที่เกี่ยวข้อง
              </h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {relatedThinkers.map((other) => {
                  const otherSlug = other.nameEn.toLowerCase().replace(/\s+/g, "-");
                  return (
                    <Link
                      key={other.nameEn}
                      href={`/thinkers/${otherSlug}`}
                      className="archron-card p-4 transition-all hover:border-accent/45"
                    >
                      <h3 className="font-serif text-base font-medium text-text-heading hover:text-accent">
                        {other.nameTh}
                      </h3>
                      <p className="mt-0.5 text-xs text-text-secondary/55">
                        {other.nameEn} · {other.era}
                      </p>
                      <p className="mt-1 text-[10px] text-accent/70">
                        สังกัด {other.schoolNameTh}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })()}

        {/* Related Articles & Concepts */}
        <section className="mt-16">
          <h2 className="font-serif text-2xl font-semibold text-text-heading border-b border-border/20 pb-3">
            งานเขียนและแนวคิดที่เกี่ยวข้องในระบบ
          </h2>
          {relatedEntries.length === 0 ? (
            <p className="mt-6 rounded-md border border-text-heading/10 bg-bg-card/20 p-8 text-center text-sm text-text-secondary/60">
              ยังไม่มีงานเขียนหรือคำอธิบายคำศัพท์วิชาการในคลังสำหรับ {t.nameTh}
            </p>
          ) : (
            <div className="mt-6 space-y-4">
              {relatedEntries.map((e) => (
                <Link
                  key={e.slug}
                  href={e.contentType === "article" ? `/articles/${e.slug}` : `/concepts/${e.slug}`}
                  className="flex items-center justify-between rounded-md border border-border/30 bg-bg-card/20 p-5 transition-colors hover:bg-bg-card/50 hover:border-accent/25"
                >
                  <div>
                    <span className="inline-flex rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-semibold text-accent mb-1">
                      {e.contentType === "article" ? "บทความ" : "คลังแนวคิด"}
                    </span>
                    <h3 className="font-serif text-base text-text-heading hover:text-accent">
                      {e.title}
                    </h3>
                    <p className="mt-1 text-xs text-text-secondary/60 line-clamp-1">
                      {e.shortDescription}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}