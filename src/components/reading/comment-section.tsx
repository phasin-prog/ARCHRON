"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth, useUser, SignedIn, SignedOut } from "@clerk/nextjs";
import {
  listCommentsAction,
  addCommentAction,
  deleteCommentAction,
} from "@/lib/content/community/comments-actions";
import type { Comment } from "@/lib/content/community/comments-db";

// ความคิดเห็นท้ายบทความ/แนวคิด — กรอบวิชาการ: ต้องมีบัญชีจึงร่วมอภิปรายได้
// หมายเหตุ: ตัวห่อ ClerkProvider อยู่ที่ ReadingPage (island) เพื่อไม่กระทบ ISR หน้าอื่น
// ใช้ Server Actions (service-role) แทน client-side Clerk JWT → แก้ปัญหา "No suitable key"
export function CommentSection({ section, slug }: { section: string; slug: string }) {
  const { userId } = useAuth();
  const { user } = useUser();

  const [comments, setComments] = useState<Comment[] | null>(null);
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const data = await listCommentsAction(section, slug);
    setComments(data);
  }

  useEffect(() => {
    let active = true;
    (async () => {
      const data = await listCommentsAction(section, slug);
      if (active) setComments(data);
    })();
    return () => {
      active = false;
    };
  }, [section, slug]);

  const authorName =
    user?.fullName || user?.username || user?.primaryEmailAddress?.emailAddress || "ผู้อ่าน";

  async function handleSubmit() {
    if (!userId || !body.trim()) return;
    setBusy(true);
    setError(null);
    const { error } = await addCommentAction(section, slug, body);
    setBusy(false);
    if (error) {
      setError(`ส่งความคิดเห็นไม่สำเร็จ: ${error}`);
      return;
    }
    setBody("");
    await load();
  }

  async function handleDelete(id: string) {
    const { error } = await deleteCommentAction(id);
    if (!error) await load();
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

  const count = comments?.length ?? 0;

  return (
    <section className="mt-16 border-t border-border/40 pt-10">
      <h2 className="font-serif text-2xl text-text-heading">
        ร่วมอภิปราย
        {count > 0 ? <span className="ml-2 text-base text-text-secondary/50">({count})</span> : null}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-text-secondary/70">
        แลกเปลี่ยนความเข้าใจอย่างมีเหตุผลและให้เกียรติกัน — โปรดอ้างอิงแหล่งที่มาเมื่อยกข้อเท็จจริง
      </p>

      <div className="mt-6">
        <SignedIn>
          <div className="archron-panel p-4">
            <label className="sr-only" htmlFor="comment-textarea">เขียนความคิดเห็นของคุณ</label>
            <textarea
              id="comment-textarea"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={3}
              maxLength={2000}
              placeholder="เขียนความคิดเห็นของคุณ…"
              aria-describedby={error ? "comment-error" : undefined}
              aria-invalid={!!error}
              className="w-full resize-y rounded-lg border border-border/30 bg-bg-card/50 p-3 text-base text-text-heading placeholder:text-text-secondary/50 focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:outline-none focus-visible:border-accent/50 transition-colors"
            />
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-text-secondary/65">ในนาม {authorName}</span>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={busy || !body.trim()}
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-br from-accent to-accent px-5 py-2 text-sm font-semibold text-text-inverse transition-all hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none disabled:opacity-50 disabled:transform-none"
              >
                {busy ? (
                  <span className="inline-flex items-center justify-center w-[1em] h-[1em] text-[18px] animate-spin" aria-hidden="true">⟳</span>
                ) : (
                  <span className="inline-flex items-center justify-center w-[1em] h-[1em] text-[18px]" aria-hidden="true">↗</span>
                )}
                {busy ? "กำลังส่ง…" : "ส่งความคิดเห็น"}
              </button>
            </div>
            {error ? <p id="comment-error" className="mt-2 text-sm text-error">{error}</p> : null}
          </div>
        </SignedIn>
        <SignedOut>
          <div className="rounded-md border border-accent/25 bg-accent/5 p-5 text-sm text-text-secondary/80">
            <Link href="/th/login" className="font-semibold text-accent hover:underline focus-visible:ring-1 focus-visible:ring-accent/60 focus-visible:outline-none">
              เข้าสู่ระบบบัญชีนักอ่าน
            </Link>{" "}
            เพื่อร่วมอภิปราย
          </div>
        </SignedOut>
      </div>

      <div className="mt-8 space-y-5">
        {comments === null ? (
          <p className="text-sm text-text-secondary/75">ยังไม่เปิดระบบความคิดเห็นในขณะนี้</p>
        ) : comments.length === 0 ? (
          <p className="text-sm text-text-secondary/75">ยังไม่มีความคิดเห็น — เป็นคนแรกที่ร่วมอภิปราย</p>
        ) : (
          comments.map((c) => (
            <article key={c.id} className="archron-panel p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="font-serif text-sm text-text-heading">{c.author_name ?? "ผู้อ่าน"}</span>
                <span className="text-xs text-text-secondary/75">{fmt(c.created_at)}</span>
              </div>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-text-body">
                {c.body}
              </p>
              {userId === c.clerk_user_id ? (
                <button
                  type="button"
                  onClick={() => handleDelete(c.id)}
                  className="mt-2 inline-flex items-center gap-1 text-xs text-text-secondary/75 transition-colors hover:text-error focus-visible:ring-1 focus-visible:ring-error/60 focus-visible:outline-none rounded px-1"
                >
                  <span className="inline-flex items-center justify-center w-[1em] h-[1em] text-[14px]" aria-hidden="true">🗑</span>
                  ลบ
                </button>
              ) : null}
            </article>
          ))
        )}
      </div>
    </section>
  );
}
