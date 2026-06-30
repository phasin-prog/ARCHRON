-- supabase/migrations/20260630_table_editor_links.sql
-- Add foreign key constraints to link entries, profiles, comments, and page_views tables.

-- 1. Link comments (slug) ➔ entries (slug)
ALTER TABLE public.comments 
ADD CONSTRAINT comments_slug_fkey 
FOREIGN KEY (slug) REFERENCES public.entries(slug) 
ON DELETE CASCADE;

-- 2. Link page_views (slug) ➔ entries (slug)
ALTER TABLE public.page_views 
ADD CONSTRAINT page_views_slug_fkey 
FOREIGN KEY (slug) REFERENCES public.entries(slug) 
ON DELETE CASCADE;
