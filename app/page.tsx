import Link from "next/link";

const ENTRY = [
  { label: "บทความ", href: "/articles", desc: "งานอ่านที่อธิบายและตีความแนวคิด" },
  { label: "คลังแนวคิด", href: "/concepts", desc: "ระบบความรู้แบบเชื่อมโยง (Wiki)" },
  { label: "ซีรีส์", href: "/reading-sets", desc: "เส้นทางการอ่านจากพื้นฐานสู่ลึก" },
  { label: "แหล่งอ้างอิง", href: "/sources", desc: "ฐานความรู้และการอ้างอิง" },
];

const KNOWLEDGE = [
  {
    no: "01",
    title: "ศึกษาเป็นระบบ",
    desc: "อ่านแนวคิดสำคัญจากหลายสำนัก โดยไม่ตัดขาดจากบริบทเดิมของมัน",
  },
  {
    no: "02",
    title: "ตรวจสอบแหล่งที่มา",
    desc: "แยกข้อเท็จจริง งานต้นทาง และการตีความออกจากกัน เพื่อให้ความรู้ไม่กลายเป็นคำกล่าวลอย ๆ",
  },
  {
    no: "03",
    title: "เชื่อมโยงข้ามศาสตร์",
    desc: "เห็นความสัมพันธ์ระหว่างจิตวิทยา ปรัชญา ภาษา สัญลักษณ์ และชีวิตภายในของมนุษย์",
  },
];

