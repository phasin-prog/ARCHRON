import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";

export type BreadcrumbItem = {
  label: string;
  href?: string; // ถ้าไม่มี = หน้าปัจจุบัน (ไม่เป็นลิงก์)
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
  className?: string;
};

// Unified Breadcrumb — ใช้กับทุกหน้า รองรับ schema.org BreadcrumbList (JSON-LD)
export function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  if (items.length === 0) return null;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://archron.vercel.app";

  // สร้าง JSON-LD สำหรับ SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.href
        ? { item: `${siteUrl}${item.href}` }
        : {}),
    })),
  };

  return (
    <>
      {/* Schema.org BreadcrumbList (invisible JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Visual breadcrumb */}
      <nav
        aria-label="เส้นทางนำทาง"
        className={`flex flex-wrap items-center gap-x-1 gap-y-0.5 text-xs text-text-secondary ${className}`}
      >
        {items.map((item, i) => (
          <span key={i} className="flex min-w-0 items-center gap-1">
            {i > 0 ? (
              <ArrowRightIcon className="h-3.5 w-3.5 shrink-0 text-text-secondary/50" />
            ) : null}
            {item.href ? (
              <Link
                href={item.href}
                className="rounded px-1.5 py-1 transition-colors hover:text-accent focus-visible:ring-1 focus-visible:ring-accent/60 focus-visible:text-accent focus-visible:outline-none"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={`rounded px-1.5 py-1 text-text-body ${i === items.length - 1 ? "max-w-[14rem] truncate sm:max-w-[24rem]" : ""}`}
              >
                {item.label}
              </span>
            )}
          </span>
        ))}
      </nav>
    </>
  );
}
