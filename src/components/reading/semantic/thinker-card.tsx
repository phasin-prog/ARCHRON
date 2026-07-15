"use client";

import React from "react";
import Link from "next/link";
import { PersonIcon, SchoolIcon, ArrowRightIcon } from "@/components/icons";

export interface ThinkerCardProps {
  slug: string;
  nameTh?: string;
  nameEn?: string;
  school?: string;
  period?: string;
  summary?: string;
}

export function ThinkerCard({
  slug,
  nameTh,
  nameEn,
  school,
  period,
  summary,
}: ThinkerCardProps) {
  const displayName = nameTh || nameEn || slug;

  return (
    <div className="my-4">
      <Link
        href={`/thinkers/${slug}`}
        className="group relative flex flex-col justify-between bg-bg-card border border-border rounded-xl p-4 transition-all duration-300 hover:border-accent/60 hover:-translate-y-0.5 shadow-xs hover:shadow-sm"
      >
        <div>
          {/* Header Row */}
          <div className="flex items-start justify-between gap-3 mb-2.5">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10 text-accent border border-accent/20 transition-transform duration-300 group-hover:scale-105 shrink-0">
                <PersonIcon className="w-5 h-5" />
              </span>
              <div>
                <h4 className="font-heading text-base md:text-lg font-semibold text-text-heading group-hover:text-accent transition-colors">
                  {displayName}
                </h4>
                {nameEn && nameEn !== displayName && (
                  <p className="text-xs font-serif text-text-secondary italic mt-0.5">
                    {nameEn}
                  </p>
                )}
              </div>
            </div>

            {school && (
              <span className="inline-flex items-center gap-1 text-xs bg-accent/10 text-accent px-2.5 py-0.5 rounded-full font-medium border border-accent/20 shrink-0">
                <SchoolIcon className="w-3.5 h-3.5" />
                <span>{school}</span>
              </span>
            )}
          </div>

          {/* Period / Chronology */}
          {period && (
            <div className="text-xs font-mono text-text-secondary/90 mt-1 mb-2">
              ช่วงเวลา: <span className="font-medium text-text-body">{period}</span>
            </div>
          )}

          {/* Summary Snippet */}
          {summary && (
            <p className="text-sm text-text-body/90 mt-2 line-clamp-3 leading-relaxed">
              {summary}
            </p>
          )}
        </div>

        {/* Footer CTA */}
        <div className="mt-3 pt-3 border-t border-border/60 flex items-center justify-between text-xs font-medium text-text-secondary group-hover:text-accent transition-colors">
          <span>สำรวจแนวคิดและผลงาน</span>
          <span className="inline-flex items-center gap-1 text-accent font-semibold">
            <span>อ่านเพิ่มเติม</span>
            <ArrowRightIcon className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </div>
      </Link>
    </div>
  );
}
