-- =========================================================
-- Archron — Service Invoices & Bookings Table (Jungian Type Analysis)
-- =========================================================

create table if not exists public.service_invoices (
  id uuid primary key default gen_random_uuid(),
  invoice_number text unique not null,
  issue_date text not null,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  service_name text not null,
  appointment_date text not null,
  appointment_time text not null,
  amount numeric(10,2) not null default 399.00,
  status text not null default 'pending', -- 'pending' | 'paid' | 'cancelled' | 'completed'
  payment_method text not null default 'PromptPay QR Code',
  promptpay_number text not null default 'xxx-x-x6727-x (นาย พศิน พสุมาตร)',
  slip_image_url text, -- Cloudflare R2 URL for uploaded payment slips
  report_pdf_url text, -- Cloudflare R2 URL for uploaded 90-min analysis PDF report
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Add columns if table already exists
alter table public.service_invoices add column if not exists slip_image_url text;
alter table public.service_invoices add column if not exists report_pdf_url text;

-- Indexes for quick client portal lookups and status filtering
create index if not exists idx_service_invoices_number on public.service_invoices(invoice_number);
create index if not exists idx_service_invoices_email on public.service_invoices(customer_email);
create index if not exists idx_service_invoices_status on public.service_invoices(status);

-- Enable Row Level Security (RLS)
alter table public.service_invoices enable row level security;

-- Policies
-- 1) Allow public/anon to read service invoices (for verifying and loading client portal)
create policy "Allow read access to service invoices"
  on public.service_invoices for select
  using (true);

-- 2) Allow public/anon to create/insert service invoices when booking
create policy "Allow insert access for booking submission"
  on public.service_invoices for insert
  with check (true);

-- 3) Allow updates (e.g. status changes upon payment verification)
create policy "Allow update access for payment verification"
  on public.service_invoices for update
  using (true)
  with check (true);
