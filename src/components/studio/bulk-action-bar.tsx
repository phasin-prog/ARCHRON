"use client";

import { CheckIcon } from "@/components/icons";

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
        className="rounded-md px-3 py-1.5 text-xs font-medium text-text-secondary hover:text-text-heading transition-colors"
      >
        {allSelected ? "ยกเลิกการเลือก" : "เลือกทั้งหมด"}
      </button>
      <span className="text-xs text-text-secondary/80">
        {selectedCount} รายการที่เลือก
      </span>
      <div className="ml-auto flex items-center gap-2">
        {onArchive && (
          <button
            onClick={onArchive}
            disabled={acting || archiveDisabled}
            className="rounded-md border border-text-heading/20 px-3 py-1.5 text-xs font-medium text-text-heading hover:border-warning hover:bg-warning/5 disabled:opacity-40 transition-colors"
          >
            เก็บถาวร{archiveCount ? ` (${archiveCount})` : ""}
          </button>
        )}
        <button
          onClick={onDelete}
          disabled={acting || selectedCount === 0}
          className="rounded-md bg-error px-3 py-1.5 text-xs font-semibold text-text-inverse hover:brightness-110 disabled:opacity-40 transition-all"
        >
          ลบถาวร ({selectedCount})
        </button>
        <button
          onClick={onCancel}
          className="rounded-md px-3 py-1.5 text-xs text-text-secondary hover:text-text-heading transition-colors"
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
        className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold"
        style={{
          backgroundColor: `${statusBadge.color}15`,
          color: statusBadge.color,
        }}
      >
        {statusBadge.label}
      </span>
    </button>
  );
}
