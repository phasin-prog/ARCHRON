# Comment System: Reply, Hide & Delete

> Design spec — 14 ก.ค. 2026

## Summary

เพิ่ม 3 ความสามารถให้ระบบความคิดเห็น: **ตอบกลับ** (reply แบบ nested ไม่จำกัดระดับ), **ซ่อน** (user self-hide), และปรับปรุง **ลบ** (confirm ก่อนลบ)

---

## 1. Database

### Migration

```sql
ALTER TABLE public.comments 
ADD COLUMN IF NOT EXISTS parent_id uuid REFERENCES public.comments(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS comments_parent_idx ON public.comments (parent_id);
```

- `parent_id = NULL` → root comment
- `ON DELETE CASCADE` → ลบ parent → ลูกลบตาม, ไม่เหลือ orphan

### RPC: `get_comment_subtree`

```sql
CREATE OR REPLACE FUNCTION get_comment_subtree(root_id uuid)
RETURNS SETOF comments AS $$
  WITH RECURSIVE tree AS (
    SELECT * FROM comments WHERE id = root_id AND status = 'visible'
    UNION ALL
    SELECT c.* FROM comments c JOIN tree t ON c.parent_id = t.id
    WHERE c.status = 'visible'
  )
  SELECT * FROM tree;
$$ LANGUAGE sql STABLE;
```

Recursive CTE ดึง subtree ทั้งหมด (เฉพาะ visible) — ใช้ตอนกด "ดูคำตอบ"

**RLS — ไม่ต้องแก้**: ฟังก์ชันเรียกผ่าน service-role (auth layer) เหมือน action อื่น

---

## 2. Data Layer

### `lib/content/community/comments-db.ts` — เพิ่ม

```typescript
// นับ replies ที่ visible ของ parent ใด ๆ
countReplies(supabase, parentId: string): Promise<number>

// ดึง subtree ผ่าน RPC
fetchSubtree(supabase, rootId: string): Promise<Comment[]>

// เปลี่ยน status เป็น 'hidden' (ตรวจ ownership ก่อน)
hideComment(supabase, id: string, userId: string): Promise<{ error }>
```

### `lib/content/community/comments-actions.ts` — เพิ่ม 3 server actions

```typescript
countRepliesAction(parentId: string): Promise<number>
fetchSubtreeAction(rootId: string): Promise<Comment[]>
hideCommentAction(id: string): Promise<{ error: string | null }>
```

- ทุก action ใช้ `getAuthedSupabase()` (service-role key) → ข้าม RLS, ตรวจ permission เอง
- `hideCommentAction` ตรวจ auth + ownership ก่อน update

### แก้ไขของเดิม

- `addCommentAction` — เพิ่ม parameter `parentId?: string` → insert เป็น reply
- `deleteCommentAction` — ไม่เปลี่ยน (cascade จัดการเอง)
- `listComments`, `listCommentsAction` — ไม่เปลี่ยน (ยัง return เฉพาะ root)

---

## 3. UI Components

### `CommentSection` — แก้จากของเดิม

| ส่วน | การเปลี่ยนแปลง |
|---|---|
| Root comments | render ผ่าน `CommentItem` component (recursive) |
| State | `expandedReplies: Set<string>` (parent ไหนโหลด subtree แล้ว) |
| State | `replyingTo: string \| null` (กำลังตอบกลับ comment ไหน — เปิด inline form ทีละอัน) |
| `handleHide(id)` | เรียก `hideCommentAction` → reload |
| `handleDelete(id)` | `window.confirm("ลบความคิดเห็นนี้ใช่หรือไม่? การลบจะลบคำตอบทั้งหมดด้วย")` → เรียก `deleteCommentAction` |

### `CommentItem` — recursive component ใหม่

```
CommentItem({ comment, depth, currentUserId, onRefresh })
```

**HTML structure (ต่อ 1 comment):**

