import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getPublicEntries, getPublicSchools } from "@/lib/content/public-source";
import { SCHOOLS } from "@/lib/content/schools";
import { disciplineMeta } from "@/components/discipline-meta";
import { readFromR2 } from "@/lib/storage";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 300;

export async function generateStaticParams() {
  return SCHOOLS.map((s) => ({ slug: s.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const schools = await getPublicSchools();
  const s = schools.find((x) => x.id === slug);
  if (!s) return { title: "ไม่พบสำนักคิด — ARCHRON" };
  return {
    title: `สำนักคิด: ${s.nameTh} (${s.nameEn}) — ARCHRON`,
    description: s.description || `ข้อมูลประวัติและนักคิดของสำนัก ${s.nameTh}`,
  };
}

export default async function SchoolDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const schools = await getPublicSchools();
  const s = schools.find((x) => x.id === slug);
  if (!s) notFound();

  const meta = disciplineMeta(s.field);
  const Icon = meta.Icon;

  // ดึงประวัติความเป็นมาฉบับเต็มจาก R2 (ถ้ามี)
  let historyContent = s.history;
  if (s.r2ContentKey) {
    const r2Content = await readFromR2(s.r2ContentKey);
    if (r2Content) {
      historyContent = r2Content;
    }
  }

  // ค้นหาบทความและแนวคิดที่เกี่ยวข้องกับสำนักคิดนี้
  const allEntries = await getPublicEntries();
  const relatedEntries = allEntries.filter(
    (e) =>
      e.status === "published" &&
      // จับคู่ด้วย slug ของสำนัก (s.id) เป็นหลัก เผื่อชื่อไทย/อังกฤษ และ framework
      (e.school === s.id ||
        e.school === s.nameTh ||
        e.school === s.nameEn ||
        (e.framework &&
          (e.framework.toLowerCase() === s.nameEn.toLowerCase() ||
            e.framework.toLowerCase() === s.nameTh.toLowerCase()))),
  );

  return (
    <main className="atmo-temple px-6 pb-24 pt-10">
      <div className="mx-auto max-w-[900px]">
        {/* Breadcrumb */}
        <nav aria-label="เส้นทางนำทาง" className="flex flex-wrap items-center gap-1 text-xs text-muted">
          <Link href="/" className="rounded px-2 py-1.5 transition-colors hover:text-soft-gold focus-visible:ring-1 focus-visible:ring-burnished-gold/60 focus-visible:text-soft-gold focus-visible:outline-none">หน้าแรก</Link>
          <span className="material-symbols-outlined text-[16px] text-subtle" aria-hidden="true">chevron_right</span>
          <Link href="/schools" className="rounded px-2 py-1.5 transition-colors hover:text-soft-gold focus-visible:ring-1 focus-visible:ring-burnished-gold/60 focus-visible:text-soft-gold focus-visible:outline-none">สำนักคิดและนักปราชญ์</Link>
          <span className="material-symbols-outlined text-[16px] text-subtle" aria-hidden="true">chevron_right</span>
          <span className="px-2 py-1.5 text-soft-ivory">{s.nameTh}</span>
        </nav>

        {/* School Header */}
        <header 
          className="mt-8 relative overflow-hidden rounded-md border bg-surface-container/30 p-8 md:p-10"
          style={{ borderColor: `${meta.accent}44` }}
        >
          <div
            className="absolute -right-16 -top-16 h-48 w-48 rounded-full blur-[80px]"
            style={{ backgroundColor: `${meta.accent}1c` }}
          />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <span
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md"
                style={{ backgroundColor: `${meta.accent}1a`, color: meta.accent }}
              >
                <Icon className="h-7 w-7" />
              </span>
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: meta.accent }}>
                  {meta.label}
                </span>
                <h1 className="mt-1 font-serif text-3xl font-bold text-ivory md:text-4xl">
                  {s.nameTh}
                </h1>
                <p className="mt-1 text-sm text-on-surface-variant/50">
                  {s.nameEn}
                </p>
              </div>
            </div>
            <div className="shrink-0">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-burnished-gold/10 px-3.5 py-1 text-xs font-medium text-burnished-gold">
                <span className="material-symbols-outlined text-[14px]">groups</span>
                {s.thinkers.length} นักคิดหลัก
              </span>
            </div>
          </div>
        </header>

        {/* School History / Info */}
        <section className="mt-12">
          <h2 className="font-serif text-2xl font-semibold text-ivory border-b border-slate-boundary/20 pb-3">
            ประวัติความเป็นมาและทฤษฎี
          </h2>
          <div className="markdown-body prose prose-invert max-w-none mt-6 text-base leading-relaxed text-soft-ivory">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {historyContent || s.description || "— ไม่มีข้อมูลประวัติความเป็นมาเพิ่มเติม —"}
            </ReactMarkdown>
          </div>
        </section>

        {/* Key Ideas Section */}
        {s.keyIdeas && s.keyIdeas.length > 0 && (
          <section className="mt-12">
            <h2 className="font-serif text-2xl font-semibold text-ivory border-b border-slate-boundary/20 pb-3">
              แนวคิดสำคัญ
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {s.keyIdeas.map((idea, idx) => (
                <div
                  key={idx}
                  className="archron-panel p-4 border-t-4"
                  style={{ borderTopColor: meta.accent }}
                >
                  <h3 className="font-serif text-base font-medium text-on-surface">
                    {idea.title}
                  </h3>
                  {idea.description && (
                    <p className="mt-2 text-sm text-on-surface-variant/70 leading-relaxed">
                      {idea.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Timeline Section */}
        {s.timeline && s.timeline.length > 0 && (
          <section className="mt-12">
            <h2 className="font-serif text-2xl font-semibold text-ivory border-b border-slate-boundary/20 pb-3">
              เส้นเวลาพัฒนาการ
            </h2>
            <div className="mt-6 relative">
              {/* Vertical Line */}
              <div className="absolute left-4 top-0 bottom-0 w-px bg-slate-boundary/30" />
              
              <div className="space-y-6">
                {s.timeline.map((event, idx) => (
                  <div key={idx} className="relative pl-10">
                    {/* Dot */}
                    <div className="absolute left-2.5 top-1.5 h-3 w-3 rounded-full border-2 border-burnished-gold bg-deep-navy" />
                    
                    <div className="archron-panel p-4">
                      <span className="text-xs font-semibold text-burnished-gold/80">
                        {event.year}
                      </span>
                      <h3 className="mt-1 font-serif text-base font-medium text-on-surface">
                        {event.title}
                      </h3>
                      {event.description && (
                        <p className="mt-2 text-sm text-on-surface-variant/70 leading-relaxed">
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

        {/* Thinkers List */}
        <section className="mt-16">
          <h2 className="font-serif text-2xl font-semibold text-ivory border-b border-slate-boundary/20 pb-3">
            นักคิดและปราชญ์ในสังกัด
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {s.thinkers.map((t) => {
              const thinkerSlug = t.nameEn.toLowerCase().replace(/\s+/g, "-");
              return (
                <Link
                  key={t.nameEn}
                  href={`/thinkers/${thinkerSlug}`}
                  className="archron-card group relative p-6 block transition-all duration-300 hover:border-burnished-gold/45 focus-visible:ring-2 focus-visible:ring-burnished-gold focus-visible:outline-none"
                >
                  <h3 className="font-serif text-xl font-medium text-on-surface group-hover:text-burnished-gold flex items-center justify-between">
                    {t.nameTh}
                    <span className="material-symbols-outlined opacity-0 group-hover:opacity-100 transition-opacity text-sm">arrow_forward</span>
                  </h3>
                  <p className="mt-1 text-xs text-on-surface-variant/55">
                    {t.nameEn} · {t.era}
                  </p>
                  
                  {t.quote && (
                    <blockquote className="mt-4 border-l border-burnished-gold/50 pl-3 text-xs italic text-on-surface-variant/75">
                      “{t.quote}”
                    </blockquote>
                  )}

                  <div className="mt-4 border-t border-ink/5 pt-3">
                    <span className="text-[10px] uppercase tracking-wider text-on-surface-variant/40 block mb-1.5">ผลงานสำคัญ</span>
                    <ul className="space-y-1">
                      {t.masterpieces.slice(0, 2).map((m) => (
                        <li key={m} className="flex items-start gap-1.5 text-xs text-on-surface-variant/70">
                          <span className="material-symbols-outlined mt-0.5 text-[12px] text-burnished-gold/70">menu_book</span>
                          {m}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Related Concepts & Articles */}
        <section className="mt-16">
          <h2 className="font-serif text-2xl font-semibold text-ivory border-b border-slate-boundary/20 pb-3">
            บทความและแนวคิดที่เกี่ยวข้อง
          </h2>
          {relatedEntries.length === 0 ? (
            <p className="mt-6 rounded-md border border-ink/10 bg-surface-container/20 p-8 text-center text-sm text-on-surface-variant/50">
              ยังไม่มีบทความหรือแนวคิดในระบบที่เชื่อมโยงกับสำนักนี้
            </p>
          ) : (
            <div className="mt-6 space-y-4">
              {relatedEntries.map((e) => (
                <Link
                  key={e.slug}
                  href={e.contentType === "article" ? `/articles/${e.slug}` : `/concepts/${e.slug}`}
                  className="flex items-center justify-between rounded-md border border-slate-boundary/30 bg-surface-container/20 p-5 transition-colors hover:bg-surface-container/50 hover:border-burnished-gold/25 focus-visible:ring-2 focus-visible:ring-burnished-gold focus-visible:outline-none"
                >
                  <div>
                    <span className="inline-flex rounded-full bg-burnished-gold/10 px-2 py-0.5 text-[10px] font-semibold text-burnished-gold mb-1">
                      {e.contentType === "article" ? "บทความ" : "คลังแนวคิด"}
                    </span>
                    <h3 className="font-serif text-base text-on-surface hover:text-burnished-gold">
                      {e.title}
                    </h3>
                    <p className="mt-1 text-xs text-on-surface-variant/60 line-clamp-1">
                      {e.shortDescription}
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-muted text-[20px]">
                    chevron_right
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Related Schools */}
        {(() => {
          const relatedSchools = schools
            .filter((other) => {
              if (other.id === s.id) return false;
              // Check if same field or mentioned in description
              return (
                other.field === s.field ||
                s.description?.includes(other.nameEn) ||
                other.description?.includes(s.nameEn)
              );
            })
            .slice(0, 3);
          
          if (relatedSchools.length === 0) return null;
          
          return (
            <section className="mt-16">
              <h2 className="font-serif text-2xl font-semibold text-ivory border-b border-slate-boundary/20 pb-3">
                สำนักคิดที่เกี่ยวข้อง
              </h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {relatedSchools.map((other) => {
                  const otherMeta = disciplineMeta(other.field);
                  return (
                    <Link
                      key={other.id}
                      href={`/schools/${other.id}`}
                      className="archron-card p-4 transition-all hover:border-burnished-gold/45"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md"
                          style={{ backgroundColor: `${otherMeta.accent}1a`, color: otherMeta.accent }}
                        >
                          <otherMeta.Icon className="h-5 w-5" />
                        </span>
                        <div>
                          <h3 className="font-serif text-base font-medium text-on-surface hover:text-burnished-gold">
                            {other.nameTh}
                          </h3>
                          <p className="text-[10px] text-on-surface-variant/50">
                            {other.nameEn}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-on-surface-variant/60 line-clamp-2">
                        {other.description}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })()}
      </div>
    </main>
  );
}