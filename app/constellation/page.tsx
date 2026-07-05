import type { Metadata } from "next";
import Link from "next/link";
import { getPublicEntries } from "@/lib/content/public-source";
import {
  buildGraph,
  NODE_TYPE_LABEL,
  NODE_TYPE_ORDER,
  type GraphNode,
} from "@/lib/content/graph";
import { ConstellationMindmap } from "@/components/constellation/constellation-mindmap";
import { PageScaffold } from "@/components/page-scaffold";

export const metadata: Metadata = {
  title: "แผนที่ความสัมพันธ์ — ARCHRON",
  description:
    "แผนภาพรัศมีของแนวคิด นักคิด หนังสือ และสำนักคิด — เลือกแนวคิดเป็นศูนย์กลางแล้วสำรวจความเชื่อมโยงทีละก้าว",
};

export default async function ConstellationPage({
  searchParams,
}: {
  searchParams: Promise<{ focus?: string }>;
}) {
  const graph = buildGraph(await getPublicEntries());
  const { focus } = await searchParams;

  const hub = [...graph.nodes].sort(
    (a, b) => b.inbound - a.inbound || b.degree - a.degree,
  )[0];
  const initialFocus =
    focus && graph.nodes.some((n) => n.id === focus) ? focus : (hub?.id ?? graph.nodes[0]?.id ?? "");

  const grouped = NODE_TYPE_ORDER.map((nt) => ({
    nt,
    items: graph.nodes
      .filter((n) => n.nodeType === nt)
      .sort((a: GraphNode, b: GraphNode) => b.degree - a.degree),
  })).filter((g) => g.items.length > 0);

  return (
    <PageScaffold
      breadcrumb={[
        { label: "หน้าแรก", href: "/" },
        { label: "คลังความรู้", href: "/knowledge" },
        { label: "แผนที่ความสัมพันธ์" },
      ]}
      kicker="Knowledge Graph"
      title="แผนที่ความสัมพันธ์"
      lead="เลือกแนวคิดเป็น 'ศูนย์กลาง' แล้วดูว่ามันเชื่อมโยงกับแนวคิดใดบ้าง — คลิกแนวคิดรอบ ๆ เพื่อย้ายศูนย์กลางและสำรวจต่อทีละก้าว หรือเปิดหน้าเต็มเพื่ออ่านรายละเอียด"
      ambient
      className="atmo-observatory"
    >
      <section className="mx-auto max-w-[1200px] px-6">
        {initialFocus ? (
          <ConstellationMindmap data={graph} initialFocus={initialFocus} />
        ) : null}

        {/* Fallback (no-JS / a11y): รายการ node จัดกลุ่มตามชนิด เป็นลิงก์ */}
        <noscript>
          <div className="mt-10">
            <p className="text-sm text-muted">
              แผนที่ต้องใช้ JavaScript — ด้านล่างคือรายการแนวคิดทั้งหมดแบบลิงก์
            </p>
            {grouped.map((g) => (
              <div key={g.nt} className="mt-6">
                <h2 className="font-serif text-xl text-ivory">{NODE_TYPE_LABEL[g.nt]}</h2>
                <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-2">
                  {g.items.map((n) => (
                    <li key={n.id}>
                      <Link
                        href={`/concepts/${n.id}`}
                        className="text-sm text-soft-ivory hover:text-soft-gold"
                      >
                        {n.thaiTitle || n.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </noscript>
      </section>
    </PageScaffold>
  );
}
