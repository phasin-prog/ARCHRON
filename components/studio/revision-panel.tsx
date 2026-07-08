"use client";

import { useEffect, useState } from "react";
import { loadRevisionsAction } from "@/app/studio/editor/actions";
import type { EditorDraft } from "@/lib/content/publish-validation";

type RevisionRow = {
  id: string;
  created_at: string;
  note: string | null;
  snapshot: EditorDraft;
};

type DiffLine = {
  type: "added" | "removed" | "unchanged";
  content: string;
};

function computeDiff(oldText: string, newText: string): DiffLine[] {
  const oldLines = oldText.split("\n");
  const newLines = newText.split("\n");
  const diff: DiffLine[] = [];

  const maxLen = Math.max(oldLines.length, newLines.length);

  for (let i = 0; i < maxLen; i++) {
    const oldLine = oldLines[i];
    const newLine = newLines[i];

    if (oldLine === undefined) {
      diff.push({ type: "added", content: newLine });
    } else if (newLine === undefined) {
      diff.push({ type: "removed", content: oldLine });
    } else if (oldLine === newLine) {
      diff.push({ type: "unchanged", content: oldLine });
    } else {
      diff.push({ type: "removed", content: oldLine });
      diff.push({ type: "added", content: newLine });
    }
  }

  return diff;
}

export function RevisionPanel({
  entryId,
  reloadKey,
  onRestore,
}: {
  entryId: string | null;
  reloadKey: number;
  onRestore: (draft: EditorDraft) => void;
}) {
  const [revs, setRevs] = useState<RevisionRow[]>([]);
  const [selectedRevision, setSelectedRevision] = useState<RevisionRow | null>(null);
  const [compareRevision, setCompareRevision] = useState<RevisionRow | null>(null);
  const [showDiff, setShowDiff] = useState(false);
  const [confirmRestore, setConfirmRestore] = useState<RevisionRow | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!entryId) {
        if (active) setRevs([]);
        return;
      }
      const { revisions } = await loadRevisionsAction(entryId);
      if (active) setRevs((revisions as RevisionRow[]) ?? []);
    })();
    return () => {
      active = false;
    };
  }, [entryId, reloadKey]);

  const handleRestore = (rev: RevisionRow) => {
    setConfirmRestore(rev);
  };

  const confirmRestoreAction = () => {
    if (confirmRestore) {
      onRestore(confirmRestore.snapshot);
      setConfirmRestore(null);
    }
  };

  const handleCompare = (rev: RevisionRow) => {
    if (selectedRevision) {
      setCompareRevision(rev);
      setShowDiff(true);
    } else {
      setSelectedRevision(rev);
    }
  };

  const diff =
    showDiff && selectedRevision && compareRevision
      ? computeDiff(
          selectedRevision.snapshot.bodyMarkdown,
          compareRevision.snapshot.bodyMarkdown,
        )
      : [];

  if (!entryId) {
    return (
      <div className="rounded-md border border-text-heading/10 bg-surface-1/40 p-5">
        <h3 className="font-serif text-base text-text-heading">ประวัติเวอร์ชัน</h3>
        <p className="mt-3 text-sm text-text-secondary">บันทึกแบบร่างครั้งแรกเพื่อเริ่มเก็บเวอร์ชัน</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-text-heading/10 bg-surface-1/40 p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-base text-text-heading">ประวัติเวอร์ชัน</h3>
        {selectedRevision && (
          <button
            onClick={() => {
              setSelectedRevision(null);
              setCompareRevision(null);
              setShowDiff(false);
            }}
            className="text-xs text-text-secondary hover:text-text-heading"
          >
            ล้างการเลือก
          </button>
        )}
      </div>

      {revs.length === 0 ? (
        <p className="mt-3 text-sm text-text-secondary">ยังไม่มีเวอร์ชันที่บันทึก</p>
      ) : (
        <>
          <ul className="mt-3 space-y-2 text-sm">
            {revs.map((r) => (
              <li
                key={r.id}
                className={`flex items-center justify-between gap-2 rounded-md p-2 transition-colors ${
                  selectedRevision?.id === r.id
                    ? "bg-accent/10"
                    : "hover:bg-bg-card"
                }`}
              >
                <div className="flex-1">
                  <span className="text-text-body">
                    {new Date(r.created_at).toLocaleString("th-TH")}
                  </span>
                  {r.note && <span className="text-text-secondary"> · {r.note}</span>}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleCompare(r)}
                    className="rounded px-2 py-0.5 text-xs text-text-secondary transition-colors hover:bg-bg-card hover:text-text-heading"
                  >
                    {selectedRevision?.id === r.id ? "เลือกเปรียบเทียบ" : "เลือก"}
                  </button>
                  <button
                    onClick={() => handleRestore(r)}
                    className="rounded px-2 py-0.5 text-xs text-accent transition-colors hover:bg-accent/10"
                  >
                    กู้คืน
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {/* Diff View */}
          {showDiff && diff.length > 0 && (
            <div className="mt-4 rounded-md border border-border bg-bg-card p-3">
              <div className="mb-2 flex items-center justify-between text-xs text-text-secondary">
                <span>
                  เปรียบเทียบ: {new Date(selectedRevision!.created_at).toLocaleString("th-TH")} →{" "}
                  {new Date(compareRevision!.created_at).toLocaleString("th-TH")}
                </span>
                <button
                  onClick={() => setShowDiff(false)}
                  className="text-text-secondary hover:text-text-heading"
                >
                  ปิด
                </button>
              </div>
              <div className="max-h-64 overflow-y-auto font-mono text-xs">
                {diff.map((line, i) => (
                  <div
                    key={i}
                    className={`py-0.5 ${
                      line.type === "added"
                        ? "bg-green-500/10 text-green-400"
                        : line.type === "removed"
                          ? "bg-red-500/10 text-red-400"
                          : "text-text-secondary"
                    }`}
                  >
                    <span className="mr-2 inline-block w-4 text-center">
                      {line.type === "added" ? "+" : line.type === "removed" ? "-" : " "}
                    </span>
                    {line.content}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Confirm Restore Modal */}
      {confirmRestore && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-md rounded-xl border border-border bg-bg-card p-6 shadow-2xl">
            <h4 className="font-serif text-lg font-semibold text-text-heading">ยืนยันการกู้คืน</h4>
            <p className="mt-2 text-sm text-text-secondary">
              จะกู้คืนไปยังเวอร์ชัน{" "}
              {new Date(confirmRestore.created_at).toLocaleString("th-TH")}
              {confirmRestore.note && ` (${confirmRestore.note})`}
              ? การเปลี่ยนแปลงปัจจุบันจะหายไป
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setConfirmRestore(null)}
                className="rounded-lg px-4 py-2 text-sm text-text-secondary transition-colors hover:bg-bg-card hover:text-text-heading"
              >
                ยกเลิก
              </button>
              <button
                onClick={confirmRestoreAction}
                className="rounded-lg bg-accent/20 px-4 py-2 text-sm font-medium text-accent transition-colors hover:bg-accent/30"
              >
                กู้คืน
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
