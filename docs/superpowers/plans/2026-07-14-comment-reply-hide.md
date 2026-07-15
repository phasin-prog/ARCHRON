# Comment Reply, Hide & Delete — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add nested reply (unlimited depth, lazy-loaded), user self-hide, and delete-confirm to the comment system.

**Architecture:** Add `parent_id` FK column to `comments` table, a PostgreSQL recursive CTE RPC function `get_comment_subtree`, new DB functions (`countReplies`, `fetchSubtree`, `hideComment`), new server actions, and rewrite `CommentSection` as a recursive component tree with `CommentItem` + `ReplyForm`.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Supabase (PostgreSQL), Clerk, Tailwind v4

## Global Constraints

- Thai-first UI — all labels in Thai, no EN route/locale switcher
- Design tokens: `--color-bg`, `--color-text-heading`, `--color-text-body`, `--color-text-secondary`, `--color-accent`, `--color-border`, `--color-error`
- Motion: `transform`/`opacity` only, respect `prefers-reduced-motion`
- Data flow: public reads via `createServerSupabase()` (anon), writes via `getAuthedSupabase()` (service-role with manual ownership check)
- No `any`, no ref `.current` during render
- Build/lint must pass (`npm run build && npm run lint`) before commit

---

### Task 1: Database Migration — `parent_id` + RPC

**Files:**
- Modify: `supabase/SYNC_ALL.sql`

**Interfaces:**
- Produces: `public.comments.parent_id` column (uuid, nullable, FK → comments.id, ON DELETE CASCADE), index `comments_parent_idx`, RPC `get_comment_subtree(root_id uuid)`

- [ ] **Step 1: Add `parent_id` column to comments table**

Open `supabase/SYNC_ALL.sql`, find the `comments` table creation block (around line 111-120). Add the `parent_id` column inside the `CREATE TABLE IF NOT EXISTS` statement:

```sql
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  section text not null,
  slug text not null,
  clerk_user_id text not null,
  author_name text,
  body text not null,
  status text not null default 'visible',
  parent_id uuid references public.comments(id) on delete cascade,
  created_at timestamptz not null default now()
);
```

- [ ] **Step 2: Add `parent_id` index to SYNC_ALL.sql**

Add the index after existing comment indexes (after line 207):

```sql
create index if not exists comments_parent_idx on public.comments (parent_id);
```

- [ ] **Step 3: Add `get_comment_subtree` RPC function**

Add the function at the end of the file (before the grants section):

```sql
-- =========================================================
-- RPC: get_comment_subtree — recursive CTE for reply threads
-- =========================================================
create or replace function get_comment_subtree(root_id uuid)
returns setof public.comments as $$
  with recursive tree as (
    select * from public.comments where id = root_id and status = 'visible'
    union all
    select c.* from public.comments c
    join tree t on c.parent_id = t.id
    where c.status = 'visible'
  )
  select * from tree;
$$ language sql stable;
```

- [ ] **Step 4: Apply migration to Supabase**

```bash
# Run via Supabase CLI or SQL editor — the ALTER is idempotent (if not exists)
# If using Supabase CLI:
npx supabase db push
```

Or execute manually in Supabase SQL Editor:

```sql
ALTER TABLE public.comments ADD COLUMN IF NOT EXISTS parent_id uuid REFERENCES public.comments(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS comments_parent_idx ON public.comments (parent_id);
-- Then run the RPC function from Step 3
```

- [ ] **Step 5: Commit**

```bash
git add supabase/SYNC_ALL.sql
git commit -m "feat: add parent_id column, index, and get_comment_subtree RPC for nested comments"
```

---

### Task 2: Data Layer — `comments-db.ts`

**Files:**
- Modify: `src/lib/content/community/comments-db.ts`

**Interfaces:**
- Consumes: `public.comments` table with new `parent_id` column, `get_comment_subtree` RPC
- Produces: `Comment` type updated with `parent_id`, `countReplies(supabase, parentId): Promise<number>`, `fetchSubtree(supabase, rootId): Promise<Comment[]>`, `hideComment(supabase, id, userId): Promise<{ error }>`, `addComment` updated to accept `parentId`, `listComments` updated to filter `parent_id IS NULL`

