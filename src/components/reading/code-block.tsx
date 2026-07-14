"use client";

import { useState, type ReactNode } from "react";
import { CheckIcon, CopyIcon } from "@/components/icons";

// แปลง className จาก react-markdown เช่น "language-typescript" ให้เป็นชื่อแสดงผลบน Badge
export function getLanguageBadge(className?: string): string {
  if (!className) return "CODE";
  const match = className.match(/language-(\w+)/);
  if (!match) return "CODE";
  const lang = match[1].toLowerCase();
  const map: Record<string, string> = {
    ts: "TS",
    typescript: "TS",
    js: "JS",
    javascript: "JS",
    tsx: "TSX",
    jsx: "JSX",
    python: "PYTHON",
    py: "PYTHON",
    bash: "BASH",
    sh: "SHELL",
    sql: "SQL",
    json: "JSON",
    html: "HTML",
    css: "CSS",
    yaml: "YAML",
    yml: "YAML",
    markdown: "MARKDOWN",
    md: "MARKDOWN",
    rust: "RUST",
    go: "GO",
    java: "JAVA",
    c: "C",
    cpp: "C++",
  };
  return map[lang] || lang.toUpperCase();
}

type CodeBlockProps = {
  className?: string;
  children?: ReactNode;
  showLineNumbersByDefault?: boolean;
};

// คอมโพเนนต์แสดงผล Block ของโค้ด พร้อมแถบชื่อภาษา ป้ายคัดลอก และรองรับ Line Numbers
export function CodeBlock({ className = "", children, showLineNumbersByDefault = false }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [showNumbers, setShowNumbers] = useState(showLineNumbersByDefault);

  const langBadge = getLanguageBadge(className);
  // ดึงข้อความดิบสำหรับคัดลอกและนับบรรทัด
  const rawCode = typeof children === "string" ? children : String(children ?? "").replace(/\n$/, "");
  const lines = rawCode.split("\n");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(rawCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback หรือ ignore เมื่อไม่มีสิทธิ์ clipboard ในบางแวดล้อม
    }
  };

  return (
    <div className="my-6 rounded-xl border border-border/80 bg-bg-card shadow-sm transition-all overflow-hidden">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-border/80 bg-bg-elevated/70 px-4 py-2 text-xs font-mono text-text-secondary select-none">
        <div className="flex items-center gap-2.5">
          <span className="flex h-2 w-2 rounded-full bg-accent/60" />
          <span className="font-semibold tracking-wider text-text-heading/90">{langBadge}</span>
        </div>

        <div className="flex items-center gap-3">
          {lines.length > 3 && (
            <button
              type="button"
              onClick={() => setShowNumbers(!showNumbers)}
              className="text-[11px] text-text-secondary hover:text-accent transition-colors"
              title="สลับแสดงเลขบรรทัด"
            >
              {showNumbers ? "ซ่อนเลขบรรทัด" : "แสดงเลขบรรทัด"}
            </button>
          )}

          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-text-body hover:bg-bg-card hover:text-text-heading active:scale-95 transition-all"
            aria-label="คัดลอกโค้ด"
          >
            {copied ? (
              <>
                <CheckIcon className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-600 dark:text-emerald-400 font-sans text-xs">คัดลอกแล้ว</span>
              </>
            ) : (
              <>
                <CopyIcon className="h-3.5 w-3.5" />
                <span className="font-sans text-xs">คัดลอก</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Content */}
      <div className="overflow-x-auto p-4 font-mono text-sm leading-relaxed text-text-heading">
        {showNumbers && lines.length > 1 ? (
          <table className="w-full border-collapse">
            <tbody>
              {lines.map((line, idx) => (
                <tr key={idx} className="hover:bg-bg-elevated/40 transition-colors">
                  <td className="w-10 select-none pr-4 text-right text-xs text-text-secondary/50 font-mono align-top">
                    {idx + 1}
                  </td>
                  <td className="whitespace-pre align-top font-mono text-sm">
                    {line || " "}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <pre className="m-0 whitespace-pre font-mono text-sm">
            <code className={className}>{children}</code>
          </pre>
        )}
      </div>
    </div>
  );
}

// Inline Code Container สำหรับแท็ก <code> ที่ไม่ได้อยู่ใน <pre>
export function InlineCode({ children }: { children?: ReactNode }) {
  return (
    <code className="rounded-md border border-border/70 bg-bg-elevated/70 px-1.5 py-0.5 font-mono text-[0.88em] text-accent font-medium">
      {children}
    </code>
  );
}
