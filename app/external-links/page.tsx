import type { Metadata } from "next";
import Link from "next/link";
import { EXTERNAL_CATEGORIES } from "@/lib/content/external-links";
import { ExternalLinksBrowser } from "@/components/external-links/external-links-browser";

export const metadata: Metadata = {
  title: "แหล่งอ้างอิงและเครือข่ายความรู้ — The Soul's Compass",
  description:
    "รวมลิงก์ ผลงานวิจัย และคลังข้อมูลภายนอกด้านจิตวิทยาวิเคราะห์ จิตวิเคราะห์ ปรัชญา ประสาทวิทยา และมานุษยวิทยา เพื่อการศึกษาค้นคว้าเชิงลึก",
};

export default function ExternalLinksPage() {
  return (
    <main className="px-6 pb-24 pt-10">
      <div className="mx-auto max-w-[1200px]">
        <nav aria-label="เส้นทางนำทาง" className="flex flex-wrap items-center gap-1 text-xs text-muted">
          <Link href="/" className="transition-colors hover:text-soft-gold">หน้าแรก</Link>
          <span className="material-symbols-outlined text-[16px] text-subtle">chevron_right</span>
          <span className="text-soft-ivory">ทรัพยากรและลิงก์ภายนอก</span>
        </nav>

        <header className="scroll-reveal mt-6">
          <span className="block text-xs font-semibold tracking-[0.05em] text-burnished-gold/70">
            คลังทรัพยากรภายนอก
          </span>
          <h1 className="mt-3 font-serif text-4xl font-bold text-ivory md:text-5xl">
            แหล่งอ้างอิงและเครือข่ายความรู้
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-soft-ivory">
            รวมลิงก์ ผลงานวิจัย และคลังข้อมูลภายนอกเพื่อการศึกษาค้นคว้าเชิงลึก —
            คัดสรรเฉพาะแหล่งอ้างอิงเชิงวิชาการและองค์กรต้นทางที่น่าเชื่อถือ
          </p>
        </header>

        <div className="scroll-reveal stagger-1">
          <ExternalLinksBrowser categories={EXTERNAL_CATEGORIES} />
        </div>

        <p className="mt-16 border-t border-slate-boundary/30 pt-6 text-sm leading-relaxed text-on-surface-variant/50">
          หมายเหตุ: ลิงก์ทั้งหมดนำไปสู่เว็บไซต์ภายนอก โครงการ The Soul&apos;s Compass
          ไม่มีส่วนเกี่ยวข้องกับการบริหารจัดการเนื้อหาภายในเว็บปลายทางเหล่านั้น
        </p>
      </div>
    </main>
  );
}
