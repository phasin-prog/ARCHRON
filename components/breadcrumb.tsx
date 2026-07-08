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

  // สร้าง JSON-LD สำหรับ SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.href
        ? { item: `https://example.com${item.href}` }
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
        className={`flex flex-wrap items-center gap-1 text-xs text-text-secondary ${className}`}
      >
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-1">
            {i > 0 ? (
              <ArrowRightIcon className="h-4 w-4 text-text-secondary" />
            ) : null}
            {item.href ? (
              <Link
                href={item.href}
                className="transition-colors hover:text-accent"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-text-body">{item.label}</span>
            )}
          </span>
        ))}
      </nav>
    </>
  );
}
