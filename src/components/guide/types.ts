export type PaymentStatus = "pending" | "paid" | "cancelled" | "completed";

export interface BookingFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  timezone: string;
  notes: string;
  service: string;
}

export interface InvoiceData {
  invoiceNumber: string;
  issueDate: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceName: string;
  appointmentDate: string;
  appointmentTime: string;
  amount: number;
  status: PaymentStatus;
  paymentMethod: string;
  promptPayNumber: string;
}

export interface AppointmentItem {
  id: string;
  serviceName: string;
  date: string;
  time: string;
  status: "confirmed" | "completed" | "pending";
  notes?: string;
  reportUrl?: string;
  invoiceId: string;
}

export interface ReportItem {
  id: string;
  title: string;
  date: string;
  pagesCount: number;
  fileSize: string;
  status: "ready" | "processing";
  downloadUrl?: string;
}

export interface FeatureCardItem {
  id: string;
  icon: "report" | "session" | "stack" | "stress" | "discussion" | "pdf";
  title: string;
  subtitle: string;
  description: string;
}

export interface ScopeCardItem {
  id: string;
  icon: "orientation" | "functions" | "stack" | "ego" | "shadow" | "defenses";
  title: string;
  englishTitle: string;
  description: string;
}

export interface TimelineStepItem {
  step: string;
  code: string;
  title: string;
  description: string;
  icon: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface ContactChannelItem {
  icon: "call" | "chat" | "person" | "groups";
  label: string;
  value: string;
  href: string;
  external: boolean;
}

// ── Shared Static Data ──

export const FEATURE_ITEMS: FeatureCardItem[] = [
  {
    id: "personal-report",
    icon: "report",
    title: "รายงานสรุปจิตวิเคราะห์รายบุคคล",
    subtitle: "Personal Analytical Report",
    description:
      "เอกสารวิเคราะห์เฉพาะบุคคลความยาวประมาณ 2–3 หน้า สะท้อนโครงสร้าง Ego และความโน้มเอียงของจิตสำนึกตามกรอบ Jungian Typology อย่างละเอียด",
  },
  {
    id: "session-90",
    icon: "session",
    title: "สนทนาและสัมภาษณ์เชิงลึก 90 นาที",
    subtitle: "90-minute Deep Interview Session",
    description:
      "เซสชันพูดคุยแบบส่วนตัวผ่านระบบออนไลน์ เพื่อสำรวจกระแสพลังงานจิตและสังเกตปฏิกิริยาของโครงสร้าง Ego ในสถานการณ์จริงร่วมกับผู้เชี่ยวชาญ",
  },
  {
    id: "function-stack",
    icon: "stack",
    title: "จำแนกลำดับฟังก์ชันจิตสำนึก",
    subtitle: "Cognitive Function Stack Hierarchy",
    description:
      "ระบุลำดับชั้นของฟังก์ชันหลัก (Dominant), ฟังก์ชันช่วย (Auxiliary), และฟังก์ชันด้อย (Inferior) ที่กำหนดมุมมองและการตัดสินข้อมูลของคุณ",
  },
  {
    id: "stress-pattern",
    icon: "stress",
    title: "วิเคราะห์แบบแผนยามเผชิญความเครียด",
    subtitle: "Inferior Grip & Stress Dynamic",
    description:
      "เข้าใจกลไกปฏิกิริยาอัตโนมัติเมื่อ Ego เผชิญแรงกดดันสูง หรือสภาวะถูกครอบงำโดย Inferior Function เพื่อการรับมือและคลี่คลายอย่างมีสติ",
  },
  {
    id: "discussion",
    icon: "discussion",
    title: "พื้นที่ปลอดภัยเพื่อการสะท้อนตัวตน",
    subtitle: "Reflective Psychological Discussion",
    description:
      "เปิดพื้นที่เสวนาเชิงจิตวิทยาที่ปราศจากการตัดสิน เพื่อเชื่อมโยงทฤษฎีเข้ากับประสบการณ์จริงของชีวิต การทำงาน และความสัมพันธ์",
  },
  {
    id: "pdf-report",
    icon: "pdf",
    title: "เอกสารดิจิทัลพร้อมดาวน์โหลด PDF",
    subtitle: "Archival PDF Documentation",
    description:
      "จัดเก็บไฟล์รายงานในระบบคลังส่วนตัว (Client Portal) พร้อมดาวน์โหลดเอกสาร PDF ความละเอียดสูงเพื่อการทบทวนระยะยาวได้ทุกเมื่อ",
  },
];

export const SCOPE_ITEMS: ScopeCardItem[] = [
  {
    id: "orientation",
    icon: "orientation",
    title: "ทิศทางพลังงานจิต",
    englishTitle: "Object / Subject Orientation",
    description:
      "ตรวจสอบแนวโน้มพื้นฐานของ Ego ว่าให้ความสำคัญและดึงพลังงานจากโลกภายนอก (Extraversion) หรือโลกภายในของตนเอง (Introversion) เป็นช่องทางหลัก",
  },
  {
    id: "functions",
    icon: "functions",
    title: "ฟังก์ชันหลักและช่องทางรับรู้",
    englishTitle: "Principal & Rational Functions",
    description:
      "วิเคราะห์ช่องทางการรับข้อมูลและตัดสินใจหลักของจิตสำนึก ครอบคลุมทั้งฟังก์ชันเชิงตรรกะคุณค่า (Thinking/Feeling) และการรับรู้ (Sensation/Intuition)",
  },
  {
    id: "stack",
    icon: "stack",
    title: "ลำดับชั้นและโครงสร้างฟังก์ชัน",
    englishTitle: "Function Stack Hierarchy",
    description:
      "ประเมินสัดส่วนน้ำหนักและการทำงานร่วมกันระหว่าง Dominant, Auxiliary, และ Inferior function ที่กำหนดรูปแบบพฤติกรรมและความถนัดตามธรรมชาติ",
  },
  {
    id: "ego",
    icon: "ego",
    title: "กลไกป้องกันตัวของตัวตน",
    englishTitle: "Ego Defense Mechanisms",
    description:
      "สำรวจรูปแบบความยึดติดของ Ego และกลไกการหลีกเลี่ยงความขัดแย้งภายใน เพื่อสร้างความตระหนักรู้ต่อแบบแผนความคุ้นเคยที่อาจจำกัดการเติบโต",
  },
  {
    id: "shadow",
    icon: "shadow",
    title: "เงาในจิตไร้สำนึก",
    englishTitle: "The Shadow & Inferior Dynamic",
    description:
      "สะท้อนคุณลักษณะและพลังงานที่ Ego มักมองข้ามหรือปฏิเสธ (The Shadow) ซึ่งซ่อนอยู่ใต้เงาของฟังก์ชันหลัก และเป็นกุญแจสำคัญสู่การบูรณาการตนเอง",
  },
  {
    id: "defenses",
    icon: "defenses",
    title: "แนวทางการคลี่คลายและพัฒนา",
    englishTitle: "Conscious Individuation Pathways",
    description:
      "ข้อเสนอแนะเชิงกลยุทธ์เพื่อขยายพื้นที่จิตสำนึก ผ่อนคลายความตึงเครียดของ Ego และนำทางสู่กระบวนการสร้างตัวตนที่สมบูรณ์ (Individuation)",
  },
];

export const TIMELINE_STEPS: TimelineStepItem[] = [
  {
    step: "01",
    code: "BOOKING",
    title: "จองเซสชันผ่านระบบออนไลน์",
    description: "เลือกวันเวลาที่สะดวกผ่านระบบนัดหมาย กรอกข้อมูลเบื้องต้นและเลือกหัวข้อบริการที่ต้องการ",
    icon: "calendar",
  },
  {
    step: "02",
    code: "INVOICE",
    title: "รับใบแจ้งยอดชำระเงินอัตโนมัติ",
    description: "ระบบสร้างใบแจ้งยอดชำระเงิน (Invoice) ทันที พร้อมแสดง QR Code PromptPay และรายละเอียดครบถ้วน",
    icon: "receipt",
  },
  {
    step: "03",
    code: "PAYMENT",
    title: "ชำระเงินและแจ้งสลิปยืนยัน",
    description: "สแกนชำระค่าบริการผ่าน PromptPay หรือโอนผ่านธนาคาร พร้อมกดจำลองหรือแนบหลักฐานเพื่อล็อคคิวนัดหมาย",
    icon: "credit-card",
  },
  {
    step: "04",
    code: "CONFIRMATION",
    title: "ยืนยันการนัดหมายและเตรียมตัว",
    description: "ผู้ดูแลระบบตรวจสอบการชำระเงินและส่งลิงก์ห้องสนทนาออนไลน์ พร้อมแบบสำรวจสั้นๆ ก่อนเข้าเซสชัน",
    icon: "check-circle",
  },
  {
    step: "05",
    code: "INTERVIEW",
    title: "เข้าสนทนาเชิงลึก 90 นาที",
    description: "พูดคุยสดแบบตัวต่อตัวกับผู้เชี่ยวชาญเพื่อสำรวจแบบแผน Ego ความคิด และทิศทางการใช้ฟังก์ชันจิตวิทยา",
    icon: "mic",
  },
  {
    step: "06",
    code: "ANALYSIS",
    title: "สังเคราะห์และเรียบเรียงโครงสร้าง",
    description: "ทีมวิเคราะห์ทำการประมวลผลข้อมูลจากการสัมภาษณ์ สังเคราะห์โครงสร้าง Function Stack และเรียบเรียงรายงาน",
    icon: "cpu",
  },
  {
    step: "07",
    code: "REPORT",
    title: "รับรายงาน PDF รายบุคคล",
    description: "จัดส่งรายงานสรุปผลความยาว 2–3 หน้าเข้าสู่ Client Portal และอีเมลของคุณภายใน 3–5 วันทำการ",
    icon: "file-text",
  },
  {
    step: "08",
    code: "FOLLOW-UP",
    title: "ติดตามผลและสอบถามเพิ่มเติม",
    description: "เปิดช่องทางพูดคุยข้อสงสัยหลังอ่านรายงาน เพื่อสนับสนุนการนำความเข้าใจไปปรับใช้ในชีวิตจริงอย่างยั่งยืน",
    icon: "refresh-cw",
  },
];

export const SAMPLE_REPORT_PAGES = [
  {
    id: "page-1",
    pageNumber: "01",
    title: "Executive Ego Summary & Orientation",
    subtitle: "บทสรุปภาพรวมโครงสร้างตัวตนและทิศทางพลังงานจิตพื้นฐาน",
    content: `รายงานฉบับนี้จัดทำขึ้นจากการประมวลผลการสัมภาษณ์เชิงลึกและการวิเคราะห์แบบแผนพฤติกรรมตามกรอบ Jungian Psychological Types โดยมุ่งเน้นการทำความเข้าใจกลไกการทำงานของ Ego ตามธรรมชาติ

[ 1. ทิศทางพลังงานพื้นฐาน: Introverted Orientation ]
โครงสร้างจิตสำนึกของคุณแสดงความโน้มเอียงอย่างเด่นชัดในการดึงพลังงานจากโลกภายใน (Subjective Inner World) Ego ให้ความสำคัญกับความหมาย แนวคิด และคุณค่าที่ผ่านการกลั่นกรองจากตนเองมากกว่าการตอบสนองต่อสิ่งเร้าภายนอกโดยตรง เมื่อเผชิญกับสถานการณ์ใหม่ จิตสำนึกจะทำการถอยรักษาระยะ (Psychological Distance) เพื่อประมวลผลความสอดคล้องภายในก่อนแสดงออก

[ 2. Dominant Principal Function: Introverted Thinking (Ti) ]
ฟังก์ชันหลักในการขับเคลื่อนชีวิตและตัดสินใจคือ Introverted Thinking (Ti) จิตสำนึกแสวงหาความถูกต้อง แม่นยำ และความเป็นเหตุเป็นผลของโครงสร้างระบบภายใน (Internal Consistency) คุณมีทักษะสูงในการแยกแยะความซับซ้อน ตั้งคำถามต่อสมมติฐานพื้นฐาน และสร้างกรอบความเข้าใจที่ชัดเจนเป็นระบบอย่างเป็นอิสระจากกระแสสังคม`,
  },
  {
    id: "page-2",
    pageNumber: "02",
    title: "Cognitive Function Stack Dynamics",
    subtitle: "โครงสร้างการทำงานร่วมกันระหว่างฟังก์ชันหลัก ฟังก์ชันช่วย และจุดบอด",
    content: `[ 3. โครงสร้างลำดับฟังก์ชันจิตสำนึก (Function Stack Hierarchy) ]

• Dominant Function — Introverted Thinking (Ti):
แกนหลักของ Ego ทำหน้าที่จัดระเบียบตรรกะและประเมินความสมเหตุสมผลเชิงโครงสร้าง มีความคมชัดและความเป็นอิสระทางปัญญาในระดับสูง

• Auxiliary Function — Extraverted Sensation (Se):
ฟังก์ชันสนับสนุนที่ช่วยให้ Ego เชื่อมต่อกับความเป็นจริงของโลกกายภาพ (Physical Reality) ทำให้สามารถสังเกตรายละเอียดรอบตัว ตอบสนองต่อปัจจุบันขณะได้อย่างคล่องตัวเมื่อจำเป็น

• Tertiary Function — Introverted Intuition (Ni):
ฟังก์ชันเสริมในระดับกึ่งสำนึก ให้ลางสังหรณ์และมุมมองเชิงลึกต่อแนวโน้มในอนาคต แต่บางครั้งอาจถูกใช้เพื่อสนับสนุนข้อสรุปเชิงตรรกะของ Ti อย่างยึดติด

• Inferior Function — Extraverted Feeling (Fe):
จุดอ่อนไหวและช่องทางสู่จิตไร้สำนึก (The Shadow Threshold) เกี่ยวข้องกับความสอดคล้องทางอารมณ์ในบรรยากาศส่วนรวม เป็นส่วนที่ Ego มักหลีกเลี่ยงหรือรู้สึกสูญเสียการควบคุมเมื่อถูกเรียกร้อง`,
  },
  {
    id: "page-3",
    pageNumber: "03",
    title: "Inferior Grip & Individuation Recommendations",
    subtitle: "กลไกปฏิกิริยามื่อเผชิญความเครียด และข้อเสนอแนะสู่การพัฒนาตนเอง",
    content: `[ 4. แบบแผนยามตกอยู่ภายใต้ความเครียด (The Inferior Fe Grip) ]
เมื่อเผชิญกับแรงกดดันสะสมหรือความตึงเครียดทางความสัมพันธ์ที่แก้ไขด้วยตรรกะไม่ได้ โครงสร้าง Ti ของคุณอาจสูญเสียเสถียรภาพ และเปิดทางให้ Inferior Fe ครอบงำ จิตสำนึกอาจเกิดปฏิกิริยากังวลอย่างรุนแรงต่อการยอมรับของผู้อื่น รู้สึกแปลกแยก หรือแสดงอารมณ์หงุดหงิดประชดประชันอย่างไม่เป็นธรรมชาติของตนเอง

[ 5. ข้อเสนอแนะเชิงกลยุทธ์สู่การสร้างตัวตน (Individuation Guidelines) ]
• การพักฟื้นฟังก์ชันหลัก: เมื่อรู้สึกอ่อนล้าทางความคิด อนุญาตให้ตนเองหยุดการวิเคราะห์ และหันมาสัมผัสโลกกายภาพผ่านฟังก์ชันช่วย (Se) เช่น การออกกำลังกาย หรืออยู่กับธรรมชาติ
• การเปิดพื้นที่ให้ความรู้สึก: ฝึกสังเกตอารมณ์ความรู้สึกในความสัมพันธ์โดยไม่ต้องพยายามหาเหตุผลหรือแก้ปัญหาเชิงตรรกะในทันที เพื่อลดความตึงเครียดของ Inferior Fe
• การตระหนักรู้ต่อความสมบูรณ์: ยอมรับว่าความไม่สมบูรณ์แบบทางอารมณ์คือส่วนหนึ่งของความเป็นมนุษย์ที่จะช่วยขยายขอบเขตของ Ego สู่ความยืดหยุ่นที่แท้จริง`,
  },
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: "faq-1",
    question: "จำเป็นต้องมีความรู้เรื่อง MBTI หรือทฤษฎีจิตวิทยาก่อนรับคำวิเคราะห์หรือไม่?",
    answer:
      "ไม่จำเป็นครับ ทีมวิเคราะห์ออกแบบกระบวนการสัมภาษณ์และรายงานสรุปให้เข้าใจง่ายและเชื่อมโยงกับชีวิตจริงโดยตรง ผู้สัมภาษณ์จะใช้คำถามปลายเปิดเพื่อสำรวจมุมมองของคุณอย่างเป็นธรรมชาติ โดยไม่ต้องอาศัยศัพท์เทคนิคทางจิตวิทยาใดๆ ในระหว่างเซสชันสนทนา",
  },
  {
    id: "faq-2",
    question: "บริการ Jungian Type Analysis นี้ถือเป็นการบำบัดทางจิตเวชหรือการปรึกษาปัญหาชีวิต (Therapy) หรือไม่?",
    answer:
      "ไม่ใช่การบำบัดรักษาครับ บริการนี้คือกระบวนการสำรวจและสะท้อนโครงสร้างบุคลิกภาพตามแนวคิดทางจิตวิทยาเชิงลึกของคาร์ล ยุง (Analytical Psychology) มุ่งเน้นความตระหนักรู้ในตนเองและการพัฒนาศักยภาพ หากคุณกำลังประสบปัญหาทางสุขภาพจิตหรือต้องการการรักษาทางคลินิก ขอแนะนำให้ปรึกษาจิตแพทย์หรือนักจิตวิทยากระบวนกรโดยตรงครับ",
  },
  {
    id: "faq-3",
    question: "หากติดภารกิจเร่งด่วน สามารถขอเลื่อนวันและเวลาสัมภาษณ์ได้หรือไม่?",
    answer:
      "สามารถแจ้งขอเลื่อนกำหนดการได้ล่วงหน้าอย่างน้อย 24 ชั่วโมงก่อนถึงเวลานัดหมาย ผ่านช่องทาง LINE Official หรือเบอร์โทรศัพท์ติดต่อหลักของ Archron โดยไม่มีค่าใช้จ่ายเพิ่มเติมครับ",
  },
  {
    id: "faq-4",
    question: "เซสชันสนทนาและสัมภาษณ์เชิงลึก 90 นาที ดำเนินการผ่านช่องทางใด?",
    answer:
      "เซสชันจัดขึ้นผ่านระบบประชุมออนไลน์แบบส่วนตัว (เช่น Google Meet หรือ Zoom) โดยระบบจะจัดส่งลิงก์การประชุมให้ทางอีเมลและใน Client Dashboard หลังจากที่ได้รับการยืนยันการชำระเงินเรียบร้อยแล้วครับ",
  },
  {
    id: "faq-5",
    question: "หลังจากเสร็จสิ้นเซสชันสัมภาษณ์ จะได้รับเอกสารรายงานสรุป PDF ภายในกี่วัน?",
    answer:
      "ทีมวิเคราะห์จะทำการเรียบเรียง สังเคราะห์ข้อมูล และจัดทำรายงานสรุปรายบุคคล (ความยาวประมาณ 2–3 หน้า) จัดส่งเข้าสู่ระบบ Client Portal และอีเมลของคุณภายใน 3–5 วันทำการหลังเสร็จสิ้นการสัมภาษณ์ครับ",
  },
];

