import Link from "next/link";
import type { ContentEntry } from "@/types/content";
import {
  localGraphFromEntry,
  NODE_TYPE_COLOR,
  NODE_TYPE_LABEL,
  RELATION_LABEL,
} from "@/lib/content/graph";
import { KnowledgeHubIcon, ArrowRightIcon } from "@/components/icons";

// Local Graph (B2) — มินิกราฟรายโหนด: โหนดเป้าหมายตรงกลาง + เพื่อนบ้านโดยตรงเป็นวงรอบ
// คงสีตามศาสตร์ (cosmology) · ไม่มี dependency กราฟหนัก · ซ่อนถ้าเพื่อนบ้าน < 2
const R = 35; // รัศมีวง (% ของกล่อง)

export function LocalGraph({ entry }: { entry: ContentEntry }) {
  const { center, neighbors } = localGraphFromEntry(entry);
  if (neighbors.length < 2) return null;

  const pts = neighbors.map((n, i) => {
    const angle = (i / neighbors.length) * Math.PI * 2 - Math.PI / 2;
    return {
      ...n,
      x: 50 + R * Math.cos(angle),
      y: 50 + R * Math.sin(angle),
    };
  });

  return (
    <figure className="archron-panel mt-6 p-4">
      <figcaption className="mb-2 flex items-center gap-1.5 text-xs text-text-secondary/60">
        <KnowledgeHubIcon className="h-4 w-4 text-accent/70" />
        แผนที่ความสัมพันธ์เฉพาะหน้านี้
      </figcaption>

      <div className="relative mx-auto h-[300px] w-full sm:max-w-[440px]">
        {/* เส้นเชื่อม */}
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {pts.map((p) => (
            <line
              key={`e-${p.slug}`}
              x1="50"
              y1="50"
              x2={p.x}
              y2={p.y}
              stroke={NODE_TYPE_COLOR[p.nodeType]}
              strokeWidth="0.4"
              strokeOpacity="0.5"
            />
          ))}
        </svg>

        {/* โหนดเพื่อนบ้าน */}
        {pts.map((p) => (
          <Link
            key={p.slug}
            href={`/concepts/${p.slug}`}
            title={`${p.label}${p.relation ? ` · ${RELATION_LABEL[p.relation]}` : ""}`}
            className="group absolute flex max-w-[40%] -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-full border border-text-heading/10 bg-bg-card/90 px-3.5 py-2 text-xs text-text-secondary transition-colors hover:border-accent/50 hover:text-accent focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
          >
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: NODE_TYPE_COLOR[p.nodeType] }}
              aria-hidden="true"
            />
            <span className="truncate">{p.label}</span>
          </Link>
        ))}

        {/* โหนดเป้าหมาย (กลาง) */}
        <span
          className="absolute left-1/2 top-1/2 flex max-w-[44%] -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-full border border-accent/50 bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent"
          title={`${center.label} · ${NODE_TYPE_LABEL[center.nodeType]}`}
        >
          <span className="truncate">{center.label}</span>
        </span>
      </div>

      <Link
        href={`/constellation?focus=${entry.slug}`}
        className="mt-2 inline-flex items-center gap-1 text-xs text-accent hover:underline"
      >
        เปิดแผนที่ความสัมพันธ์เต็ม
        <ArrowRightIcon className="h-3.5 w-3.5" />
      </Link>
    </figure>
  );
}
