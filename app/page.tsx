import Link from "next/link";

const PILLARS = [
  {
    icon: "account_tree",
    title: "ศึกษาเป็นระบบ",
    desc: "อ่านแนวคิดสำคัญจากหลายสำนัก โดยไม่ตัดขาดจากบริบทเดิมของมัน เพื่อให้เข้าใจรากฐานที่มาอย่างแท้จริง",
  },
  {
    icon: "history_edu",
    title: "ตรวจสอบแหล่งที่มา",
    desc: "แยกข้อเท็จจริง งานต้นทาง และการตีความออกจากกัน เพื่อให้ความรู้ไม่กลายเป็นคำกล่าวลอย ๆ ที่ไร้น้ำหนัก",
  },
  {
    icon: "all_inclusive",
    title: "เชื่อมโยงข้ามศาสตร์",
    desc: "เห็นความสัมพันธ์ระหว่างจิตวิทยา ปรัชญา ภาษา สัญลักษณ์ และชีวิตภายในของมนุษย์ที่ถักทอเข้าด้วยกัน",
  },
];

const ATLAS = [
  { no: "01", kicker: "แนวคิด", title: "จิตวิทยาเชิงลึก", desc: "สำรวจชั้นที่อยู่ใต้ความรู้สึกตัว แรงขับ และโครงสร้างภายในของจิต", icon: "psychology" },
  { no: "02", kicker: "ทฤษฎี", title: "จิตวิเคราะห์", desc: "อ่านความฝัน ความขัดแย้ง และภาษาของจิตไร้สำนึกตามสายงานต้นทาง", icon: "visibility" },
  { no: "03", kicker: "ปรัชญา", title: "ปรัชญา", desc: "ตั้งคำถามต่อความหมาย เสรีภาพ และการดำรงอยู่ของมนุษย์", icon: "auto_stories" },
  { no: "04", kicker: "วิทยาศาสตร์", title: "ประสาทวิทยาศาสตร์", desc: "เชื่อมประสบการณ์ภายในเข้ากับการทำงานของสมองและระบบประสาท", icon: "neurology" },
  { no: "05", kicker: "สัญลักษณ์", title: "สัญลักษณ์และตำนาน", desc: "ถอดรหัสภาพแทน เรื่องเล่า และแบบแผนร่วมของมนุษยชาติ", icon: "rebase_edit" },
  { no: "06", kicker: "ภาษา", title: "ภาษาและการตีความ", desc: "เข้าใจว่าความหมายถูกสร้าง ส่งผ่าน และตีความอย่างไร", icon: "translate" },
];

const QUICK = [
  { no: "01", kicker: "บทความ", title: "บทความ", desc: "งานอ่านที่อธิบายและตีความแนวคิดสำคัญในบริบทปัจจุบัน", href: "/articles" },
  { no: "02", kicker: "คลังแนวคิด", title: "คลังแนวคิด", desc: "ระบบความรู้แบบเชื่อมโยง (Wiki) ที่รวบรวมพื้นฐานของแต่ละศาสตร์", href: "/concepts" },
  { no: "03", kicker: "ซีรีส์", title: "ซีรีส์", desc: "เส้นทางการอ่านที่เรียงลำดับจากพื้นฐานสู่ความเข้าใจระดับลึก", href: "/reading-sets" },
  { no: "04", kicker: "แหล่งอ้างอิง", title: "แหล่งอ้างอิง", desc: "ฐานข้อมูลเอกสารชั้นต้นและรายชื่อหนังสือสำหรับการศึกษาต่อ", href: "/sources" },
];

