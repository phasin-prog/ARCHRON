import type { Metadata } from "next";

// metadata ของโซน Studio ทั้งหมด — หน้า client (page.tsx ฯลฯ) export metadata เองไม่ได้
// ลูกเซกเมนต์ที่ประกาศ title เองจะเข้า template "%s — Studio · ARCHRON" อัตโนมัติ
// noindex: Studio เป็นเครื่องมือภายในสำหรับนักเขียน/ผู้ดูแล ไม่ใช่เนื้อหาสาธารณะ
export const metadata: Metadata = {
  title: {
    default: "Studio — ห้องเขียน ARCHRON",
    template: "%s — Studio · ARCHRON",
  },
  description:
    "ห้องเขียนของ ARCHRON — พื้นที่เรียบเรียง บันทึก และเผยแพร่ความรู้สำหรับนักเขียนและผู้ดูแลคลัง",
  robots: { index: false },
};

// force-dynamic: ไม่ prerender ตอน build → publishableKey ต้องการเฉพาะตอน runtime
export const dynamic = "force-dynamic";

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
