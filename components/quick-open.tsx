"use client";

import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";

type Item = {
  id: string;
  title: string;
  thaiTitle?: string;
  description?: string;
  href: string;
  external?: boolean;
  badge?: string;
  keywords: string;
};

const lc = (parts: (string | undefined | null)[]) =>
  parts.filter(Boolean).join(" ").toLowerCase();

// Performance: concept registry + ลิงก์ภายนอก + label กราฟ โหลดแบบ dynamic import
// ตอนเปิด palette ครั้งแรกเท่านั้น → data ก้อนนี้หลุดออกจาก First Load JS ของทุกหน้า
// (cache ไว้ที่ module scope — เปิดครั้งถัดไปไม่ต้อง import ซ้ำ)
let indexPromise: Promise<Item[]> | null = null;

function loadIndex(): Promise<Item[]> {
  if (indexPromise) return indexPromise;
  indexPromise = Promise.all([
    import("@/lib/content/concept-registry"),
    import("@/lib/content/graph"),
    import("@/lib/content/external-links"),
  ]).then(([{ conceptRegistry }, { NODE_TYPE_LABEL }, { EXTERNAL_CATEGORIES }]) =>
    buildIndex(conceptRegistry, NODE_TYPE_LABEL, EXTERNAL_CATEGORIES),
  );
  return indexPromise;
}

function buildIndex(
  conceptRegistry: (typeof import("@/lib/content/concept-registry"))["conceptRegistry"],
  NODE_TYPE_LABEL: (typeof import("@/lib/content/graph"))["NODE_TYPE_LABEL"],
  EXTERNAL_CATEGORIES: (typeof import("@/lib/content/external-links"))["EXTERNAL_CATEGORIES"],
): Item[] {
  const items: Item[] = [];

  for (const c of conceptRegistry) {
    items.push({
      id: `concept:${c.slug}`,
      title: c.title,
      thaiTitle: c.thaiTitle,
      description: c.description,
      href: `/concepts/${c.slug}`,
      badge: NODE_TYPE_LABEL[c.nodeType],
      keywords: lc([c.title, c.thaiTitle, ...c.aliases, c.description, c.framework, c.slug]),
    });
  }

  for (const cat of EXTERNAL_CATEGORIES) {
    for (const r of cat.items) {
      items.push({
        id: `resource:${r.url}`,
        title: r.title,
        description: r.description,
        href: r.url,
        external: true,
        badge: cat.thaiLabel,
        keywords: lc([r.title, r.description, ...r.tags, cat.thaiLabel, cat.enLabel]),
      });
    }
  }

  const sections = [
    { title: "บทความ", href: "/articles", description: "งานอ่านที่อธิบายและตีความแนวคิด" },
    { title: "คลังแนวคิด", href: "/concepts", description: "ระบบความรู้แบบเชื่อมโยง (Wiki)" },
    { title: "แผนที่ความสัมพันธ์", href: "/constellation", description: "กราฟความสัมพันธ์ระหว่างแนวคิด" },
    { title: "สำนักคิดและนักปราชญ์", href: "/schools", description: "ไดเรกทอรีสำนักคิด นักปราชญ์ และผลงานเด่น" },
    { title: "เส้นทางการอ่าน", href: "/reading-sets", description: "ลำดับการอ่านจากพื้นฐานสู่ความลึก" },
    { title: "แหล่งอ้างอิง", href: "/sources", description: "ฐานความรู้และการอ้างอิงภายใน" },
    { title: "ทรัพยากรภายนอก", href: "/external-links", description: "ลิงก์ งานวิจัย และคลังข้อมูลภายนอก" },
    { title: "Manifesto", href: "/manifesto", description: "จุดยืนและแนวทางของโครงการ" },
    { title: "คำถามที่พบบ่อย", href: "/faq", description: "คำถามที่พบบ่อย" },
    { title: "สนับสนุนโครงการ", href: "/support", description: "ช่องทางสนับสนุน" },
    { title: "บริการ Jungian Type Analysis", href: "/guide", description: "วิเคราะห์ประเภททางจิตวิทยา" },
  ];
  for (const s of sections) {
    items.push({
      id: `section:${s.href}`,
      title: s.title,
      description: s.description,
      href: s.href,
      keywords: lc([s.title, s.description, s.href]),
    });
  }

  return items;
}

