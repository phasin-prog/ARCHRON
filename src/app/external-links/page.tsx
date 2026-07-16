import type { Metadata } from "next";
import Link from "next/link";
import { PageScaffold } from "@/components/page-scaffold";
import { EXTERNAL_CATEGORIES } from "@/lib/content/utils/external-links";
import { ExternalLinksBrowser } from "@/components/external-links/external-links-browser";

export const metadata: Metadata = {
  title: "แหล่งอ้างอิงและเครือข่ายความรู้ — ARCHRON",
  description:
    "รวมลิงก์ ผลงานวิจัย และคลังข้อมูลภายนอกด้านจิตวิทยาวิเคราะห์ จิตวิเคราะห์ ปรัชญา ประสาทวิทยา และมานุษยวิทยา",
};

export default function ExternalLinksPage() {
  return (
    <PageScaffold
      className="atmo-temple"
      breadcrumb={[
        { label: "หน้าแรก", href: "/" },
        { label: "ทรัพยากรและลิงก์ภายนอก" },
      ]}
      kicker="คลังทรัพยากรภายนอก"
      title="แหล่งอ้างอิงและเครือข่ายความรู้"
      lead="รวมลิงก์ ผลงานวิจัย และคลังข้อมูลภายนอก แยกตามสาขาและหน่วยงาน"
      ambient
      navCurrent="/external-links"
    >
      <div className="tpl-reference">
        <ExternalLinksBrowser categories={EXTERNAL_CATEGORIES} />
        <p className="mt-16 border-t border-border/30 pt-6 text-sm leading-relaxed text-text-secondary/50">
          หมายเหตุ: ลิงก์ทั้งหมดนำไปสู่เว็บไซต์ภายนอก โครงการ ARCHRON
          ไม่มีส่วนเกี่ยวข้องกับการบริหารจัดการเนื้อหาภายในเว็บปลายทางเหล่านั้น
        </p>
      </div>
    </PageScaffold>
  );
}
