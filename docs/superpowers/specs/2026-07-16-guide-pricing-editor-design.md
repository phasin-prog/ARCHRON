# Guide Pricing Editor — Design Spec

## Goal
ให้ข้อมูลส่วนราคา (Standard Rate) และกิจกรรมพิเศษ (Special Event) ในหน้า Guide สามารถแก้ไขผ่าน Studio Editor ได้ โดยไม่ต้องแก้ SQL schema

## Data Flow
```
guide/page.tsx (async server component)
  → getPublicEntryBySlug("guide-pricing")
  → parsePricingData(entry.bodyMarkdown) → PricingPageData
  → ส่ง props → JungianServicePlatform → PricingSection
```

## Seed Entry
- slug: `guide-pricing`
- contentType: `article` (ใช้ระบบเดิม ไม่ต้องเพิ่ม content type ใหม่)
- bodyMarkdown: JSON string ที่มี structure ของทั้ง 2 การ์ด
- Fallback เมื่อยังไม่มี published entry ใน DB

## Component Changes

### New file: `src/lib/content/guide/pricing-data.ts`
- Interfaces: `StandardRateData`, `SpecialEventData`, `PricingPageData`
- `parsePricingData(bodyMarkdown: string): PricingPageData`
- `DEFAULT_PRICING: PricingPageData` (ข้อมูลปัจจุบันที่เคย hardcoded)

### guide/page.tsx
- เปลี่ยนเป็น async server component
- เรียก `getPublicEntryBySlug("guide-pricing")`
- แปลง JSON → PricingPageData
- ส่งเป็น prop ให้ JungianServicePlatform

### jungian-service-platform.tsx
- รับ prop `pricingData?: PricingPageData` (optional, fallback เป็น default)
- ส่งต่อไปยัง `<PricingSection>`

### pricing-card.tsx
- รับ `data: PricingPageData` props
- Render การ์ดจาก data แทน hardcoded
- เพิ่ม Edit button ที่แต่ละ card (visible เมื่อมี write permission)
- Edit button → `<Link href="/studio/editor?slug=guide-pricing">`

## Security
- Edit button แสดงเฉพาะเมื่อ user มีสิทธิ์ `canWrite` (เช็คผ่าน useAuth + role)
- ลิงก์ไปหน้า editor ซึ่งมี auth gate อยู่แล้ว

## Files Modified
1. `src/lib/content/guide/pricing-data.ts` (NEW)
2. `src/lib/content/core/seeds/entries.ts` (add seed entry)
3. `src/app/guide/page.tsx` (async, fetch data)
4. `src/components/guide/jungian-service-platform.tsx` (accept prop)
5. `src/components/guide/pricing-card.tsx` (dynamic + edit btn)
