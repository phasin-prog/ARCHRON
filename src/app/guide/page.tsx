import type { Metadata } from "next";
import { JungianServicePlatform } from "@/components/guide/jungian-service-platform";
import { getPublicEntryBySlug } from "@/lib/content/publishing/public-source";
import { parsePricingData } from "@/lib/content/guide/pricing-data";

export const metadata: Metadata = {
  title: "Jungian Type Analysis | Archron — บริการวิเคราะห์และสัมภาษณ์จิตวิทยาเชิงลึก",
  description:
    "บริการวิเคราะห์โครงสร้างตัวตนและปรึกษาเชิงลึกแบบ 1-on-1 เพื่อทำความเข้าใจทิศทางพลังงานจิต (Ego), ลำดับชั้นฟังก์ชัน (Cognitive Stack) และกลไกป้องกันตัวยามเครียด (Stress Loop & Shadow)",
};

export default async function GuidePage() {
  const entry = await getPublicEntryBySlug("guide-pricing");
  const pricingData = entry?.bodyMarkdown
    ? parsePricingData(entry.bodyMarkdown)
    : undefined;
  return <JungianServicePlatform pricingData={pricingData} />;
}
