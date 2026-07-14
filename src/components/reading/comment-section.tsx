"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth, useUser, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import {
  listCommentsAction,
  addCommentAction,
  deleteCommentAction,
  countRepliesAction,
  fetchSubtreeAction,
  hideCommentAction,
} from "@/lib/content/community/comments-actions";
import type { Comment } from "@/lib/content/community/comments-db";

const FMT_OPTS: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
};

function fmt(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("th-TH", FMT_OPTS);
  } catch {
    return iso;
  }
}

function ReplyForm({
  parentId,
  onDone,
  onCancel,
}: {
  parentId: string;
  onDone: () => void;
  onCancel: () => void;
}) {
  const { userId } = useAuth();
  const { user } = useUser();
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const authorName =
    user?.fullName || user?.username || user?.primaryEmailAddress?.emailAddress || "ผู้อ่าน";

  async function handleSubmit() {
    if (!userId || !body.trim()) return;
    setBusy(true);
    setError(null);
    const { error: err } = await addCommentAction("", "", body, parentId);
    setBusy(false);
    if (err) {
      setError(`ส่งไม่สำเร็จ: ${err}`);
      return;
    }
    setBody("");
    onDone();
  }

  return (
    <div className="mt-3 border-l-2 border-accent/30 pl-3">
      <label className="sr-only" htmlFor={`reply-${parentId}`}>
        เขียนคำตอบ
      </label>
      <textarea
        id={`reply-${parentId}`}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={2}
        maxLength={500}
        placeholder="เขียนคำตอบ…"
        className="w-full resize-y rounded-lg border border-border/30 bg-bg-card/50 p-2 text-sm text-text-heading placeholder:text-text-secondary/50 focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:outline-none focus-visible:border-accent/50 transition-colors"
      />
      <div className="mt-2 flex items-center justify-between gap-2">
        <span className="text-xs text-text-secondary/65">ในนาม {authorName}</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg px-3 py-1.5 text-xs text-text-secondary/70 hover:text-text-body transition-colors"
          >
            ยกเลิก
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={busy || !body.trim()}
            className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-br from-accent to-accent px-3 py-1.5 text-xs font-semibold text-text-inverse transition-all hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none disabled:opacity-50 disabled:transform-none"
          >
            {busy ? "กำลังส่ง…" : "ตอบกลับ"}
          </button>
        </div>
      </div>
      {error ? <p className="mt-1 text-xs text-error">{error}</p> : null}
    </div>
  );
}

function CommentItem({
  comment,
  depth,
  currentUserId,
  onRefresh,
  replyingTo,
  onReply,
}: {
  comment: Comment;
  depth: number;
  currentUserId: string | null | undefined;
  onRefresh: () => void;
  replyingTo: string | null;
  onReply: (id: string | null) => void;
}) {
  const [children, setChildren] = useState<Comment[] | null>(null);
  const [replyCount, setReplyCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [hidden, setHidden] = useState(false);

  const isOwner = currentUserId === comment.clerk_user_id;
  const isExpanded = children !== null;
  const isReplying = replyingTo === comment.id;

  useEffect(() => {
    let active = true;
    (async () => {
      const n = await countRepliesAction(comment.id);
      if (active) setReplyCount(n);
    })();
    return () => {
      active = false;
    };
  }, [comment.id, children]);

  async function expandReplies() {
    setLoading(true);
    const subtree = await fetchSubtreeAction(comment.id);
    setChildren(subtree);
    setLoading(false);
  }

  async function handleHide() {
    const { error } = await hideCommentAction(comment.id);
    if (!error) {
      setHidden(true);
    }
  }

  async function handleDelete() {
    if (!window.confirm("ลบความคิดเห็นนี้ใช่หรือไม่? การลบจะลบคำตอบทั้งหมดด้วย")) return;
    const { error } = await deleteCommentAction(comment.id);
    if (!error) onRefresh();
  }

  if (hidden) {
    return (
      <div className="flex" style={{ paddingLeft: depth * 24 }}>
        <p className="text-xs text-text-secondary/50 italic py-2">
          ความคิดเห็นนี้ถูกซ่อนโดยเจ้าของ
        </p>
      </div>
    );
  }

  const thread = children
    ? children
        .filter((c) => c.parent_id === comment.id)
        .sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
        )
    : null;

  return (
    <div className="comment-thread">
      <div className="flex" style={{ paddingLeft: depth * 24 }}>
        <article
          className={`flex-1 ${
            depth > 0
              ? "border-l-2 border-border/30 pl-4"
              : ""
          }`}
        >
          <div className="archron-panel p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="font-serif text-sm text-text-heading">
                {comment.author_name ?? "ผู้อ่าน"}
              </span>
              <span className="text-xs text-text-secondary/75">
                {fmt(comment.created_at)}
              </span>
            </div>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-text-body">
              {comment.body}
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
              <button
                type="button"
                onClick={() => onReply(isReplying ? null : comment.id)}
                className="inline-flex items-center gap-1 text-text-secondary/75 transition-colors hover:text-accent focus-visible:ring-1 focus-visible:ring-accent/60 focus-visible:outline-none rounded px-1"
              >
                ↩ ตอบกลับ
              </button>
              {isOwner ? (
                <>
                  <button
                    type="button"
                    onClick={handleHide}
                    className="inline-flex items-center gap-1 text-text-secondary/75 transition-colors hover:text-amber-600 focus-visible:ring-1 focus-visible:ring-amber-600/60 focus-visible:outline-none rounded px-1"
                  >
                    ⊘ ซ่อน
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="inline-flex items-center gap-1 text-text-secondary/75 transition-colors hover:text-error focus-visible:ring-1 focus-visible:ring-error/60 focus-visible:outline-none rounded px-1"
                  >
                    🗑 ลบ
                  </button>
                </>
              ) : null}
            </div>

            {isReplying ? (
              <ReplyForm
                parentId={comment.id}
                onDone={() => {
                  onReply(null);
                  if (isExpanded) expandReplies();
                  else onRefresh();
                }}
                onCancel={() => onReply(null)}
              />
            ) : null}
          </div>

          {replyCount !== null && replyCount > 0 && !isExpanded ? (
            <button
              type="button"
              onClick={expandReplies}
              disabled={loading}
              className="mt-2 inline-flex items-center gap-1 text-xs text-accent/80 hover:text-accent transition-colors disabled:opacity-50 ml-2"
            >
              {loading ? "กำลังโหลด…" : `📥 ดูคำตอบ (${replyCount})`}
            </button>
          ) : null}

          {isExpanded && thread ? (
            <div className="mt-1">
              {thread.map((child) => (
                <CommentItem
                  key={child.id}
                  comment={child}
                  depth={depth + 1}
                  currentUserId={currentUserId}
                  onRefresh={onRefresh}
                  replyingTo={replyingTo}
                  onReply={onReply}
                />
              ))}
            </div>
          ) : null}
        </article>
      </div>
    </div>
  );
}

