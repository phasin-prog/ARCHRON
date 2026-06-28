import Link from "next/link";

type KnowledgeCard = {
  title: string;
  engTitle: string;
  description: string;
  href: string;
  icon: string;
  colorClass: string;
};

const KNOWLEDGE_SECTIONS: KnowledgeCard[] = [
  {
    title: "บทความวิชาการ",
    engTitle: "Articles",
    description: "บทความถอดบทเรียน เจาะลึกโครงสร้างจิตใจ และการประยุกต์ทฤษฎีจิตวิเคราะห์ในชีวิตจริง",
    href: "/articles",
    icon: "newspaper",
    colorClass: "from-amber-500/10 to-antique-gold/20 hover:border-antique-gold/40",
  },
  {
    title: "คลังแนวคิดเชิงลึก",
    engTitle: "Concepts",
    description: "สารานุกรมคำนิยามของกลไกทางจิตและการตีความเชิงลึกของสำนักคิดหลัก",
    href: "/concepts",
    icon: "psychology",
    colorClass: "from-blue-500/10 to-indigo-500/20 hover:border-indigo-400/40",
  },
  {
    title: "สำนักคิดและนักปราชญ์",
    engTitle: "Schools & Thinkers",
    description: "ประวัติ แนวคิดสำคัญ และคุณประโยชน์ต่อทฤษฎีจิตวิทยาของเหล่านักคิดผู้บุกเบิก",
    href: "/schools",
    icon: "groups_2",
    colorClass: "from-emerald-500/10 to-teal-500/20 hover:border-teal-400/40",
  },
  {
    title: "แผนที่ความสัมพันธ์",
    engTitle: "Constellation Map",
    description: "สำรวจปฏิสัมพันธ์ระหว่างแนวคิดต่างๆ ในรูปแบบของโครงข่ายดาราจักรทางจิตวิทยา",
    href: "/constellation",
    icon: "hub",
    colorClass: "from-violet-500/10 to-purple-500/20 hover:border-purple-400/40",
  },
  {
    title: "เส้นทางการอ่าน",
    engTitle: "Reading Paths",
    description: "ลำดับการอ่านแนวคิดและบทความที่มีความเกี่ยวโยงกันเพื่อช่วยให้ศึกษาอย่างเป็นขั้นเป็นตอน",
    href: "/reading-sets",
    icon: "layers",
    colorClass: "from-rose-500/10 to-pink-500/20 hover:border-rose-400/40",
  },
];

export default function KnowledgeHubPage() {
  return (
    <main className="min-h-screen bg-deep-navy py-20 px-6 relative overflow-hidden">
      {/* วงแสงเรืองรองสะท้อนมิติเบื้องหลัง */}
      <div className="absolute top-[-10%] left-[-10%] -z-10 h-[50vw] w-[50vw] rounded-full bg-antique-gold/3 blur-[140px]" />
      <div className="absolute bottom-[-10%] right-[-10%] -z-10 h-[50vw] w-[50vw] rounded-full bg-indigo-500/3 blur-[140px]" />

      <div className="mx-auto max-w-5xl">
        {/* หัวข้อหน้าและบทนำ */}
        <header className="mb-16 text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-antique-gold/30 bg-antique-gold/5 px-4 py-1.5 text-[11px] tracking-[0.2em] text-burnished-gold uppercase">
            <span className="material-symbols-outlined text-[14px]">explore</span>
            Knowledge Atlas
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl tracking-tight text-ivory">
            เข้าสู่คลังความรู้แห่งจิตใจ
          </h1>
          <p className="mx-auto max-w-xl text-sm sm:text-base leading-relaxed text-on-surface-variant/80">
            ขอต้อนรับผู้แสวงหา สู่สารบัญแผนที่นำทางแห่งการทำความเข้าใจโลกภายในของมนุษย์
            ผ่านทฤษฎีจิตวิเคราะห์ ปรัชญา และจิตวิทยาเชิงลึก
          </p>
        </header>

        {/* ตารางแสดงกลุ่มคลังความรู้ */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {KNOWLEDGE_SECTIONS.map((section, idx) => (
            <Link
              key={section.href}
              href={section.href}
              className={`group relative flex flex-col justify-between rounded-lg border border-slate-boundary/40 bg-midnight/55 p-6 backdrop-blur-md shadow-lg transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl bg-gradient-to-br ${section.colorClass} ${
                idx === 3 || idx === 4 ? "lg:col-span-1.5" : ""
              }`}
            >
              {/* Glow เอฟเฟกต์เฉพาะจุดที่หัวใจของการ์ดเมื่อ Hover */}
              <div className="absolute inset-0 -z-10 rounded-lg bg-gradient-to-br from-white/0 to-white/[0.02] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded bg-deep-navy border border-ink/5 text-burnished-gold transition-colors duration-500 group-hover:border-antique-gold/20 group-hover:bg-midnight group-hover:text-antique-gold">
                    <span className="material-symbols-outlined text-[24px]">
                      {section.icon}
                    </span>
                  </div>
                  <span className="text-[10px] tracking-widest text-on-surface-variant/40 uppercase font-semibold">
                    {section.engTitle}
                  </span>
                </div>

                <div className="space-y-2">
                  <h2 className="font-serif text-xl text-ivory group-hover:text-burnished-gold transition-colors duration-300">
                    {section.title}
                  </h2>
                  <p className="text-xs leading-relaxed text-on-surface-variant/70">
                    {section.description}
                  </p>
                </div>
              </div>

              <div className="mt-8 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-burnished-gold opacity-80 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                เข้าสู่ส่วนนี้ 
                <span className="material-symbols-outlined text-[14px]">arrow_right_alt</span>
              </div>
            </Link>
          ))}
        </div>

        {/* จุดยืนโครงการ / ท้ายหน้า */}
        <footer className="mt-20 border-t border-slate-boundary/30 pt-10 text-center">
          <Link
            href="/manifesto"
            className="inline-flex items-center gap-2 text-xs text-on-surface-variant/60 hover:text-burnished-gold transition-colors duration-300"
          >
            อ่าน Manifesto จุดมุ่งหมายของโครงการ 
            <span className="material-symbols-outlined text-[16px]">arrow_outward</span>
          </Link>
        </footer>
      </div>
    </main>
  );
}
