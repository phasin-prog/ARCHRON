"use client";

import { BookmarkIcon, CheckIcon, CloseIcon } from "@/components/icons";

type BulkActionBarProps = {
  totalItems: number;
  allSelected: boolean;
  onSelectAllToggle: () => void;
  selectedCount: number;
  acting: boolean;
  onDelete: () => void;
  onCancel: () => void;
  onArchive?: () => void;
  archiveCount?: number;
  archiveDisabled?: boolean;
};

export function BulkActionBar({
  totalItems,
  allSelected,
  onSelectAllToggle,
  selectedCount,
  acting,
  onDelete,
  onCancel,
  onArchive,
  archiveCount,
  archiveDisabled,
}: BulkActionBarProps) {
  return (
    <div className="sticky top-0 z-20 flex flex-wrap items-center gap-2 rounded-xl border border-border/50 bg-bg-card/95 p-3 shadow-sm backdrop-blur">
      <button
        onClick={onSelectAllToggle}
        className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-text-secondary hover:text-text-heading transition-colors"
      >
        <CheckIcon className="h-3.5 w-3.5" />
        {allSelected ? "ยกเลิกการเลือก" : "เลือกทั้งหมด"}
      </button>
      <span className="text-xs text-text-secondary/60">
        {selectedCount} รายการ
      </span>
      <div className="ml-auto flex items-center gap-1.5">
        {onArchive && (
          <button
            onClick={onArchive}
            disabled={acting || archiveDisabled}
            className="inline-flex items-center gap-1.5 rounded-lg border border-warning/30 px-3 py-1.5 text-xs font-medium text-warning transition-colors hover:bg-warning/10 disabled:opacity-40"
          >
            <BookmarkIcon className="h-3.5 w-3.5" />
            เก็บถาวร{archiveCount ? ` (${archiveCount})` : ""}
          </button>
        )}
        <span className="mx-0.5 h-5 w-px bg-border/40" aria-hidden="true" />
        <button
          onClick={onDelete}
          disabled={acting || selectedCount === 0}
          className="inline-flex items-center gap-1.5 rounded-lg bg-error/10 px-3 py-1.5 text-xs font-semibold text-error transition-all hover:bg-error/20 disabled:opacity-40"
        >
          <CloseIcon className="h-3.5 w-3.5" />
          ลบถาวร ({selectedCount})
        </button>
        <button
          onClick={onCancel}
          className="rounded-lg px-3 py-1.5 text-xs text-text-secondary hover:text-text-heading transition-colors"
        >
          เลิกเลือก
        </button>
      </div>
    </div>
  );
}

type SelectRowProps = {
  checked: boolean;
  onToggle: () => void;
  ariaLabel: string;
  typeBadge?: { label: string; color: string } | null;
  title: string;
  subtitle?: string;
  statusBadge: { label: string; color: string };
};

export function SelectRow({
  checked,
  onToggle,
  ariaLabel,
  typeBadge,
  title,
  subtitle,
  statusBadge,
}: SelectRowProps) {
  return (
    <button
      onClick={onToggle}
      aria-label={ariaLabel}
      aria-pressed={checked}
      className={`archron-card group flex w-full items-center gap-4 p-4 text-left transition-all ${
        checked
          ? "ring-2 ring-accent/40 bg-accent/5"
          : "hover:border-accent/30"
      }`}
    >
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-all ${
          checked
            ? "border-accent bg-accent text-text-inverse"
            : "border-border text-transparent"
        }`}
        aria-hidden="true"
      >
        <CheckIcon className="h-3 w-3" />
      </span>
      {typeBadge && (
        <span
          className="inline-flex shrink-0 rounded-lg px-2.5 py-1 text-[10px] font-semibold"
          style={{
            backgroundColor: `${typeBadge.color}15`,
            color: typeBadge.color,
          }}
        >
          {typeBadge.label}
        </span>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-text-heading">
          {title}
        </p>
        {subtitle && (
          <p className="mt-0.5 text-[11px] text-text-secondary/70">
            {subtitle}
          </p>
        )}
      </div>
      <span
        className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold leading-relaxed"
        style={{
          backgroundColor: `${statusBadge.color}15`,
          color: statusBadge.color,
        }}
      >
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: statusBadge.color }}
        />
        {statusBadge.label}
      </span>
    </button>
  );
}
