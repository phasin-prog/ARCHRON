import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { ProfileTabs } from "@/components/profile/profile-tabs";
import { getAuthedSupabase, getUserRole } from "@/lib/content/server-auth";
import { canWrite, ROLE_LABEL } from "@/lib/content/roles";
import { getMyProfile } from "@/lib/content/profile-db";
import { listMyEntries } from "@/lib/content/entries-db";
import { getPublicEntries } from "@/lib/content/public-source";
import {
  getReadingStats,
  getReadingHistory,
  getUserAchievements,
  type ReadingRow,
} from "@/lib/content/reading-db";
import { levelProgress, LEVELS } from "@/lib/content/levels";
import { ACHIEVEMENTS } from "@/lib/content/achievements";
import { SealProfileSection } from "@/components/seals/seal-profile-section";
import type { ContentEntry } from "@/types/content";

export const metadata: Metadata = {
  title: "โปรไฟล์ของฉัน — ARCHRON",
  description:
    "หน้าโปรไฟล์นักอ่าน ARCHRON — ติดตามระดับการอ่าน เหรียญตรา ประวัติการอ่าน และงานเขียนของคุณ",
};

// /profile เป็นหน้า Private เท่านั้น — ไม่ cache (ข้อมูลรายบุคคล)
export const dynamic = "force-dynamic";

const CONTENT_TYPE_LABEL: Record<string, string> = {
  article: "บทความ",
  concept: "แนวคิด",
  person: "นักคิด",
  book: "หนังสือ",
  school: "สำนักคิด",
  symbol: "สัญลักษณ์",
  term: "คำศัพท์",
  "reading-set": "เส้นทางการอ่าน",
  "source-note": "บันทึกอ้างอิง",
};

function sectionForType(t: string): "articles" | "concepts" {
  return t === "article" ? "articles" : "concepts";
}

// อักษรย่อสำหรับ monogram avatar (ตัวแรกของชื่อ)
function monogram(name: string): string {
  const trimmed = (name || "").trim();
  return trimmed ? trimmed[0].toUpperCase() : "?";
}

export default async function ProfilePage() {
  const { userId } = await auth();
  // ป้องกันซ้อน middleware — signed-out → ไปหน้าเข้าสู่ระบบนักอ่าน
  if (!userId) {
    redirect("/th/login");
  }

  const { userId: uid, supabase } = await getAuthedSupabase();
  const role = await getUserRole();
  const isWriter = canWrite(role);

  // ชื่อที่แสดง — จาก profiles ก่อน แล้ว fallback ไป Clerk
  const profile = await getMyProfile(supabase, uid);
  const client = await clerkClient();
  const clerkUser = await client.users.getUser(uid);
  const displayName =
    profile?.display_name ||
    clerkUser.fullName ||
    profile?.username ||
    clerkUser.username ||
    clerkUser.primaryEmailAddress?.emailAddress ||
    "ผู้อ่าน";
  const title = profile?.title || ROLE_LABEL[role];

  // สถิติการอ่าน + ประวัติ + เหรียญ (derive ทุกครั้ง)
  const stats = await getReadingStats(supabase, uid);
  const history = await getReadingHistory(supabase, uid, 30);
  const unlockedKeys = new Set(await getUserAchievements(supabase, uid));
  const lp = levelProgress(stats.completed);

  // map slug → ชื่อเรื่องจริง สำหรับแสดงในประวัติการอ่าน (fallback เป็น slug ถ้าไม่พบ)
  const allEntries = await getPublicEntries();
  const titleBySlug = new Map<string, string>(
    allEntries.map((e) => [e.slug, e.title] as const),
  );

  // งานที่เขียนเอง (เฉพาะนักเขียน)
  let myEntries: ContentEntry[] = [];
  if (isWriter) {
    myEntries = await listMyEntries(supabase, uid);
  }

  const readingTab = (
    <ReadingTab
      displayName={displayName}
      lp={lp}
      stats={stats}
      history={history}
      unlockedKeys={unlockedKeys}
      titleBySlug={titleBySlug}
    />
  );

  const workTab = <WorkTab entries={myEntries} />;

  return (
    <main className="pb-24">
      <PageHeader
        kicker="โปรไฟล์นักอ่าน"
        title="โปรไฟล์ของฉัน"
        lead="ติดตามการเดินทางในคลังความรู้ ระดับนักอ่าน และเหรียญตราของคุณ"
      />

      <div className="tpl-reference">
        {/* หัวโปรไฟล์ — monogram avatar + ชื่อ + ยศ */}
        <div className="archron-card flex flex-col items-center justify-between gap-4 p-7 sm:flex-row sm:gap-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-6">
            <div
              className="flex h-20 w-20 flex-none items-center justify-center rounded-full border text-3xl font-serif text-accent"
              style={{
                borderColor: "color-mix(in srgb, var(--accent) 45%, transparent)",
                backgroundColor: "color-mix(in srgb, var(--accent) 12%, transparent)",
              }}
              aria-hidden="true"
            >
              {monogram(displayName)}
            </div>
            <div className="text-center sm:text-left">
              <h2 className="font-serif text-2xl text-text-heading">{displayName}</h2>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold leading-[1.4] bg-accent/10 text-accent">{title}</span>
                <span className="inline-flex items-center gap-1 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-0.5 text-xs text-accent">
                  <span className="inline-flex items-center justify-center w-[1em] h-[1em] text-[14px]" aria-hidden="true">🏅</span>
                  ระดับ {lp.level} · {lp.name}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link
              href="/studio/profile"
              className="inline-flex items-center gap-1.5 rounded-md border border-border/30 bg-bg-card/30 px-4 py-2 text-xs text-text-body hover:border-accent/45 hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <span className="inline-flex items-center justify-center w-4 h-4 text-[16px]" aria-hidden="true">✎</span>
              แก้ไขโปรไฟล์
            </Link>
          </div>
        </div>

        {/* แท็บ */}
        <div className="mt-8">
          <ProfileTabs reading={readingTab} work={workTab} showWork={isWriter} />
        </div>
      </div>

      <SealProfileSection />
    </main>
  );
}

