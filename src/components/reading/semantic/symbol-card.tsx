"use client";

import React from "react";
import Link from "next/link";
import { SymbolIcon, ArrowRightIcon } from "@/components/icons";

export interface SymbolCardProps {
  slug: string;
  nameTh: string;
  nameEn?: string;
  archetype?: string;
  shortMeaning: string;
}

function AutoAwesomeIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M19 9l1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9zm-7.5.5L9 2 6.5 9.5 0 12l6.5 2.5L9 22l2.5-7.5L18 12l-6.5-2.5zM19 15l-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25L19 15z" />
    </svg>
  );
}

export function SymbolCard({
  slug,
  nameTh,
  nameEn,
  archetype,
  shortMeaning,
}: SymbolCardProps) {
  return (
    <div className="my-5">
      <Link
        href={`/concepts/${slug}`}
        className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-premium/30 bg-bg-card/80 p-5 transition-all duration-300 hover:border-premium hover:shadow-sm"
      >
        {/* Subtle Ambient Gold Glow */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-premium/10 blur-2xl transition-all duration-500 group-hover:scale-125 group-hover:bg-premium/20"
        />

        <div>
          {/* Header Row */}
          <div className="flex items-start justify-between gap-3 relative z-10">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-premium/15 text-premium border border-premium/30 transition-transform duration-300 group-hover:scale-110 shrink-0 shadow-2xs">
                <AutoAwesomeIcon className="w-5 h-5 text-[#B89A63]" />
              </span>
              <div>
                <h4 className="font-heading text-base md:text-lg font-semibold text-text-heading group-hover:text-[#B89A63] transition-colors flex items-center gap-1.5">
                  <span>{nameTh}</span>
                </h4>
                {nameEn && (
                  <p className="text-xs font-serif text-text-secondary italic mt-0.5">
                    {nameEn}
                  </p>
                )}
              </div>
            </div>

            {archetype && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-premium/15 text-premium-dark text-[#8E7343] dark:text-[#D4B050] border border-premium/30 shrink-0">
                <SymbolIcon className="w-3.5 h-3.5 inline-block" />
                <span>{archetype}</span>
              </span>
            )}
          </div>

          {/* Short Meaning */}
          <div className="mt-3.5 relative z-10">
            <p className="text-sm text-text-body leading-relaxed">
              {shortMeaning}
            </p>
          </div>
        </div>

        {/* Footer Link */}
        <div className="mt-4 pt-3 border-t border-premium/20 flex items-center justify-between text-xs font-medium text-text-secondary group-hover:text-text-heading transition-colors relative z-10">
          <span className="text-text-secondary/90">สัญลักษณ์วิทยาเชิงลึกและจิตวิทยาวิเคราะห์</span>
          <span className="inline-flex items-center gap-1 font-semibold text-[#8E7343] dark:text-[#D4B050] group-hover:underline">
            <span>สำรวจสัญลักษณ์</span>
            <ArrowRightIcon className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </div>
      </Link>
    </div>
  );
}
