"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import { Modal } from "@/components/modal";
import type { BookingFormData } from "@/components/guide/types";

interface BookingDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmitSuccess: (data: BookingFormData) => void;
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

export function BookingDialog({ open, onClose, onSubmitSuccess }: BookingDialogProps) {
  const [formData, setFormData] = useState<BookingFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error on type
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    setSubmitError(null);
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "กรุณาระบุชื่อจริง";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "กรุณาระบุนามสกุล";
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "กรุณาระบุอีเมลที่ถูกต้อง (เช่น yourname@domain.com)";
    }
    if (!formData.phone.trim() || formData.phone.trim().length < 9) {
      newErrors.phone = "กรุณาระบุเบอร์โทรศัพท์ติดต่อ (อย่างน้อย 9 หลัก)";
    }
    if (!formData.preferredDate) {
      newErrors.preferredDate = "กรุณาเลือกวันที่ต้องการนัดหมาย";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Simulate clean async submission & invoice generation delay
      await new Promise((resolve) => setTimeout(resolve, 600));
      setIsSubmitting(false);
      onSubmitSuccess(formData);
    } catch (err) {
      setIsSubmitting(false);
      setSubmitError("เกิดข้อผิดพลาดในการประมวลผลข้อมูล กรุณาลองใหม่อีกครั้ง");
    }
  };

  // Get tomorrow date string in YYYY-MM-DD for min date picker
  const getMinDateString = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="จองเซสชันวิเคราะห์และสัมภาษณ์เชิงลึก"
      className="w-[min(95%,660px)]"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-md border border-border/70 bg-bg-card px-5 py-2.5 text-xs font-medium text-text-body transition-colors hover:bg-bg-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50"
          >
            ยกเลิก
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-6 py-2.5 text-xs font-semibold text-text-inverse shadow-sm transition-all hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <span
                  className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-text-inverse border-t-transparent"
                  aria-hidden="true"
                />
                <span>กำลังสร้างใบแจ้งยอด...</span>
              </>
            ) : (
              <span>ยืนยันการจอง &amp; ออกใบแจ้งยอด</span>
            )}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5 text-sm" noValidate>
        {submitError && (
          <div className="rounded-md border border-error/40 bg-error/10 p-3.5 text-xs text-error">
            {submitError}
          </div>
        )}

        <div className="rounded-lg border border-accent/20 bg-accent/5 p-3.5 text-xs text-text-body">
          <span className="font-semibold text-accent">บริการที่เลือก:</span>{" "}
          {formData.service}
        </div>

        {/* Name Grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="firstName" className="block text-xs font-semibold text-text-heading">
              ชื่อจริง <span className="text-accent">*</span>
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              required
              value={formData.firstName}
              onChange={handleChange}
              placeholder="ระบุชื่อจริงของคุณ"
              aria-invalid={!!errors.firstName}
              className={`mt-1.5 w-full rounded-md border bg-bg px-3 py-2.5 text-sm text-text-heading placeholder:text-text-secondary/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                errors.firstName ? "border-error focus-visible:ring-error" : "border-border/70"
              }`}
            />
            {errors.firstName && (
              <p className="mt-1 text-[11px] text-error">{errors.firstName}</p>
            )}
          </div>

          <div>
            <label htmlFor="lastName" className="block text-xs font-semibold text-text-heading">
              นามสกุล <span className="text-accent">*</span>
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              required
              value={formData.lastName}
              onChange={handleChange}
              placeholder="ระบุนามสกุลของคุณ"
              aria-invalid={!!errors.lastName}
              className={`mt-1.5 w-full rounded-md border bg-bg px-3 py-2.5 text-sm text-text-heading placeholder:text-text-secondary/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                errors.lastName ? "border-error focus-visible:ring-error" : "border-border/70"
              }`}
            />
            {errors.lastName && (
              <p className="mt-1 text-[11px] text-error">{errors.lastName}</p>
            )}
          </div>
        </div>

        {/* Contact Grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-text-heading">
              อีเมลติดต่อ (สำหรับส่งรายงาน PDF) <span className="text-accent">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="yourname@domain.com"
              aria-invalid={!!errors.email}
              className={`mt-1.5 w-full rounded-md border bg-bg px-3 py-2.5 text-sm text-text-heading placeholder:text-text-secondary/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                errors.email ? "border-error focus-visible:ring-error" : "border-border/70"
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-[11px] text-error">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-xs font-semibold text-text-heading">
              เบอร์โทรศัพท์ (สำหรับแจ้งคิว/PromptPay) <span className="text-accent">*</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              value={formData.phone}
              onChange={handleChange}
              placeholder="08X-XXX-XXXX"
              aria-invalid={!!errors.phone}
              className={`mt-1.5 w-full rounded-md border bg-bg px-3 py-2.5 text-sm text-text-heading placeholder:text-text-secondary/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                errors.phone ? "border-error focus-visible:ring-error" : "border-border/70"
              }`}
            />
            {errors.phone && (
              <p className="mt-1 text-[11px] text-error">{errors.phone}</p>
            )}
          </div>
        </div>

        {/* Date & Time Grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="preferredDate" className="block text-xs font-semibold text-text-heading">
              เลือกวันที่ต้องการนัดหมาย <span className="text-accent">*</span>
            </label>
            <input
              id="preferredDate"
              name="preferredDate"
              type="date"
              min={getMinDateString()}
              required
              value={formData.preferredDate}
              onChange={handleChange}
              aria-invalid={!!errors.preferredDate}
              className={`mt-1.5 w-full rounded-md border bg-bg px-3 py-2.5 text-sm text-text-heading transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                errors.preferredDate ? "border-error focus-visible:ring-error" : "border-border/70"
              }`}
            />
            {errors.preferredDate && (
              <p className="mt-1 text-[11px] text-error">{errors.preferredDate}</p>
            )}
          </div>

          <div>
            <label htmlFor="preferredTime" className="block text-xs font-semibold text-text-heading">
              เลือกช่วงเวลาที่สะดวก
            </label>
            <select
              id="preferredTime"
              name="preferredTime"
              value={formData.preferredTime}
              onChange={handleChange}
              className="mt-1.5 w-full rounded-md border border-border/70 bg-bg px-3 py-2.5 text-sm text-text-heading transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <option value="ช่วงเช้า (09:30 - 11:00 น.)">ช่วงเช้า (09:30 - 11:00 น.)</option>
              <option value="ช่วงบ่าย (13:30 - 15:00 น.)">ช่วงบ่าย (13:30 - 15:00 น.)</option>
              <option value="ช่วงค่ำ (19:00 - 20:30 น.)">ช่วงค่ำ (19:00 - 20:30 น.)</option>
            </select>
          </div>
        </div>

        {/* Timezone */}
        <div>
          <label htmlFor="timezone" className="block text-xs font-semibold text-text-heading">
            เขตเวลา (Timezone)
          </label>
          <input
            id="timezone"
            name="timezone"
            type="text"
            readOnly
            value={formData.timezone}
            className="mt-1.5 w-full cursor-not-allowed rounded-md border border-border/50 bg-bg-elevated/60 px-3 py-2 text-xs text-text-secondary"
          />
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-xs font-semibold text-text-heading">
            ข้อความเพิ่มเติม หรือประเด็นที่อยากโฟกัสเป็นพิเศษ (ถ้ามี)
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            value={formData.notes}
            onChange={handleChange}
            placeholder="เช่น อยากเข้าใจแนวโน้มฟังก์ชันที่ทำให้เครียดตอนทำงาน, ข้อสงสัยเรื่อง Extraversion/Introversion ฯลฯ"
            className="mt-1.5 w-full rounded-md border border-border/70 bg-bg px-3 py-2 text-sm text-text-heading placeholder:text-text-secondary/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          />
        </div>
      </form>
    </Modal>
  );
}
