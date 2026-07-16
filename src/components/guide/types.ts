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
  slipImageUrl?: string;
  reportPdfUrl?: string;
  notes?: string;
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
      "รายงานความยาวประมาณ 2–3 หน้า สรุปแบบแผนของ Ego และทิศทางการใช้ฟังก์ชันจิตตามกรอบ Jungian Typology",
  },
  {
    id: "session-90",
    icon: "session",
    title: "สนทนาและสัมภาษณ์เชิงลึก 90 นาที",
    subtitle: "90-minute Deep Interview Session",
    description:
      "การสนทนาแบบส่วนตัวผ่านระบบออนไลน์ เพื่อสำรวจรูปแบบความคิด ประสบการณ์ และการตอบสนองของ Ego ในสถานการณ์จริง",
  },
  {
    id: "function-stack",
    icon: "stack",
    title: "จำแนกลำดับฟังก์ชันจิตสำนึก",
    subtitle: "Cognitive Function Stack Hierarchy",
    description:
      "พิจารณาลำดับของฟังก์ชันหลัก (Dominant) ฟังก์ชันช่วย (Auxiliary) และฟังก์ชันด้อย (Inferior) ที่เกี่ยวข้องกับการรับรู้และการตัดสินใจ",
  },
  {
    id: "stress-pattern",
    icon: "stress",
    title: "วิเคราะห์แบบแผนยามเผชิญความเครียด",
    subtitle: "Inferior Grip & Stress Dynamic",
    description:
      "สำรวจปฏิกิริยาที่อาจเกิดขึ้นเมื่อ Ego อยู่ภายใต้แรงกดดัน รวมถึงบทบาทของ Inferior Function ในช่วงนั้น",
  },
  {
    id: "discussion",
    icon: "discussion",
    title: "พื้นที่ปลอดภัยเพื่อการสะท้อนตัวตน",
    subtitle: "Reflective Psychological Discussion",
    description:
      "การสนทนาเชิงจิตวิทยาที่ไม่ตัดสิน เพื่อเชื่อมโยงทฤษฎีกับประสบการณ์ในชีวิต การทำงาน และความสัมพันธ์",
  },
  {
    id: "pdf-report",
    icon: "pdf",
    title: "เอกสารดิจิทัลพร้อมดาวน์โหลด PDF",
    subtitle: "Archival PDF Documentation",
    description:
      "จัดเก็บรายงานไว้ในพื้นที่ส่วนตัว (Client Portal) และดาวน์โหลดเป็น PDF เพื่อกลับมาทบทวนภายหลัง",
  },
];

export const SCOPE_ITEMS: ScopeCardItem[] = [
  {
    id: "orientation",
    icon: "orientation",
    title: "ทิศทางพลังงานจิต",
    englishTitle: "Object / Subject Orientation",
    description:
      "พิจารณาว่า Ego มักหันความสนใจไปยังโลกภายนอก (Extraversion) หรือโลกภายใน (Introversion) เป็นหลัก",
  },
  {
    id: "functions",
    icon: "functions",
    title: "ฟังก์ชันหลักและช่องทางรับรู้",
    englishTitle: "Principal & Rational Functions",
    description:
      "พิจารณาช่องทางรับข้อมูลและตัดสินใจของจิตสำนึก ทั้ง Thinking, Feeling, Sensation และ Intuition",
  },
  {
    id: "stack",
    icon: "stack",
    title: "ลำดับชั้นและโครงสร้างฟังก์ชัน",
    englishTitle: "Function Stack Hierarchy",
    description:
      "ดูการทำงานร่วมกันของ Dominant, Auxiliary และ Inferior Function เพื่ออธิบายความถนัดและรูปแบบการตอบสนองที่พบได้บ่อย",
  },
  {
    id: "ego",
    icon: "ego",
    title: "กลไกป้องกันตัวของตัวตน",
    englishTitle: "Ego Defense Mechanisms",
    description:
      "สำรวจรูปแบบที่ Ego ใช้รับมือกับความขัดแย้งภายใน และจุดที่อาจหลีกเลี่ยงหรือยึดติดโดยไม่รู้ตัว",
  },
  {
    id: "shadow",
    icon: "shadow",
    title: "เงาในจิตไร้สำนึก",
    englishTitle: "The Shadow & Inferior Dynamic",
    description:
      "พิจารณาคุณลักษณะที่ Ego มักมองข้ามหรือปฏิเสธ (The Shadow) และความสัมพันธ์กับฟังก์ชันที่พัฒนาน้อยกว่า",
  },
  {
    id: "defenses",
    icon: "defenses",
    title: "ข้อสังเกตเพื่อการพัฒนาตน",
    englishTitle: "Conscious Individuation Pathways",
    description:
      "ข้อสังเกตสำหรับการทำความเข้าใจ Ego ลดความตึงเครียด และค่อย ๆ ทำงานกับประสบการณ์ที่ยังไม่คุ้นเคยในกระบวนการ Individuation",
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
    description: "เปิดช่องทางให้สอบถามข้อสงสัยหลังอ่านรายงาน และทบทวนประเด็นที่ต้องการทำความเข้าใจเพิ่ม",
    icon: "refresh-cw",
  },
];

