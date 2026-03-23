
CREATE TABLE public.seo_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_url text NOT NULL,
  business_description text NOT NULL,
  target_keywords text NOT NULL,
  competitors text NOT NULL,
  publishing_frequency text NOT NULL DEFAULT '1',
  google_search_console_connected boolean NOT NULL DEFAULT false,
  is_running boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.seo_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read seo_settings" ON public.seo_settings FOR SELECT TO public USING (true);
CREATE POLICY "Anyone can insert seo_settings" ON public.seo_settings FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Anyone can update seo_settings" ON public.seo_settings FOR UPDATE TO public USING (true) WITH CHECK (true);

CREATE TABLE public.seo_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  body text NOT NULL,
  excerpt text,
  target_keyword text,
  published_at timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'published'
);

ALTER TABLE public.seo_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published seo_posts" ON public.seo_posts FOR SELECT TO public USING (status = 'published');

CREATE TABLE public.seo_keywords (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword text NOT NULL,
  current_position integer,
  previous_position integer,
  page_url text,
  last_checked timestamptz DEFAULT now()
);

ALTER TABLE public.seo_keywords ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read seo_keywords" ON public.seo_keywords FOR SELECT TO public USING (true);

CREATE TABLE public.seo_errors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  error_message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.seo_errors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read seo_errors" ON public.seo_errors FOR SELECT TO public USING (true);
