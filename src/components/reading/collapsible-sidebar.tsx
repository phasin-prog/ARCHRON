"use client";

import { useState, useCallback } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
} from "@/components/icons";

type Side = "left" | "right";

export function CollapsibleSidebar({
  side,
  children,
}: {
  side: Side;
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const toggle = useCallback(() => setCollapsed((v) => !v), []);

  const isLeft = side === "left";

  return (
    <>
      {collapsed ? (
        <button
          type="button"
          onClick={toggle}
          aria-label={isLeft ? "เปิดสารบัญ" : "เปิดแผนที่ความเชื่อมโยง"}
          className={`sticky top-28 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-accent/20 bg-bg-card/90 text-accent/70 shadow-sm backdrop-blur transition-colors hover:bg-bg-card hover:text-accent hover:border-accent/40 ${
            isLeft ? "ml-0" : "mr-0"
          }`}
        >
          {isLeft ? (
            <ChevronRightIcon className="h-4 w-4" />
          ) : (
            <ChevronLeftIcon className="h-4 w-4" />
          )}
        </button>
      ) : (
        <div className="group relative">
          <button
            type="button"
            onClick={toggle}
            aria-label={isLeft ? "ปิดสารบัญ" : "ปิดแผนที่ความเชื่อมโยง"}
            className={`absolute top-2 z-20 flex h-7 w-7 items-center justify-center rounded-full border border-accent/15 bg-bg-card/90 text-accent/50 opacity-0 shadow-sm backdrop-blur transition-all duration-200 hover:text-accent hover:border-accent/40 group-hover:opacity-100 ${
              isLeft ? "-right-1" : "-left-1"
            }`}
          >
            <CloseIcon className="h-3 w-3" />
          </button>
          {children}
        </div>
      )}
    </>
  );
}
