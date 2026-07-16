"use client";

import { Component, type ReactNode, type ErrorInfo } from "react";
import Link from "next/link";

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ReadingErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ReadingPage error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-6 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-warning/30 bg-warning/10">
            <span className="text-2xl text-warning">!</span>
          </div>
          <h1 className="mt-6 font-serif text-2xl text-text-heading">
            {this.props.fallbackTitle || "เกิดข้อผิดพลาดในการโหลดเนื้อหา"}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-text-secondary/70">
            ไม่สามารถแสดงเนื้อหาได้ในขณะนี้ อาจเกิดจากปัญหาการเชื่อมต่อ กรุณาลองใหม่ในภายหลัง
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex min-h-[44px] items-center justify-center gap-2 bg-accent px-6 py-2.5 text-sm font-semibold text-text-inverse transition-all hover:brightness-110"
            >
              กลับหน้าแรก
            </Link>
            <button
              type="button"
              onClick={() => this.setState({ hasError: false, error: null })}
              className="inline-flex min-h-[44px] items-center justify-center gap-2 border border-accent/40 px-6 py-2.5 text-sm text-accent hover:bg-accent/10"
            >
              ลองใหม่
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
