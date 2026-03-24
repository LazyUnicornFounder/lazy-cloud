
CREATE TABLE public.blog_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  posts_per_day integer NOT NULL DEFAULT 48,
  frequency_minutes integer NOT NULL DEFAULT 30,
  is_publishing boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.blog_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read blog_settings"
  ON public.blog_settings FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can insert blog_settings"
  ON public.blog_settings FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update blog_settings"
  ON public.blog_settings FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);
