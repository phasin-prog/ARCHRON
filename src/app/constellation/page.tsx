import type { Metadata } from "next";
import Link from "next/link";
import { getPublicEntries } from "@/lib/content/publishing/public-source";
import {
  buildGraph,
  NODE_TYPE_LABEL,
  NODE_TYPE_ORDER,
  type GraphNode,
} from "@/lib/content/reading/graph";
import { ConstellationMindmap } from "@/components/constellation/constellation-mindmap";
import { PageScaffold } from "@/components/page-scaffold";

export const metadata: Metadata = {
  title: "แผนที่ความสัมพันธ์ — ARCHRON",
  description:
    "แผนภาพความสัมพันธ์ของแนวคิด นักคิด หนังสือ และสำนักคิดใน ARCHRON",
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
      kicker="แผนที่ความสัมพันธ์"
      title="แผนที่ความสัมพันธ์ในคลัง"
      lead="เลือกแนวคิดเป็นศูนย์กลางเพื่อดูเนื้อหาที่เชื่อมโยงกัน คลิกรายการรอบ ๆ เพื่อเปลี่ยนจุดโฟกัส หรือเปิดหน้าเนื้อหาเพื่ออ่านรายละเอียด"
      ambient
      className="atmo-observatory"
    >
      <section className="tpl-content">
        {initialFocus ? (
          <ConstellationMindmap data={graph} initialFocus={initialFocus} />
        ) : null}

        {/* Fallback (no-JS / a11y): รายการ node จัดกลุ่มตามชนิด เป็นลิงก์ */}
        <noscript>
          <div className="mt-10">
            <p className="text-sm text-text-secondary">
              แผนที่นี้ต้องใช้ JavaScript ด้านล่างคือรายการแบบลิงก์
            </p>
            {grouped.map((g) => (
              <div key={g.nt} className="mt-6">
                <h2 className="font-serif text-xl text-text-heading">{NODE_TYPE_LABEL[g.nt]}</h2>
                <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-2">
                  {g.items.map((n) => (
                    <li key={n.id}>
                      <Link
                        href={`/concepts/${n.id}`}
                        className="text-sm text-text-body hover:text-accent"
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
