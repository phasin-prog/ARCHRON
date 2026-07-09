type CardPreview = {
  id: string;
  label: string;
  accentLabel: string;
  accentVar: string;
  description: string;
  title: string;
  body: string;
};

const CARDS: CardPreview[] = [
  {
    id: "article",
    label: "บทความ (Article)",
    accentLabel: "Burnished Gold",
    accentVar: "var(--color-accent)",
    description: "สมมาตร · แถบไล่สีขอบบน · ทอง",
    title: "ถอดรหัสแบบฉบับดั้งเดิม: วิธีที่ตำนานจัดรูปประสบการณ์ของเรา",
    body: "ทำความเข้าใจแนวคิด Archetype และโครงสร้างร่วมทางจิตที่คอยกำหนดพฤติกรรมและการรับรู้ของเรา",
  },
  {
    id: "concept",
    label: "แนวคิด (Concept)",
    accentLabel: "Psyche",
    accentVar: "var(--color-concept)",
    description: "มุมอสมมาตร · จุดกลมซ้าย · ฟ้า",
    title: "เงา (Shadow)",
    body: "ส่วนที่เราไม่อยากเห็นในตัวเอง มักปรากฏผ่านการตัดสินผู้อื่นอย่างรุนแรงโดยไม่รู้ตัว",
  },
  {
    id: "person",
    label: "นักคิด (Person)",
    accentLabel: "Mercurius",
    accentVar: "var(--color-thinker)",
    description: "กระทัดรัด · กรอบสี่เหลี่ยมมุมซ้ายบน · เขียว",
    title: "คาร์ล ยุง (Carl Jung)",
    body: "นักจิตวิทยาชาวสวิสผู้พัฒนาแนวคิด Shadow, Archetype, Individuation และจิตวิทยาวิเคราะห์",
  },
  {
    id: "book",
    label: "หนังสือ (Book)",
    accentLabel: "Sapientia",
    accentVar: "var(--color-accent)",
    description: "สันซ้าย 6px · มุมหนังสือ · ทอง",
    title: "Man and His Symbols",
    body: "งานรวมบทความของยุงและคณะที่อธิบายจิตวิทยาเชิงลึกในภาษาที่ทุกคนเข้าใจได้",
  },
  {
    id: "school",
    label: "สำนักคิด (School)",
    accentLabel: "Lumen",
    accentVar: "var(--color-accent)",
    description: "เหลี่ยม · แถบสันบนตรงกลาง · เหลืองนวล",
    title: "Analytical Psychology (จิตวิทยาเชิงลึกแนวคาร์ล ยุง)",
    body: "สำนักที่ศึกษาจิตไร้สำนึกผ่านสัญลักษณ์ ตำนาน และ archetype เน้นกระบวนการปัจเจกภาพ",
  },
  {
    id: "symbol",
    label: "สัญลักษณ์ (Symbol)",
    accentLabel: "Ash",
    accentVar: "var(--color-text-secondary)",
    description: "เรขาคณิต · มุม ◇ ด้านบน-ล่าง · เทา",
    title: "มัณฑละ (Mandala)",
    body: "รูปเรขาคณิตศักดิ์สิทธิ์แทนความสมบูรณ์ของตัวตน ปรากฏในพิธีกรรมและความฝันทั่วโลก",
  },
  {
    id: "term",
    label: "คำศัพท์ (Term)",
    accentLabel: "Soft Ivory",
    accentVar: "var(--color-text-body)",
    description: "เรียบน้อยที่สุด · ไม่มี pseudo-element · งาช้าง",
    title: "Individuation (กระบวนการปัจเจกภาพ)",
    body: "การบูรณาการส่วนต่าง ๆ ของจิตให้เป็นตัวตนที่สมบูรณ์ เป้าหมายสูงสุดของจิตวิทยาเชิงลึก",
  },
];

function VariantCard({ card }: { card: CardPreview }) {
  return (
    <div className="flex flex-col gap-3">
      <a
        href="#"
        className={`archron-card archron-card--${card.id} group p-5`}
        style={{ "--card-accent": card.accentVar } as React.CSSProperties}
      >
        <span
          className="mb-2 flex items-center gap-1.5 text-[11px] font-medium opacity-70"
          style={{ color: card.accentVar } as React.CSSProperties}
        >
          {card.label}
        </span>
        <span className="font-serif text-lg leading-snug text-text-heading break-words transition-colors group-hover:text-accent">
          {card.title}
        </span>
        <p className="mt-3 text-sm leading-relaxed text-text-secondary line-clamp-2">
          {card.body}
        </p>
      </a>
      <div className="text-xs text-text-secondary space-y-0.5 px-1">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: card.accentVar }} />
          <span className="text-sm font-medium text-text-secondary/80">{card.accentLabel}</span>
        </div>
        <p className="text-[10px] opacity-60">{card.description}</p>
      </div>
    </div>
  );
}

export default function PreviewCardsPage() {
  return (
    <div className="tpl-content py-24">
      <div className="mb-16 text-center">
        <h1 className="font-serif text-fluid-h1 text-text-heading">ระบบการ์ด 7 รูปแบบ</h1>
        <p className="mt-4 text-text-secondary max-w-2xl mx-auto">
          แต่ละ Card variant มีโครงสร้างเฉพาะ — เปลี่ยนจาก side-stripe (ถูกแบน) เป็นรูปแบบเฉพาะตัว
          ที่สะท้อนประเภทเนื้อหา แก้ปัญหา identical card grids และ AI slop tells
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {CARDS.map((card) => (
          <VariantCard key={card.id} card={card} />
        ))}
      </div>

      <section className="mt-20 border-t border-border/30 pt-10">
        <h2 className="font-serif text-xl text-text-heading mb-6">สารบัญรูปแบบ</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CARDS.map((c) => (
            <div key={c.id} className="archron-panel p-4 text-xs space-y-1">
              <div className="flex items-center gap-2">
                <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: c.accentVar }} />
                <span className="font-medium text-text-heading">{c.id}</span>
              </div>
              <p className="text-text-secondary">{c.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
