"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { RelationType } from "@/types/content";
import { ContextMenu } from "@/components/context-menu";
import {
  NODE_TYPE_COLOR,
  NODE_TYPE_LABEL,
  RELATION_LABEL,
  type GraphData,
} from "@/lib/content/graph";

// ARCHRON Color Cosmology — สีเส้นความสัมพันธ์ตามสถานะการสืบค้น
const RELATION_COLOR: Record<RelationType, string> = {
  prerequisite: "#C79A4A",
  "part-of": "#C79A4A",
  "source-of": "#8AA395",
  "influenced-by": "#6E93A8",
  "contrasts-with": "#C9776A",
  "used-in": "#6E93A8",
  related: "#A9A399",
};

type Neighbor = { id: string; relation: RelationType; soft?: boolean };

const RX = 37; // รัศมีแนวนอน (% ของกล่อง)
const RY = 39; // รัศมีแนวตั้ง

export function ConstellationMindmap({
  data,
  initialFocus,
}: {
  data: GraphData;
  initialFocus: string;
}) {
  const router = useRouter();
  const nodeById = useMemo(() => new Map(data.nodes.map((n) => [n.id, n])), [data]);
  const [focus, setFocus] = useState(initialFocus);
  const [history, setHistory] = useState<string[]>([]);
  const [hover, setHover] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState(false);

  const copyLink = (id: string) => {
    navigator.clipboard
      ?.writeText(`${window.location.origin}/concepts/${id}`)
      .then(() => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1500);
      })
      .catch(() => {});
  };

  const focusNode = nodeById.get(focus);

  const neighbors = useMemo<Neighbor[]>(() => {
    const m = new Map<string, Neighbor>();
    for (const e of data.edges) {
      if (e.source === focus && nodeById.has(e.target) && !m.has(e.target))
        m.set(e.target, { id: e.target, relation: e.relation, soft: e.soft });
      else if (e.target === focus && nodeById.has(e.source) && !m.has(e.source))
        m.set(e.source, { id: e.source, relation: e.relation, soft: e.soft });
    }
    return [...m.values()];
  }, [data, focus, nodeById]);

  const positions = neighbors.map((nb, i) => {
    const ang = ((-90 + (i * 360) / neighbors.length) * Math.PI) / 180;
    return { ...nb, x: 50 + RX * Math.cos(ang), y: 50 + RY * Math.sin(ang) };
  });

  const goTo = (id: string) => {
    if (id === focus) return;
    setHistory([...history, focus]);
    setFocus(id);
    setHover(null);
  };
  const back = () => {
    if (history.length === 0) return;
    setFocus(history[history.length - 1]);
    setHistory(history.slice(0, -1));
    setHover(null);
  };
  const runSearch = (q: string) => {
    const t = q.trim().toLowerCase();
    if (!t) return;
    const found = data.nodes.find(
      (n) =>
        n.id.toLowerCase() === t ||
        n.label.toLowerCase().includes(t) ||
        (n.thaiTitle ?? "").toLowerCase().includes(t),
    );
    if (found) goTo(found.id);
  };

  if (!focusNode) return null;

  const relationsPresent = [...new Set(neighbors.map((n) => n.relation))];

  return (
    <div className="mt-6">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={back}
          disabled={history.length === 0}
          className="inline-flex items-center gap-1.5 rounded-md border border-ink/12 px-3 py-2 text-sm text-on-surface-variant transition-colors hover:border-burnished-gold/40 hover:text-on-surface disabled:cursor-default disabled:opacity-35"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          ย้อนกลับ
        </button>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            runSearch(query);
          }}
          className="flex flex-1 items-center gap-2 rounded-md border border-ink/12 bg-surface-container/60 px-3 py-2 focus-within:border-burnished-gold/40"
        >
          <span className="material-symbols-outlined text-[18px] text-burnished-gold">search</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ค้นหาแนวคิดเพื่อตั้งเป็นศูนย์กลาง..."
            aria-label="ค้นหาแนวคิดเพื่อตั้งเป็นศูนย์กลาง"
            className="w-full bg-transparent text-sm text-on-surface placeholder:text-on-surface-variant/55 focus-visible:ring-2 focus-visible:ring-burnished-gold/30 focus:outline-none"
          />
        </form>
      </div>

      {/* Map */}
      <div
        key={focus}
        className="mm-fade relative mx-auto mt-6 h-[520px] max-w-[900px] sm:h-[620px]"
      >
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full"
        >
          {positions.map((p) => {
            const hot = hover === p.id;
            return (
              <line
                key={p.id}
                x1="50"
                y1="50"
                x2={p.x}
                y2={p.y}
                stroke={RELATION_COLOR[p.relation]}
                strokeWidth={hot ? 2.2 : 1.4}
                strokeOpacity={hot ? 0.95 : p.soft ? 0.25 : 0.5}
                strokeDasharray={p.soft ? "3 3" : undefined}
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
        </svg>

        {/* Center (focus) node */}
        <ContextMenu
          items={[
            { label: "เปิดหน้าเต็ม", icon: "open_in_full", onSelect: () => router.push(`/concepts/${focusNode.id}`) },
            { label: "คัดลอกลิงก์", icon: "link", onSelect: () => copyLink(focusNode.id) },
          ]}
          className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2"
        >
        <Link
          href={`/concepts/${focusNode.id}`}
          className="group flex flex-col items-center"
        >
          <span
            className="flex h-24 w-24 items-center justify-center rounded-full border-2 bg-deep-navy/85 backdrop-blur"
            style={{
              borderColor: NODE_TYPE_COLOR[focusNode.nodeType],
              boxShadow: focusNode.isHub ? "0 0 0 4px rgba(212,175,55,0.15)" : undefined,
            }}
          >
            <span className="px-2 text-center font-serif text-sm leading-tight text-ivory">
              {focusNode.label}
            </span>
          </span>
          {focusNode.thaiTitle ? (
            <span className="mt-1.5 text-[11px] text-on-surface-variant/70">{focusNode.thaiTitle}</span>
          ) : null}
          <span className="mt-2 inline-flex items-center gap-1 text-[11px] text-burnished-gold opacity-80 transition-opacity group-hover:opacity-100">
            เปิดหน้าเต็ม
            <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
          </span>
        </Link>
        </ContextMenu>

        {/* Neighbor nodes */}
        {positions.map((p) => {
          const n = nodeById.get(p.id)!;
          return (
            <div
              key={p.id}
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
            >
              <ContextMenu
                items={[
                  { label: "ตั้งเป็นศูนย์กลาง", icon: "center_focus_strong", onSelect: () => goTo(p.id) },
                  { label: "เปิดหน้าเต็ม", icon: "open_in_full", onSelect: () => router.push(`/concepts/${p.id}`) },
                  { label: "คัดลอกลิงก์", icon: "link", onSelect: () => copyLink(p.id) },
                ]}
                className="inline-block"
              >
              <button
                type="button"
                onClick={() => goTo(p.id)}
                onMouseEnter={() => setHover(p.id)}
                onMouseLeave={() => setHover(null)}
                className="flex max-w-[160px] flex-col items-center gap-1 rounded-md border border-ink/10 bg-surface-container/85 px-3 py-2 text-center backdrop-blur transition-colors hover:border-burnished-gold/50 hover:bg-surface-container"
              >
                <span className="flex items-center gap-1.5">
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: NODE_TYPE_COLOR[n.nodeType] }}
                  />
                  <span className="font-serif text-sm text-on-surface">{n.label}</span>
                </span>
                {n.thaiTitle ? (
                  <span className="text-[10px] text-on-surface-variant/70">{n.thaiTitle}</span>
                ) : null}
                <span className="text-[10px] text-on-surface-variant/55">
                  {RELATION_LABEL[p.relation]}
                </span>
              </button>
              </ContextMenu>
            </div>
          );
        })}

        {neighbors.length === 0 ? (
          <p className="absolute left-1/2 top-[64%] w-full -translate-x-1/2 text-center text-sm text-on-surface-variant/55">
            แนวคิดนี้ยังไม่มีความเชื่อมโยงในระบบ — ลองค้นหาแนวคิดอื่น
          </p>
        ) : null}

        {copied ? (
          <div className="pointer-events-none absolute bottom-3 left-1/2 z-30 -translate-x-1/2 rounded-md bg-burnished-gold px-3 py-1 text-xs font-medium text-prima">
            คัดลอกลิงก์แล้ว
          </div>
        ) : null}
      </div>

      {/* Detail / legend */}
      <div className="mx-auto mt-6 max-w-[900px] rounded-md border border-slate-boundary/40 bg-surface-container/40 p-5">
        <div className="flex items-center gap-2">
          <span
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: NODE_TYPE_COLOR[focusNode.nodeType] }}
          />
          <span className="font-serif text-lg text-ivory">
            {focusNode.label}
          </span>
          {focusNode.thaiTitle ? (
            <span className="text-sm text-on-surface-variant/70">{focusNode.thaiTitle}</span>
          ) : null}
          <span className="text-xs text-on-surface-variant/55">
            {[NODE_TYPE_LABEL[focusNode.nodeType], focusNode.framework].filter(Boolean).join(" · ")}
          </span>
        </div>
        {focusNode.description ? (
          <p className="mt-2 text-sm leading-relaxed text-soft-ivory">{focusNode.description}</p>
        ) : null}
        <p className="mt-3 text-xs text-on-surface-variant/55">
          เชื่อมโยง {neighbors.length} แนวคิด · คลิกแนวคิดรอบ ๆ เพื่อย้ายศูนย์กลาง ·{" "}
          <Link href={`/concepts/${focusNode.id}`} className="text-burnished-gold hover:underline">
            เปิดหน้าเต็ม →
          </Link>
        </p>
        {relationsPresent.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 border-t border-ink/10 pt-3">
            {relationsPresent.map((r) => (
              <span key={r} className="flex items-center gap-1.5 text-[11px] text-on-surface-variant/60">
                <span className="h-2 w-4 rounded-full" style={{ backgroundColor: RELATION_COLOR[r] }} />
                {RELATION_LABEL[r]}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