- [ ] **Step 1: Update `Comment` type to include `parent_id`**

Change the `Comment` type (line 5-13):

```typescript
export type Comment = {
  id: string;
  section: string;
  slug: string;
  clerk_user_id: string;
  author_name: string | null;
  body: string;
  status?: string;
  parent_id: string | null;
  created_at: string;
};
```

- [ ] **Step 2: Update `CommentInput` type to include `parentId`**

Change the `CommentInput` type (line 15-21):

```typescript
export type CommentInput = {
  section: string;
  slug: string;
  userId: string;
  authorName: string | null;
  body: string;
  parentId?: string | null;
};
```

- [ ] **Step 3: Update `listComments` to filter root comments only**

Add `.is("parent_id", null)` to the query in `listComments` (inside the `.select(...)` chain):

```typescript
export async function listComments(
  supabase: SupabaseClient,
  section: string,
  slug: string,
): Promise<Comment[] | null> {
  const { data, error } = await supabase
    .from("comments")
    .select("id, section, slug, clerk_user_id, author_name, body, parent_id, created_at")
    .eq("section", section)
    .eq("slug", slug)
    .eq("status", "visible")
    .is("parent_id", null)
    .order("created_at", { ascending: true });
  if (error) return null;
  return (data as Comment[]) ?? [];
}
```

- [ ] **Step 4: Update `addComment` to accept `parentId`**

Change the `addComment` function to include `parent_id` in the insert:

```typescript
export async function addComment(
  supabase: SupabaseClient,
  input: CommentInput,
): Promise<{ error: { message: string } | null }> {
  const body = input.body.trim();
  if (!body) return { error: { message: "ยังไม่ได้พิมพ์ข้อความ" } };
  const { error } = await supabase.from("comments").insert({
    id: randomUUID(),
    section: input.section,
    slug: input.slug,
    clerk_user_id: input.userId,
    author_name: input.authorName?.trim() || null,
    body,
    parent_id: input.parentId || null,
  });
  return { error: error ? { message: error.message } : null };
}
```

- [ ] **Step 5: Add `countReplies` function**

Add after the `deleteComment` function:

```typescript
export async function countReplies(
  supabase: SupabaseClient,
  parentId: string,
): Promise<number> {
  const { count, error } = await supabase
    .from("comments")
    .select("id", { count: "exact", head: true })
    .eq("parent_id", parentId)
    .eq("status", "visible");
  if (error) return 0;
  return count ?? 0;
}
```

- [ ] **Step 6: Add `fetchSubtree` function**

```typescript
export async function fetchSubtree(
  supabase: SupabaseClient,
  rootId: string,
): Promise<Comment[]> {
  const { data, error } = await supabase.rpc("get_comment_subtree", {
    root_id: rootId,
  });
  if (error) return [];
  return ((data as Comment[]) ?? []).filter((c) => c.id !== rootId);
}
```

- [ ] **Step 7: Add `hideComment` function**

```typescript
export async function hideComment(
  supabase: SupabaseClient,
  id: string,
  userId: string,
): Promise<{ error: { message: string } | null }> {
  const { data: row } = await supabase
    .from("comments")
    .select("clerk_user_id")
    .eq("id", id)
    .maybeSingle();
  const owner = (row as { clerk_user_id: string } | null)?.clerk_user_id;
  if (owner !== userId) {
    return { error: { message: "ซ่อนได้เฉพาะความคิดเห็นของตนเอง" } };
  }
  const { error } = await supabase
    .from("comments")
    .update({ status: "hidden" })
    .eq("id", id);
  return { error: error ? { message: error.message } : null };
}
```

- [ ] **Step 8: Run lint check**

```bash
npm run lint
```

Expected: clean (no new errors).

- [ ] **Step 9: Commit**

```bash
git add src/lib/content/community/comments-db.ts
git commit -m "feat: add countReplies, fetchSubtree, hideComment, parent_id support to comments-db"
```

---

### Task 3: Server Actions — `comments-actions.ts`

**Files:**
- Modify: `src/lib/content/community/comments-actions.ts`

