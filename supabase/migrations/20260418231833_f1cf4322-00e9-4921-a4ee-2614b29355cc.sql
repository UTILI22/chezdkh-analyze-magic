-- Add slug + sizes to products
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS slug text,
  ADD COLUMN IF NOT EXISTS sizes text[] NOT NULL DEFAULT ARRAY['S','M','L','XL','XXL']::text[];

CREATE UNIQUE INDEX IF NOT EXISTS products_slug_unique ON public.products(slug) WHERE slug IS NOT NULL;

-- Restrict public order reads: by default no one can SELECT.
-- We rely on .insert(...).select() returning the row to the same client session,
-- which works because INSERT...RETURNING returns the inserted row to the caller
-- without needing SELECT permission. So we drop the broad SELECT policy.
DROP POLICY IF EXISTS "Public can read order by id" ON public.orders;