import Link from "next/link";
import type { ContentEntry, RelationType, SourceItem } from "@/types/content";

const RELATION_LABEL: Record<RelationType, string> = {
  prerequisite: "ควรอ่านก่อน",
  related: "เกี่ยวข้องโดยตรง",
  "contrasts-with": "เปรียบเทียบ / ต่าง",
  "part-of": "เป็นส่วนหนึ่งของ",
  "source-of": "แหล่งที่มา",
  "used-in": "ถูกใช้ใน",
  "influenced-by": "ได้รับอิทธิพลจาก",
};

const MAX_RELATED_INLINE = 6;

function SourceList({ items }: { items: SourceItem[] }) {
  return (
    <ul className="space-y-3">
      {items.map((s, i) => (
        <li key={i} className="text-sm leading-relaxed text-soft-ivory">
          <span className="text-ivory">{[s.author, s.title].filter(Boolean).join(", ")}</span>
          {s.year ? <span className="text-muted"> ({s.year})</span> : null}
          {s.relatedClaim ? (
            <span className="block text-muted">รองรับ: {s.relatedClaim}</span>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

export function ReadingPage({ entry }: { entry: ContentEntry }) {
  const primary = entry.references.filter((r) => r.sourceType === "primary-source");
  const secondary = entry.references.filter((r) =>
    ["secondary-source", "commentary"].includes(r.sourceType),
  );
  const interpretation = entry.references.filter((r) =>
    ["editorial-interpretation", "website", "dictionary-lexicon", "other"].includes(
      r.sourceType,
    ),
  );

  const relatedInline = entry.relatedConcepts.slice(0, MAX_RELATED_INLINE);
  const hasOverflow = entry.relatedConcepts.length > MAX_RELATED_INLINE;

  return (
    <main className="mx-auto max-w-2xl px-6 pb-24 pt-16">
      <header>
        <h1 className="font-serif text-4xl text-ivory">{entry.mainTerm ?? entry.title}</h1>
        <p className="mt-3 text-base text-soft-ivory">
          {[entry.thaiName, entry.originalTerm, entry.partOfSpeech]
            .filter(Boolean)
            .join(" · ")}
          {entry.ipa ? <span className="text-muted"> {entry.ipa}</span> : null}
        </p>
        {entry.shortDescription ? (
          <p className="mt-4 text-lg leading-relaxed text-soft-ivory">
            {entry.shortDescription}
          </p>
        ) : null}
      </header>

      <dl className="mt-8 grid grid-cols-2 gap-4 border-y border-white/10 py-6 text-sm">
        {entry.framework ? (
          <div>
            <dt className="text-muted">สำนัก / กรอบทฤษฎี</dt>
            <dd className="mt-1 text-ivory">{entry.framework}</dd>
          </div>
        ) : null}
        {entry.mainThinkers && entry.mainThinkers.length > 0 ? (
          <div>
            <dt className="text-muted">นักคิดหลัก</dt>
            <dd className="mt-1 text-ivory">{entry.mainThinkers.join(", ")}</dd>
          </div>
        ) : null}
        {entry.difficulty ? (
          <div>
            <dt className="text-muted">ระดับการอ่าน</dt>
            <dd className="mt-1 text-ivory">{entry.difficulty}</dd>
          </div>
        ) : null}
        <div>
          <dt className="text-muted">ผู้เรียบเรียง</dt>
          <dd className="mt-1 text-ivory">{entry.author ?? "The Soul's Compass"}</dd>
        </div>
        {entry.publishedAt ? (
          <div>
            <dt className="text-muted">เผยแพร่</dt>
            <dd className="mt-1 text-ivory">{entry.publishedAt}</dd>
          </div>
        ) : null}
        {entry.updatedAt ? (
          <div>
            <dt className="text-muted">อัปเดตล่าสุด</dt>
            <dd className="mt-1 text-ivory">{entry.updatedAt}</dd>
          </div>
        ) : null}
      </dl>

      {entry.visualExplanation ? (
        <section className="mt-12">
          <h2 className="font-serif text-2xl text-ivory">คำอธิบายให้เห็นภาพ</h2>
          <p className="mt-4 whitespace-pre-line text-lg leading-loose text-soft-ivory">
            {entry.visualExplanation}
          </p>
        </section>
      ) : null}

      {entry.technicalMeaning ? (
        <section className="mt-12">
          <h2 className="font-serif text-2xl text-ivory">ความหมายทางวิชาการ / เทคนิค</h2>
          <p className="mt-4 whitespace-pre-line text-lg leading-loose text-soft-ivory">
            {entry.technicalMeaning}
          </p>
        </section>
      ) : null}

      {entry.relatedConcepts.length > 0 ? (
        <section className="mt-12">
          <h2 className="font-serif text-2xl text-ivory">แนวคิดที่เกี่ยวข้อง</h2>
          <ul className="mt-4 space-y-3">
            {relatedInline.map((rc) => (
              <li key={rc.conceptSlug} className="rounded-md border border-white/10 bg-charcoal/40 p-4">
                <Link href={`/concepts/${rc.conceptSlug}`} className="text-ivory hover:text-soft-gold">
                  {rc.conceptSlug}
                </Link>
                <span className="ml-2 text-xs text-antique-gold">
                  {RELATION_LABEL[rc.relationType]}
                </span>
                {rc.reason ? (
                  <p className="mt-1 text-sm leading-relaxed text-muted">{rc.reason}</p>
                ) : null}
              </li>
            ))}
          </ul>
          {hasOverflow ? (
            <Link
              href="/concepts"
              className="mt-5 inline-block text-sm text-soft-gold hover:underline"
            >
              ดูแผนที่ความสัมพันธ์ทั้งหมด →
            </Link>
          ) : null}
        </section>
      ) : null}

      {entry.references.length > 0 ? (
        <section className="mt-12">
          <h2 className="font-serif text-2xl text-ivory">เอกสารอ้างอิง</h2>
          {primary.length > 0 ? (
            <div className="mt-5">
              <h3 className="text-sm tracking-widest text-antique-gold">แหล่งต้นทาง (Primary)</h3>
              <div className="mt-3"><SourceList items={primary} /></div>
            </div>
          ) : null}
          {secondary.length > 0 ? (
            <div className="mt-5">
              <h3 className="text-sm tracking-widest text-antique-gold">งานอธิบาย (Secondary)</h3>
              <div className="mt-3"><SourceList items={secondary} /></div>
            </div>
          ) : null}
          {interpretation.length > 0 ? (
            <div className="mt-5">
              <h3 className="text-sm tracking-widest text-antique-gold">การตีความของเว็บ (Interpretation)</h3>
              <div className="mt-3"><SourceList items={interpretation} /></div>
            </div>
          ) : null}
        </section>
      ) : null}

      {entry.roots ? (
        <section className="mt-12 rounded-md border border-white/10 bg-surface-1/40 p-7">
          <h2 className="font-serif text-2xl text-ivory">Roots — ที่มาของคำ</h2>
          {entry.roots.etymology ? (
            <p className="mt-4 text-base leading-relaxed text-soft-ivory">
              <span className="text-muted">รากศัพท์: </span>{entry.roots.etymology}
            </p>
          ) : null}
          {entry.roots.historicalUsage ? (
            <p className="mt-3 text-base leading-relaxed text-soft-ivory">
              <span className="text-muted">การใช้ในอดีต: </span>{entry.roots.historicalUsage}
            </p>
          ) : null}
          {entry.roots.meaningShift ? (
            <p className="mt-3 text-base leading-relaxed text-soft-ivory">
              <span className="text-muted">การเปลี่ยนความหมาย: </span>{entry.roots.meaningShift}
            </p>
          ) : null}
          {entry.roots.caution ? (
            <p className="mt-3 text-sm italic leading-relaxed text-muted">
              ข้อควรระวัง: {entry.roots.caution}
            </p>
          ) : null}
        </section>
      ) : null}

      <section className="mt-12 border-t border-white/10 pt-8">
        <h2 className="font-serif text-xl text-ivory">อ่านต่อจากแนวคิดนี้</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/concepts" className="rounded-sm border border-white/20 px-5 py-2.5 text-sm text-ivory transition-colors hover:border-antique-gold hover:text-soft-gold">
            สำรวจคลังแนวคิด
          </Link>
          <Link href="/articles" className="rounded-sm border border-white/20 px-5 py-2.5 text-sm text-ivory transition-colors hover:border-antique-gold hover:text-soft-gold">
            อ่านบทความอื่น
          </Link>
        </div>
      </section>
    </main>
  );
}
