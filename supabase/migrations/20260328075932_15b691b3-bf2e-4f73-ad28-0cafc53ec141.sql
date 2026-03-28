CREATE TABLE public.product_publish_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product text NOT NULL UNIQUE,
  seo_posts_per_day integer NOT NULL DEFAULT 1,
  geo_posts_per_day integer NOT NULL DEFAULT 1,
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.product_publish_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read product_publish_settings" ON public.product_publish_settings FOR SELECT TO public USING (true);
CREATE POLICY "Anyone can insert product_publish_settings" ON public.product_publish_settings FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Anyone can update product_publish_settings" ON public.product_publish_settings FOR UPDATE TO public USING (true) WITH CHECK (true);
