import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";
import { contentTypeMeta } from "@/lib/content/core/cosmology";

type PageOrderEntry = {
  href: string;
  label: string;
  icon: string | null;
};

const COSMOLOGY_ROUTES: Record<string, string> = {
  "/articles": "article",
  "/concepts": "concept",
  "/thinkers": "person",
  "/reading-sets": "reading-set",
};

function buildPageOrder(): PageOrderEntry[] {
  const raw: { href: string; label: string; icon?: string | null }[] = [
    { href: "/knowledge", label: "คลังความรู้" },
    { href: "/explore", label: "สำรวจ" },
    { href: "/discover", label: "ค้นพบ" },
    { href: "/compare", label: "เปรียบเทียบ" },
    { href: "/timeline", label: "เส้นเวลา" },
    { href: "/concepts", label: "คลังแนวคิด" },
    { href: "/thinkers", label: "นักปราชญ์" },
    { href: "/articles", label: "บทความ" },
    { href: "/reading-sets", label: "ซีรีส์" },
    { href: "/sources", label: "แหล่งอ้างอิง" },
    { href: "/external-links", label: "ลิงก์ภายนอก" },
    { href: "/constellation", label: "แผนที่ความรู้" },
    { href: "/manifesto", label: "ปฏิญญา" },
    { href: "/support", label: "สนับสนุน" },
  ];

  return raw.map((entry) => {
    const ct = COSMOLOGY_ROUTES[entry.href];
    if (ct) {
      const meta = contentTypeMeta(ct);
      return { href: entry.href, label: meta.label, icon: meta.icon };
    }
    return { href: entry.href, label: entry.label, icon: entry.icon ?? null };
  });
}

export const PAGE_ORDER: PageOrderEntry[] = buildPageOrder();

export function PageNav({ current }: { current: string }) {
  const i = PAGE_ORDER.findIndex((p) => p.href === current);
  const prev = i > 0 ? PAGE_ORDER[i - 1] : null;
  const next = i >= 0 && i < PAGE_ORDER.length - 1 ? PAGE_ORDER[i + 1] : null;

  return (
    <nav className="tpl-reference mt-20" aria-label="นำทางระหว่างหน้า">
      <div className="grid grid-cols-1 items-center gap-4 border-t border-text-heading/10 pt-8 text-sm sm:grid-cols-3">
        <div>
          {prev ? (
            <Link href={prev.href} className="inline-flex items-center gap-2 text-text-body transition-colors hover:text-accent">
              <ArrowRightIcon className="h-4 w-4 rotate-180" />
              {prev.label}
            </Link>
          ) : null}
        </div>
        <div className="text-center">
          <Link href="/" className="text-text-secondary transition-colors hover:text-accent">
            กลับหน้าแรก
          </Link>
        </div>
        <div className="flex justify-end">
          {next ? (
            <Link href={next.href} className="inline-flex items-center gap-2 text-text-body transition-colors hover:text-accent">
              {next.label}
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
