import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jungian Type Analysis — ARCHRON",
  description: "วิเคราะห์โครงสร้าง Ego ผ่านกรอบทฤษฎีจิตวิทยาเชิงลึกของคาร์ล ยุง",
};

export default function GuideLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
