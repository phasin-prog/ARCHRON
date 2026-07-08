import Link from "next/link";
import type { ReactNode } from "react";
import type { ContentEntry } from "@/types/content";
import { contentTypeMeta, deriveDomain, DOMAIN_LABEL } from "@/lib/content/cosmology";
import { conceptTitle } from "@/lib/content/concept-registry";
import { themesForEntry } from "@/lib/content/themes";

const THAI_MONTHS_SHORT = ["ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."];
function formatThaiDate(iso: string | undefined): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return `${d.getDate()} ${THAI_MONTHS_SHORT[d.getMonth()]} ${d.getFullYear()}`;
}
const DIFFICULTY_LABEL: Record<string, string> = { beginner:"ผู้เริ่มต้น", intermediate:"ระดับกลาง", advanced:"อ่านลึก", "source-note":"บันทึกอ้างอิง" };

function Chip({ children, icon }: { children: ReactNode; icon?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium"
      style={{ borderColor:"color-mix(in srgb, var(--accent) 35%, transparent)", color:"var(--accent)", backgroundColor:"color-mix(in srgb, var(--accent) 10%, transparent)" }}>
      {icon ? <span className="inline-flex items-center justify-center w-[1em] h-[1em] text-[14px]" aria-hidden="true">{icon === "library_books" ? "📚" : icon === "account_balance" ? "🏛" : icon === "category" ? "📋" : icon === "psychology" ? "🧠" : icon[0]?.toUpperCase()}</span> : null}
      {children}
    </span>
  );
}

function MetaRow({ label, value }: { label: string; value: ReactNode }) {
  if (value === null || value === undefined || value === "") return null;
  return (<div className="flex flex-col gap-0.5"><dt className="text-[11px] tracking-[0.06em] text-text-secondary">{label}</dt><dd className="text-sm leading-snug text-text-heading">{value}</dd></div>);
}

function ThinkerLinks({ names }: { names: string[] }) {
  return (
    <span className="flex flex-wrap gap-x-2 gap-y-1">
      {names.map((t, i) => {
        const slug = t.toLowerCase().replace(/\s+/g, "-");
        return (
          <span key={t}>{i > 0 ? <span className="text-text-secondary"> · </span> : null}
            <Link href={`/thinkers/${slug}`} className="text-text-heading underline-offset-2 hover:text-accent hover:underline">{t}</Link>
          </span>
        );
      })}
    </span>
  );
}

function RelatedSummary({ entry }: { entry: ContentEntry }) {
  const related = (entry.relatedConcepts ?? []).slice(0, 3);
  const overflow = (entry.relatedConcepts ?? []).length - related.length;
  if (related.length === 0) return null;
  return (
    <span className="flex flex-wrap items-baseline gap-x-1">
      {related.map((rc, i) => (<span key={rc.conceptSlug}>{i > 0 ? <span className="text-text-secondary">, </span> : null}
        <Link href={`/concepts/${rc.conceptSlug}`} className="text-text-heading underline-offset-2 hover:text-accent hover:underline">{conceptTitle(rc.conceptSlug)}</Link></span>))}
      {overflow > 0 ? <span className="text-text-secondary"> +{overflow}</span> : null}
    </span>
  );
}

function ThemeChips({ entry }: { entry: ContentEntry }) {
  const themes = themesForEntry(entry);
  if (themes.length === 0) return null;
  return (<span className="flex flex-wrap gap-1.5">{themes.map((t) => (
    <Link key={t.key} href={`/themes/${t.key}`} className="rounded-full border px-2 py-0.5 text-[11px] transition-opacity hover:opacity-80"
      style={{ borderColor:`${t.accent}55`, color:t.accent, backgroundColor:`${t.accent}12` }}>{t.label}</Link>))}</span>);
}

function HeroSection({ entry }: { entry: ContentEntry }) {
  const title = entry.mainTerm ?? entry.title;
  return (<header className="scroll-reveal"><h1 className="font-serif text-fluid-h2 font-semibold text-text-heading">{title}</h1>
    {entry.shortDescription ? <p className="mt-4 text-base leading-relaxed text-text-body">{entry.shortDescription}</p> : null}</header>);
}

