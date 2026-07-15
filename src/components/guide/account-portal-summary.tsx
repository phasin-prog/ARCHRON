"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { listServiceInvoices } from "@/lib/content/invoices-db";
import type { InvoiceData, AppointmentItem, ReportItem } from "@/components/guide/types";
import {
  PersonIcon,
  CalendarIcon,
  AuthorPenIcon,
  CheckIcon,
  ClockIcon,
  ArrowRightIcon,
} from "@/components/icons";

export function AccountPortalSummary() {
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
    if (!supabaseUrl || !supabaseKey) {
      setLoading(false);
      return;
    }
    const supabase = createClient(supabaseUrl, supabaseKey);
    listServiceInvoices(supabase).then((data) => {
      if (data) setInvoices(data);
      setLoading(false);
    });
  }, []);

  const pendingCount = invoices.filter((i) => i.status === "pending").length;
  const paidCount = invoices.filter((i) => i.status === "paid" || i.status === "completed").length;
  const upcomingAppointments = invoices.filter(
    (i) => i.status === "paid" || i.status === "pending"
  ).length;

  if (loading) {
    return (
      <div className="px-3 py-4 text-xs text-text-secondary/70">
        <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        <span className="ml-2">กำลังโหลดข้อมูล...</span>
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <div className="px-3 py-4 text-xs text-text-secondary/80">
        <p className="font-medium text-text-heading mb-1">ยังไม่มีรายการนัดหมาย</p>
        <p>จองเซสชันวิเคราะห์ Jungian Type Analysis เพื่อเริ่มต้น</p>
        <Link
          href="/guide"
          className="mt-3 inline-flex items-center gap-1 rounded-md bg-accent px-4 py-2 text-xs font-semibold text-text-inverse transition-colors hover:bg-accent/90"
        >
          จองคิววิเคราะห์
          <ArrowRightIcon className="h-3 w-3" />
        </Link>
      </div>
    );
  }

  return (
    <div className="px-3 py-3 text-xs">
      <div className="flex items-center gap-2 border-b border-border/30 pb-2.5 mb-2.5">
        <CalendarIcon className="h-4 w-4 text-accent" />
        <span className="font-semibold text-text-heading">ภาพรวมการนัดหมาย</span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-text-secondary">นัดหมายที่กำลังจะมาถึง</span>
          <span className="font-semibold text-text-heading">{upcomingAppointments} รายการ</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-text-secondary">รอชำระเงิน</span>
          <span className="font-semibold text-warning">{pendingCount} รายการ</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-text-secondary">ชำระแล้ว / เสร็จสิ้น</span>
          <span className="font-semibold text-success">{paidCount} รายการ</span>
        </div>
      </div>

      <Link
        href="/guide"
        className="mt-3 flex items-center justify-center gap-1 rounded-md border border-accent/20 bg-accent/5 px-3 py-2 text-xs font-semibold text-accent transition-colors hover:bg-accent/10"
      >
        <span>ดูรายละเอียดทั้งหมด</span>
        <ArrowRightIcon className="h-3 w-3" />
      </Link>
    </div>
  );
}
