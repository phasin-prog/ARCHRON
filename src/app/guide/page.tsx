import type { Metadata } from "next";
import { JungianServicePlatform } from "@/components/guide/jungian-service-platform";

export const metadata: Metadata = {
  title: "Jungian Type Analysis | Archron — บริการวิเคราะห์และสัมภาษณ์จิตวิทยาเชิงลึก",
  description:
    "บริการวิเคราะห์โครงสร้างตัวตนและปรึกษาเชิงลึกแบบ 1-on-1 เพื่อทำความเข้าใจทิศทางพลังงานจิต (Ego), ลำดับชั้นฟังก์ชัน (Cognitive Stack) และกลไกป้องกันตัวยามเครียด (Stress Loop & Shadow)",
};

export default function GuidePage() {
  return <JungianServicePlatform />;
}
