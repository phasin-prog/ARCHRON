"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import Image from "next/image";
import type { BookingFormData } from "@/components/guide/types";

interface BookingSectionProps {
  onSubmitSuccess: (data: BookingFormData, slipFile?: File) => void;
}

const INITIAL_FORM: BookingFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  preferredDate: "",
  preferredTime: "ช่วงเช้า (09:30 - 11:00 น.)",
  timezone: "Asia/Bangkok (GMT+7)",
  notes: "",
  service: "Jungian Type Analysis - เซสชัน 90 นาที + รายงานสรุป PDF (399 บาท)",
};

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  preferredDate?: string;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function BookingSection({ onSubmitSuccess }: BookingSectionProps) {
  const [formData, setFormData] = useState<BookingFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [slipFile, setSlipFile] = useState<File | null>(null);
  const [slipError, setSlipError] = useState<string | null>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    setSubmitError(null);
  };

  const handleSlipChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setSlipError(null);
    if (file) {
      if (!file.type.startsWith("image/")) {
        setSlipError("กรุณาเลือกไฟล์รูปภาพเท่านั้น (JPG, PNG, ฯลฯ)");
        setSlipFile(null);
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        setSlipError("ไฟล์มีขนาดใหญ่เกินไป (สูงสุด 10MB)");
        setSlipFile(null);
        return;
      }
      setSlipFile(file);
    } else {
      setSlipFile(null);
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "กรุณาระบุชื่อจริง";
    if (!formData.lastName.trim()) newErrors.lastName = "กรุณาระบุนามสกุล";
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "กรุณาระบุอีเมลที่ถูกต้อง";
    if (!formData.phone.trim() || formData.phone.trim().length < 9)
      newErrors.phone = "กรุณาระบุเบอร์โทรศัพท์ (อย่างน้อย 9 หลัก)";
    if (!formData.preferredDate) newErrors.preferredDate = "กรุณาเลือกวันที่";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setIsSubmitting(false);
      onSubmitSuccess(formData, slipFile ?? undefined);
    } catch {
      setIsSubmitting(false);
      setSubmitError("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    }
  };

  const getMinDateString = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  };

  return (
    <section className="border-b border-border/30 bg-bg px-6 py-20 lg:py-24">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-xl border border-border/60 bg-bg-card p-6 sm:p-8 shadow-sm">
          <h2 className="font-heading text-xl font-bold text-text-heading">
            จองเซสชันวิเคราะห์
          </h2>
          <p className="mt-1 text-sm text-text-secondary">
            กรอกข้อมูลและแนบสลิปชำระเงิน (ถ้ามี) เพื่อยืนยันการจอง
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5 text-sm" noValidate>
          {submitError && (
            <div className="rounded-md border border-error/40 bg-error/10 p-3.5 text-xs text-error">
              {submitError}
            </div>
          )}

          <div className="rounded-lg border border-accent/20 bg-accent/5 p-3.5 text-xs text-text-body">
            <span className="font-semibold text-accent">บริการที่เลือก:</span>{" "}
            {formData.service}
          </div>

          <div className="rounded-lg border border-success/25 bg-success/5 p-4 text-center">
            <span className="block text-xs font-bold text-success uppercase tracking-wider">
              ชำระเงินผ่าน THAI QR PAYMENT / PromptPay
            </span>
            <p className="mt-1 text-[11px] text-text-secondary/90">
              สแกนผ่านแอปพลิเคชันธนาคารทุกธนาคาร หรือโอนเข้าบัญชี: <strong className="font-mono text-text-heading">xxx-x-x6727-x (นาย พศิน พสุมาตร)</strong>
            </p>
            <div className="mx-auto mt-3 flex flex-col items-center justify-center rounded-xl border-2 border-success/30 bg-bg-card p-3 shadow-md max-w-[180px]">
              <Image
                src="/promptpay-qr.jpg"
                alt="THAI QR PAYMENT - PromptPay นาย พศิน พสุมาตร บัญชี xxx-x-x6727-x"
                width={160}
                height={200}
                className="rounded object-contain w-full h-auto"
                priority
                unoptimized
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="bs-firstName" className="block text-xs font-semibold text-text-heading">
                ชื่อจริง <span className="text-accent">*</span>
              </label>
              <input
                id="bs-firstName"
                name="firstName"
                type="text"
                required
                value={formData.firstName}
                onChange={handleChange}
                placeholder="ระบุชื่อจริง"
                aria-invalid={!!errors.firstName}
                className={`mt-1.5 w-full rounded-md border bg-bg px-3 py-3 text-sm text-text-heading placeholder:text-text-secondary/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                  errors.firstName ? "border-error focus-visible:ring-error" : "border-border/70"
                }`}
              />
              {errors.firstName && <p className="mt-1 text-[11px] text-error">{errors.firstName}</p>}
            </div>
            <div>
              <label htmlFor="bs-lastName" className="block text-xs font-semibold text-text-heading">
                นามสกุล <span className="text-accent">*</span>
              </label>
              <input
                id="bs-lastName"
                name="lastName"
                type="text"
                required
                value={formData.lastName}
                onChange={handleChange}
                placeholder="ระบุนามสกุล"
                aria-invalid={!!errors.lastName}
                className={`mt-1.5 w-full rounded-md border bg-bg px-3 py-3 text-sm text-text-heading placeholder:text-text-secondary/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                  errors.lastName ? "border-error focus-visible:ring-error" : "border-border/70"
                }`}
              />
              {errors.lastName && <p className="mt-1 text-[11px] text-error">{errors.lastName}</p>}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="bs-email" className="block text-xs font-semibold text-text-heading">
                อีเมลติดต่อ <span className="text-accent">*</span>
              </label>
              <input
                id="bs-email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="yourname@domain.com"
                aria-invalid={!!errors.email}
                className={`mt-1.5 w-full rounded-md border bg-bg px-3 py-3 text-sm text-text-heading placeholder:text-text-secondary/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                  errors.email ? "border-error focus-visible:ring-error" : "border-border/70"
                }`}
              />
              {errors.email && <p className="mt-1 text-[11px] text-error">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="bs-phone" className="block text-xs font-semibold text-text-heading">
                เบอร์โทรศัพท์ <span className="text-accent">*</span>
              </label>
              <input
                id="bs-phone"
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="08X-XXX-XXXX"
                aria-invalid={!!errors.phone}
                className={`mt-1.5 w-full rounded-md border bg-bg px-3 py-3 text-sm text-text-heading placeholder:text-text-secondary/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                  errors.phone ? "border-error focus-visible:ring-error" : "border-border/70"
                }`}
              />
              {errors.phone && <p className="mt-1 text-[11px] text-error">{errors.phone}</p>}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="bs-preferredDate" className="block text-xs font-semibold text-text-heading">
                เลือกวันที่ <span className="text-accent">*</span>
              </label>
              <input
                id="bs-preferredDate"
                name="preferredDate"
                type="date"
                min={getMinDateString()}
                required
                value={formData.preferredDate}
                onChange={handleChange}
                aria-invalid={!!errors.preferredDate}
                className={`mt-1.5 w-full rounded-md border bg-bg px-3 py-3 text-sm text-text-heading transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                  errors.preferredDate ? "border-error focus-visible:ring-error" : "border-border/70"
                }`}
              />
              {errors.preferredDate && <p className="mt-1 text-[11px] text-error">{errors.preferredDate}</p>}
            </div>
            <div>
              <label htmlFor="bs-preferredTime" className="block text-xs font-semibold text-text-heading">
                เลือกช่วงเวลา
              </label>
              <select
                id="bs-preferredTime"
                name="preferredTime"
                value={formData.preferredTime}
                onChange={handleChange}
                className="mt-1.5 w-full rounded-md border border-border/70 bg-bg px-3 py-3 text-sm text-text-heading transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <option value="ช่วงเช้า (09:30 - 11:00 น.)">ช่วงเช้า (09:30 - 11:00 น.)</option>
                <option value="ช่วงบ่าย (13:30 - 15:00 น.)">ช่วงบ่าย (13:30 - 15:00 น.)</option>
                <option value="ช่วงค่ำ (19:00 - 20:30 น.)">ช่วงค่ำ (19:00 - 20:30 น.)</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="bs-timezone" className="block text-xs font-semibold text-text-heading">
              เขตเวลา (Timezone)
            </label>
            <input
              id="bs-timezone"
              name="timezone"
              type="text"
              readOnly
              value={formData.timezone}
              className="mt-1.5 w-full cursor-not-allowed rounded-md border border-border/50 bg-bg-elevated/60 px-3 py-2 text-xs text-text-secondary"
            />
          </div>

          <div>
            <label htmlFor="bs-notes" className="block text-xs font-semibold text-text-heading">
              ข้อความเพิ่มเติม หรือประเด็นที่อยากโฟกัส (ถ้ามี)
            </label>
            <textarea
              id="bs-notes"
              name="notes"
              rows={3}
              value={formData.notes}
              onChange={handleChange}
              placeholder="เช่น อยากเข้าใจแนวโน้มฟังก์ชันที่ทำให้เครียดตอนทำงาน ฯลฯ"
              className="mt-1.5 w-full rounded-md border border-border/70 bg-bg px-3 py-2 text-sm text-text-heading placeholder:text-text-secondary/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            />
          </div>

          <div>
            <label htmlFor="bs-slip" className="block text-xs font-semibold text-text-heading">
              แนบสลิปชำระเงิน (ถ้ามี)
            </label>
            <p className="mt-0.5 text-[11px] text-text-secondary">
              หากชำระเงินแล้ว สามารถแนบสลิปได้ที่นี่ หรือแนบทีหลังใน Invoice
            </p>
            <div className="mt-1.5 flex items-center gap-3">
              <label className="cursor-pointer inline-flex items-center gap-2 rounded-md border border-border/70 bg-bg px-4 py-3 text-xs font-medium text-text-body transition-colors hover:bg-bg-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
                <span>📎 เลือกไฟล์สลิป</span>
                <input
                  id="bs-slip"
                  type="file"
                  accept="image/*"
                  onChange={handleSlipChange}
                  className="hidden"
                />
              </label>
              {slipFile && (
                <span className="text-xs text-text-secondary truncate max-w-[200px]">
                  {slipFile.name}
                </span>
              )}
            </div>
            {slipError && <p className="mt-1 text-[11px] text-error">{slipError}</p>}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-border/40">
            <p className="text-[11px] text-text-secondary">
              * ฟิลด์ที่ต้องกรอก — ค่าบริการ 399 บาท (ชำระผ่าน PromptPay)
            </p>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-8 py-3 text-sm font-semibold text-text-inverse shadow-sm transition-all hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-text-inverse border-t-transparent" />
                  <span>กำลังดำเนินการ...</span>
                </>
              ) : (
                <span>ยืนยันการจอง{slipFile ? " & แนบสลิป" : ""}</span>
              )}
            </button>
          </div>
          </form>
        </div>
      </div>
    </section>
  );
}
