import type { Metadata } from "next";
import Link from "next/link";
import { FAQ } from "@/lib/content/utils/faq";
import { Accordion } from "@/components/accordion";
import { PageScaffold } from "@/components/page-scaffold";

export const metadata: Metadata = {
  title: "คำถามที่พบบ่อย — ARCHRON",
  description: "คำถามที่พบบ่อยเกี่ยวกับ ARCHRON — จุดยืน วิธีอ่าน ระดับเนื้อหา การอ้างอิง และบริการ",
};

export default function FaqPage() {
  const items = FAQ.map((f) => ({ id: f.id, title: f.q, content: f.a }));

  return (
    <PageScaffold
      breadcrumb={[
        { label: "หน้าแรก", href: "/" },
        { label: "คำถามที่พบบ่อย" },
      ]}
      kicker="คำถามที่พบบ่อย"
      title="คำถามที่พบบ่อย"
      lead="รวมคำถามเกี่ยวกับจุดยืนของโครงการ วิธีอ่าน ระดับเนื้อหา และการนำไปใช้ — คลิกที่คำถามเพื่อดูคำตอบ"
      className="atmo-observatory"
    >
      <section className="tpl-reference">
        <Accordion items={items} />

        <p className="mt-8 text-sm text-text-secondary/60">
          มีคำถามอื่นเพิ่มเติม?{" "}
          <Link href="/support" className="text-accent hover:underline">
            ติดต่อ / สนับสนุนโครงการ
          </Link>
        </p>
      </section>
    </PageScaffold>
  );
}
