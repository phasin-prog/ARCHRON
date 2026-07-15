"use client";

import { CheckIcon, ClockIcon } from "@/components/icons";
import type { ChecklistItem } from "@/lib/content/publishing/publish-validation";

type Props = {
  items: ChecklistItem[];
  deadLinks: string[];
  publishTried: boolean;
};

export function PublishChecklist({ items, deadLinks, publishTried }: Props) {
  const ready = items.every((i) => i.ok);

  return (
    <div className="archron-panel p-5">
      <h3 className="font-serif text-base text-text-heading">Publish Checklist</h3>
      <ul className="mt-3 space-y-2 text-sm">
        {items.map((c) => (
          <li key={c.label} className={`flex items-center gap-2 ${c.ok ? "text-text-body" : "text-text-secondary"}`}>
            <span className={c.ok ? "text-success" : "text-error"}>
              {c.ok ? <CheckIcon className="h-3.5 w-3.5" /> : <ClockIcon className="h-3.5 w-3.5" />}
            </span>
            {c.label}
          </li>
        ))}
      </ul>
      {deadLinks.length > 0 && (
        <p className="mt-3 text-xs text-error" role="alert">
          ลิงก์เสีย {deadLinks.length}: {deadLinks.join(", ")}
        </p>
      )}
      {publishTried && (
        <p className={`mt-4 text-sm ${ready && deadLinks.length === 0 ? "text-success" : "text-error"}`}>
          {ready && deadLinks.length === 0
            ? "พร้อมเผยแพร่ — กดปุ่ม \"เผยแพร่\" ด้านบน"
            : "ยังเผยแพร่ไม่ได้ — ทำรายการที่ยังไม่ผ่าน / แก้ลิงก์เสียให้ครบ"}
        </p>
      )}
    </div>
  );
}
