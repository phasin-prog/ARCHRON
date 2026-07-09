import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "สนับสนุน — ARCHRON",
  description: "ร่วมดูแลคลังความรู้ภาษาไทยด้านจิตวิทยาและปรัชญาให้คงอยู่ — สนับสนุนผ่าน ARCHRON Companion, การวิเคราะห์ Jungian Type Guide, หรือการร่วมเขียน",
};

export default function SupportLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