**Interfaces:**
- Consumes: `countReplies`, `fetchSubtree`, `hideComment` from `comments-db`, `getAuthedSupabase` from `server-auth`
- Produces: `countRepliesAction(parentId): Promise<number>`, `fetchSubtreeAction(rootId): Promise<Comment[]>`, `hideCommentAction(id): Promise<{ error }>`
- Modifies: `addCommentAction(section, slug, body, parentId?)` — accepts optional `parentId`

- [ ] **Step 1: Add `countRepliesAction`**

Add after the existing `deleteCommentAction` (before the closing of the file):

```typescript
export async function countRepliesAction(parentId: string): Promise<number> {
  const supabase = createServerSupabase();
  const { countReplies } = await import("@/lib/content/community/comments-db");
  return countReplies(supabase, parentId);
}
```

- [ ] **Step 2: Add `fetchSubtreeAction`**

```typescript
export async function fetchSubtreeAction(rootId: string): Promise<Comment[]> {
  const { supabase } = await getAuthedSupabase();
  const { fetchSubtree } = await import("@/lib/content/community/comments-db");
  return fetchSubtree(supabase, rootId);
}
```

- [ ] **Step 3: Add `hideCommentAction`**

```typescript
export async function hideCommentAction(id: string): Promise<{ error: string | null }> {
  const { userId } = await auth();
  if (!userId) return { error: "ยังไม่ได้เข้าสู่ระบบ" };

  const { supabase } = await getAuthedSupabase();
  const { hideComment } = await import("@/lib/content/community/comments-db");
  const { error } = await hideComment(supabase, id, userId);
  return { error: error?.message ?? null };
}
```

- [ ] **Step 4: Modify `addCommentAction` to accept optional `parentId` and auto-resolve section/slug**

When `parentId` is provided without `section`/`slug`, resolve them from the parent comment:

```typescript
export async function addCommentAction(
  section: string,
  slug: string,
  body: string,
  parentId?: string | null,
): Promise<{ error: string | null }> {
  const { userId } = await auth();
  if (!userId) return { error: "ยังไม่ได้เข้าสู่ระบบ" };

  const { userId: uid, supabase } = await getAuthedSupabase();

  // Auto-resolve section/slug from parent when replying
  let resolvedSection = section;
  let resolvedSlug = slug;
  if (parentId && (!section || !slug)) {
    const { data: parentRow } = await supabase
      .from("comments")
      .select("section, slug")
      .eq("id", parentId)
      .maybeSingle();
    const parent = parentRow as { section: string; slug: string } | null;
    if (parent) {
      resolvedSection = parent.section;
      resolvedSlug = parent.slug;
    }
  }

  const { clerkClient } = await import("@clerk/nextjs/server");
  const client = await clerkClient();
  const user = await client.users.getUser(uid);
  const authorName =
    user.fullName || user.username || user.primaryEmailAddress?.emailAddress || "ผู้อ่าน";

  const { error } = await addComment(supabase, {
    section: resolvedSection,
    slug: resolvedSlug,
    userId: uid,
    authorName,
    body,
    parentId: parentId || null,
  });
  return { error: error?.message ?? null };
}
```

- [ ] **Step 5: Run lint check**

```bash
npm run lint
```

Expected: clean.

- [ ] **Step 6: Commit**

```bash
git add src/lib/content/community/comments-actions.ts
git commit -m "feat: add countRepliesAction, fetchSubtreeAction, hideCommentAction, parentId support"
```

---

### Task 4: UI — Rewrite `CommentSection` with Reply, Hide, Recursive Tree

**Files:**
- Modify: `src/components/reading/comment-section.tsx`

**Interfaces:**
- Consumes: `Comment` type from `comments-db`, `countRepliesAction`, `fetchSubtreeAction`, `hideCommentAction`, `addCommentAction` (with parentId), `deleteCommentAction` from `comments-actions`
- Produces: `CommentSection({ section, slug })` — full comment UI with reply, hide, and confirm-delete

- [ ] **Step 1: Rewrite `comment-section.tsx` — full file**

Replace the entire content of `src/components/reading/comment-section.tsx`:

