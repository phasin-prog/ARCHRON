import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";

export const PAGE_ORDER = [
  { href: "/knowledge", label: "คลังความรู้" },
  { href: "/explore", label: "สำรวจ" },
  { href: "/compare", label: "เปรียบเทียบ" },
  { href: "/concepts", label: "คลังแนวคิด" },
  { href: "/schools", label: "สำนักคิด" },
  { href: "/articles", label: "บทความ" },
  { href: "/reading-sets", label: "ซีรีส์" },
  { href: "/sources", label: "แหล่งอ้างอิง" },
  { href: "/external-links", label: "ลิงก์ภายนอก" },
  { href: "/constellation", label: "แผนที่ความรู้" },
  { href: "/manifesto", label: "ปฏิญญา" },
  { href: "/support", label: "สนับสนุน" },
];

export function PageNav({ current }: { current: string }) {
  const i = PAGE_ORDER.findIndex((p) => p.href === current);
  const prev = i > 0 ? PAGE_ORDER[i - 1] : null;
  const next = i >= 0 && i < PAGE_ORDER.length - 1 ? PAGE_ORDER[i + 1] : null;

  return (
    <nav className="mx-auto mt-20 max-w-6xl px-6" aria-label="นำทางระหว่างหน้า">
      <div className="grid grid-cols-1 items-center gap-4 border-t border-ink/10 pt-8 text-sm sm:grid-cols-3">
        <div>
          {prev ? (
            <Link href={prev.href} className="inline-flex items-center gap-2 text-soft-ivory transition-colors hover:text-soft-gold">
              <ArrowRightIcon className="h-4 w-4 rotate-180" />
              {prev.label}
            </Link>
          ) : null}
        </div>
        <div className="text-center">
          <Link href="/" className="text-muted transition-colors hover:text-soft-gold">
            กลับหน้าแรก
          </Link>
        </div>
        <div className="flex justify-end">
          {next ? (
            <Link href={next.href} className="inline-flex items-center gap-2 text-soft-ivory transition-colors hover:text-soft-gold">
              {next.label}
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
