"use client";

import { useRouter } from "next/navigation";
import {
  contentTypeMeta,
} from "@/lib/content/core/cosmology";
import { EditorIcon } from "@/components/studio/editor-icon";

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
    accent: "var(--color-premium)",
  },
  {
    type: "concept",
    description: "มโนทัศน์หรือแนวคิดหลักทางจิตวิทยาและปรัชญา",
    fields: ["Title", "Thai Title", "Aliases", "Framework", "Tags"],
    accent: "var(--color-concept)",
  },
  {
    type: "person",
    description: "นักคิด นักปราชญ์ หรือนักจิตวิทยา",
    fields: ["Title (ชื่อ)", "Thai Title", "Aliases", "Framework", "Tags"],
    accent: "var(--color-quote)",
  },
  {
    type: "school",
    description: "สำนักคิดหรือประเพณีทางปัญญา",
    fields: ["Title", "Thai Title", "Aliases", "Tags", "คำอธิบาย"],
    accent: "var(--color-thinker)",
  },
  {
    type: "book",
    description: "หนังสือหรืองานเขียนสำคัญ",
    fields: ["Title", "Aliases", "Framework", "Tags", "ผู้เขียน"],
    accent: "var(--color-book)",
  },
  {
    type: "term",
    description: "คำศัพท์เฉพาะทาง",
    fields: ["Title", "Thai Title", "Aliases", "Tags", "นิยาม"],
    accent: "var(--color-text-secondary)",
  },
  {
    type: "symbol",
    description: "สัญลักษณ์และรหัสลับ",
    fields: ["Title", "Thai Title", "Aliases", "Tags", "ความหมาย"],
    accent: "var(--color-symbol)",
  },
];

export function ContentTypeSelector() {
  const router = useRouter();

  function handleSelect(type: string) {
    router.push(`/studio/editor?type=${type}`);
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="mb-12 text-center">
          <EditorIcon name="edit_note" className="mb-4 h-12 w-12 text-accent" />
          <h1 className="font-serif text-3xl text-text-heading">สร้างเนื้อหาใหม่</h1>
          <p className="mt-3 text-sm text-text-secondary">
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
                    <EditorIcon name={meta.icon} className="h-6 w-6" />
                  </span>
                  <div>
                    <h2 className="font-serif text-lg font-semibold text-text-heading group-hover:text-accent transition-colors">
                      {meta.label}
                    </h2>
                    <p className="text-[11px] text-text-secondary">
                      {opt.type}
                    </p>
                  </div>
                </div>
                <p className="mb-4 text-sm leading-relaxed text-text-secondary">
                  {opt.description}
                </p>
                <div className="mt-auto flex flex-wrap gap-1.5">
                  {opt.fields.map((f) => (
                    <span
                      key={f}
                      className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                      style={{
                        backgroundColor: `color-mix(in srgb, ${opt.accent} 8%, transparent)`,
                        color: `color-mix(in srgb, ${opt.accent} 70%, var(--color-text-secondary))`,
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
                  <EditorIcon name="arrow_right" className="h-[1em] w-[1em]" />
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => router.push("/studio")}
            className="text-sm text-text-secondary hover:text-text-heading transition-colors"
          >
            ← กลับห้องเขียน
          </button>
        </div>
      </div>
    </div>
  );
}