function IdentitySection({ entry }: { entry: ContentEntry }) {
  const typeMeta = contentTypeMeta(entry.contentType);
  const domain = deriveDomain(entry);
  const chips: ReactNode[] = [];
  chips.push(<Chip key="type" icon={typeMeta.icon}>{typeMeta.label}</Chip>);
  if (domain && DOMAIN_LABEL[domain]) chips.push(<Chip key="domain" icon="category">{DOMAIN_LABEL[domain]}</Chip>);
  const ct = entry.contentType;
  if (ct === "book") {
    const sp = [entry.series, entry.volume ? `เล่ม ${entry.volume}` : null].filter(Boolean);
    if (sp.length > 0) chips.push(<Chip key="series" icon="library_books">{sp.join(" · ")}</Chip>);
  } else if (ct === "person" || ct === "school") {
    if (entry.school) chips.push(<Chip key="school" icon="account_balance">{entry.school}</Chip>);
  } else {
    if (entry.framework) chips.push(<Chip key="framework" icon="psychology">{entry.framework}</Chip>);
  }
  return <div className="scroll-reveal flex flex-wrap gap-2">{chips}</div>;
}

function KnowledgeSummarySection({ entry, readingTime }: { entry: ContentEntry; readingTime: string }) {
  const rows: { label: string; value: ReactNode }[] = [];
  if (entry.thaiName) rows.push({ label: "ชื่อไทย", value: entry.thaiName });
  if (entry.originalTerm) rows.push({ label: "ชื่อดั้งเดิม", value: entry.originalTerm });
  if (entry.aliases && entry.aliases.length > 0) rows.push({ label: "ชื่อเรียกอื่น", value: entry.aliases.join(", ") });
  if (entry.partOfSpeech) rows.push({ label: "ชนิดคำ", value: entry.partOfSpeech });
  if (entry.difficulty) rows.push({ label: "ระดับ", value: DIFFICULTY_LABEL[entry.difficulty] ?? entry.difficulty });
  if (readingTime) rows.push({ label: "เวลาอ่าน", value: `~${readingTime}` });
  if (rows.length === 0) return null;
  return (<dl className="scroll-reveal grid gap-x-6 gap-y-4 sm:grid-cols-2">{rows.map((r) => <MetaRow key={r.label} label={r.label} value={r.value} />)}</dl>);
}

function KnowledgeMetadataSection({ entry }: { entry: ContentEntry }) {
  const ct = entry.contentType;
  const rows: { label: string; value: ReactNode }[] = [];
  const themeChips = <ThemeChips entry={entry} />;
  const relatedSummary = <RelatedSummary entry={entry} />;
  const thinkers = entry.mainThinkers && entry.mainThinkers.length > 0 ? <ThinkerLinks names={entry.mainThinkers} /> : null;
  const domain = deriveDomain(entry);
  const domainLabel = domain && DOMAIN_LABEL[domain] ? DOMAIN_LABEL[domain] : null;
  const etymology = entry.roots?.etymology;
  if (ct === "concept") {
    if (themeChips) rows.push({ label: "แก่นเรื่อง", value: themeChips });
    if (thinkers) rows.push({ label: "นักคิดหลัก", value: thinkers });
    if (entry.school || entry.framework) rows.push({ label: "สำนักคิด", value: entry.school ?? entry.framework });
    if (etymology) rows.push({ label: "รากศัพท์", value: etymology });
    if (relatedSummary) rows.push({ label: "แนวคิดที่เกี่ยวข้อง", value: relatedSummary });
  } else if (ct === "person") {
    const era = [entry.bornYear, entry.diedYear].filter(Boolean).join(" – ");
    if (era) rows.push({ label: "ช่วงชีวิต", value: era });
    if (entry.nationality) rows.push({ label: "สัญชาติ", value: entry.nationality });
    if (entry.school) rows.push({ label: "สำนักคิด", value: entry.school });
    if (entry.keyIdeas && entry.keyIdeas.length > 0) rows.push({ label: "แนวคิดสำคัญ", value: entry.keyIdeas.join(", ") });
    if (entry.notableWorks && entry.notableWorks.length > 0) rows.push({ label: "ผลงานเด่น", value: entry.notableWorks.join(", ") });
  } else if (ct === "book") {
    if (thinkers) rows.push({ label: "ผู้เขียน", value: thinkers });
    if (entry.publicationYear) rows.push({ label: "ปีตีพิมพ์", value: entry.publicationYear });
    if (entry.publisher) rows.push({ label: "สำนักพิมพ์", value: entry.publisher });
    if (entry.isbn) rows.push({ label: "ISBN", value: entry.isbn });
    if (entry.keyIdeas && entry.keyIdeas.length > 0) rows.push({ label: "แนวคิดหลัก", value: entry.keyIdeas.join(", ") });
  } else if (ct === "school") {
    if (entry.founder) rows.push({ label: "ผู้ก่อตั้ง", value: entry.founder });
    if (entry.period) rows.push({ label: "ช่วงเวลา", value: entry.period });
    if (domainLabel) rows.push({ label: "ศาสตร์", value: domainLabel });
    if (thinkers) rows.push({ label: "นักคิดสำคัญ", value: thinkers });
    if (entry.keyIdeas && entry.keyIdeas.length > 0) rows.push({ label: "แนวคิดหลัก", value: entry.keyIdeas.join(", ") });
  } else if (ct === "symbol") {
    if (entry.shortDescription) rows.push({ label: "ความหมาย", value: entry.shortDescription });
    if (etymology) rows.push({ label: "ที่มา", value: etymology });
    if (entry.roots?.historicalUsage) rows.push({ label: "การใช้งาน", value: entry.roots.historicalUsage });
    if (relatedSummary) rows.push({ label: "ความเกี่ยวข้อง", value: relatedSummary });
  } else if (ct === "term") {
    if (etymology) rows.push({ label: "รากศัพท์", value: etymology });
    if (domainLabel) rows.push({ label: "ศาสตร์", value: domainLabel });
    if (relatedSummary) rows.push({ label: "แนวคิดที่เกี่ยวข้อง", value: relatedSummary });
  } else if (ct === "article") {
    if (entry.author) rows.push({ label: "ผู้เขียน", value: entry.author });
    if (themeChips) rows.push({ label: "แก่นเรื่อง", value: themeChips });
    if (relatedSummary) rows.push({ label: "แนวคิดที่เกี่ยวข้อง", value: relatedSummary });
    if (entry.difficulty) rows.push({ label: "ระดับ", value: DIFFICULTY_LABEL[entry.difficulty] ?? entry.difficulty });
  } else {
    if (entry.framework) rows.push({ label: "กรอบทฤษฎี", value: entry.framework });
    if (relatedSummary) rows.push({ label: "แนวคิดที่เกี่ยวข้อง", value: relatedSummary });
  }
  if (rows.length === 0) return null;
  return (<dl className="scroll-reveal grid gap-x-6 gap-y-4 sm:grid-cols-2">{rows.map((r) => <MetaRow key={r.label} label={r.label} value={r.value} />)}</dl>);
}

