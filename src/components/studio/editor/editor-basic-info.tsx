"use client";

import type { EditorDraft } from "@/lib/content/publishing/publish-validation";
import { slugify } from "@/lib/content/publishing/publish-validation";

export function EditorBasicInfo({ draft, updateField }: {
  draft: EditorDraft; updateField: (field: keyof EditorDraft, value: unknown) => void;
}) {
  return (
    <section className="space-y-4">
      <h2 className="font-serif text-lg font-semibold text-text-heading">ข้อมูลพื้นฐาน</h2>
      <div>
        <label className="block text-sm font-medium text-text-body">Title</label>
        <input type="text" value={draft.title} onChange={(e) => updateField("title", e.target.value)}
          className="mt-1 w-full rounded-md border border-text-heading/15 px-3 py-2 bg-bg-card text-text-heading outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/30"
          placeholder="ชื่อบทความ / แนวคิด..." />
      </div>
      <div>
        <label className="block text-sm font-medium text-text-body">Slug</label>
        <input type="text" value={draft.slug} onChange={(e) => updateField("slug", slugify(e.target.value))}
          className="mt-1 w-full rounded-md border border-text-heading/15 px-3 py-2 bg-bg-card text-text-heading outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/30"
          placeholder="article-slug" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-body">Content Type</label>
          <select value={draft.contentType} onChange={(e) => updateField("contentType", e.target.value)}
            className="mt-1 w-full rounded-md border border-text-heading/15 px-3 py-2 bg-bg-card text-text-heading outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/30">
            <option value="article">บทความ</option>
            <option value="concept">แนวคิด</option>
            <option value="person">นักคิด</option>
            <option value="book">หนังสือ</option>
            <option value="school">สำนักคิด</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-body">Status</label>
          <select value={draft.status} onChange={(e) => updateField("status", e.target.value)}
            className="mt-1 w-full rounded-md border border-text-heading/15 px-3 py-2 bg-bg-card text-text-heading outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/30">
            <option value="draft">ฉบับร่าง</option>
            <option value="needs-source-check">รอตรวจแหล่งอ้างอิง</option>
            <option value="ready-to-publish">พร้อมเผยแพร่</option>
            <option value="published">เผยแพร่แล้ว</option>
          </select>
        </div>
      </div>
    </section>
  );
}