export const BOUNDARIES_ITEMS = [
  "เป็นการสะท้อนโครงสร้างบุคลิกภาพและรูปแบบการรับรู้โลกตามแนว Jungian Psychological Types ดั้งเดิม",
  "ไม่ใช่การวินิจฉัยทางการแพทย์ จิตเวช ทางคลินิก หรือกระบวนการจิตบำบัดรักษาโรค",
  "ไม่ใช่การทำนายอนาคต การทายโชคชะตา หรือการพยากรณ์เชิงโหราศาสตร์ใดๆ",
  "ผลลัพธ์มีขึ้นเพื่อช่วยให้บุคคลเข้าใจแบบแผนของ Ego ตระหนักรู้กลไกป้องกันตัว และนำไปพัฒนาตนเองอย่างมีสติ",
];

export const CONTACT_CHANNELS: ContactChannelItem[] = [
  {
    icon: "call",
    label: "โทรศัพท์ติดต่อสอบถาม",
    value: "081-538-2404",
    href: "tel:0815382404",
    external: false,
  },
  {
    icon: "chat",
    label: "LINE Official / สอบถามคิว",
    value: "phasin_pasumart",
    href: "https://line.me/ti/p/~phasin_pasumart",
    external: true,
  },
  {
    icon: "person",
    label: "Facebook ส่วนตัว (ผู้เขียน)",
    value: "Phasin Pasumart",
    href: "https://www.facebook.com/phasin.phasin.7",
    external: true,
  },
  {
    icon: "groups",
    label: "Facebook Page",
    value: "ARCHRON",
    href: "https://www.facebook.com/profile.php?id=61561438596973",
    external: true,
  },
];