export function CommentSection({
  section,
  slug,
}: {
  section: string;
  slug: string;
}) {
  const { userId } = useAuth();
  const { user } = useUser();

  const [comments, setComments] = useState<Comment[] | null>(null);
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const load = useCallback(async () => {
    const data = await listCommentsAction(section, slug);
    setComments(data);
  }, [section, slug]);

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
    user?.fullName ||
    user?.username ||
    user?.primaryEmailAddress?.emailAddress ||
    "ผู้อ่าน";

  async function handleSubmit() {
    if (!userId || !body.trim()) return;
    setBusy(true);
    setError(null);
    const { error: err } = await addCommentAction(section, slug, body);
    setBusy(false);
    if (err) {
      setError(`ส่งความคิดเห็นไม่สำเร็จ: ${err}`);
      return;
    }
    setBody("");
    await load();
  }

  const count = comments?.length ?? 0;

  return (
    <section className="mt-16 border-t border-border/40 pt-10">
      <h2 className="font-serif text-2xl text-text-heading">
        ร่วมอภิปราย
        {count > 0 ? (
          <span className="ml-2 text-base text-text-secondary/50">
            ({count})
          </span>
        ) : null}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-text-secondary/70">
        แลกเปลี่ยนความเข้าใจอย่างมีเหตุผลและให้เกียรติกัน — โปรดอ้างอิงแหล่งที่มาเมื่อยกข้อเท็จจริง
      </p>

      <div className="mt-6">
        <SignedIn>
          <div className="archron-panel p-4">
            <label className="sr-only" htmlFor="comment-textarea">
              เขียนความคิดเห็นของคุณ
            </label>
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
              <span className="text-xs text-text-secondary/65">
                ในนาม {authorName}
              </span>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={busy || !body.trim()}
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-br from-accent to-accent px-5 py-2 text-sm font-semibold text-text-inverse transition-all hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none disabled:opacity-50 disabled:transform-none"
              >
                {busy ? (
                  <span
                    className="inline-flex items-center justify-center w-[1em] h-[1em] text-[18px] animate-spin"
                    aria-hidden="true"
                  >
                    ⟳
                  </span>
                ) : (
                  <span
                    className="inline-flex items-center justify-center w-[1em] h-[1em] text-[18px]"
                    aria-hidden="true"
                  >
                    ↗
                  </span>
                )}
                {busy ? "กำลังส่ง…" : "ส่งความคิดเห็น"}
              </button>
            </div>
            {error ? (
              <p id="comment-error" className="mt-2 text-sm text-error">
                {error}
              </p>
            ) : null}
          </div>
        </SignedIn>
        <SignedOut>
          <div className="rounded-md border border-accent/25 bg-accent/5 p-5 text-sm text-text-secondary/80">
            <SignInButton mode="modal">
              <button
                type="button"
                className="font-semibold text-accent hover:underline cursor-pointer"
              >
                เข้าสู่ระบบบัญชีนักอ่าน
              </button>
            </SignInButton>{" "}
            เพื่อร่วมอภิปราย
          </div>
        </SignedOut>
      </div>

      <div className="mt-8 space-y-2">
        {comments === null ? (
          <p className="text-sm text-text-secondary/75">
            ยังไม่เปิดระบบความคิดเห็นในขณะนี้
          </p>
        ) : comments.length === 0 ? (
          <p className="text-sm text-text-secondary/75">
            ยังไม่มีความคิดเห็น — เป็นคนแรกที่ร่วมอภิปราย
          </p>
        ) : (
          comments.map((c) => (
            <CommentItem
              key={c.id}
              comment={c}
              depth={0}
              currentUserId={userId}
              onRefresh={load}
              replyingTo={replyingTo}
              onReply={setReplyingTo}
            />
          ))
        )}
      </div>
    </section>
  );
}
