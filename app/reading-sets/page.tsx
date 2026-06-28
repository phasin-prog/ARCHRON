import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { PageNav } from "@/components/page-nav";

export const metadata: Metadata = {
  title: "ซีรีส์ / ชุดอ่าน — ARCHRON",
};

export default function ReadingSetsPage() {
  return (
    <main className="pb-24">
      <PageHeader
        kicker="ซีรีส์ / ชุดอ่าน"
        title="เส้นทางการอ่าน"
        lead="ลำดับการอ่านที่ช่วยให้ผู้อ่านเดินจากพื้นฐานไปสู่ความลึก — เส้นทางคือทางเดิน ไม่ใช่หมวดหมู่"
      />
      <section className="scroll-reveal stagger-1 mx-auto max-w-6xl px-6">
        <div className="rounded-md border border-ink/10 bg-surface-1/50 p-10 text-center">
          <p className="text-soft-ivory">ยังไม่มีเส้นทางการอ่านเผยแพร่</p>
          <p className="mt-2 text-sm text-muted">ตัวอย่างที่วางแผนไว้ เช่น เริ่มต้นกับ Jung จาก Ego ถึง Self</p>
        </div>
      </section>
      <PageNav current="/reading-sets" />
    </main>
  );
}
