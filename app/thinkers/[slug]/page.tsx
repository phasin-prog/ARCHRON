import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Thinker, School } from "@/lib/content/schools";
import { getPublicEntries, getPublicSchools } from "@/lib/content/public-source";
import { readFromR2 } from "@/lib/storage";
import { disciplineMeta } from "@/components/discipline-meta";

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

export async function generateStaticParams() {
  const schools = await getPublicSchools();
  const params: { slug: string }[] = [];
  for (const s of schools) {
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

  // ดึงประวัติชีวประวัติฉบับเต็มจาก R2 (ถ้ามี)
  let bioContent = t.bio;
  if (t.r2ContentKey) {
    const r2Content = await readFromR2(t.r2ContentKey);
    if (r2Content) {
      bioContent = r2Content;
    }
  }

  // ค้นหาบทความและแนวคิดที่อ้างอิงถึงนักคิดคนนี้
  const allEntries = await getPublicEntries();
  const relatedEntries = allEntries.filter(
    (e) =>
      e.status === "published" &&
      (e.mainThinkers?.includes(t.nameEn) ||
        e.mainThinkers?.includes(t.nameTh) ||
        e.bodyMarkdown?.includes(t.nameTh) ||
        e.bodyMarkdown?.includes(t.nameEn)),
  );

  return (
    <main className="px-6 pb-24 pt-10">
      <div className="mx-auto max-w-[800px]">
        {/* Breadcrumb */}
        <nav aria-label="เส้นทางนำทาง" className="flex flex-wrap items-center gap-1 text-xs text-muted">
          <Link href="/" className="transition-colors hover:text-soft-gold">หน้าแรก</Link>
          <span className="material-symbols-outlined text-[16px] text-subtle">chevron_right</span>
          <Link href="/schools" className="transition-colors hover:text-soft-gold">สำนักคิดและนักปราชญ์</Link>
          <span className="material-symbols-outlined text-[16px] text-subtle">chevron_right</span>
          <Link href={`/schools/${s.id}`} className="transition-colors hover:text-soft-gold">{s.nameTh}</Link>
          <span className="material-symbols-outlined text-[16px] text-subtle">chevron_right</span>
          <span className="text-soft-ivory">{t.nameTh}</span>
        </nav>

        {/* Thinker Header */}
        <header className="mt-8 rounded-md border border-slate-boundary/40 bg-surface-container/20 p-8 relative overflow-hidden">
          <div
            className="absolute -right-20 -top-20 h-44 w-44 rounded-full blur-[80px]"
            style={{ backgroundColor: `${meta.accent}12` }}
          />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <span className="text-xs font-semibold tracking-wider text-burnished-gold/80 block mb-1">
                นักปราชญ์ / ผู้สร้างสรรค์แนวคิด
              </span>
              <h1 className="font-serif text-3xl font-bold text-ivory md:text-4xl">
                {t.nameTh}
              </h1>
              <p className="mt-1 text-sm text-on-surface-variant/60">
                {t.nameEn} · {t.era}
              </p>
            </div>
            <div>
              <Link
                href={`/schools/${s.id}`}
                className="inline-flex items-center gap-2 rounded bg-surface-container-low px-4 py-2 border border-slate-boundary/30 text-xs font-medium text-soft-ivory hover:border-burnished-gold/30 hover:text-burnished-gold transition-all"
              >
                <span className="material-symbols-outlined text-[14px]" style={{ color: meta.accent }}>
                  account_balance
                </span>
                สังกัด: {s.nameTh}
              </Link>
            </div>
          </div>

          {t.quote && (
            <div className="mt-8 border-l-2 border-burnished-gold bg-black/10 p-5 rounded-r">
              <span className="material-symbols-outlined text-[36px] text-burnished-gold/20 block h-6 leading-none">
                format_quote
              </span>
              <p className="font-serif text-lg italic leading-relaxed text-soft-gold mt-1">
                “{t.quote}”
              </p>
            </div>
          )}
        </header>

        {/* Bio Section */}
        <section className="mt-12">
          <h2 className="font-serif text-2xl font-semibold text-ivory border-b border-slate-boundary/20 pb-3">
            ประวัติและชีวิตเบื้องต้น
          </h2>
          <p className="mt-6 text-base leading-relaxed text-soft-ivory whitespace-pre-line">
            {bioContent || "— ไม่มีข้อมูลประวัติชีวิตเพิ่มเติมในขณะนี้ —"}
          </p>
        </section>

        {/* Relations Section */}
        {t.relationships && (
          <section className="mt-12">
            <h2 className="font-serif text-2xl font-semibold text-ivory border-b border-slate-boundary/20 pb-3">
              ความสัมพันธ์และอิทธิพลทางความคิด
            </h2>
            <p className="mt-6 text-base leading-relaxed text-soft-ivory whitespace-pre-line">
              {t.relationships}
            </p>
          </section>
        )}

        {/* Masterpieces Section */}
        <section className="mt-12">
          <h2 className="font-serif text-2xl font-semibold text-ivory border-b border-slate-boundary/20 pb-3">
            ผลงานและเอกสารวิชาการสำคัญ
          </h2>
          <div className="mt-6 rounded-md border border-slate-boundary/30 bg-surface-container/20 p-6">
            <ul className="space-y-3">
              {t.masterpieces.map((m) => (
                <li key={m} className="flex items-start gap-2.5 text-sm leading-relaxed text-soft-ivory">
                  <span className="material-symbols-outlined text-[16px] text-burnished-gold mt-0.5">
                    menu_book
                  </span>
                  {m}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Related Articles & Concepts */}
        <section className="mt-16">
          <h2 className="font-serif text-2xl font-semibold text-ivory border-b border-slate-boundary/20 pb-3">
            งานเขียนและแนวคิดที่เกี่ยวข้องในระบบ
          </h2>
          {relatedEntries.length === 0 ? (
            <p className="mt-6 rounded-md border border-ink/10 bg-surface-container/20 p-8 text-center text-sm text-on-surface-variant/50">
              ยังไม่มีงานเขียนหรือคำอธิบายคำศัพท์วิชาการในคลังสำหรับ {t.nameTh}
            </p>
          ) : (
            <div className="mt-6 space-y-4">
              {relatedEntries.map((e) => (
                <Link
                  key={e.slug}
                  href={e.contentType === "article" ? `/articles/${e.slug}` : `/concepts/${e.slug}`}
                  className="flex items-center justify-between rounded-md border border-slate-boundary/30 bg-surface-container/20 p-5 transition-colors hover:bg-surface-container/50 hover:border-burnished-gold/25"
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
      </div>
    </main>
  );
}