const CONCEPTS = [
  { no: "01", title: "จิตวิทยาเชิงลึก", desc: "สำรวจชั้นที่อยู่ใต้ความรู้สึกตัว แรงขับ และโครงสร้างภายในของจิต" },
  { no: "02", title: "จิตวิเคราะห์", desc: "อ่านความฝัน ความขัดแย้ง และภาษาของจิตไร้สำนึกตามสายงานต้นทาง" },
  { no: "03", title: "ปรัชญา", desc: "ตั้งคำถามต่อความหมาย เสรีภาพ และการดำรงอยู่ของมนุษย์" },
  { no: "04", title: "ประสาทวิทยาศาสตร์", desc: "เชื่อมประสบการณ์ภายในเข้ากับการทำงานของสมองและระบบประสาท" },
  { no: "05", title: "สัญลักษณ์และตำนาน", desc: "ถอดรหัสภาพแทน เรื่องเล่า และแบบแผนร่วมของมนุษยชาติ" },
  { no: "06", title: "ภาษาและการตีความ", desc: "เข้าใจว่าความหมายถูกสร้าง ส่งผ่าน และตีความอย่างไร" },
];

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_500px_at_70%_-10%,rgba(200,168,90,0.10),transparent_60%)]" />
        <div className="relative mx-auto max-w-6xl px-6 py-24 md:py-32">
          <p className="text-sm tracking-widest text-antique-gold">
            คลังความรู้เพื่อศึกษาจิตใจมนุษย์อย่างมีบริบท
          </p>
          <h1 className="mt-6 max-w-3xl font-serif text-4xl font-semibold leading-snug text-ivory md:text-5xl">
            อ่านจิตใจมนุษย์ โดยไม่ลดทอนให้เหลือเพียง
            <span className="text-soft-gold"> ป้ายกำกับ</span>
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-soft-ivory">
            The Soul&apos;s Compass คือพื้นที่ศึกษาจิตวิทยา จิตวิเคราะห์ ปรัชญา ประสาทวิทยาศาสตร์
            และทฤษฎีความรู้ โดยแยกแหล่งที่มา ข้อเท็จจริง และการตีความออกจากกัน
          </p>
          <p className="mt-5 max-w-2xl border-l-2 border-antique-gold/30 pl-5 text-base italic leading-relaxed text-muted">
            เราไม่ได้ทำให้ความคิดซับซ้อนกลายเป็นคำตอบง่าย ๆ แต่ทำให้ความซับซ้อนนั้นอ่านได้
            ตรวจสอบได้ และเชื่อมโยงกันได้มากขึ้น
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/articles"
              className="rounded-sm bg-gradient-to-br from-antique-gold to-soft-gold px-7 py-3.5 text-base font-semibold text-[#1a1306] transition-transform hover:-translate-y-0.5"
            >
              เริ่มอ่านบทความ
            </Link>
            <Link
              href="/concepts"
              className="rounded-sm border border-white/25 px-7 py-3.5 text-base text-ivory transition-colors hover:border-antique-gold hover:text-soft-gold"
            >
              เปิดแผนที่แนวคิด
            </Link>
          </div>
        </div>
      </section>

      {/* Entry Points */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ENTRY.map((e) => (
            <Link
              key={e.href}
              href={e.href}
              className="group rounded-md border border-white/10 bg-surface-1/50 p-6 transition-colors hover:border-antique-gold/40"
            >
              <span className="font-serif text-lg text-ivory group-hover:text-soft-gold">{e.label}</span>
              <p className="mt-2 text-sm leading-relaxed text-muted">{e.desc}</p>
              <span className="mt-3 inline-block text-sm text-antique-gold">เข้าชม →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Knowledge cards */}
      <section id="knowledge" className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-5 md:grid-cols-3">
          {KNOWLEDGE.map((c) => (
            <article
              key={c.no}
              className="rounded-md border border-white/10 bg-surface-1/60 p-8 transition-colors hover:border-antique-gold/30"
            >
              <span className="font-serif text-2xl text-antique-gold">{c.no}</span>
              <h3 className="mt-4 font-serif text-xl text-ivory">{c.title}</h3>
              <p className="mt-3 text-base leading-relaxed text-soft-ivory">{c.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Concept map */}
      <section id="concept" className="mx-auto max-w-6xl px-6 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs tracking-widest text-antique-gold">แผนที่ความรู้</span>
          <h2 className="mt-4 font-serif text-3xl text-ivory">แผนที่ความรู้ของจิตใจมนุษย์</h2>
          <p className="mt-4 text-base text-muted">
            หกหมวดหลักที่เชื่อมโยงกันเป็นระบบ ดั่งคลังเอกสารและหอดูดาวของชีวิตภายใน
          </p>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {CONCEPTS.map((c) => (
            <Link
              key={c.no}
              href="/concepts"
              className="group flex min-h-[170px] flex-col rounded-md border border-white/10 bg-charcoal/40 p-7 transition-colors hover:border-antique-gold/30 hover:bg-surface-2/40"
            >
              <div className="flex items-center justify-between">
                <span className="font-serif text-lg text-antique-gold">{c.no}</span>
                <span className="h-2.5 w-2.5 rounded-full border border-antique-gold" aria-hidden="true" />
              </div>
              <h3 className="mt-4 font-serif text-xl text-ivory group-hover:text-soft-gold">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-soft-ivory">{c.desc}</p>
            </Link>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/concepts" className="text-sm text-soft-gold hover:underline">
            เปิดคลังแนวคิดทั้งหมด →
          </Link>
        </div>
      </section>

      {/* Manifesto */}
      <section id="manifesto" className="relative py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(700px_400px_at_50%_50%,rgba(200,168,90,0.08),transparent_64%)]" />
        <div className="relative mx-auto max-w-2xl px-6 text-center">
          <h2 className="font-serif text-2xl leading-relaxed text-ivory md:text-3xl">
            เราไม่รีบทำให้ความซับซ้อนกลายเป็นคำตอบง่าย ๆ
          </h2>
          <p className="mt-7 text-lg leading-loose text-soft-ivory">
            ความรู้เกี่ยวกับจิตใจมนุษย์ไม่ควรถูกลดทอนเหลือเพียงป้ายกำกับ ประเภทบุคลิกภาพ
            หรือสูตรสำเร็จในการใช้ชีวิต The Soul&apos;s Compass จึงพยายามวางแนวคิดไว้ในบริบทเดิมของมัน
            พร้อมเปิดพื้นที่ให้การตีความ การเปรียบเทียบ และการตั้งคำถามเกิดขึ้นอย่างรับผิดชอบ
          </p>
          <div className="mt-8">
            <Link href="/manifesto" className="text-sm text-soft-gold hover:underline">
              อ่าน Manifesto ฉบับเต็ม →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
