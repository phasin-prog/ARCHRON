// lib/content/external-links.ts — คลังทรัพยากรและลิงก์ภายนอก (curated resources)
// ข้อมูลคงที่ (static) จัดกลุ่มตามหมวดความรู้ — ใช้แสดงในหน้า /external-links

export type ExternalLink = {
  title: string;
  description: string;
  url: string;
  tags: string[];
  checkedAt?: string;
};

export type ExternalCategory = {
  id: string;
  thaiLabel: string;
  enLabel: string;
  icon: string; // Material Symbols glyph
  items: ExternalLink[];
};

export const EXTERNAL_CATEGORIES: ExternalCategory[] = [
  {
    id: "analytical-psychology",
    thaiLabel: "จิตวิทยาวิเคราะห์",
    enLabel: "Analytical Psychology",
    icon: "psychology",
    items: [
      {
        title: "International Association for Analytical Psychology (IAAP)",
        description:
          "สมาคมวิชาชีพและศูนย์กลางการรับรองนักจิตวิทยาวิเคราะห์สายตรงของ Carl Jung ในระดับสากล",
        url: "https://iaap.org",
        tags: ["Official Organization", "Jungian"],
        checkedAt: "2026-07-02",
      },
      {
        title: "Philemon Foundation",
        description:
          "มูลนิธิที่อุทิศตนเพื่อชำระ รวบรวม และแปลต้นฉบับงานเขียนที่ยังไม่เคยเผยแพร่ของ Carl Jung ออกมาเป็น Collected Works",
        url: "https://philemonfoundation.org",
        tags: ["Manuscripts", "Research"],
        checkedAt: "2026-07-02",
      },
    ],
  },
  {
    id: "psychoanalysis",
    thaiLabel: "จิตวิเคราะห์",
    enLabel: "Psychoanalysis",
    icon: "visibility",
    items: [
      {
        title: "International Psychoanalytical Association (IPA)",
        description:
          "องค์กรระดับโลกที่ก่อตั้งโดย Sigmund Freud เพื่อวางรากฐานและรับรองมาตรฐานการฝึกฝนวิชาชีพจิตวิเคราะห์",
        url: "https://www.ipa.world",
        tags: ["Freudian", "Psychoanalysis"],
        checkedAt: "2026-07-02",
      },
    ],
  },
  {
    id: "general-psychology",
    thaiLabel: "จิตวิทยาทั่วไป",
    enLabel: "General Psychology",
    icon: "school",
    items: [
      {
        title: "American Psychological Association (APA)",
        description:
          "คลังทรัพยากร ข้อมูลงานวิจัย และมาตรฐานทางวิชาการที่ใหญ่ที่สุดในด้านจิตวิทยาร่วมสมัย",
        url: "https://www.apa.org",
        tags: ["Academic", "Standard"],
        checkedAt: "2026-07-02",
      },
    ],
  },
  {
    id: "philosophy",
    thaiLabel: "ปรัชญา",
    enLabel: "Philosophy",
    icon: "auto_stories",
    items: [
      {
        title: "Stanford Encyclopedia of Philosophy (SEP)",
        description:
          "แหล่งอ้างอิงและสารานุกรมปรัชญาออนไลน์ที่ผ่านการ Peer-review โดยนักวิชาการอย่างเข้มข้น ครอบคลุมทั้งญาณวิทยาและจิตวิทยาเชิงปรัชญา",
        url: "https://plato.stanford.edu",
        tags: ["Encyclopedia", "Epistemology"],
        checkedAt: "2026-07-02",
      },
    ],
  },
  {
    id: "neuroscience",
    thaiLabel: "ประสาทวิทยา",
    enLabel: "Neuroscience",
    icon: "neurology",
    items: [
      {
        title: "Society for Neuroscience (SfN)",
        description:
          "ฐานข้อมูลและสมาคมวิจัยที่มุ่งเน้นการศึกษาโครงสร้างทางชีวภาพของสมองและระบบประสาทที่ส่งผลต่อพฤติกรรมและจิตใจ",
        url: "https://www.sfn.org",
        tags: ["Neuroscience", "Research"],
        checkedAt: "2026-07-02",
      },
    ],
  },
  {
    id: "anthropology",
    thaiLabel: "มานุษยวิทยา",
    enLabel: "Anthropology",
    icon: "public",
    items: [
      {
        title: "AnthroSource , American Anthropological Association",
        description:
          "คลังวารสารและงานวิจัยเชิงมานุษยวิทยา วัฒนธรรม และตำนานวิทยา ซึ่งเป็นประโยชน์อย่างยิ่งในการศึกษา Archetype ร่วมของมนุษยชาติ",
        url: "https://anthrosource.onlinelibrary.wiley.com",
        tags: ["Culture", "Mythology", "Journals"],
        checkedAt: "2026-07-02",
      },
    ],
  },
];
