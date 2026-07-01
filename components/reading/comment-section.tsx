"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth, useUser, SignedIn, SignedOut } from "@clerk/nextjs";
import {
  listCommentsAction,
  addCommentAction,
  deleteCommentAction,
} from "@/lib/content/comments-actions";
import type { Comment } from "@/lib/content/comments-db";

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
    <section className="mt-16 border-t border-slate-boundary/40 pt-10">
      <h2 className="font-serif text-2xl text-ivory">
        ร่วมอภิปราย
        {count > 0 ? <span className="ml-2 text-base text-on-surface-variant/50">({count})</span> : null}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-on-surface-variant/70">
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
              className="w-full resize-y bg-transparent text-base text-on-surface placeholder:text-on-surface-variant/75 focus-visible:ring-2 focus-visible:ring-burnished-gold focus-visible:outline-none rounded p-2 border border-slate-boundary/20"
            />
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-on-surface-variant/75">ในนาม {authorName}</span>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={busy || !body.trim()}
                className="inline-flex items-center gap-2 bg-gradient-to-br from-antique-gold to-burnished-gold px-5 py-2 text-sm font-semibold text-prima transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-burnished-gold focus-visible:outline-none disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[18px]">send</span>
                {busy ? "กำลังส่ง…" : "ส่งความคิดเห็น"}
              </button>
            </div>
            {error ? <p className="mt-2 text-sm text-danger">{error}</p> : null}
          </div>
        </SignedIn>
        <SignedOut>
          <div className="rounded-md border border-burnished-gold/25 bg-burnished-gold/5 p-5 text-sm text-on-surface-variant/80">
            <Link href="/th/login" className="font-semibold text-burnished-gold hover:underline focus-visible:ring-1 focus-visible:ring-burnished-gold/60 focus-visible:outline-none">
              เข้าสู่ระบบบัญชีนักอ่าน
            </Link>{" "}
            เพื่อร่วมอภิปราย
          </div>
        </SignedOut>
      </div>

      <div className="mt-8 space-y-5">
        {comments === null ? (
          <p className="text-sm text-on-surface-variant/75">ยังไม่เปิดระบบความคิดเห็นในขณะนี้</p>
        ) : comments.length === 0 ? (
          <p className="text-sm text-on-surface-variant/75">ยังไม่มีความคิดเห็น — เป็นคนแรกที่ร่วมอภิปราย</p>
        ) : (
          comments.map((c) => (
            <article key={c.id} className="archron-panel p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="font-serif text-sm text-on-surface">{c.author_name ?? "ผู้อ่าน"}</span>
                <span className="text-xs text-on-surface-variant/75">{fmt(c.created_at)}</span>
              </div>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-soft-ivory">
                {c.body}
              </p>
              {userId === c.clerk_user_id ? (
                <button
                  type="button"
                  onClick={() => handleDelete(c.id)}
                  className="mt-2 inline-flex items-center gap-1 text-xs text-on-surface-variant/75 transition-colors hover:text-danger focus-visible:ring-1 focus-visible:ring-danger/60 focus-visible:outline-none rounded px-1"
                >
                  <span className="material-symbols-outlined text-[14px]">delete</span>
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
