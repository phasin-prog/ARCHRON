"use client";

import React, { useState } from "react";
import { PersonIcon, CalendarIcon } from "@/components/icons";

export interface TimelineItem {
  year: string | number;
  title: string;
  description: string;
  thinker?: string;
}

export interface InteractiveTimelineProps {
  items: TimelineItem[];
}

export function InteractiveTimeline({ items = [] }: InteractiveTimelineProps) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="my-8">
      <div className="relative border-l-2 border-accent/30 ml-3 sm:ml-4 pl-6 sm:pl-8 space-y-6 sm:space-y-8">
        {items.map((item, idx) => {
          const isActive = activeIdx === idx;
          return (
            <div
              key={`${item.year}-${idx}`}
              onMouseEnter={() => setActiveIdx(idx)}
              onMouseLeave={() => setActiveIdx(null)}
              onClick={() => setActiveIdx(isActive ? null : idx)}
              className={`group relative transition-all duration-300 rounded-xl p-4 -ml-2 sm:-ml-4 border cursor-pointer ${
                isActive
                  ? "bg-bg-elevated/70 border-accent/40 shadow-xs"
                  : "bg-transparent border-transparent hover:bg-bg-card/60 hover:border-border/60"
              }`}
            >
              {/* Glowing Circular Node */}
              <span
                aria-hidden="true"
                className={`absolute -left-[31px] sm:-left-[39px] top-4 w-3.5 h-3.5 rounded-full border-2 transition-all duration-300 z-10 ${
                  isActive
                    ? "scale-125 border-accent bg-accent shadow-[0_0_10px_rgba(140,21,21,0.6)]"
                    : "border-accent bg-bg-card group-hover:scale-125 group-hover:border-accent group-hover:bg-accent group-hover:shadow-[0_0_8px_rgba(140,21,21,0.5)]"
                }`}
              />

              {/* Header Row: Year & Thinker */}
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-accent bg-accent/10 px-2.5 py-0.5 rounded border border-accent/20">
                  <CalendarIcon className="w-3.5 h-3.5" />
                  <span>{item.year}</span>
                </span>

                {item.thinker && (
                  <span className="inline-flex items-center gap-1 text-xs text-text-secondary bg-bg-elevated px-2.5 py-0.5 rounded border border-border/80">
                    <PersonIcon className="w-3.5 h-3.5 text-accent" />
                    <span className="font-medium text-text-body">{item.thinker}</span>
                  </span>
                )}
              </div>

              {/* Title */}
              <h5 className="font-heading text-base md:text-lg font-semibold text-text-heading group-hover:text-accent transition-colors leading-snug">
                {item.title}
              </h5>

              {/* Description */}
              <p className="text-sm text-text-body mt-1.5 leading-relaxed">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
