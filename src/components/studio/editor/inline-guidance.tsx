"use client";

import React from "react";
import type { ValidationIssue } from "@/lib/content/publishing/editor-validation";

export function InlineGuidance({ issue }: { issue?: ValidationIssue }) {
  if (!issue) return null;

  const isError = issue.severity === "error";
  const isWarning = issue.severity === "warning";

  return (
    <div className={`mt-2 rounded-lg border p-3 text-xs leading-relaxed transition-all duration-300 ${
      isError
        ? "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300 animate-in fade-in slide-in-from-top-1"
        : isWarning
        ? "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300 animate-in fade-in slide-in-from-top-1"
        : "border-accent/30 bg-accent/10 text-accent animate-in fade-in slide-in-from-top-1"
    }`}>
      <div className="font-semibold flex items-start gap-1.5 mb-1">
        <span className="text-sm shrink-0 leading-none">{isError ? "🛑" : isWarning ? "⚠️" : "💡"}</span>
        <span>{issue.message.replace(/^[🛑⚠️💡]\s*/, "")}</span>
      </div>
      <div className="text-[11px] opacity-80 pl-5">
        <span className="font-medium underline mr-1">ทำไมจึงสำคัญ:</span>
        {issue.whyItMatters}
      </div>
    </div>
  );
}