// ===== แท็บ "การอ่านของฉัน" =====
function ReadingTab({
  displayName,
  lp,
  stats,
  history,
  unlockedKeys,
  titleBySlug,
}: {
  displayName: string;
  lp: ReturnType<typeof levelProgress>;
  stats: { completed: number; distinctSchools: number; streakDays: number; readManifesto: boolean };
  history: ReadingRow[];
  unlockedKeys: Set<string>;
  titleBySlug: Map<string, string>;
}) {
  const completedHistory = history.filter((h) => h.status === "completed");

  return (
    <div className="space-y-10">
      {/* การ์ดระดับ + แถบความคืบหน้า */}
      <section className="archron-card p-6 sm:p-7">
        <div className="flex items-end justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* ไอคอน 3 มิติ "หอวงโคจร" — ระดับการอ่าน (sprite เฟส 0) */}
            <span className="inline-flex items-center justify-center w-11 h-11 flex-none border border-border/40 rounded-[0.9rem_0.3rem] bg-bg-card" aria-hidden="true">
              <svg className="icon-3d">
                <use href="/icons/archron-icons.svg#level" />
              </svg>
            </span>
            <div>
              <p className="text-sm font-medium text-text-secondary/80">ระดับปัจจุบัน</p>
              <p className="mt-1 font-serif text-2xl text-text-heading">
                {lp.level} · {lp.name}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-serif text-3xl text-accent">{stats.completed}</p>
            <p className="text-xs text-text-secondary">ชิ้นความรู้ที่อ่านจบ</p>
          </div>
        </div>

        {/* แถบความคืบหน้า */}
        <div className="mt-5">
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-bg-card">
            <div
              className="h-full rounded-full transition-[width] duration-700"
              style={{
                width: `${lp.pct}%`,
                backgroundImage:
                  "linear-gradient(90deg, color-mix(in srgb, var(--accent) 55%, transparent), var(--accent))",
              }}
            />
          </div>
          <p className="mt-2 text-xs text-text-secondary">
            {lp.next
              ? `อ่านอีก ${lp.toNext} ชิ้นความรู้เพื่อเลื่อนสู่ระดับ ${lp.next.name}`
              : "ถึงระดับสูงสุดแล้ว — นักปราชญ์แห่งคลังความรู้"}
          </p>
        </div>

        {/* บันไดระดับ 6 ขั้น */}
        <ol className="mt-6 grid grid-cols-3 gap-2 sm:grid-cols-6">
          {LEVELS.map((lv) => {
            const reached = stats.completed >= lv.threshold;
            const isCurrent = lv.level === lp.level;
            return (
              <li
                key={lv.level}
                className={`rounded-md border px-2 py-3 text-center flex flex-col items-center justify-center ${
                  isCurrent
                    ? "border-accent/60 bg-accent/10"
                    : reached
                      ? "border-border/40 bg-bg-card"
                      : "border-border/20 opacity-55"
                }`}
              >
                <span className="inline-flex items-center justify-center w-11 h-11 flex-none border border-border/40 rounded-[0.9rem_0.3rem] bg-bg-card scale-75 mb-1.5" style={!reached ? { borderColor: "color-mix(in srgb, var(--color-border) 60%, transparent)" } : undefined}>
                  <svg className="icon-3d" aria-hidden="true" style={{ "--ico-main": reached ? "var(--color-accent)" : "var(--color-text-secondary)" } as React.CSSProperties}>
                    <use href="/icons/archron-icons.svg#level" />
                  </svg>
                </span>
                <p className={`text-xs ${reached ? "text-accent font-semibold" : "text-text-secondary"}`}>
                  {lv.level}
                </p>
                <p className={`mt-0.5 text-xs leading-tight ${reached ? "text-text-heading" : "text-text-secondary"}`}>
                  {lv.name}
                </p>
                <p className="mt-0.5 text-xs text-text-secondary">{lv.threshold}+</p>
              </li>
            );
          })}
        </ol>
      </section>

      {/* กริดเหรียญตรา */}
      <section>
        <h3 className="flex items-center gap-3 font-serif text-fluid-h3 text-text-heading">
          {/* ไอคอน 3 มิติ "ดาวรัศมี" — เหรียญตรา (sprite เฟส 0) */}
          <span className="inline-flex items-center justify-center w-11 h-11 flex-none border border-border/40 rounded-[0.9rem_0.3rem] bg-bg-card" aria-hidden="true">
            <svg className="icon-3d">
              <use href="/icons/archron-icons.svg#achievement" />
            </svg>
          </span>
          เหรียญตรา
        </h3>
        <p className="mt-1 text-sm text-text-secondary">
          ปลดล็อก {unlockedKeys.size} จาก {ACHIEVEMENTS.length} เหรียญ
        </p>
        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {ACHIEVEMENTS.map((a) => {
            const unlocked = unlockedKeys.has(a.key);
            return (
              <div
                key={a.key}
                className={`archron-panel flex flex-col items-center p-5 text-center ${
                  unlocked ? "" : "opacity-45"
                }`}
              >
                <span className="inline-flex items-center justify-center w-11 h-11 flex-none border border-border/40 rounded-[0.9rem_0.3rem] bg-bg-card scale-110 mb-2" style={!unlocked ? { borderColor: "color-mix(in srgb, var(--color-border) 60%, transparent)" } : undefined}>
                  <svg className="icon-3d" aria-hidden="true" style={{ "--ico-main": unlocked ? "var(--color-accent)" : "var(--color-text-secondary)" } as React.CSSProperties}>
                    <use href="/icons/archron-icons.svg#achievement" />
                  </svg>
                </span>
                <p className="mt-3 text-sm font-medium text-text-heading">{a.title}</p>
                <p className="mt-1 text-xs leading-snug text-text-secondary">{a.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ประวัติการอ่าน */}
      <section>
        <h3 className="flex items-center gap-3 font-serif text-fluid-h3 text-text-heading">
          {/* ไอคอน 3 มิติ "ตั้งหนังสือ" — ประวัติการอ่าน (sprite เฟส 0) */}
          <span className="inline-flex items-center justify-center w-11 h-11 flex-none border border-border/40 rounded-[0.9rem_0.3rem] bg-bg-card" aria-hidden="true">
            <svg className="icon-3d">
              <use href="/icons/archron-icons.svg#reading-set" />
            </svg>
          </span>
          ประวัติการอ่าน
        </h3>
        {history.length === 0 ? (
          <div className="mt-4">
            <EmptyState
              icon="auto_stories"
              title="ยังไม่มีประวัติการอ่าน"
              description="เริ่มอ่านชิ้นความรู้ในคลัง แล้วความคืบหน้าจะถูกบันทึกที่นี่โดยอัตโนมัติ"
            >
              <Link
                href="/articles"
                className="inline-flex items-center gap-1.5 text-sm text-accent hover:underline"
              >
                <span className="inline-flex items-center justify-center w-4 h-4 text-[16px]" aria-hidden="true">⊚</span>
                เริ่มสำรวจคลังความรู้
              </Link>
            </EmptyState>
          </div>
        ) : (
          <ul className="mt-4 space-y-2">
            {history.map((h) => {
              const done = h.status === "completed";
              const displayTitle = titleBySlug.get(h.slug) ?? h.slug;
              return (
                <li key={h.slug}>
                  <Link
                    href={`/${sectionForType(h.content_type)}/${h.slug}`}
                    className="archron-panel flex items-center justify-between gap-3 px-4 py-3 transition-colors hover:border-accent/40"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm text-text-heading">{displayTitle}</p>
                      <p className="mt-0.5 text-xs text-text-secondary">
                        {CONTENT_TYPE_LABEL[h.content_type] ?? h.content_type}
                      </p>
                    </div>
                    <span
                      className={`inline-flex flex-none items-center gap-1 rounded-full px-2.5 py-0.5 text-xs ${
                        done
                          ? "border border-accent/30 bg-accent/10 text-accent"
                          : "border border-border/40 text-text-secondary"
                      }`}
                    >
                      <span className="inline-flex items-center justify-center w-[1em] h-[1em] text-[14px]" aria-hidden="true">
                        {done ? "✓" : "⏰"}
                      </span>
                      {done ? "อ่านจบ" : "อ่านค้าง"}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
        {completedHistory.length > 0 ? (
          <p className="mt-3 text-xs text-text-secondary">
            อ่านจบแล้ว {completedHistory.length} รายการจากประวัติล่าสุด
          </p>
        ) : null}
      </section>
    </div>
  );
}

// ===== แท็บ "งานของฉัน" (นักเขียน) =====
function WorkTab({ entries }: { entries: ContentEntry[] }) {
  if (entries.length === 0) {
    return (
      <EmptyState
        icon="edit_note"
        title="ยังไม่มีงานที่เขียน"
        description="เมื่อคุณเผยแพร่หรือบันทึกฉบับร่างใน Studio งานเหล่านั้นจะปรากฏที่นี่"
      >
        <Link
          href="/studio/editor"
          className="inline-flex items-center gap-1.5 text-sm text-accent hover:underline"
        >
          <span className="inline-flex items-center justify-center w-4 h-4 text-[16px]" aria-hidden="true">✎</span>
          เข้าสู่ห้องเขียน
        </Link>
      </EmptyState>
    );
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {entries.map((e) => {
        const published = e.status === "published";
        return (
          <li key={e.id}>
            <Link
              href={`/${sectionForType(e.contentType)}/${e.slug}`}
              className="archron-card flex h-full flex-col p-5"
            >
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold leading-[1.4] bg-accent/10 text-accent">{CONTENT_TYPE_LABEL[e.contentType] ?? e.contentType}</span>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs ${
                    published
                      ? "border border-success/40 bg-success/10 text-success"
                      : "border border-border/40 text-text-secondary"
                  }`}
                >
                  {published ? "เผยแพร่แล้ว" : "ฉบับร่าง"}
                </span>
              </div>
              <p className="mt-3 font-serif text-lg text-text-heading">{e.title}</p>
              {e.shortDescription ? (
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-text-secondary">
                  {e.shortDescription}
                </p>
              ) : null}
              {e.updatedAt ? (
                <p className="mt-auto pt-3 text-xs text-text-secondary">แก้ไขล่าสุด · {e.updatedAt}</p>
              ) : null}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
