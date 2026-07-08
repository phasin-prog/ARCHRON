"use client";

import { useState } from "react";

interface AIWritingAssistantProps {
  content: string;
  onSuggestion: (suggestion: string) => void;
}

type AISuggestionType =
  | "expand"
  | "summarize"
  | "simplify"
  | "academic"
  | "thai-formal"
  | "add-examples"
  | "improve-flow"
  | "check-facts";

const AI_SUGGESTIONS: { type: AISuggestionType; label: string; icon: string; prompt: string }[] = [
  {
    type: "expand",
    label: "ขยายความ",
    icon: "expand_more",
    prompt: "ขยายความส่วนนี้ให้ละเอียดขึ้น โดยเพิ่มคำอธิบายและตัวอย่างที่เหมาะสม",
  },
  {
    type: "summarize",
    label: "สรุปสั้น",
    icon: "compress",
    prompt: "สรุปส่วนนี้ให้กระชับขึ้น แต่ยังคงสาระสำคัญไว้",
  },
  {
    type: "simplify",
    label: "เข้าใจง่าย",
    icon: "psychology",
    prompt: "เขียนใหม่ให้ผู้อ่านทั่วไปเข้าใจง่ายขึ้น โดยใช้ภาษาที่เรียบง่าย",
  },
  {
    type: "academic",
    label: "ภาษาวิชาการ",
    icon: "school",
    prompt: "เขียนใหม่ในระดับภาษาวิชาการที่เหมาะสมสำหรับบทความทางวิชาการ",
  },
  {
    type: "thai-formal",
    label: "ภาษาไทยทางการ",
    icon: "translate",
    prompt: "เขียนใหม่เป็นภาษาไทยทางการที่สละสลวย เหมาะสำหรับบทความวิชาการ",
  },
  {
    type: "add-examples",
    label: "เพิ่มตัวอย่าง",
    icon: "lightbulb",
    prompt: "เพิ่มตัวอย่างที่เป็นรูปธรรมและช่วยให้ผู้อ่านเข้าใจแนวคิดนี้ได้ดีขึ้น",
  },
  {
    type: "improve-flow",
    label: "ปรับการไหล",
    icon: "water_drop",
    prompt: "ปรับปรุงการไหลของเนื้อหาให้ราบรื่นขึ้น เชื่อมโยงแต่ละย่อหน้าอย่างเป็นธรรมชาติ",
  },
  {
    type: "check-facts",
    label: "ตรวจสอบข้อเท็จจริง",
    icon: "fact_check",
    prompt: "ตรวจสอบข้อเท็จจริงในส่วนนี้และแนะนำสิ่งที่ควรแก้ไขหรือเพิ่มเติม",
  },
];

export function AIWritingAssistant({ content, onSuggestion }: AIWritingAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");
  const [selectedType, setSelectedType] = useState<AISuggestionType | null>(null);

  const handleSuggest = (type: AISuggestionType, prompt: string) => {
    setSelectedType(type);
    // In a real implementation, this would call an AI API
    // For now, we'll just show the prompt
    onSuggestion(prompt);
    setIsOpen(false);
  };

  const handleCustomSuggest = () => {
    if (customPrompt.trim()) {
      onSuggestion(customPrompt);
      setCustomPrompt("");
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-concept/30 bg-concept/10 px-3 py-1.5 text-xs font-medium text-concept transition-colors hover:bg-concept/20"
      >
        <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
        AI ช่วยเขียน
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-lg border border-border bg-bg-card shadow-xl">
          <div className="border-b border-border p-3">
            <h4 className="text-sm font-semibold text-text-heading">AI Writing Assistant</h4>
            <p className="mt-1 text-xs text-text-secondary">เลือกประเภทการช่วยเขียน</p>
          </div>

          <div className="max-h-64 overflow-y-auto p-2">
            {AI_SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion.type}
                onClick={() => handleSuggest(suggestion.type, suggestion.prompt)}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-bg-card"
              >
                <span className="material-symbols-outlined text-[18px] text-concept">
                  {suggestion.icon}
                </span>
                <span className="text-text-heading">{suggestion.label}</span>
              </button>
            ))}
          </div>

          <div className="border-t border-border p-3">
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="พิมพ์คำสั่งเอง..."
              className="w-full rounded-md border border-border bg-bg-card px-3 py-2 text-xs text-text-heading placeholder-muted focus:border-concept focus:outline-none"
              rows={2}
            />
            <button
              onClick={handleCustomSuggest}
              disabled={!customPrompt.trim()}
              className="mt-2 w-full rounded-md bg-concept/20 px-3 py-1.5 text-xs font-medium text-concept transition-colors hover:bg-concept/30 disabled:opacity-50"
            >
              ส่งคำสั่ง
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

interface AIContentImproverProps {
  content: string;
  onImprove: (improved: string) => void;
}

export function AIContentImprover({ content, onImprove }: AIContentImproverProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImprove = async (type: "grammar" | "style" | "flow") => {
    setIsProcessing(true);
    // In a real implementation, this would call an AI API
    // For now, simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // In real implementation: const improved = await callAI(content, type);
    // onImprove(improved);
    setIsProcessing(false);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleImprove("grammar")}
        disabled={isProcessing}
        className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs text-text-secondary transition-colors hover:bg-bg-card hover:text-text-heading disabled:opacity-50"
      >
        <span className="material-symbols-outlined text-[14px]">spellcheck</span>
        ไวยากรณ์
      </button>
      <button
        onClick={() => handleImprove("style")}
        disabled={isProcessing}
        className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs text-text-secondary transition-colors hover:bg-bg-card hover:text-text-heading disabled:opacity-50"
      >
        <span className="material-symbols-outlined text-[14px]">style</span>
        สไตล์
      </button>
      <button
        onClick={() => handleImprove("flow")}
        disabled={isProcessing}
        className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs text-text-secondary transition-colors hover:bg-bg-card hover:text-text-heading disabled:opacity-50"
      >
        <span className="material-symbols-outlined text-[14px]">water_drop</span>
        การไหล
      </button>
    </div>
  );
}
