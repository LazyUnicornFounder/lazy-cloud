
ALTER TABLE public.seo_keywords ADD COLUMN IF NOT EXISTS product text DEFAULT 'general';
ALTER TABLE public.geo_queries ADD COLUMN IF NOT EXISTS product text DEFAULT 'general';
