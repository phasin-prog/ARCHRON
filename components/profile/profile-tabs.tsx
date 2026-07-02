"use client";

import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";

// สลับแท็บบนหน้า /profile — client component เล็ก ๆ (state อยู่ฝั่ง client)
// รับ content ของแต่ละแท็บเป็น ReactNode (เรนเดอร์จาก server component แม่)
// showWork = แสดงแท็บ "งานของฉัน" เฉพาะนักเขียน
// ARIA tablist เต็มรูปแบบ: tab ↔ tabpanel โยงด้วย id/aria-controls/aria-labelledby
// + นำทางด้วยคีย์บอร์ด (←/→/Home/End) ตามแพตเทิร์น WAI-ARIA (roving tabindex)

export type ProfileTabKey = "reading" | "work";

export function ProfileTabs({
  reading,
  work,
  showWork,
}: {
  reading: ReactNode;
  work: ReactNode;
  showWork: boolean;
}) {
  const [active, setActive] = useState<ProfileTabKey>("reading");
  const tabRefs = useRef<Map<ProfileTabKey, HTMLButtonElement>>(new Map());

  const tabs: { key: ProfileTabKey; label: string; icon: string; show: boolean }[] = [
    { key: "reading", label: "การอ่านของฉัน", icon: "auto_stories", show: true },
    { key: "work", label: "งานของฉัน", icon: "edit_note", show: showWork },
  ];
  const visibleTabs = tabs.filter((t) => t.show);

  // ←/→ วนตามลำดับแท็บ · Home/End ไปหัว/ท้าย — เลือกแล้วย้ายโฟกัสตาม
  function onTablistKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const keys = visibleTabs.map((t) => t.key);
    const i = keys.indexOf(active);
    let next: ProfileTabKey | null = null;
    if (e.key === "ArrowRight") next = keys[(i + 1) % keys.length];
    else if (e.key === "ArrowLeft") next = keys[(i - 1 + keys.length) % keys.length];
    else if (e.key === "Home") next = keys[0];
    else if (e.key === "End") next = keys[keys.length - 1];
    if (next) {
      e.preventDefault();
      setActive(next);
      tabRefs.current.get(next)?.focus();
    }
  }

  return (
    <div>
      {/* แถบแท็บ */}
      <div
        role="tablist"
        aria-label="หมวดโปรไฟล์"
        className="flex flex-wrap gap-2 border-b border-slate-boundary/30"
        onKeyDown={onTablistKeyDown}
      >
        {visibleTabs.map((t) => {
          const isActive = active === t.key;
          return (
            <button
              key={t.key}
              ref={(el) => {
                if (el) tabRefs.current.set(t.key, el);
                else tabRefs.current.delete(t.key);
              }}
              type="button"
              role="tab"
              id={`profile-tab-${t.key}`}
              aria-selected={isActive}
              aria-controls={`profile-panel-${t.key}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActive(t.key)}
              className={`-mb-px inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? "border-burnished-gold text-soft-gold"
                  : "border-transparent text-muted hover:text-soft-ivory"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
                {t.icon}
              </span>
              {t.label}
            </button>
          );
        })}
      </div>

      {/* เนื้อหาแท็บ */}
      <div className="mt-8">
        <div
          role="tabpanel"
          id="profile-panel-reading"
          aria-labelledby="profile-tab-reading"
          hidden={active !== "reading"}
        >
          {reading}
        </div>
        {showWork ? (
          <div
            role="tabpanel"
            id="profile-panel-work"
            aria-labelledby="profile-tab-work"
            hidden={active !== "work"}
          >
            {work}
          </div>
        ) : null}
      </div>
    </div>
  );
}
