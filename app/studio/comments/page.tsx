"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { roleFromMetadata, isAdmin } from "@/lib/content/roles";
import {
  listAllCommentsAction,
  setCommentStatusAction,
  deleteCommentAdminAction,
  type ModComment,
} from "./actions";

// โมเดอเรชันคอมเมนต์ (แอดมินเท่านั้น) — ซ่อน/แสดง/ลบ คอมเมนต์ของผู้ใช้ทุกคน
// สิทธิ์ตรวจซ้ำที่ server action เสมอ (UI นี้เป็นเพียงชั้นแสดงผล)
export default function StudioCommentsPage() {
  const { user, isLoaded } = useUser();
  const admin = isAdmin(roleFromMetadata(user?.publicMetadata));

  const [items, setItems] = useState<ModComment[] | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await listAllCommentsAction();
      setItems(data);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "โหลดไม่สำเร็จ");
      setItems([]);
    }
  }, []);

  useEffect(() => {
    if (isLoaded && admin) load();
  }, [isLoaded, admin, load]);

  async function toggle(c: ModComment) {
    setBusyId(c.id);
    const next = c.status === "visible" ? "hidden" : "visible";
    const res = await setCommentStatusAction(c.id, next);
    setBusyId(null);
    if (res.ok) load();
    else setError(res.error ?? "ทำรายการไม่สำเร็จ");
  }

  async function remove(c: ModComment) {
    setBusyId(c.id);
    const res = await deleteCommentAdminAction(c.id);
    setBusyId(null);
    if (res.ok) load();
    else setError(res.error ?? "ลบไม่สำเร็จ");
  }

  const fmt = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString("th-TH", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return iso;
    }
  };

  if (isLoaded && !admin) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-20 text-center">
        <h1 className="font-serif text-2xl text-text-heading">เฉพาะผู้ดูแล</h1>
        <p className="mt-3 text-sm text-text-secondary/70">
          หน้านี้สำหรับแอดมินเท่านั้น
        </p>
        <Link href="/studio" className="mt-6 inline-block text-sm text-accent hover:underline">
          ← กลับห้องเขียน
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <header className="mb-8">
        <span className="text-[11px] uppercase tracking-[0.2em] text-accent/70">
          Studio · โมเดอเรชัน
        </span>
        <h1 className="mt-2 font-serif text-3xl text-text-heading">ดูแลความคิดเห็น</h1>
        <p className="mt-2 text-sm text-text-secondary/70">
          ซ่อน แสดง หรือลบความคิดเห็นของผู้ใช้ทุกคน — ใช้ดูแลคุณภาพการอภิปราย
        </p>
      </header>

      {error ? <p className="mb-6 text-sm text-error">{error}</p> : null}

      {items === null ? (
        <p className="text-sm text-text-secondary/50">กำลังโหลด…</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-text-secondary/50">ยังไม่มีความคิดเห็น</p>
      ) : (
        <div className="space-y-4">
          {items.map((c) => {
            const hidden = c.status !== "visible";
            return (
              <article
                key={c.id}
                className={`rounded-md border p-4 transition-opacity ${
                  hidden
                    ? "border-error/25 bg-bg-card/20 opacity-70"
                    : "border-text-heading/10 bg-bg-card/40"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="flex items-center gap-2 text-sm">
                    <span className="font-serif text-text-heading">{c.author_name ?? "ผู้อ่าน"}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        hidden
                          ? "bg-error/15 text-error"
                          : "bg-success/15 text-success"
                      }`}
                    >
                      {hidden ? "ซ่อนอยู่" : "แสดงอยู่"}
                    </span>
                  </span>
                  <span className="text-xs text-text-secondary/45">{fmt(c.created_at)}</span>
                </div>

                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-text-body">
                  {c.body}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-4 text-xs">
                  <Link
                    href={`/${c.section}/${c.slug}`}
                    className="inline-flex items-center gap-1 text-text-secondary/60 hover:text-accent"
                  >
                    <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                    {c.section}/{c.slug}
                  </Link>
                  <button
                    type="button"
                    onClick={() => toggle(c)}
                    disabled={busyId === c.id}
                    className="inline-flex items-center gap-1 text-text-secondary/70 transition-colors hover:text-accent disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-[15px]">
                      {hidden ? "visibility" : "visibility_off"}
                    </span>
                    {hidden ? "แสดง" : "ซ่อน"}
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(c)}
                    disabled={busyId === c.id}
                    className="inline-flex items-center gap-1 text-text-secondary/70 transition-colors hover:text-error disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-[15px]">delete</span>
                    ลบถาวร
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <div className="mt-10">
        <Link href="/studio" className="text-sm text-accent hover:underline">
          ← กลับห้องเขียน
        </Link>
      </div>
    </main>
  );
}
