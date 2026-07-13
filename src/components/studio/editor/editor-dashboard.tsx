"use client";

export interface EntryItem {
  id: string; slug: string; title: string; status: string;
  content_type: string; published_at: string | null; author_name?: string | null;
}

export interface DraftItem {
  id: string; slug: string; title: string; status: string;
  updated_at: string | null;
}

const TYPE_LABELS: Record<string, string> = {
  all: "ทั้งหมด",
  article: "บทความ",
  concept: "แนวคิด",
  person: "นักคิด",
  book: "หนังสือ",
  school: "สำนักคิด",
  "reading-set": "ชุดการอ่าน",
  "source-note": "บันทึกแหล่งข้อมูล",
};

const STATUS_LABELS: Record<string, string> = {
  draft: "ฉบับร่าง",
  "needs-source-check": "รอตรวจแหล่งอ้างอิง",
  "ready-to-publish": "พร้อมเผยแพร่",
  published: "เผยแพร่แล้ว",
  archived: "เก็บถาวร",
};

export function EditorDashboard({ entries, drafts, loading, typeFilter, onNewDraft, onLoadEntry, onTypeFilterChange }: {
  entries: EntryItem[]; drafts: DraftItem[]; loading: boolean;
  typeFilter: string;
  onNewDraft: () => void;
  onLoadEntry: (slug: string) => void;
  onTypeFilterChange: (f: string) => void;
}) {
  const typeOptions = Object.keys(TYPE_LABELS);

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-lg font-semibold text-text-heading">งานของฉัน</h2>
        <button
          type="button"
          onClick={onNewDraft}
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover transition-colors"
        >
          + เขียนใหม่
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {typeOptions.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => onTypeFilterChange(t)}
            className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
              typeFilter === t
                ? "bg-accent text-white"
                : "border border-border text-text-body hover:bg-bg-elevated"
            }`}
          >
            {TYPE_LABELS[t] ?? t}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-text-secondary">กำลังโหลด...</p>
      ) : (
        <div className="space-y-6">
          {drafts.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wider">ฉบับร่าง</h3>
              <div className="space-y-1">
                {drafts.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => onLoadEntry(d.slug)}
                    className="w-full rounded-md border border-text-heading/10 bg-bg-card px-4 py-3 text-left hover:bg-bg-elevated transition-colors"
                  >
                    <div className="font-medium text-text-heading">{d.title || "(ไม่มีชื่อ)"}</div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-text-secondary">
                      <span>{d.slug}</span>
                      <span>·</span>
                      <span>{STATUS_LABELS[d.status] ?? d.status}</span>
                      {d.updated_at && (
                        <>
                          <span>·</span>
                          <span>{new Date(d.updated_at).toLocaleDateString("th-TH")}</span>
                        </>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {entries.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wider">บทความที่เผยแพร่</h3>
              <div className="space-y-1">
                {entries.map((e) => (
                  <button
                    key={e.id}
                    type="button"
                    onClick={() => onLoadEntry(e.slug)}
                    className="w-full rounded-md border border-text-heading/10 bg-bg-card px-4 py-3 text-left hover:bg-bg-elevated transition-colors"
                  >
                    <div className="font-medium text-text-heading">{e.title}</div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-text-secondary">
                      <span>{e.slug}</span>
                      <span>·</span>
                      <span>{TYPE_LABELS[e.content_type] ?? e.content_type}</span>
                      <span>·</span>
                      <span>{STATUS_LABELS[e.status] ?? e.status}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {drafts.length === 0 && entries.length === 0 && (
            <p className="text-sm text-text-secondary">ยังไม่มีเนื้อหา — คลิก &quot;+ เขียนใหม่&quot; เพื่อเริ่มต้น</p>
          )}
        </div>
      )}
    </section>
  );
}
