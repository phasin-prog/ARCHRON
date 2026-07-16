"use client";

import { useMemo } from "react";
import {
  DEFAULT_PRICING,
  isPricingPageData,
  parsePricingData,
  type PricingPageData,
} from "@/lib/content/guide/pricing-data";

type GuidePricingEditorProps = {
  bodyMarkdown: string;
  onChange: (bodyMarkdown: string) => void;
};

const inputClass = "mt-1 w-full rounded-md border border-text-heading/15 bg-bg-card px-3 py-2 text-sm text-text-heading outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/30";
const labelClass = "block text-sm font-medium text-text-body";

export function GuidePricingEditor({ bodyMarkdown, onChange }: GuidePricingEditorProps) {
  const parsed = useMemo(() => {
    try {
      return JSON.parse(bodyMarkdown) as unknown;
    } catch {
      return null;
    }
  }, [bodyMarkdown]);
  const usesFallback = !isPricingPageData(parsed);
  const data = useMemo(() => parsePricingData(bodyMarkdown), [bodyMarkdown]);

  const updateData = (updater: (current: PricingPageData) => PricingPageData) => {
    onChange(JSON.stringify(updater(data), null, 2));
  };

  return (
    <section id="guide-pricing-form" className="rounded-xl border border-accent/25 bg-bg-card p-5 shadow-xs sm:p-7">
      <div className="border-b border-border pb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Guide</p>
        <h2 className="mt-1 font-heading text-2xl font-semibold text-text-heading">ราคาและกิจกรรมพิเศษ</h2>
        <p className="mt-2 text-sm leading-relaxed text-text-secondary">
          แก้ไขข้อมูลที่แสดงในหน้า Guide ได้โดยตรง ข้อมูลนี้ไม่ใช่บทความและจะไม่แสดงในคลังความรู้
        </p>
      </div>

      {usesFallback && (
        <p className="mt-5 rounded-lg border border-amber-400/40 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          ข้อมูลเดิมมีรูปแบบไม่สมบูรณ์ จึงแสดงค่าเริ่มต้นให้ตรวจทานก่อนบันทึก
        </p>
      )}

      <div className="mt-6 space-y-8">
        <section>
          <h3 className="font-heading text-lg font-semibold text-text-heading">ค่าบริการมาตรฐาน</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className={labelClass}>
              ชื่อบริการ
              <input className={inputClass} value={data.standard.title} onChange={(event) => updateData((current) => ({ ...current, standard: { ...current.standard, title: event.target.value } }))} />
            </label>
            <label className={labelClass}>
              ราคาต่อครั้ง
              <input className={inputClass} type="number" min="0" value={data.standard.price} onChange={(event) => updateData((current) => ({ ...current, standard: { ...current.standard, price: Number(event.target.value) || 0 } }))} />
            </label>
            <label className={labelClass}>
              คำกำกับราคา
              <input className={inputClass} value={data.standard.priceLabel} onChange={(event) => updateData((current) => ({ ...current, standard: { ...current.standard, priceLabel: event.target.value } }))} />
            </label>
            <label className={labelClass}>
              หมายเหตุราคา
              <input className={inputClass} value={data.standard.priceNote} onChange={(event) => updateData((current) => ({ ...current, standard: { ...current.standard, priceNote: event.target.value } }))} />
            </label>
            <label className={`${labelClass} sm:col-span-2`}>
              คำอธิบายบริการ
              <textarea className={inputClass} rows={3} value={data.standard.subtitle} onChange={(event) => updateData((current) => ({ ...current, standard: { ...current.standard, subtitle: event.target.value } }))} />
            </label>
            <label className={labelClass}>
              ข้อความปุ่มจอง
              <input className={inputClass} value={data.standard.cta} onChange={(event) => updateData((current) => ({ ...current, standard: { ...current.standard, cta: event.target.value } }))} />
            </label>
            <label className={labelClass}>
              ข้อความท้ายส่วนราคา
              <input className={inputClass} value={data.standard.footer} onChange={(event) => updateData((current) => ({ ...current, standard: { ...current.standard, footer: event.target.value } }))} />
            </label>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between gap-3">
              <h4 className="font-medium text-text-heading">สิ่งที่รวมในบริการ</h4>
              <button type="button" onClick={() => updateData((current) => ({ ...current, standard: { ...current.standard, includedItems: [...current.standard.includedItems, { bold: "", detail: "" }] } }))} className="rounded-md border border-accent/35 px-3 py-1.5 text-sm font-semibold text-accent hover:bg-accent/10">
                เพิ่มรายการ
              </button>
            </div>
            <div className="mt-3 space-y-3">
              {data.standard.includedItems.map((item, index) => (
                <div key={`${index}-${item.bold}`} className="rounded-lg border border-border bg-bg p-4">
                  <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
                    <label className={labelClass}>
                      หัวข้อ
                      <input className={inputClass} value={item.bold} onChange={(event) => updateData((current) => ({ ...current, standard: { ...current.standard, includedItems: current.standard.includedItems.map((included, itemIndex) => itemIndex === index ? { ...included, bold: event.target.value } : included) } }))} />
                    </label>
                    <label className={labelClass}>
                      รายละเอียด
                      <input className={inputClass} value={item.detail} onChange={(event) => updateData((current) => ({ ...current, standard: { ...current.standard, includedItems: current.standard.includedItems.map((included, itemIndex) => itemIndex === index ? { ...included, detail: event.target.value } : included) } }))} />
                    </label>
                    <button type="button" onClick={() => updateData((current) => ({ ...current, standard: { ...current.standard, includedItems: current.standard.includedItems.filter((_, itemIndex) => itemIndex !== index) } }))} className="rounded-md border border-red-300 px-3 py-2 text-sm text-red-700 hover:bg-red-50">
                      ลบ
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-border pt-7">
          <h3 className="font-heading text-lg font-semibold text-text-heading">กิจกรรมพิเศษ</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className={labelClass}>
              ป้ายกิจกรรม
              <input className={inputClass} value={data.specialEvent.badge} onChange={(event) => updateData((current) => ({ ...current, specialEvent: { ...current.specialEvent, badge: event.target.value } }))} />
            </label>
            <label className={labelClass}>
              ป้ายวันที่
              <input className={inputClass} value={data.specialEvent.label} onChange={(event) => updateData((current) => ({ ...current, specialEvent: { ...current.specialEvent, label: event.target.value } }))} />
            </label>
            <label className={labelClass}>
              วันที่กิจกรรม
              <input className={inputClass} value={data.specialEvent.date} onChange={(event) => updateData((current) => ({ ...current, specialEvent: { ...current.specialEvent, date: event.target.value } }))} />
            </label>
            <label className={labelClass}>
              ชื่อกิจกรรม
              <input className={inputClass} value={data.specialEvent.title} onChange={(event) => updateData((current) => ({ ...current, specialEvent: { ...current.specialEvent, title: event.target.value } }))} />
            </label>
            <label className={`${labelClass} sm:col-span-2`}>
              คำโปรยกิจกรรม
              <textarea className={inputClass} rows={2} value={data.specialEvent.subtitle} onChange={(event) => updateData((current) => ({ ...current, specialEvent: { ...current.specialEvent, subtitle: event.target.value } }))} />
            </label>
            <label className={`${labelClass} sm:col-span-2`}>
              รายละเอียดกิจกรรม
              <textarea className={inputClass} rows={5} value={data.specialEvent.description} onChange={(event) => updateData((current) => ({ ...current, specialEvent: { ...current.specialEvent, description: event.target.value } }))} />
            </label>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between gap-3">
              <h4 className="font-medium text-text-heading">เงื่อนไขกิจกรรม</h4>
              <button type="button" onClick={() => updateData((current) => ({ ...current, specialEvent: { ...current.specialEvent, conditions: [...current.specialEvent.conditions, { step: String(current.specialEvent.conditions.length + 1), text: "" }] } }))} className="rounded-md border border-accent/35 px-3 py-1.5 text-sm font-semibold text-accent hover:bg-accent/10">
                เพิ่มเงื่อนไข
              </button>
            </div>
            <div className="mt-3 space-y-3">
              {data.specialEvent.conditions.map((condition, index) => (
                <div key={`${index}-${condition.step}`} className="rounded-lg border border-border bg-bg p-4">
                  <div className="grid gap-3 sm:grid-cols-[96px_1fr_auto] sm:items-end">
                    <label className={labelClass}>
                      ลำดับ
                      <input className={inputClass} value={condition.step} onChange={(event) => updateData((current) => ({ ...current, specialEvent: { ...current.specialEvent, conditions: current.specialEvent.conditions.map((item, itemIndex) => itemIndex === index ? { ...item, step: event.target.value } : item) } }))} />
                    </label>
                    <label className={labelClass}>
                      เงื่อนไข
                      <input className={inputClass} value={condition.text} onChange={(event) => updateData((current) => ({ ...current, specialEvent: { ...current.specialEvent, conditions: current.specialEvent.conditions.map((item, itemIndex) => itemIndex === index ? { ...item, text: event.target.value } : item) } }))} />
                    </label>
                    <button type="button" onClick={() => updateData((current) => ({ ...current, specialEvent: { ...current.specialEvent, conditions: current.specialEvent.conditions.filter((_, itemIndex) => itemIndex !== index) } }))} className="rounded-md border border-red-300 px-3 py-2 text-sm text-red-700 hover:bg-red-50">
                      ลบ
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <label className={`${labelClass} mt-6`}>
            หมายเหตุท้ายกิจกรรม
            <textarea className={inputClass} rows={3} value={data.specialEvent.disclaimer} onChange={(event) => updateData((current) => ({ ...current, specialEvent: { ...current.specialEvent, disclaimer: event.target.value } }))} />
          </label>
        </section>
      </div>
    </section>
  );
}
