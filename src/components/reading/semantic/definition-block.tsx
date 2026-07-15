"use client";

import React from "react";
import { TermIcon } from "@/components/icons";

export interface DefinitionBlockProps {
  term: string;
  phonetic?: string;
  etymology?: string;
  definition: string;
  category?: string;
}

export function DefinitionBlock({
  term,
  phonetic,
  etymology,
  definition,
  category,
}: DefinitionBlockProps) {
  return (
    <div className="border-l-4 border-accent bg-accent/5 p-5 rounded-r-lg my-6 transition-all duration-300 shadow-2xs">
      {/* Header Row */}
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-accent/15 pb-3">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 font-serif text-lg text-text-heading font-semibold">
            <TermIcon className="w-4 h-4 text-accent inline-block shrink-0" />
            <span>{term}</span>
          </span>
          {phonetic && (
            <span className="text-sm font-mono text-text-secondary italic">
              /{phonetic}/
            </span>
          )}
        </div>

        {category && (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/20">
            {category}
          </span>
        )}
      </div>

      {/* Etymology Pill */}
      {etymology && (
        <div className="mt-3">
          <span className="inline-flex items-center gap-1.5 text-xs bg-bg-card border border-border px-2.5 py-1 rounded-md text-text-secondary font-mono shadow-2xs">
            <span className="font-semibold text-text-body">รากศัพท์:</span>
            <span>{etymology}</span>
          </span>
        </div>
      )}

      {/* Definition Body */}
      <div className="mt-3 text-sm md:text-base text-text-body leading-relaxed font-body">
        {definition}
      </div>
    </div>
  );
}
