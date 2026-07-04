"use client";

import { useRouter } from "next/navigation";
import {
  contentTypeMeta,
} from "@/lib/content/cosmology";

type ContentTypeOption = {
  type: string;
  description: string;
  fields: string[];
  accent: string;
};

const CONTENT_TYPE_OPTIONS: ContentTypeOption[] = [
  {
    type: "article",
    description: "บทความยาวเชิงวิเคราะห์ ตีความ หรือเรียบเรียงเชิงลึก",
    fields: ["Title", "Framework", "Tags", "Markdown", "ภาพปก"],
    accent: "#CBA45A",
  },
  {
    type: "concept",
    description: "มโนทัศน์หรือแนวคิดหลักทางจิตวิทยาและปรัชญา",
    fields: ["Title", "Thai Title", "Aliases", "Framework", "Tags"],
    accent: "#6E93A8",
  },
  {
    type: "person",
    description: "นักคิด นักปราชญ์ หรือนักจิตวิทยา",
    fields: ["Title (ชื่อ)", "Thai Title", "Aliases", "Framework", "Tags"],
    accent: "#8AA395",
  },
  {
    type: "school",
    description: "สำนักคิดหรือประเพณีทางปัญญา",
    fields: ["Title", "Thai Title", "Aliases", "Tags", "คำอธิบาย"],
    accent: "#7FB08A",
  },
  {
    type: "book",
    description: "หนังสือหรืองานเขียนสำคัญ",
    fields: ["Title", "Aliases", "Framework", "Tags", "ผู้เขียน"],
    accent: "#C9A24A",
  },
  {
    type: "term",
    description: "คำศัพท์เฉพาะทาง",
    fields: ["Title", "Thai Title", "Aliases", "Tags", "นิยาม"],
    accent: "#9A948A",
  },
  {
    type: "symbol",
    description: "สัญลักษณ์และรหัสลับ",
    fields: ["Title", "Thai Title", "Aliases", "Tags", "ความหมาย"],
    accent: "#B9C2CE",
  },
];

export function ContentTypeSelector() {
  const router = useRouter();

  function handleSelect(type: string) {
    router.push(`/studio/editor?type=${type}`);
  }

  return (
    <div className="min-h-screen bg-midnight">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="mb-12 text-center">
          <span className="material-symbols-outlined mb-4 text-[48px] text-burnished-gold">
            edit_note
          </span>
          <h1 className="font-serif text-3xl text-ivory">สร้างเนื้อหาใหม่</h1>
          <p className="mt-3 text-sm text-on-surface-variant/70">
            เลือกประเภทเนื้อหาที่ต้องการเขียน ระบบจะแสดงฟอร์มที่เหมาะสมกับแต่ละประเภท
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {CONTENT_TYPE_OPTIONS.map((opt) => {
            const meta = contentTypeMeta(opt.type);
            return (
              <button
                key={opt.type}
                onClick={() => handleSelect(opt.type)}
                className="archron-card group flex flex-col items-start p-5 text-left"
                style={{ "--cosmology-accent": opt.accent } as React.CSSProperties}
              >
                <div className="mb-4 flex items-center gap-3">
                  <span
                    className="flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
                    style={{
                      backgroundColor: `color-mix(in srgb, ${opt.accent} 12%, transparent)`,
                      color: opt.accent,
                    }}
                  >
                    <span className="material-symbols-outlined text-[24px]">
                      {meta.icon}
                    </span>
                  </span>
                  <div>
                    <h2 className="font-serif text-lg font-semibold text-ivory group-hover:text-soft-gold transition-colors">
                      {meta.label}
                    </h2>
                    <p className="text-[11px] text-on-surface-variant/50">
                      {opt.type}
                    </p>
                  </div>
                </div>
                <p className="mb-4 text-sm leading-relaxed text-on-surface-variant/70">
                  {opt.description}
                </p>
                <div className="mt-auto flex flex-wrap gap-1.5">
                  {opt.fields.map((f) => (
                    <span
                      key={f}
                      className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                      style={{
                        backgroundColor: `color-mix(in srgb, ${opt.accent} 8%, transparent)`,
                        color: `color-mix(in srgb, ${opt.accent} 70%, var(--color-on-surface-variant))`,
                      }}
                    >
                      {f}
                    </span>
                  ))}
                </div>
                <span className="mt-4 flex items-center gap-1 text-xs font-semibold transition-all group-hover:gap-2"
                  style={{ color: opt.accent }}
                >
                  เลือก
                  <span className="material-symbols-outlined text-[14px]">
                    arrow_forward
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => router.push("/studio")}
            className="text-sm text-on-surface-variant/50 hover:text-ivory transition-colors"
          >
            ← กลับห้องเขียน
          </button>
        </div>
      </div>
    </div>
  );
}
