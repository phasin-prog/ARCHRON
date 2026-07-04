// บัตรสรุปใจความสำคัญ (Key Takeaway Card) — Executive Summary Box สำหรับหน้าอ่าน Unified
import type { ContentEntry } from "@/types/content";
import { InternalLinkText } from "@/components/reading/internal-link-text";

// ทำความสะอาดและตัดข้อความมาร์กดาวน์สำหรับ Fallback (ไม่ตัดกลางคำ)
function cleanAndTruncate(raw: string, maxChars = 220): string {
  let text = raw.replace(/\[\[cite:\s*([\d\s,]+)\]\]/g, "");
  text = text.replace(/!\[.*?\]\(.*?\)/g, "");
  text = text.replace(/\[([^\]]+)\]\(.*?\)/g, "$1");
  text = text.replace(/^#{1,6}\s+/gm, "");
  text = text.replace(/^>\s+/gm, "");
  text = text.replace(/(\*\*|__|\*|_)/g, "");
  text = text.replace(/\s+/g, " ").trim();

  if (text.length <= maxChars) return text;
  const cut = text.slice(0, maxChars);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut) + " ...";
}

export function TakeawayCard({ entry }: { entry: ContentEntry }) {
  let contentText = entry.shortDescription?.trim() ?? "";
  let isFallback = false;

  if (!contentText) {
    if (entry.visualExplanation && entry.visualExplanation.trim()) {
      contentText = cleanAndTruncate(entry.visualExplanation, 220);
      isFallback = true;
    } else if (entry.bodyMarkdown && entry.bodyMarkdown.trim()) {
      contentText = cleanAndTruncate(entry.bodyMarkdown, 220);
      isFallback = true;
    }
  }

  if (!contentText) return null;

  return (
    <section aria-label="ข้อสรุปสำคัญ" className="scroll-reveal stagger-3 mt-10">
      <div className="relative overflow-hidden rounded-xl border border-antique-gold/40 bg-gradient-to-br from-surface-1/90 via-surface-2/60 to-surface-1/40 p-6 sm:p-7 shadow-lg backdrop-blur-md">
        {/* แถบสีทองด้านซ้ายสร้างสัดส่วนเนื้อหาวิชาการ */}
        <div className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-antique-gold via-soft-gold to-antique-gold/40" aria-hidden="true" />

        {/* แสงเรือง Ambient Glow มุมขวาบน */}
        <div
          className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-antique-gold/10 blur-2xl"
          aria-hidden="true"
        />

        <div className="flex items-center gap-2.5 text-antique-gold">
          <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
            lightbulb
          </span>
          <h2 className="font-serif text-sm font-semibold tracking-wide text-soft-gold">
            ข้อสรุปสำคัญ (Key Takeaway)
          </h2>
        </div>

        <div className="mt-3.5 font-serif text-base sm:text-lg leading-relaxed text-ivory/95">
          {isFallback ? contentText : <InternalLinkText text={contentText} />}
        </div>
      </div>
    </section>
  );
}
