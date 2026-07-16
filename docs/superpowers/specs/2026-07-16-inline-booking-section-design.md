# Inline Booking Section with Slip Upload — Guide Page

## Overview
Replace the modal-based `BookingDialog` with an inline booking form section on the Guide page, positioned directly under the `PricingSection`. Add slip attachment as part of the booking form so users can upload payment evidence at booking time.

## Current Flow (Baseline)
1. User clicks "จองเซสชันวิเคราะห์" → `BookingDialog` modal opens
2. User fills in name, email, phone, date, time, notes
3. User clicks "ยืนยันการจอง & ออกใบแจ้งยอด"
4. `BookingDialog` closes, invoice generated, `InvoiceModal` opens
5. Inside `InvoiceModal`, user can separately upload slip

## Target Flow
1. User scrolls to Pricing tab → sees pricing + inline booking form below
2. User fills in name, email, phone, date, time, notes
3. User optionally attaches slip (image file) from the form
4. User clicks "ยืนยันการจอง"
5. If slip provided → upload to Cloudflare R2 first
6. Invoice generated + upserted to Supabase + email sent
7. `InvoiceModal` opens (unchanged)

## Components

### New: `BookingSection` (`components/guide/booking-section.tsx`)
- Client component ("use client")
- Renders inline (no modal wrapper)
- Fields: firstName, lastName, email, phone, preferredDate, preferredTime, timezone (readonly), notes, slipFile (file input)
- Validation: same rules as current `BookingDialog` + optional file validation (image MIME, max 10MB)
- Props: `onSubmitSuccess: (formData: BookingFormData, slipFile?: File) => void`
- Submit button: "ยืนยันการจอง" (if no slip) / "ยืนยันการจอง & แนบสลิป" (if slip selected)
- Container styling: consistent with surrounding sections (max-w-5xl, bg-bg-card, rounded-xl, border)

### Removed: `BookingDialog` (`components/guide/booking-dialog.tsx`)
- Delete this file — no longer used

### Modified: `JungianServicePlatform` (`components/guide/jungian-service-platform.tsx`)
- Remove `bookingOpen` state
- Remove `BookingDialog` import and usage
- Add `BookingSection` under `<PricingSection>` in `platformTab === "pricing"` block
- Update `handleBookingSubmitSuccess` to accept optional `slipFile` parameter:
  - If `slipFile` provided → upload to R2 via `/api/upload/slip`
  - Then generate invoice as before
  - Then open `InvoiceModal`
- Keep all other logic unchanged

### Unchanged: `InvoiceModal` (`components/guide/invoice-modal.tsx`)
- Same flow — opens after booking with invoice data
- User can still upload slip here if they didn't at booking time

### Unchanged: Types (`components/guide/types.ts`)
- `BookingFormData` stays the same
- Slip file passed as separate param (not part of form data)

## Data Flow

```
BookingSection (inline form)
  → onSubmitSuccess(formData, slipFile?)
    → [if slipFile] fetch POST /api/upload/slip (multipart)
    → generateInvoiceNumber()
    → generateInvoiceData(formData, invoiceId)
    → upsertServiceInvoice(supabase, invoice)
    → fetch POST /api/email/notify-booking
    → setSelectedInvoice(invoice)
    → setInvoiceModalOpen(true)
```

## Error Handling
- Upload failure: show inline error in `BookingSection` (not modal), allow retry
- No slip: proceed without slip (user can upload later in `InvoiceModal`)
- Validation errors: inline field errors (same pattern as current `BookingDialog`)

## File Changes Summary
| File | Action |
|---|---|
| `components/guide/booking-section.tsx` | CREATE |
| `components/guide/jungian-service-platform.tsx` | EDIT |
| `components/guide/booking-dialog.tsx` | DELETE |

## Files NOT Changed
- `components/guide/invoice-modal.tsx` — stays the same
- `components/guide/types.ts` — stays the same
- `components/guide/pricing-card.tsx` — stays the same
- `app/guide/page.tsx` — stays the same
- `lib/content/invoices-db.ts` — stays the same
- `app/api/upload/slip/route.ts` — stays the same