// Escape regex special chars
function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function QuickOpen() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // ดัชนีค้นหา — โหลดตอนเปิดครั้งแรก (dynamic import, ดูคอมเมนต์ที่ loadIndex)
  const [index, setIndex] = useState<Item[] | null>(null);
  useEffect(() => {
    if (!open || index) return;
    let cancelled = false;
    loadIndex().then((items) => {
      if (!cancelled) setIndex(items);
    });
    return () => {
      cancelled = true;
    };
  }, [open, index]);

  // Cmd+K / Ctrl+K to toggle
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((v) => !v);
        setQuery("");
        setSelectedIndex(0);
      }
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      const raf = requestAnimationFrame(() => inputRef.current?.focus());
      return () => cancelAnimationFrame(raf);
    }
  }, [open]);

  const terms = useMemo(() => {
    return query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  }, [query]);

  const matched = useMemo(() => {
    const items = index ?? []; // ระหว่างดัชนียังโหลด (หลัก ms) แสดง state ว่างไปก่อน
    if (terms.length === 0) return items.slice(0, 8); // show top 8 when no query
    return items
      .filter((it) => terms.every((t) => it.keywords.includes(t)))
      .slice(0, 12);
  }, [index, terms]);

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const navigate = useCallback(
    (item: Item) => {
      setOpen(false);
      setQuery("");
      if (item.external) {
        window.open(item.href, "_blank", "noopener,noreferrer");
      } else {
        router.push(item.href);
      }
    },
    [router],
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, matched.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && matched[selectedIndex]) {
      e.preventDefault();
      navigate(matched[selectedIndex]);
    }
  };

  // Scroll selected item into view
  useEffect(() => {
    const el = listRef.current?.children[selectedIndex] as HTMLElement | undefined;
    el?.scrollIntoView?.({ block: "nearest" });
  }, [selectedIndex]);

  if (!open) return null;

  // Highlight matching terms
  const highlight = (text: string): React.ReactNode => {
    if (terms.length === 0) return text;
    const term = terms.find((t) => text.toLowerCase().includes(t.toLowerCase()));
    if (!term) return text;
    const parts = text.split(new RegExp(`(${escapeRegex(term)})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === term.toLowerCase() ? (
        <mark key={i} className="rounded-sm bg-burnished-gold/30 text-on-surface">
          {part}
        </mark>
      ) : (
        <span key={i}>{part}</span>
      ),
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div className="relative z-10 w-full max-w-xl rounded-xl border border-slate-boundary/50 bg-surface-container shadow-[0_20px_60px_-20px_rgba(0,0,0,0.7)]">
        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-slate-boundary/30 px-4 py-3">
          <span className="material-symbols-outlined text-[20px] text-burnished-gold/70">
            search
          </span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="ค้นหาแนวคิด บทความ หรือหน้า..."
            className="flex-1 border-none bg-transparent text-base text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-0"
            aria-label="ค้นหาแบบเร็ว"
          />
          <kbd className="hidden rounded border border-slate-boundary/40 px-1.5 py-0.5 text-[10px] text-on-surface-variant/60 sm:inline">
            ESC
          </kbd>
        </div>

        {/* Results */}
        {matched.length > 0 ? (
          <ul
            ref={listRef}
            className="max-h-[360px] overflow-y-auto py-2"
            role="listbox"
            aria-label="ผลลัพธ์การค้นหา"
          >
            {matched.map((item, i) => (
              <li key={item.id} role="option" aria-selected={i === selectedIndex}>
                <button
                  type="button"
                  onClick={() => navigate(item)}
                  onMouseEnter={() => setSelectedIndex(i)}
                  className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                    i === selectedIndex
                      ? "bg-burnished-gold/10"
                      : "hover:bg-surface-container-low"
                  }`}
                >
                  <span className="material-symbols-outlined shrink-0 text-[18px] text-on-surface-variant/60">
                    {item.external ? "open_in_new" : "article"}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-medium text-on-surface">
                        {highlight(item.thaiTitle || item.title)}
                      </span>
                      {item.badge ? (
                        <span className="shrink-0 text-[10px] text-on-surface-variant/50">
                          {item.badge}
                        </span>
                      ) : null}
                    </div>
                    {item.description ? (
                      <p className="mt-0.5 truncate text-xs text-on-surface-variant/60">
                        {highlight(item.description)}
                      </p>
                    ) : null}
                  </div>
                  <span className="shrink-0 text-[10px] text-on-surface-variant/45">
                    {item.external ? "ภายนอก" : "ไป →"}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="px-4 py-8 text-center text-sm text-on-surface-variant/60">
            {query.trim() ? (
              <>
                ไม่พบผลลัพธ์สำหรับ &ldquo;{query.trim()}&rdquo;
                <br />
                <span className="text-xs">
                  ลองค้นหาแบบละเอียดที่{" "}
                  <a href="/search" className="text-burnished-gold hover:underline">
                    หน้าค้นหา
                  </a>
                </span>
              </>
            ) : (
              "พิมพ์เพื่อค้นหา — แนวคิด บทความ และหน้าต่าง ๆ"
            )}
          </div>
        )}

        {/* Footer hint */}
        <div className="flex items-center justify-between border-t border-slate-boundary/30 px-4 py-2 text-[10px] text-on-surface-variant/45">
          <span>
            <kbd className="mr-1 rounded border border-slate-boundary/40 px-1 py-0.5">↑↓</kbd>
            นำทาง{" "}
            <kbd className="ml-1 rounded border border-slate-boundary/40 px-1 py-0.5">↵</kbd>
            เลือก
          </span>
          <span>
            <kbd className="rounded border border-slate-boundary/40 px-1 py-0.5">Esc</kbd>
            ปิด
          </span>
        </div>
      </div>
    </div>
  );
}
