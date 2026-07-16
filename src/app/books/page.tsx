import type { Metadata } from "next";
import Link from "next/link";
import { PageScaffold } from "@/components/page-scaffold";
import { EmptyState } from "@/components/empty-state";
import { getPublicEntries } from "@/lib/content/publishing/public-source";
import { BookCard } from "@/components/books/book-card";
import { ArrowRightIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "หนังสือ — ARCHRON",
  description:
    "รายชื่อหนังสือและตำราที่เกี่ยวข้องกับแนวคิดใน ARCHRON พร้อมคำอธิบายโดยย่อและประเด็นสำคัญ",
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
      kicker="คลังหนังสือ"
      title="หนังสือและตำรา"
      lead="หนังสือและตำราที่เกี่ยวข้องกับจิตวิทยา ปรัชญา และมนุษยศาสตร์"
      ambient
      navCurrent="/books"
    >
      <section className="tpl-reference">
        {books.length === 0 ? (
          <EmptyState
            icon="book"
            title="ยังไม่มีหนังสือในคลัง"
            description="ขณะนี้ยังไม่มีหนังสือในคลัง ลองเริ่มจากคลังแนวคิดหรือนักปราชญ์"
          >
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/concepts"
                className="inline-flex items-center gap-1.5 rounded-lg border border-accent/40 bg-accent/10 px-4 py-2 text-sm font-semibold text-accent transition-colors hover:bg-accent/20"
              >
                สำรวจคลังแนวคิด
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <Link
                href="/thinkers"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border/40 px-4 py-2 text-sm text-text-secondary transition-colors hover:bg-bg-card/50"
              >
                นักปราชญ์
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