```
<div className="comment-thread">
  <div className="flex gap-3">
    <!-- indent spacer: depth * 24px -->
    <div style="width: {depth * 24}px" />
    <div className="flex-1">
      <!-- border-left สำหรับ depth > 0 -->
      <article className={depth > 0 ? "border-l-2 border-border/30 pl-4" : ""}>
        <header>ชื่อ · เวลา</header>
        <p>{body}</p>
        <footer className="flex gap-3 text-xs">
          <button onClick={() => setReplyingTo(id)}>↩ ตอบกลับ</button>
          {isOwner && <button onClick={handleHide}>👁 ซ่อน</button>}
          {isOwner && <button onClick={handleDelete}>🗑 ลบ</button>}
        </footer>

        <!-- inline reply form (แสดงเมื่อ replyingTo === id) -->
        {isReplying && <ReplyForm parentId={id} onDone={refresh} />}

        <!-- replies -->
        {hasReplies && !isExpanded && (
          <button onClick={expandReplies}>📥 ดูคำตอบ ({replyCount})</button>
        )}
        {isExpanded && children.map(c => <CommentItem c depth+1 />)}
      </article>
    </div>
  </div>
</div>
```

**การ expand replies:**
1. กดปุ่ม → call `fetchSubtreeAction(parentId)`
2. ได้ subtree แบบ flat → group ตาม `parent_id` ใน client
3. render `CommentItem` recursive ด้วย depth+1

### `ReplyForm` — form เล็กสำหรับตอบกลับ

- textarea 2 rows (max 500 ตัวอักษร)
- ปุ่มส่ง + ยกเลิก
- อยู่ใต้ comment ที่กำลังตอบกลับ ใน `<article>` เดียวกัน

### Signed-out state — แก้ลิงก์

- `href="/th/login"` → ใช้ Clerk modal หรือชี้ไปที่ sign-in (link ปัจจุบันอาจเสีย)

---

## 4. Admin Page (`/studio/comments`)

แก้ไขเล็กน้อยให้แสดงว่า comment ไหนเป็น reply:

- ถ้า `parent_id != null` → แสดง badge "↩ ตอบกลับ" + ปุ่มลิงก์ไปยัง parent
- ฟังก์ชัน toggle/delete ทำงานเหมือนเดิม (admin override ทุกสิทธิ์)

---

## 5. Files to Change

| File | Action |
|---|---|
| `supabase/SYNC_ALL.sql` | ADD: `parent_id` column, index, RPC function |
| `lib/content/community/comments-db.ts` | ADD: `countReplies`, `fetchSubtree`, `hideComment` |
| `lib/content/community/comments-actions.ts` | ADD: `countRepliesAction`, `fetchSubtreeAction`, `hideCommentAction`; MODIFY: `addCommentAction` (+parentId param) |
| `components/reading/comment-section.tsx` | REWRITE: ใช้ `CommentItem` recursive, เพิ่ม hide/confirm-delete/reply state |
| `app/studio/comments/page.tsx` | MODIFY: แสดง reply indicator |

---

## 6. Edge Cases

| กรณี | พฤติกรรม |
|---|---|
| ลบ parent | `ON DELETE CASCADE` — ลูกลบทั้งหมด, ไม่มี orphan |
| ซ่อน parent | ลูกยัง visible แต่จะถูกกรองออกเพราะ parent ไม่อยู่ใน visible list (ลูกหลานที่ยัง visible แต่ parent hidden → ไม่แสดงใน UI, แอดมินยังเห็นใน moderation) |
| ตอบกลับตัวเอง | ได้ (ไม่มีข้อห้าม) |
| parent ถูกลบไปแล้ว (race condition) | `parent_id` FK → insert จะ fail (referential integrity) — UI reload ใหม่ |
| กด "ดูคำตอบ" แล้วมีคนเพิ่ม reply ใหม่ | จำนวนอาจเปลี่ยนหลัง fetch — refresh ได้ด้วยการ reload page |
| รายงาน abuse | ไม่มีใน scope นี้ (ใช้ช่องทางที่มีอยู่แล้ว/ติดต่อแอดมิน) |
