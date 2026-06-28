import type { Metadata } from "next";
import Link from "next/link";
import { FAQ } from "@/lib/content/faq";
import { Accordion } from "@/components/accordion";

export const metadata: Metadata = {
  title: "คำถามที่พบบ่อย — The Soul's Compass",
  description: "คำถามที่พบบ่อยเกี่ยวกับ The Soul's Compass — จุดยืน วิธีอ่าน ระดับเนื้อหา การอ้างอิง และบริการ",
};

export default function FaqPage() {
  const items = FAQ.map((f) => ({ id: f.id, title: f.q, content: f.a }));

  return (
    <main className="px-6 pb-24 pt-10">
      <div className="mx-auto max-w-3xl">
        <nav aria-label="เส้นทางนำทาง" className="flex flex-wrap items-center gap-1 text-xs text-muted">
          <Link href="/" className="transition-colors hover:text-soft-gold">หน้าแรก</Link>
          <span className="material-symbols-outlined text-[16px] text-subtle">chevron_right</span>
          <span className="text-soft-ivory">คำถามที่พบบ่อย</span>
        </nav>

        <header className="mt-6 mb-8">
          <h1 className="font-serif text-4xl font-bold text-ivory">คำถามที่พบบ่อย</h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-soft-ivory">
            รวมคำถามเกี่ยวกับจุดยืนของโครงการ วิธีอ่าน ระดับเนื้อหา และการนำไปใช้ — คลิกที่คำถามเพื่อดูคำตอบ
          </p>
        </header>

        <Accordion items={items} />

        <p className="mt-8 text-sm text-on-surface-variant/60">
          มีคำถามอื่นเพิ่มเติม?{" "}
          <Link href="/support" className="text-burnished-gold hover:underline">
            ติดต่อ / สนับสนุนโครงการ
          </Link>
        </p>
      </div>
    </main>
  );
}
