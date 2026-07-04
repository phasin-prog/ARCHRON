import type { Metadata } from "next";
import Link from "next/link";
import { PageScaffold } from "@/components/page-scaffold";
import { EmptyState } from "@/components/empty-state";
import { getPublicEntries } from "@/lib/content/public-source";
import { BookCard } from "@/components/books/book-card";

export const metadata: Metadata = {
  title: "หนังสือ — ARCHRON",
  description:
    "รายการหนังสือและตำราที่เป็นรากฐานของแนวคิดใน ARCHRON พร้อมบทสรุปและแนวคิดสำคัญ",
};

export const revalidate = 300;

export default async function BooksPage() {
  const published = await getPublicEntries();
  const books = published.filter((e) => e.contentType === "book");

  return (
    <PageScaffold
      breadcrumb={[
        { label: "หน้าแรก", href: "/" },
        { label: "คลังความรู้", href: "/knowledge" },
        { label: "หนังสือ" },
      ]}
      kicker="LIBRARY"
      title="หนังสือและตำรา"
      lead="รากฐานของแนวคิดสำคัญที่หล่อหลอมจิตวิทยา ปรัชญา และมนุษยศาสตร์ ตั้งแต่ยุคโบราณจนถึงปัจจุบัน"
      ambient
      navCurrent="/books"
    >
      <section className="mx-auto max-w-6xl px-6">
        {books.length === 0 ? (
          <EmptyState
            icon="book"
            title="ยังไม่มีหนังสือในคลัง"
            description="เรากำลังรวบรวมหนังสือและตำราสำคัญที่เป็นรากฐานของแนวคิดใน ARCHRON"
          >
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/concepts"
                className="inline-flex items-center gap-1.5 rounded-lg border border-burnished-gold/40 bg-burnished-gold/10 px-4 py-2 text-sm font-semibold text-burnished-gold transition-colors hover:bg-burnished-gold/20"
              >
                สำรวจคลังแนวคิด
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
              <Link
                href="/schools"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-boundary/40 px-4 py-2 text-sm text-on-surface-variant transition-colors hover:bg-surface-container/50"
              >
                สำนักคิดและนักปราชญ์
              </Link>
            </div>
          </EmptyState>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((book) => (
              <BookCard key={book.slug} entry={book} />
            ))}
          </div>
        )}
      </section>
    </PageScaffold>
  );
}