export const SAMPLE_INVOICE: InvoiceData = {
  invoiceNumber: "INV-20260715-0089",
  issueDate: "15 กรกฎาคม 2569",
  customerName: "คุณตัวอย่าง รักการวิเคราะห์",
  customerEmail: "sample.explorer@archron.org",
  customerPhone: "089-123-4567",
  serviceName: "Jungian Type Analysis - เซสชัน 90 นาที + รายงาน PDF",
  appointmentDate: "20 กรกฎาคม 2569",
  appointmentTime: "ช่วงเช้า (09:30 - 11:00 น.)",
  amount: 399.00,
  status: "paid",
  paymentMethod: "PromptPay QR Code",
  promptPayNumber: "081-538-2404",
};

export function generateInvoiceNumber(): string {
  const d = new Date();
  const dateStr = d.toISOString().split("T")[0].replace(/-/g, "");
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `INV-${dateStr}-${randomNum}`;
}

export function generateInvoiceData(formData: BookingFormData, invoiceNumber: string): InvoiceData {
  const d = new Date();
  const thaiYear = d.getFullYear() + 543;
  const thaiMonths = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
    "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม",
  ];
  const issueDate = `${d.getDate()} ${thaiMonths[d.getMonth()]} ${thaiYear}`;

  return {
    invoiceNumber,
    issueDate,
    customerName: `${formData.firstName} ${formData.lastName}`.trim(),
    customerEmail: formData.email,
    customerPhone: formData.phone,
    serviceName: formData.service,
    appointmentDate: formData.preferredDate,
    appointmentTime: formData.preferredTime,
    amount: 399.00,
    status: "pending",
    paymentMethod: "PromptPay QR Code",
    promptPayNumber: "081-538-2404",
  };
}

