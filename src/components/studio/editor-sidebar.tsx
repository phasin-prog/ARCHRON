"use client";

import { MyContentSearch } from "@/components/studio/my-content-search";
import { RevisionPanel } from "@/components/studio/revision-panel";
import { InternalLinkSuggestionPanel } from "@/components/studio/internal-link-suggestion-panel";
import { PublishChecklist } from "@/components/studio/publish-checklist";
import type { ChecklistItem } from "@/lib/content/publish-validation";

type Props = {
  checklist: ChecklistItem[];
  deadLinks: string[];
  publishTried: boolean;
  entryId: string | null;
  reloadKey: number;
  onRestore: (draft: any) => void;
  userId: string | null;
  linkSuggestionText: string;
  onInsertLink: (term: string) => void;
};

export function EditorSidebar({
  checklist, deadLinks, publishTried, entryId, reloadKey,
  onRestore, userId, linkSuggestionText, onInsertLink,
}: Props) {
  return (
    <aside className="space-y-6 md:sticky md:top-20 md:self-start">
      <MyContentSearch userId={userId} />
      <div className="archron-panel p-5">
        <h3 className="font-serif text-base text-text-heading">คำแนะนำ</h3>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-text-secondary">
          <li>เขียนให้ชัด ไม่ลดทอนแนวคิดจนผิด</li>
          <li>เลี่ยงคำว่า ลึก/คม/ทรงพลัง ถ้าไม่อธิบายว่าอย่างไร</li>
          <li>แยกข้อเท็จจริง แหล่งที่มา และการตีความ</li>
          <li>{"autosave ทุก 2.5 วิ · กด \"บันทึก + เวอร์ชัน\" เพื่อเก็บ snapshot"}</li>
        </ul>
      </div>
      <PublishChecklist items={checklist} deadLinks={deadLinks} publishTried={publishTried} />
      <RevisionPanel entryId={entryId} reloadKey={reloadKey} onRestore={onRestore} />
      <InternalLinkSuggestionPanel text={linkSuggestionText} onInsert={onInsertLink} />
    </aside>
  );
}
