import type { Metadata } from "next";
import { PageScaffold } from "@/components/page-scaffold";
import { TimelineBrowser } from "@/components/timeline/timeline-browser";

export const metadata: Metadata = {
  title: "เส้นเวลาประวัติศาสตร์ปัญญา — ARCHRON",
  description:
    "วิวัฒนาการทางปรัชญา จิตวิเคราะห์ และมนุษยศาสตร์ ตั้งแต่ยุคโบราณจนถึงยุคปัญญาประดิษฐ์และประสาทวิทยาศาสตร์ในปัจจุบัน",
};

export default function TimelinePage() {
  return (
    <PageScaffold
      breadcrumb={[
        { label: "หน้าแรก", href: "/" },
        { label: "คลังความรู้", href: "/knowledge" },
        { label: "เส้นเวลาประวัติศาสตร์ปัญญา" },
      ]}
      kicker="TIMELINE PORTAL"
      title="วิวัฒนาการทางปัญญาของมนุษยชาติ"
      lead="ไล่เรียงจุดเปลี่ยนสำคัญทางความคิด ตั้งแต่การตั้งคำถามเชิงจริยธรรมในกรีกโบราณ การค้นพบจิตไร้สำนึก จนถึงปัญญาสังเคราะห์ร่วมสมัย"
      ambient
      navCurrent="/timeline"
      className="atmo-museum"
    >
      <section className="mx-auto max-w-6xl px-6">
        <TimelineBrowser />
      </section>
    </PageScaffold>
  );
}
