"use client";

import type { ReactNode } from "react";
import Link from "next/link";

type DashboardEmptyStateProps = {
  icon: ReactNode;
  title: string;
  message?: string;
  cta?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
};

export function DashboardEmptyState({
  icon,
  title,
  message,
  cta,
}: DashboardEmptyStateProps) {
  return (
    <div className="archron-card flex flex-col items-center gap-4 p-12 text-center">
      <span className="flex h-12 w-12 items-center justify-center text-text-secondary">
        {icon}
      </span>
      <div>
        <p className="text-sm font-medium text-text-heading">{title}</p>
        {message && (
          <p className="mt-1 text-sm text-text-secondary/80">{message}</p>
        )}
      </div>
      {cta && cta.href && (
        <Link
          href={cta.href}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:underline"
        >
          {cta.label}
        </Link>
      )}
      {cta && cta.onClick && (
        <button
          onClick={cta.onClick}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:underline"
        >
          {cta.label}
        </button>
      )}
    </div>
  );
}
