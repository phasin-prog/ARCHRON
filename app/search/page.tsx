import type { Metadata } from "next";
import Link from "next/link";
import { getPublicEntries } from "@/lib/content/public-source";
import { buildSearchIndex } from "@/lib/content/search-index";
import { SearchClient } from "@/components/search/search-client";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "ค้นหา — The Soul's Compass",
  description:
    "ค้นหาแนวคิด บทความ ทรัพยากรภายนอก และหน้าต่าง ๆ ในคลังความรู้จิตใจมนุษย์",
};

export default async function SearchPage() {
  const index = buildSearchIndex(await getPublicEntries());

  return (
    <main className="px-6 pb-24 pt-10">
      <div className="mx-auto max-w-3xl">
        <nav aria-label="เส้นทางนำทาง" className="flex flex-wrap items-center gap-1 text-xs text-muted">
          <Link href="/" className="transition-colors hover:text-soft-gold">หน้าแรก</Link>
          <span className="material-symbols-outlined text-[16px] text-subtle">chevron_right</span>
          <span className="text-soft-ivory">ค้นหา</span>
        </nav>

        <header className="mt-6">
          <h1 className="font-serif text-4xl font-bold text-ivory">ค้นหา</h1>
          <p className="mt-3 text-base leading-relaxed text-soft-ivory">
            ค้นทั่วทั้งคลังความรู้ — แนวคิด บทความ ทรัพยากรภายนอก และหน้าต่าง ๆ ในที่เดียว
          </p>
        </header>

        <SearchClient items={index} />
      </div>
    </main>
  );
}