export default function HomePage() {
  return (
    <main>
        {/* Hero */}
        <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-6 text-center">
          <div className="hero-gradient ambient-glow pointer-events-none absolute inset-0 z-0" />
          <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-transparent via-transparent to-deep-navy" />
          <div className="relative z-10 mx-auto max-w-5xl py-24">
            <span className="scroll-reveal mb-8 block text-xs font-semibold uppercase tracking-[0.4em] text-burnished-gold/80">
              คลังความรู้เพื่อศึกษาจิตใจมนุษย์อย่างมีบริบท
            </span>
            <h1 className="scroll-reveal stagger-1 mb-10 font-serif text-[36px] font-semibold leading-[1.15] text-on-surface md:text-[64px] md:tracking-[-0.02em]">
              อ่านจิตใจมนุษย์ โดยไม่ลดทอนให้เหลือเพียง{" "}
              <span className="italic text-burnished-gold">ป้ายกำกับ</span>
            </h1>
            <p className="scroll-reveal stagger-2 mx-auto mb-12 max-w-3xl text-lg leading-[1.8] text-on-surface-variant/80">
              The Soul&apos;s Compass คือพื้นที่ศึกษาจิตวิทยา จิตวิเคราะห์ ปรัชญา ประสาทวิทยาศาสตร์
              และทฤษฎีความรู้ โดยแยกแหล่งที่มา ข้อเท็จจริง และการตีความออกจากกัน
            </p>
            <div className="scroll-reveal stagger-3 flex flex-col justify-center gap-6 sm:flex-row">
              <Link
                href="/articles"
                className="group flex items-center justify-center gap-3 bg-burnished-gold px-10 py-5 text-xs font-semibold uppercase tracking-[0.2em] text-deep-navy transition-all duration-500 hover:shadow-[0_0_30px_rgba(212,175,55,0.3)]"
              >
                เริ่มอ่านบทความ
                <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1.5">
                  arrow_forward
                </span>
              </Link>
              <Link
                href="/concepts"
                className="flex items-center justify-center gap-3 border border-burnished-gold/40 px-10 py-5 text-xs font-semibold uppercase tracking-[0.2em] text-burnished-gold transition-all duration-500 hover:bg-burnished-gold/5"
              >
                เปิดแผนที่แนวคิด
                <span className="material-symbols-outlined text-[18px]">map</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Pillars */}
        <section className="mx-auto max-w-[1200px] px-6 py-32 md:py-40">
          <div className="grid grid-cols-1 gap-y-16 md:grid-cols-12 md:gap-x-12">
            {PILLARS.map((p, i) => (
              <div key={p.title} className={`group scroll-reveal stagger-${i + 1} md:col-span-4`}>
                <div className="mb-8 h-px w-12 bg-burnished-gold/30" />
                <div className="flex flex-col gap-6">
                  <span className="material-symbols-outlined text-[40px] text-burnished-gold transition-transform duration-500 group-hover:scale-110">
                    {p.icon}
                  </span>
                  <h3 className="font-serif text-[26px] font-medium text-on-surface">{p.title}</h3>
                  <p className="text-lg leading-relaxed text-on-surface-variant/80">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Knowledge Atlas */}
        <section className="border-y border-slate-boundary/30 bg-surface-container-lowest px-6 py-20">
          <div className="mx-auto max-w-[1200px]">
            <div className="mb-20 grid grid-cols-1 items-end gap-8 md:grid-cols-12">
              <div className="md:col-span-8">
                <span className="mb-4 block text-xs font-semibold uppercase tracking-[0.3em] text-burnished-gold/60">
                  แผนที่ความรู้
                </span>
                <h2 className="mb-6 font-serif text-4xl font-medium text-on-surface">
                  แผนที่ความรู้ของจิตใจมนุษย์
                </h2>
                <p className="max-w-2xl text-lg text-on-surface-variant/70">
                  หกหมวดหลักที่เชื่อมโยงกันเป็นระบบ ดั่งคลังเอกสารและหอดูดาวของชีวิตภายในที่สะท้อนถึงการดำรงอยู่ของเรา
                </p>
              </div>
              <div className="md:col-span-4 md:text-right">
                <Link
                  href="/concepts"
                  className="group inline-flex items-center gap-3 border-b border-burnished-gold/0 pb-2 text-xs font-semibold uppercase tracking-[0.2em] text-burnished-gold transition-all duration-500 hover:border-burnished-gold/40"
                >
                  เปิดคลังแนวคิดทั้งหมด
                  <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1.5">
                    arrow_forward
                  </span>
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {ATLAS.map((c, i) => (
                <Link
                  key={c.no}
                  href="/concepts"
                  className={`concept-card group relative flex min-h-[300px] flex-col justify-between overflow-hidden border border-slate-boundary/40 p-10 scroll-reveal stagger-${i + 1}`}
                >
                  <div className="absolute left-0 top-0 h-0 w-[2px] bg-burnished-gold transition-all duration-700 group-hover:h-full" />
                  <div>
                    <span className="mb-6 block text-[10px] tracking-[0.25em] text-burnished-gold/40">
                      {c.no} / {c.kicker}
                    </span>
                    <h4 className="mb-4 font-serif text-[24px] text-on-surface">{c.title}</h4>
                    <p className="text-base leading-relaxed text-on-surface-variant/70">{c.desc}</p>
                  </div>
                  <div className="mt-8 flex items-center justify-between">
                    <span className="material-symbols-outlined text-3xl text-on-surface-variant/20">
                      {c.icon}
                    </span>
                    <span className="material-symbols-outlined -translate-x-4 text-burnished-gold opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100">
                      arrow_right_alt
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Manifesto quote */}
        <section className="scroll-reveal mx-auto max-w-5xl px-6 py-32 text-center md:py-40">
          <div className="mb-12">
            <span className="material-symbols-outlined text-[64px] text-burnished-gold/30">
              format_quote
            </span>
          </div>
          <h2 className="mb-12 font-serif text-[32px] italic leading-[1.6] text-on-surface">
            “เราไม่รีบทำให้ความซับซ้อนกลายเป็นคำตอบง่าย ๆ”
          </h2>
          <div className="mx-auto mb-12 h-px w-16 bg-burnished-gold/20" />
          <p className="mx-auto mb-16 max-w-3xl text-lg leading-[1.9] text-on-surface-variant/80">
            ความรู้เกี่ยวกับจิตใจมนุษย์ไม่ควรถูกลดทอนเหลือเพียงป้ายกำกับ ประเภทบุคลิกภาพ
            หรือสูตรสำเร็จในการใช้ชีวิต The Soul&apos;s Compass จึงพยายามวางแนวคิดไว้ในบริบทเดิมของมัน
            พร้อมเปิดพื้นที่ให้การตีความ การเปรียบเทียบ และการตั้งคำถามเกิดขึ้นอย่างรับผิดชอบ
          </p>
          <Link
            href="/manifesto"
            className="group inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-burnished-gold transition-all hover:text-primary"
          >
            อ่าน Manifesto ฉบับเต็ม
            <span className="material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-2">
              arrow_right_alt
            </span>
          </Link>
        </section>

        {/* Quick links */}
        <section className="scroll-reveal border-t border-slate-boundary/30 bg-surface-container-low py-24">
          <div className="mx-auto max-w-[1200px] px-6">
            <div className="grid grid-cols-1 gap-px overflow-hidden border border-slate-boundary/20 bg-slate-boundary/20 sm:grid-cols-2 lg:grid-cols-4">
              {QUICK.map((q) => (
                <Link
                  key={q.no}
                  href={q.href}
                  className="group bg-surface-container-low p-10 transition-all duration-500 hover:bg-surface-container"
                >
                  <span className="mb-4 block text-xs font-semibold uppercase tracking-[0.2em] text-burnished-gold/60">
                    {q.no} / {q.kicker}
                  </span>
                  <h5 className="mb-3 font-serif text-[20px] text-on-surface">{q.title}</h5>
                  <p className="mb-6 text-sm leading-relaxed text-on-surface-variant/60">{q.desc}</p>
                  <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-burnished-gold transition-all group-hover:gap-4">
                    เข้าชม <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
    </main>
  );
}
