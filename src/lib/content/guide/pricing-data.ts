export interface IncludedItem {
  bold: string;
  detail: string;
}

export interface StandardRateData {
  title: string;
  subtitle: string;
  price: number;
  priceLabel: string;
  priceNote: string;
  includedItems: IncludedItem[];
  cta: string;
  footer: string;
}

export interface ConditionItem {
  step: string;
  text: string;
}

export interface SpecialEventData {
  badge: string;
  label: string;
  date: string;
  title: string;
  subtitle: string;
  description: string;
  conditions: ConditionItem[];
  disclaimer: string;
}

export interface PricingPageData {
  standard: StandardRateData;
  specialEvent: SpecialEventData;
}

export function parsePricingData(bodyMarkdown: string): PricingPageData {
  try {
    const parsed = JSON.parse(bodyMarkdown);
    if (!parsed.standard || !parsed.specialEvent) return DEFAULT_PRICING;
    return parsed as PricingPageData;
  } catch {
    return DEFAULT_PRICING;
  }
}

export const DEFAULT_PRICING: PricingPageData = {
  standard: {
    title: "Jungian Type Analysis Session",
    subtitle: "บริการวิเคราะห์โครงสร้างตัวตนและปรึกษาเชิงลึกแบบ 1-on-1",
    price: 399,
    priceLabel: "บาท / ครั้ง",
    priceNote: "(ผ่านพ้นกำหนดราคาทดลอง 249 บาท เมื่อ 30 มิ.ย. 69)",
    includedItems: [
      {
        bold: "เซสชันสัมภาษณ์ออนไลน์ 90 นาที",
        detail: "แบบส่วนตัว 1-on-1 ผ่าน Video Conference",
      },
      {
        bold: "รายงานสรุปรายบุคคล 2–3 หน้า",
        detail: "จัดส่งผ่าน PDF และบันทึกใน Client Portal",
      },
      {
        bold: "วิเคราะห์ Function Stack & Stress Loop",
        detail: "เพื่อการตระหนักรู้และนำไปพัฒนาต่อ",
      },
      {
        bold: "เปิดพื้นที่ติดตามผล",
        detail: "สอบถามข้อสงสัยเพิ่มเติมหลังอ่านรายงานได้โดยตรง",
      },
    ],
    cta: "จองคิวนัดหมาย (Book Session)",
    footer:
      "ไม่มีค่าใช้จ่ายแฝงใดๆ ทั้งสิ้น · ชำระเงินผ่าน PromptPay หรือโอนธนาคารเมื่อจองสำเร็จ",
  },
  specialEvent: {
    badge: "SPECIAL EVENT",
    label: "16 กรกฎาคม 2569",
    date: "16 กรกฎาคม 2569",
    title: "กิจกรรมพิเศษวันเกิดแบรนด์ Archron",
    subtitle: "สิทธิ์พิเศษวิเคราะห์ฟรี (จำนวนจำกัด 5 สิทธิ์ อิงตามลำดับเวลา)",
    description:
      'ในโอกาสครบรอบการรีแบรนด์ครั้งสำคัญจากชื่อเดิม <strong>The Soul\'s Compass - Moonlight</strong> สู่บ้านหลังใหม่ในนาม <strong>Archron</strong> เราเปิดรับสิทธิ์วิเคราะห์และสัมภาษณ์ฟรีสำหรับผู้ร่วมกิจกรรมครบถ้วนตามเงื่อนไขดังนี้:',
    conditions: [
      {
        step: "1",
        text: "อวยพรวันเกิดเพจในโพสต์กิจกรรมหลักประจำวันที่ <strong>16 กรกฎาคม 2569</strong>",
      },
      {
        step: "2",
        text: "แชร์โพสต์โปรโมตกิจกรรมการรีแบรนด์ไปยังโปรไฟล์ส่วนตัวของคุณพร้อมเปิดสาธารณะ",
      },
      {
        step: "3",
        text: "ตกลงส่งรีวิวสะท้อนผลการสัมภาษณ์ตามความเป็นจริงผ่านหน้าเพจ Archron หลังเสร็จสิ้นเซสชัน",
      },
    ],
    disclaimer:
      "* กิจกรรมสิทธิ์พิเศษนี้จัดทำขึ้นและตรวจสอบสิทธิ์โดยตรงผ่านช่องทาง Official Facebook Page ของ Archron เท่านั้น สามารถติดต่อทีมงานเพื่อเช็คสถานะสิทธิ์คงเหลือได้ตลอดเวลา",
  },
};
