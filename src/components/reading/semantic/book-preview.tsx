"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BookIcon, ArrowRightIcon } from "@/components/icons";

export interface BookPreviewProps {
  slug: string;
  titleTh: string;
  titleEn?: string;
  author: string;
  year?: string | number;
  coverUrl?: string;
  summary?: string;
}

export function BookPreview({
  slug,
  titleTh,
  titleEn,
  author,
  year,
  coverUrl,
  summary,
}: BookPreviewProps) {
  const [imgError, setImgError] = useState(false);
  const showCover = Boolean(coverUrl && !imgError);

  return (
    <div className="my-6">
      <Link
        href={`/books/${slug}`}
        className="group relative flex flex-col sm:flex-row items-stretch sm:items-start gap-4 sm:gap-5 p-5 rounded-xl border border-border bg-bg-card transition-all duration-300 hover:border-accent/60 hover:shadow-sm"
      >
        {/* Book Cover / Icon Placeholder */}
        <div className="shrink-0 flex sm:block justify-center">
          {showCover ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={coverUrl}
              alt={titleTh}
              onError={() => setImgError(true)}
              className="w-24 sm:w-28 h-36 sm:h-40 object-cover rounded-md border border-border shadow-xs transition-transform duration-300 group-hover:scale-102"
            />
          ) : (
            <div className="w-24 sm:w-28 h-36 sm:h-40 rounded-md border border-border/80 bg-[linear-gradient(135deg,var(--color-bg-elevated)_0%,var(--color-bg-card)_100%)] flex flex-col items-center justify-center p-3 text-center shadow-2xs transition-transform duration-300 group-hover:scale-102">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-accent/10 text-accent mb-2">
                <BookIcon className="w-5 h-5" />
              </span>
              <span className="font-serif text-[11px] font-semibold text-text-heading line-clamp-3">
                {titleTh}
              </span>
            </div>
          )}
        </div>

        {/* Book Info Column */}
        <div className="flex-1 flex flex-col justify-between min-h-[9rem]">
          <div>
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="font-serif text-base md:text-lg font-semibold text-text-heading group-hover:text-accent transition-colors leading-snug">
                  {titleTh}
                </h4>
                {titleEn && (
                  <p className="text-xs font-serif text-text-secondary italic mt-0.5">
                    {titleEn}
                  </p>
                )}
              </div>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-accent/10 text-accent border border-accent/20 shrink-0">
                หนังสือ / ตำรา
              </span>
            </div>

            <div className="text-xs sm:text-sm font-medium text-text-secondary mt-2 flex items-center gap-1.5">
              <span>โดย</span>
              <span className="text-text-heading font-semibold">{author}</span>
              {year && <span className="text-text-secondary/80 font-mono">({year})</span>}
            </div>

            {summary && (
              <p className="text-sm text-text-body/90 mt-2.5 line-clamp-2 leading-relaxed">
                {summary}
              </p>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs">
            <span className="text-text-secondary">อ่านบทวิเคราะห์และสรุปสาระสำคัญ</span>
            <span className="inline-flex items-center gap-1 font-semibold text-accent group-hover:underline">
              <span>ดูรายละเอียดหนังสือ</span>
              <ArrowRightIcon className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
