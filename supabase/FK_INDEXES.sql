-- =========================================================
-- Archron — FK INDEXES (เพิ่ม index สำหรับ Foreign Key ที่ขาด)
-- คัดลอก → Supabase SQL Editor → Run
-- Idempotent — รันซ้ำได้ปลอดภัย
-- =========================================================
-- ปัญหา: FK columns ที่ไม่มี index ทำให้ PostgreSQL
--         ต้อง seq scan ตารางลูกทุกครั้งที่ parent row
--         ถูก DELETE/UPDATE — กิน CPU/RAM ของ Supabase เปล่าๆ
-- =========================================================

-- 1) comments.slug → entries.slug
--    มี composite index (section, slug, created_at) อยู่แล้ว
--    แต่ slug อยู่คอลัมน์ที่ 2 ใช้ไม่ได้สำหรับ pure FK lookup
--    เพิ่ม dedicated index เพื่อให้ DELETE/UPDATE entries
--    ตรวจสอบ comments ได้ทันที
create index if not exists comments_slug_idx
  on public.comments (slug);

-- =========================================================
-- ตรวจสอบว่า index ทั้งหมดถูกต้อง
-- =========================================================
-- SELECT
--   indexrelname AS index_name,
--   tablename,
--   indexdef
-- FROM pg_indexes
-- WHERE schemaname = 'public'
-- ORDER BY tablename, indexname;
