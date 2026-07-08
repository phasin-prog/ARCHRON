"use client";

import { useState, useMemo } from "react";
import { SEALS, type AcademicSeal } from "@/lib/content/seals";
import { SealIcon } from "./seal-icon";

interface SealGalleryProps {
  earnedSealIds?: string[];
  onSelectSeal?: (seal: AcademicSeal) => void;
}

type FilterMode = "all" | "earned" | "locked";
type SortMode = "recent" | "level" | "alphabetical";

export function SealGallery({ earnedSealIds = [], onSelectSeal }: SealGalleryProps) {
  const [filter, setFilter] = useState<FilterMode>("all");
  const [sort, setSort] = useState<SortMode>("level");

  const earnedSet = useMemo(() => new Set(earnedSealIds), [earnedSealIds]);

  const filteredSeals = useMemo(() => {
    let result = SEALS;
    if (filter === "earned") {
      result = result.filter((s) => earnedSet.has(s.id));
    } else if (filter === "locked") {
      result = result.filter((s) => !earnedSet.has(s.id));
    }

    const sorted = [...result];
    if (sort === "level") {
      sorted.sort((a, b) => (a.level ?? 99) - (b.level ?? 99));
    } else if (sort === "alphabetical") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    }
    return sorted;
  }, [filter, sort, earnedSet]);

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center gap-4">
        <div className="flex gap-2" role="group" aria-label="กรองตรา">
          {(["all", "earned", "locked"] as FilterMode[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
                filter === f
                  ? "bg-accent text-text-inverse"
                  : "border border-border text-text-secondary hover:border-accent hover:text-accent"
              }`}
            >
              {f === "all" ? "ทั้งหมด" : f === "earned" ? "ที่ได้รับ" : "ที่ยังล็อก"}
            </button>
          ))}
        </div>
        <div className="flex gap-2" role="group" aria-label="เรียงลำดับ">
          {(["level", "alphabetical"] as SortMode[]).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSort(s)}
              className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
                sort === s
                  ? "bg-accent text-text-inverse"
                  : "border border-border text-text-secondary hover:border-accent hover:text-accent"
              }`}
            >
              {s === "level" ? "ตามระดับ" : "ตามตัวอักษร"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {filteredSeals.map((seal, index) => {
          const isLocked = !earnedSet.has(seal.id);
          return (
            <button
              key={seal.id}
              type="button"
              onClick={() => onSelectSeal?.(seal)}
              className="flex flex-col items-center gap-3 rounded-lg border border-border bg-bg-card p-4 transition-colors hover:border-accent/30 hover:bg-bg-elevated"
              style={{
                animation: `seal-stagger 300ms ease-out ${index * 50}ms both`,
              }}
            >
              <SealIcon seal={seal} size={64} isLocked={isLocked} />
              <span className="font-ui text-xs text-text-secondary text-center">
                {seal.nameThai}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