```tsx
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
    const roots = subtree.filter((c) => c.parent_id === comment.id);
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
        <p className="text-xs text-text-secondary/50 italic py-2">ความคิดเห็นนี้ถูกซ่อนโดยเจ้าของ</p>
      </div>
    );
  }

  return (
    <div className="comment-thread">
      <div className="flex" style={{ paddingLeft: depth * 24 }}>
        <article
          className={`flex-1 ${
            depth > 0 ? "border-l-2 border-border/30 pl-4" : ""
          }`}
        >
          <div className="archron-panel p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="font-serif text-sm text-text-heading">
                {comment.author_name ?? "ผู้อ่าน"}
              </span>
              <span className="text-xs text-text-secondary/75">{fmt(comment.created_at)}</span>
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

          {/* Replies */}
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

          {isExpanded && children ? (
            <div className="mt-1">
              {children
                .filter((c) => c.parent_id === comment.id)
                .map((child) => (
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

export function CommentSection({ section, slug }: { section: string; slug: string }) {
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
    user?.fullName || user?.username || user?.primaryEmailAddress?.emailAddress || "ผู้อ่าน";

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
          <span className="ml-2 text-base text-text-secondary/50">({count})</span>
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
              <span className="text-xs text-text-secondary/65">ในนาม {authorName}</span>
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
          <p className="text-sm text-text-secondary/75">ยังไม่เปิดระบบความคิดเห็นในขณะนี้</p>
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
```

- [ ] **Step 2: Run lint check**

```bash
npm run lint
```

Expected: clean.

- [ ] **Step 3: Run build check**

```bash
npm run build
```

Expected: builds successfully with no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/reading/comment-section.tsx
git commit -m "feat: rewrite CommentSection with recursive reply, hide, confirm-delete"
```

---

### Task 5: Admin Page — Show Reply Indicator

**Files:**
- Modify: `src/app/studio/comments/page.tsx`

**Interfaces:**
- Consumes: `ModComment` type (which now includes `parent_id` from DB)
- Produces: Updated admin comment list with reply badge

- [ ] **Step 1: Update `ModComment` type to include `parent_id`**

In `src/features/studio/actions/comments-actions.ts` (line 7-16):

```typescript
export type ModComment = {
  id: string;
  section: string;
  slug: string;
  clerk_user_id: string;
  author_name: string | null;
  body: string;
  status: string;
  parent_id: string | null;
  created_at: string;
};
```

- [ ] **Step 2: Update `listAllCommentsAction` select to include `parent_id`**

In the same file, update the `.select(...)` in `listAllCommentsAction`:

```typescript
.select("id, section, slug, clerk_user_id, author_name, body, status, parent_id, created_at")
```

- [ ] **Step 3: Add reply indicator in admin page**

In `src/app/studio/comments/page.tsx`, inside the comment article (after the status badge, before the body), add a reply badge:

```tsx
{c.parent_id ? (
  <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-medium text-accent">
    ↩ ตอบกลับ
  </span>
) : null}
```

Add it right after the status badge span (after line 128 in the original):

```tsx
<span
  className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
    hidden ? "bg-error/15 text-error" : "bg-success/15 text-success"
  }`}
>
  {hidden ? "ซ่อนอยู่" : "แสดงอยู่"}
</span>
{c.parent_id ? (
  <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-medium text-accent">
    ↩ ตอบกลับ
  </span>
) : null}
```

- [ ] **Step 4: Run lint check**

```bash
npm run lint
```

Expected: clean.

- [ ] **Step 5: Run build check**

```bash
npm run build
```

Expected: builds successfully.

- [ ] **Step 6: Commit**

```bash
git add src/features/studio/actions/comments-actions.ts src/app/studio/comments/page.tsx
git commit -m "feat: add reply indicator badge to admin comment moderation"
```

---

### Verification

After all tasks:

- [ ] Run full lint: `npm run lint`
- [ ] Run full build: `npm run build`
- [ ] Run tests: `npx vitest run`

All must pass green.

---

### Rollback Plan

To revert, drop the column and function:

```sql
DROP FUNCTION IF EXISTS get_comment_subtree(uuid);
ALTER TABLE public.comments DROP COLUMN IF EXISTS parent_id;
```

Revert the code changes in comments-db.ts, comments-actions.ts, comment-section.tsx, and studio comments page to prior commits.
