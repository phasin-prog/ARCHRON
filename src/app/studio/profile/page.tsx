"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth, useUser } from "@clerk/nextjs";
import { roleFromMetadata, ROLE_LABEL, ROLE_META, canWrite } from "@/lib/content/roles";
import { AchievementBadgeIcon } from "@/components/icons";
import { EditorIcon } from "@/components/studio/editor-icon";
import {
  getMyProfileAction,
  upsertMyProfileAction,
  requestWriterAction,
} from "@/features/studio/actions/profile-actions";
import type { Profile } from "@/lib/content/profile-db";

interface RecentItem {
  slug: string;
  title: string;
  section: string;
  timestamp: number;
}

interface BookmarkItem {
  slug: string;
  title: string;
  section: string;
  timestamp: number;
}

const RECENT_KEY = "archron-recently-viewed";
const BOOKMARK_KEY = "archron-bookmarks";

function loadRecent(): RecentItem[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.slice(0, 10) : [];
  } catch {
    return [];
  }
}

function loadBookmarks(): BookmarkItem[] {
  try {
    const raw = localStorage.getItem(BOOKMARK_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function removeBookmark(slug: string) {
  try {
    const current = loadBookmarks();
    const filtered = current.filter((b) => b.slug !== slug);
    localStorage.setItem(BOOKMARK_KEY, JSON.stringify(filtered));
    return filtered;
  } catch {
    return [];
  }
}

export default function StudioProfilePage() {
  const { userId } = useAuth();
  const { user } = useUser();

  const role = roleFromMetadata(user?.publicMetadata);
  const roleMeta = ROLE_META[role];

  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [title, setTitle] = useState("");
  const [writerRequested, setWriterRequested] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [recentItems, setRecentItems] = useState<RecentItem[]>([]);
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);

  useEffect(() => {
    if (!userId) return;
    let active = true;
    (async () => {
      const p: Profile | null = await getMyProfileAction();
      if (active && p) {
        setUsername(p.username ?? "");
        setDisplayName(p.display_name ?? "");
        setTitle(p.title ?? "");
        setWriterRequested(p.writer_request);
      }
    })();
    return () => {
      active = false;
    };
  }, [userId]);

  useEffect(() => {
    setRecentItems(loadRecent());
    setBookmarks(loadBookmarks());
  }, []);

  async function handleSave() {
    if (!userId) {
      setMessage("ยังไม่ได้เข้าสู่ระบบ");
      return;
    }
    setSaving(true);
    const { error } = await upsertMyProfileAction({
      username,
      display_name: displayName,
      title,
    });
    setSaving(false);
    setMessage(error ? `บันทึกไม่สำเร็จ: ${error}` : "บันทึกโปรไฟล์แล้ว ✓");
  }

  async function handleRequestWriter() {
    if (!userId) return;
    const { error } = await requestWriterAction();
    if (!error) {
      setWriterRequested(true);
      setMessage("ส่งคำขอเป็นนักเขียนแล้ว — รออนุมัติ");
    } else {
      setMessage(`ส่งคำขอไม่สำเร็จ: ${error}`);
    }
  }

  function handleRemoveBookmark(slug: string) {
    const updated = removeBookmark(slug);
    setBookmarks([...updated]);
  }

  const inputClass =
    "w-full rounded-md border border-border/50 bg-bg-card px-3 py-2 text-text-heading outline-none transition-colors focus:border-accent/50";

  const sectionLabel = (s: string) => {
    const map: Record<string, string> = {
      articles: "บทความ",
      concepts: "แนวคิด",
      books: "หนังสือ",
    };
    return map[s] ?? s;
  };

  return (
    <main className="mx-auto max-w-4xl px-6 py-20">
      <header className="mb-10">
        <span className="text-[11px] uppercase tracking-[0.2em] text-accent/70">
          Studio · โปรไฟล์
        </span>
        <h1 className="mt-2 font-serif text-3xl text-text-heading">โปรไฟล์ของฉัน</h1>
        <p className="mt-2 text-sm text-text-secondary/70">
          ตั้งชื่อผู้ใช้ ชื่อที่แสดง และยศของคุณบน ARCHRON
        </p>
      </header>

      <div className="archron-panel mb-8 flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center w-11 h-11 flex-none border border-border/40 rounded-[0.9rem_0.3rem] bg-bg-card" style={{ borderColor: `color-mix(in srgb, ${roleMeta.accent} 26%, var(--color-border))`, color: roleMeta.accent }}>
              <AchievementBadgeIcon className="h-6 w-6" />
            </span>
          <div>
            <p className="text-xs text-text-secondary/60">บทบาท</p>
            <p className="font-serif text-lg" style={{ color: roleMeta.accent }}>
              {ROLE_LABEL[role]}
            </p>
          </div>
        </div>
        {canWrite(role) ? (
          <Link
            href="/studio/dashboard"
            className="inline-flex items-center gap-1.5 rounded-md border border-accent/30 bg-accent/10 px-4 py-2 text-xs font-semibold tracking-[0.05em] text-accent transition-colors hover:bg-accent hover:text-text-inverse focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <span className="inline-flex items-center justify-center w-4 h-4 text-[16px]" aria-hidden="true">◫</span>
            Dashboard
          </Link>
        ) : null}
      </div>

      {message ? (
        <p className="mb-6 text-sm text-accent">{message}</p>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
        {/* Profile Form */}
        <div className="space-y-5">
          <h2 className="font-serif text-xl text-text-heading">ข้อมูลส่วนตัว</h2>
          <div>
            <label htmlFor="username-input" className="mb-1.5 block text-sm font-medium text-text-body">ชื่อผู้ใช้ (Username)</label>
            <input id="username-input" autoComplete="username" className={inputClass} value={username} onChange={(e) => setUsername(e.target.value)} placeholder="เช่น phasin" />
          </div>
          <div>
            <label htmlFor="display-name-input" className="mb-1.5 block text-sm font-medium text-text-body">ชื่อที่แสดง</label>
            <input id="display-name-input" autoComplete="name" className={inputClass} value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="ชื่อที่ปรากฏบนงานเขียน" />
          </div>
          <div>
            <label htmlFor="title-input" className="mb-1.5 block text-sm font-medium text-text-body">ยศ / ตำแหน่ง</label>
            <input id="title-input" className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="เช่น ผู้สนับสนุน, นักเขียนกิตติมศักดิ์" />
          </div>
          <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 bg-gradient-to-br from-accent to-accent rounded px-6 py-2.5 text-sm font-semibold text-text-inverse transition-transform hover:-translate-y-0.5 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
            <span className="inline-flex items-center justify-center w-4.5 w-4.5 text-[18px]" aria-hidden="true">💾</span>
            {saving ? "กำลังบันทึก..." : "บันทึกโปรไฟล์"}
          </button>

          {role === "user" ? (
            <div className="archron-panel mt-6 p-5">
              <h2 className="font-serif text-lg text-text-heading">อยากร่วมเป็นนักเขียน?</h2>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary/70">
                ผู้ใช้ทั่วไปอ่านได้ทุกอย่าง หากต้องการเขียนและเรียบเรียงเนื้อหา ส่งคำขอเป็นนักเขียนเพื่อให้แอดมินพิจารณา
              </p>
              <button onClick={handleRequestWriter} disabled={writerRequested} className="mt-4 inline-flex items-center gap-2 rounded border border-accent/45 px-4 py-2 text-sm text-accent transition-colors hover:bg-accent/10 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
                <EditorIcon name="edit_note" className="h-[18px] w-[18px]" />
                {writerRequested ? "ส่งคำขอแล้ว — รออนุมัติ" : "ขอเป็นนักเขียน"}
              </button>
            </div>
          ) : null}
        </div>

        {/* Reading History & Bookmarks */}
        <div className="space-y-8">
          {/* Bookmarks */}
          <section>
            <h2 className="mb-4 font-serif text-xl text-text-heading">
              <span className="inline-flex items-center justify-center w-5 h-5 mr-1.5 text-accent align-middle" aria-hidden="true">🔖</span>
              รายการบันทึก
            </h2>
            {bookmarks.length === 0 ? (
              <div className="archron-panel p-6 text-center">
                <span className="inline-flex items-center justify-center w-8 h-8 text-[32px] text-text-secondary" aria-hidden="true">🔖</span>
                <p className="mt-2 text-sm text-text-secondary/60">ยังไม่มีรายการบันทึก</p>
                <p className="mt-1 text-xs text-text-secondary/40">
                  บันทึกบทความหรือแนวคิดจากหน้าอ่าน
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {bookmarks.map((b) => (
                  <div
                    key={b.slug}
                    className="archron-panel flex items-center justify-between p-3 transition-all hover:border-accent/45"
                  >
                    <Link
                      href={`/${b.section}/${b.slug}`}
                      className="min-w-0 flex-1"
                    >
                      <p className="truncate text-sm font-medium text-text-heading hover:text-accent">
                        {b.title}
                      </p>
                      <p className="text-[10px] text-text-secondary/50">
                        {sectionLabel(b.section)}
                      </p>
                    </Link>
                    <button
                      onClick={() => handleRemoveBookmark(b.slug)}
                      className="shrink-0 ml-2 p-1 text-text-secondary hover:text-error transition-colors"
                      aria-label="ลบรายการบันทึก"
                    >
                      <EditorIcon name="close" className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Reading History */}
          <section>
            <h2 className="mb-4 font-serif text-xl text-text-heading">
              <span className="inline-flex items-center justify-center w-5 h-5 mr-1.5 text-concept align-middle" aria-hidden="true">⏱</span>
              ประวัติการอ่านล่าสุด
            </h2>
            {recentItems.length === 0 ? (
              <div className="archron-panel p-6 text-center">
                <span className="inline-flex items-center justify-center w-8 h-8 text-[32px] text-text-secondary" aria-hidden="true">⏰</span>
                <p className="mt-2 text-sm text-text-secondary/60">ยังไม่มีประวัติการอ่าน</p>
                <p className="mt-1 text-xs text-text-secondary/40">
                  เริ่มอ่านบทความเพื่อบันทึกประวัติ
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {recentItems.map((item) => (
                  <Link
                    key={`${item.slug}-${item.timestamp}`}
                    href={`/${item.section}/${item.slug}`}
                    className="archron-panel block p-3 transition-all hover:border-accent/45"
                  >
                    <p className="truncate text-sm font-medium text-text-heading hover:text-accent">
                      {item.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-text-secondary/50">
                        {sectionLabel(item.section)}
                      </span>
                      <span className="text-[10px] text-text-secondary/30">·</span>
                      <span className="text-[10px] text-text-secondary/40">
                        {new Date(item.timestamp).toLocaleDateString("th-TH", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      <div className="mt-10">
        <Link href="/studio" className="text-sm text-accent hover:underline">← กลับห้องเขียน</Link>
      </div>
    </main>
  );
}
