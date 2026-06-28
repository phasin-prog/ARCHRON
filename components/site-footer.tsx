import Link from "next/link";

const EXPLORE = [
  { label: "บทความ", href: "/articles" },
  { label: "คลังแนวคิด", href: "/concepts" },
  { label: "แผนที่ความสัมพันธ์", href: "/constellation" },
  { label: "ซีรีส์การอ่าน", href: "/reading-sets" },
];

const INSTITUTIONAL = [
  { label: "Manifesto", href: "/manifesto" },
  { label: "แหล่งอ้างอิง", href: "/sources" },
  { label: "ทรัพยากรภายนอก", href: "/external-links" },
  { label: "คำถามที่พบบ่อย", href: "/faq" },
  { label: "สนับสนุนโครงการ", href: "/support" },
];

export function SiteFooter() {
  return (
    <footer id="footer" className="w-full border-t border-slate-boundary bg-deep-navy py-24">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-16 px-6 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="mb-8 font-serif text-[24px] tracking-tight text-burnished-gold">
            The Soul&apos;s Compass
          </div>
          <p className="mb-10 max-w-md leading-relaxed text-on-surface-variant/70">
            คลังความรู้จิตวิทยา ปรัชญา และจิตใจมนุษย์ สร้างขึ้นเพื่อการศึกษา การอ่าน
            และการตีความอย่างมีบริบท ไม่ใช่เพื่อการลดทอนความหมายของมนุษย์
          </p>
          <div className="flex gap-6">
            <Link
              href="/support"
              aria-label="สนับสนุนโครงการ"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-boundary text-on-surface-variant transition-all hover:border-burnished-gold hover:text-burnished-gold"
            >
              <span className="material-symbols-outlined text-sm">favorite</span>
            </Link>
            <Link
              href="/manifesto"
              aria-label="อ่าน Manifesto"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-boundary text-on-surface-variant transition-all hover:border-burnished-gold hover:text-burnished-gold"
            >
              <span className="material-symbols-outlined text-sm">description</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-12 sm:grid-cols-3 md:col-span-7">
          <div>
            <h6 className="mb-8 text-xs font-semibold tracking-[0.05em] text-burnished-gold">
              สำรวจ
            </h6>
            <ul className="flex flex-col gap-4">
              {EXPLORE.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-on-surface-variant transition-colors hover:text-burnished-gold"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h6 className="mb-8 text-xs font-semibold tracking-[0.05em] text-burnished-gold">
              เกี่ยวกับโครงการ
            </h6>
            <ul className="flex flex-col gap-4">
              {INSTITUTIONAL.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-on-surface-variant transition-colors hover:text-burnished-gold"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <h6 className="mb-8 text-xs font-semibold tracking-[0.05em] text-burnished-gold">
              จดหมายข่าว
            </h6>
            <p className="mb-6 text-xs text-on-surface-variant/60">
              รับการอัปเดตบทความใหม่และการสำรวจรายสัปดาห์
            </p>
            <form className="flex border-b border-slate-boundary/60 pb-2">
              <input
                className="w-full border-none bg-transparent p-0 text-sm placeholder:text-on-surface-variant/30 focus:outline-none focus:ring-0"
                placeholder="อีเมลของคุณ"
                type="email"
                aria-label="อีเมลสำหรับรับจดหมายข่าว"
              />
              <button
                type="submit"
                aria-label="สมัครรับจดหมายข่าว"
                className="material-symbols-outlined text-burnished-gold/60 transition-colors hover:text-burnished-gold"
              >
                arrow_right_alt
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-24 flex max-w-[1200px] flex-col items-center justify-between gap-4 border-t border-slate-boundary/30 px-6 pt-10 sm:flex-row">
        <p className="text-center text-xs leading-relaxed tracking-wide text-on-surface-variant/55 sm:text-left">
          © 2026 <span className="text-on-surface-variant/85">The Soul&apos;s Compass</span>
          <span className="px-1.5 text-on-surface-variant/30">·</span>
          คลังความรู้เพื่อการศึกษาจิตใจมนุษย์
        </p>
        <p className="text-center font-serif text-sm italic leading-relaxed text-on-surface-variant/70 sm:text-right">
          สร้างขึ้นเพื่อการศึกษา การอ่าน และการตีความอย่างมีบริบท
        </p>
      </div>
    </footer>
  );
}
