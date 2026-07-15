"use client";

import { ArrowRightIcon } from "@/components/icons";

interface PricingSectionProps {
  onBookClick: () => void;
  onPreviewInvoiceClick?: () => void;
}

export function PricingSection({ onBookClick, onPreviewInvoiceClick }: PricingSectionProps) {
  return (
    <section id="pricing" className="border-b border-border/30 bg-bg px-6 py-20 lg:py-24">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-accent/85">
            Transparent & Consulting Rates
          </span>
          <h2 className="mt-3 font-serif text-3xl font-bold text-text-heading md:text-4xl">
            ค่าบริการและเงื่อนไขการวิเคราะห์
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-text-secondary/85 md:text-base">
            อัตราค่าบริการมาตรฐานที่โปร่งใส ครอบคลุมการสัมภาษณ์ 90 นาที และรายงานสรุปรายบุคคล พร้อมสิทธิพิเศษในโอกาสพิเศษ
          </p>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-12 lg:items-stretch">
          {/* Primary Rate Card */}
          <div className="flex flex-col justify-between rounded-xl border-2 border-accent bg-bg-card p-8 shadow-[0_16px_50px_rgba(140,21,21,0.08)] lg:col-span-6 md:p-10">
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded bg-accent/10 px-3 py-1 font-mono text-[11px] font-bold tracking-wider text-accent uppercase">
                  STANDARD CONSULTING RATE
                </span>
                <span className="text-xs font-semibold text-success">
                  • ว่างรับคิวประจำสัปดาห์นี้
                </span>
              </div>

              <h3 className="mt-6 font-serif text-2xl font-bold text-text-heading">
                Jungian Type Analysis Session
              </h3>
              <p className="mt-1.5 text-xs text-text-secondary/80">
                บริการวิเคราะห์โครงสร้างตัวตนและปรึกษาเชิงลึกแบบ 1-on-1
              </p>

              <div className="mt-8 flex items-baseline gap-2 border-y border-border/40 py-6">
                <span className="font-serif text-5xl font-bold text-text-heading md:text-6xl">
                  399
                </span>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-text-heading">บาท / ครั้ง</span>
                  <span className="text-[11px] text-text-secondary/70">
                    (ผ่านพ้นกำหนดราคатดลอง 249 บาท เมื่อ 30 มิ.ย. 69)
                  </span>
                </div>
              </div>

              <div className="mt-6 space-y-3.5">
                <span className="block text-xs font-semibold tracking-wider text-text-secondary/80 uppercase">
                  สิ่งที่รวมอยู่ในอัตราบริการนี้ (What&apos;s Included):
                </span>
                <div className="flex items-start gap-3 text-xs leading-relaxed text-text-body">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-success/15 font-bold text-success">✓</span>
                  <span><strong>เซสชันสัมภาษณ์ออนไลน์ 90 นาที</strong> แบบส่วนตัว 1-on-1 ผ่าน Video Conference</span>
                </div>
                <div className="flex items-start gap-3 text-xs leading-relaxed text-text-body">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-success/15 font-bold text-success">✓</span>
                  <span><strong>รายงานสรุปรายบุคคล 2–3 หน้า</strong> จัดส่งผ่าน PDF และบันทึกใน Client Portal</span>
                </div>
                <div className="flex items-start gap-3 text-xs leading-relaxed text-text-body">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-success/15 font-bold text-success">✓</span>
                  <span><strong>วิเคราะห์ Function Stack &amp; Stress Loop</strong> เพื่อการตระหนักรู้และนำไปพัฒนาต่อ</span>
                </div>
                <div className="flex items-start gap-3 text-xs leading-relaxed text-text-body">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-success/15 font-bold text-success">✓</span>
                  <span><strong>เปิดพื้นที่ติดตามผล</strong> สอบถามข้อสงสัยเพิ่มเติมหลังอ่านรายงานได้โดยตรง</span>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <button
                type="button"
                onClick={onBookClick}
                className="group flex w-full items-center justify-center gap-2 rounded-md bg-accent py-4 text-sm font-semibold text-text-inverse shadow-[0_4px_14px_rgba(140,21,21,0.25)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              >
                <span>จองคิวนัดหมาย (Book Session)</span>
                <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>

              {onPreviewInvoiceClick && (
                <button
                  type="button"
                  onClick={onPreviewInvoiceClick}
                  className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-md border border-accent/40 bg-accent/10 py-3 text-xs font-semibold text-accent transition-all duration-200 hover:bg-accent/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <span>📄 ดูตัวอย่างใบแจ้งยอด (รอชำระเงิน)</span>
                </button>
              )}

              <div className="mt-3 text-center text-[11px] text-text-secondary/75">
                <span className="font-semibold text-accent/90">ไม่มีค่าใช้จ่ายแฝงใดๆ ทั้งสิ้น</span> · ชำระเงินผ่าน PromptPay หรือโอนธนาคารเมื่อจองสำเร็จ
              </div>
            </div>
          </div>

          {/* Special Brand Promotion Card */}
          <div className="flex flex-col justify-between rounded-xl border border-border/60 bg-gradient-to-br from-bg-card via-bg-card/70 to-bg-elevated/40 p-8 lg:col-span-6 md:p-10">
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded bg-premium/15 px-3 py-1 font-mono text-[11px] font-bold tracking-wider text-premium uppercase">
                  SPECIAL EVENT
                </span>
                <span className="font-serif text-xs italic text-premium">
                  16 กรกฎาคม 2569
                </span>
              </div>

              <h3 className="mt-6 font-serif text-2xl font-bold text-text-heading">
                กิจกรรมพิเศษวันเกิดแบรนด์ Archron
              </h3>
              <p className="mt-1.5 font-serif text-sm italic text-premium">
                สิทธิ์พิเศษวิเคราะห์ฟรี (จำนวนจำกัด 5 สิทธิ์ อิงตามลำดับเวลา)
              </p>

              <p className="mt-4 text-xs leading-relaxed text-text-secondary/90">
                ในโอกาสครบรอบการรีแบรนด์ครั้งสำคัญจากชื่อเดิม <strong>The Soul&apos;s Compass - Moonlight</strong> สู่บ้านหลังใหม่ในนาม <strong>Archron</strong> เราเปิดรับสิทธิ์วิเคราะห์และสัมภาษณ์ฟรีสำหรับผู้ร่วมกิจกรรมครบถ้วนตามเงื่อนไขดังนี้:
              </p>

              <div className="mt-6 space-y-3.5 border-t border-border/30 pt-6">
                <div className="flex items-start gap-3 text-xs leading-relaxed text-text-body">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-premium/20 font-bold text-premium">1</span>
                  <span>อวยพรวันเกิดเพจในโพสต์กิจกรรมหลักประจำวันที่ <strong>16 กรกฎาคม 2569</strong></span>
                </div>
                <div className="flex items-start gap-3 text-xs leading-relaxed text-text-body">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-premium/20 font-bold text-premium">2</span>
                  <span>แชร์โพสต์โปรโมตกิจกรรมการรีแบรนด์ไปยังโปรไฟล์ส่วนตัวของคุณพร้อมเปิดสาธารณะ</span>
                </div>
                <div className="flex items-start gap-3 text-xs leading-relaxed text-text-body">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-premium/20 font-bold text-premium">3</span>
                  <span>ตกลงส่งรีวิวสะท้อนผลการสัมภาษณ์ตามความเป็นจริงผ่านหน้าเพจ Archron หลังเสร็จสิ้นเซสชัน</span>
                </div>
              </div>
            </div>

            <div className="mt-10 rounded-lg border border-border/40 bg-bg/60 p-4 text-xs leading-relaxed text-text-secondary/80 italic">
              * กิจกรรมสิทธิ์พิเศษนี้จัดทำขึ้นและตรวจสอบสิทธิ์โดยตรงผ่านช่องทาง Official Facebook Page ของ Archron เท่านั้น สามารถติดต่อทีมงานเพื่อเช็คสถานะสิทธิ์คงเหลือได้ตลอดเวลา
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
