"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="tpl-reference py-24 text-center">
      <h2 className="font-heading text-2xl font-semibold text-text-heading">
        เกิดข้อผิดพลาด
      </h2>
      <p className="mt-4 text-sm leading-relaxed text-text-secondary">
        {error.message || "ไม่สามารถโหลดเนื้อหาได้ กรุณาลองใหม่อีกครั้ง"}
      </p>
      {error.digest && (
        <p className="mt-2 font-mono text-xs text-text-secondary/50">
          Error ID: {error.digest}
        </p>
      )}
      <button
        type="button"
        onClick={reset}
        className="mt-8 rounded-lg border border-border bg-bg-card px-6 py-3 text-sm text-text-heading transition-colors hover:border-accent hover:text-accent"
      >
        ลองใหม่
      </button>
    </div>
  );
}