function AcademicSection({ entry }: { entry: ContentEntry }) {
  let origins = entry.academicOrigins;
  if ((!origins || origins.length === 0) && entry.originalTerm) {
    origins = [{ original: entry.originalTerm, language: entry.languageRoot, meaning: entry.roots?.etymology }];
  }
  if (!origins || origins.length === 0) return null;
  const valid = origins.filter((o) => o.original || o.language || o.meaning);
  if (valid.length === 0) return null;
  return (
    <div className="scroll-reveal space-y-2.5">
      {valid.map((o, i) => (
        <div key={i} className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-sm">
          {o.language ? (<span className="rounded border px-1.5 py-0.5 text-[11px] font-medium" style={{ borderColor:"color-mix(in srgb, var(--accent) 35%, transparent)", color:"var(--accent)" }}>{o.language}</span>) : null}
          {o.original ? <span className="font-serif text-text-heading">{o.original}</span> : null}
          {o.meaning ? <span className="text-text-secondary">— {o.meaning}</span> : null}
        </div>
      ))}
    </div>
  );
}

function PublicationSection({ entry, readingTime }: { entry: ContentEntry; readingTime: string }) {
  const updated = formatThaiDate(entry.updatedAt);
  const showAuthor = entry.author && entry.author.trim() !== "" && entry.author.trim().toLowerCase() !== "archron";
  const parts: ReactNode[] = [];
  if (updated) parts.push(`อัปเดต ${updated}`);
  parts.push(`เวลาอ่าน ~${readingTime}`);
  if (entry.version) parts.push(`เวอร์ชัน ${entry.version}`);
  if (showAuthor) parts.push(`โดย ${entry.author}`);
  if (parts.length === 0) return null;
  return (
    <footer className="scroll-reveal flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-border/20 pt-4 text-xs text-text-secondary">
      {parts.map((p, i) => (<span key={i} className="flex items-center gap-x-3">{i > 0 ? <span className="text-text-secondary" aria-hidden="true">·</span> : null}{p}</span>))}
    </footer>
  );
}

export function KnowledgeCard({ entry, readingTime }: { entry: ContentEntry; readingTime: string }) {
  const typeMeta = contentTypeMeta(entry.contentType);
  return (
    <div className="archron-panel relative mt-7 overflow-hidden p-5 sm:p-7" style={{ ["--accent" as string]: typeMeta.accent }}>
      <span className="absolute inset-y-0 left-0 w-[3px]" style={{ backgroundColor: "var(--accent)" }} aria-hidden="true" />
      <div className="space-y-7">
        <HeroSection entry={entry} />
        <IdentitySection entry={entry} />
        <KnowledgeSummarySection entry={entry} readingTime={readingTime} />
        <KnowledgeMetadataSection entry={entry} />
        <AcademicSection entry={entry} />
        <PublicationSection entry={entry} readingTime={readingTime} />
      </div>
    </div>
  );
}