export const SAMPLE_REPORT_PAGES = [
  {
    id: "page-1",
    pageNumber: "01",
    title: "ฟังก์ชันหลักและทิศทางของจิตสำนึก",
    subtitle: "เหตุผลภายในและมุมมองต่อโลก",
    content: `ตัวอย่างนี้แสดงรูปแบบการสรุปจากการสัมภาษณ์และการพิจารณาแบบแผนพฤติกรรมตามกรอบ Psychological Types ของ C. G. Jung เพื่ออธิบายว่าจิตสำนึกอาจใช้ฟังก์ชันใดเป็นหลัก และพลังงานจิตหันไปทางใด

[ 1. ทิศทางของพลังงานจิต: ทัศนคติแบบ Introverted ]
ในตัวอย่างนี้ บุคคลมีแนวโน้มหันความสนใจไปยังโลกภายใน ทั้งความคิด ประสบการณ์ส่วนตัว และความหมายที่ค่อย ๆ สร้างขึ้นเอง ก่อนตอบสนองต่อสิ่งรอบตัวจึงมักเว้นระยะเพื่อคิดและตีความก่อน ซึ่งสอดคล้องกับทัศนคติแบบ Introverted ในแนวคิดของ Jung

[ 2. ฟังก์ชันหลัก: Introverted Thinking ]
ฟังก์ชันที่พัฒนาชัดที่สุดคือ Introverted Thinking บุคคลนี้ใช้เหตุผลภายในเพื่อจัดระเบียบความคิด ตรวจสอบสมมติฐาน และมองหาความสัมพันธ์ระหว่างแนวคิด จุดแข็งนี้เอื้อต่อการสร้างความเข้าใจที่เป็นระบบด้วยตนเอง`,
  },
  {
    id: "page-2",
    pageNumber: "02",
    title: "ฟังก์ชันสนับสนุนและการทำงานร่วมกัน",
    subtitle: "เมื่อความคิดเชื่อมกับสิ่งที่เกิดขึ้นตรงหน้า",
    content: `[ 3. ฟังก์ชันสนับสนุน: Extraverted Sensation ]
ฟังก์ชันรองในตัวอย่างนี้คือ Extraverted Sensation หรือการรับรู้สิ่งที่เกิดขึ้นตรงหน้าผ่านประสาทสัมผัสและข้อเท็จจริงจากโลกภายนอก ฟังก์ชันนี้ช่วยให้ Introverted Thinking กลับมาตรวจสอบกับสิ่งที่จับต้องและสังเกตได้

Thinking ช่วยจัดความหมายและวางโครงให้ข้อมูล ส่วน Sensation นำรายละเอียดจากภายนอกเข้ามาเติม ทั้งสองจึงทำงานเกื้อหนุนกัน โดยทำให้การคิดอย่างเป็นระบบยังเชื่อมกับสถานการณ์ตรงหน้า

[ 4. ฟังก์ชันที่ถูกทำให้แตกต่างน้อยกว่า (Less Differentiated Functions) ]
ส่วน Intuition และ Feeling ยังเป็นฟังก์ชันที่บุคคลนี้อาจไม่คุ้นเคยนัก จึงมักทำงานอยู่เบื้องหลังหรือแสดงออกแบบฉับพลัน โดยเฉพาะในช่วงที่เหนื่อยล้าหรืออยู่ภายใต้แรงกดดัน`,
  },
  {
    id: "page-3",
    pageNumber: "03",
    title: "ฟังก์ชันที่พัฒนาน้อยกว่าและการเติบโต",
    subtitle: "การทำความเข้าใจความรู้สึกที่อาจถูกมองข้าม",
    content: `[ 5. ฟังก์ชันด้อย: Extraverted Feeling ]
Extraverted Feeling เป็นฟังก์ชันที่พัฒนาน้อยกว่าในตัวอย่างนี้ ตามกรอบของ Jung ฟังก์ชันนี้อยู่ตรงข้ามกับฟังก์ชันหลัก จึงมักทำงานใกล้ระดับไร้สำนึกและอาจให้ความรู้สึกไม่คุ้นเคย

เมื่อเผชิญแรงกดดันสูง ฟังก์ชันนี้อาจปรากฏเป็นอารมณ์ที่รุนแรง ความต้องการการยอมรับ หรือปฏิกิริยาที่เกินกว่าสถานการณ์ ไม่ได้หมายความว่านี่อธิบายบุคลิกภาพทั้งหมด แต่เป็นสัญญาณว่ามีประสบการณ์บางส่วนที่ยังไม่ได้รับฟัง

Jung มองช่วงเวลานี้ว่าเป็นโอกาสให้ Ego ได้พบกับด้านที่มักผลักออกไป หรือที่เรียกว่า Shadow

[ 6. ข้อสังเกตเพื่อการปัจเจกภาพ (Individuation) ]
• ให้ Thinking ได้พักบ้าง: เมื่อใช้ความคิดหนักต่อเนื่อง ลองหันกลับมารับรู้ร่างกายและสิ่งรอบตัว เช่น เดิน ทำงานฝีมือ หรือเคลื่อนไหวร่างกาย

• ค่อย ๆ ทำความรู้จักกับ Feeling: ไม่จำเป็นต้องรีบแก้ไขหรือแสดงอารมณ์ทันที เริ่มจากสังเกตว่าอะไรเกิดขึ้น และให้ชื่อกับความรู้สึกนั้นอย่างตรงไปตรงมา

• สังเกตการฉายภาพ: เมื่อรู้สึกติดขัดกับคนที่ดูอ่อนไหวเกินไปหรือไร้เหตุผล ลองถามตัวเองว่าเกี่ยวข้องกับส่วนใดในตนเองที่ยังไม่คุ้นเคยหรือไม่ การสังเกตเช่นนี้เป็นส่วนหนึ่งของ Individuation`,
  },
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: "faq-1",
    question: "จำเป็นต้องมีความรู้เรื่อง MBTI หรือทฤษฎีจิตวิทยาก่อนรับคำวิเคราะห์หรือไม่?",
    answer:
      "ไม่จำเป็นครับ การสัมภาษณ์และรายงานใช้ภาษาที่เชื่อมกับประสบการณ์จริง ผู้สัมภาษณ์จะใช้คำถามปลายเปิดเพื่อสำรวจมุมมองของคุณ โดยไม่จำเป็นต้องรู้ศัพท์เทคนิคมาก่อน",
  },
  {
    id: "faq-2",
    question: "บริการ Jungian Type Analysis นี้ถือเป็นการบำบัดทางจิตเวชหรือการปรึกษาปัญหาชีวิต (Therapy) หรือไม่?",
    answer:
      "ไม่ใช่การบำบัดรักษาครับ บริการนี้ใช้สำรวจโครงสร้างบุคลิกภาพตามแนวคิด Analytical Psychology ของคาร์ล ยุง หากคุณกำลังเผชิญปัญหาสุขภาพจิตหรือต้องการการรักษาทางคลินิก ควรปรึกษาจิตแพทย์หรือนักจิตวิทยาโดยตรงครับ",
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
  "ใช้สำรวจโครงสร้างบุคลิกภาพและรูปแบบการรับรู้โลกตามแนว Jungian Psychological Types",
  "ไม่ใช่การวินิจฉัยทางการแพทย์ จิตเวช ทางคลินิก หรือกระบวนการจิตบำบัดรักษาโรค",
  "ไม่ใช่การทำนายอนาคต การทายโชคชะตา หรือการพยากรณ์เชิงโหราศาสตร์ใดๆ",
  "ผลลัพธ์มีไว้เพื่อช่วยทำความเข้าใจแบบแผนของ Ego และกลไกป้องกันตัว",
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
  promptPayNumber: "xxx-x-x6727-x (นาย พศิน พสุมาตร)",
};

export const SAMPLE_PENDING_INVOICE: InvoiceData = {
  ...SAMPLE_INVOICE,
  invoiceNumber: "INV-20260715-0102",
  customerName: "คุณผู้สำรวจ โครงสร้างจิต",
  status: "pending",
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
    promptPayNumber: "xxx-x-x6727-x (นาย พศิน พสุมาตร)",
  };
}
