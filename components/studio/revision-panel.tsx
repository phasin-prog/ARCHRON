"use client";

import { useEffect, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getRevisions } from "@/lib/content/entries-db";
import type { EditorDraft } from "@/lib/content/publish-validation";

type RevisionRow = {
  id: string;
  created_at: string;
  note: string | null;
  snapshot: EditorDraft;
};

export function RevisionPanel({
  supabase,
  entryId,
  reloadKey,
  onRestore,
}: {
  supabase: SupabaseClient;
  entryId: string | null;
  reloadKey: number;
  onRestore: (draft: EditorDraft) => void;
}) {
  const [revs, setRevs] = useState<RevisionRow[]>([]);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!entryId) {
        if (active) setRevs([]);
        return;
      }
      const data = await getRevisions(supabase, entryId);
      if (active) setRevs((data as RevisionRow[]) ?? []);
    })();
    return () => {
      active = false;
    };
  }, [supabase, entryId, reloadKey]);

  if (!entryId) {
    return (
      <div className="rounded-md border border-ink/10 bg-surface-1/40 p-5">
        <h3 className="font-serif text-base text-ivory">ประวัติเวอร์ชัน</h3>
        <p className="mt-3 text-sm text-muted">บันทึกแบบร่างครั้งแรกเพื่อเริ่มเก็บเวอร์ชัน</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-ink/10 bg-surface-1/40 p-5">
      <h3 className="font-serif text-base text-ivory">ประวัติเวอร์ชัน</h3>
      {revs.length === 0 ? (
        <p className="mt-3 text-sm text-muted">ยังไม่มีเวอร์ชันที่บันทึก</p>
      ) : (
        <ul className="mt-3 space-y-2 text-sm">
          {revs.map((r) => (
            <li key={r.id} className="flex items-center justify-between gap-2">
              <span className="text-soft-ivory">
                {new Date(r.created_at).toLocaleString("th-TH")}
                {r.note ? <span className="text-muted"> · {r.note}</span> : null}
              </span>
              <button
                type="button"
                onClick={() => onRestore(r.snapshot)}
                className="rounded border border-ink/20 px-2 py-1 text-xs text-soft-ivory hover:border-antique-gold"
              >
                กู้คืน
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
