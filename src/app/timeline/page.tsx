import type { Metadata } from "next";
import { PageScaffold } from "@/components/page-scaffold";
import { TimelineBrowser } from "@/components/timeline/timeline-browser";

export const metadata: Metadata = {
  title: "เส้นเวลาประวัติศาสตร์ปัญญา — ARCHRON",
  description:
    "ลำดับเหตุการณ์ที่คัดเลือกมาจากประวัติศาสตร์ปรัชญา จิตวิเคราะห์ มนุษยศาสตร์ และปัญญาประดิษฐ์",
};

export default function TimelinePage() {
  return (
    <PageScaffold
      breadcrumb={[
        { label: "หน้าแรก", href: "/" },
        { label: "คลังความรู้", href: "/knowledge" },
        { label: "เส้นเวลาประวัติศาสตร์ปัญญา" },
      ]}
      kicker="เส้นเวลาปัญญา"
      title="เส้นเวลาประวัติศาสตร์ปัญญา"
      lead="เหตุการณ์ที่คัดเลือกมาตั้งแต่การตั้งคำถามในกรีกโบราณ การศึกษาจิตไร้สำนึก ไปจนถึงปัญญาประดิษฐ์ร่วมสมัย"
      ambient
      navCurrent="/timeline"
      className="atmo-museum"
    >
      <section className="tpl-reference">
        <TimelineBrowser />
      </section>
    </PageScaffold>
  );
}
