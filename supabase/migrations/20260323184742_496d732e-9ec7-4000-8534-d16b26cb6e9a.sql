
CREATE TABLE public.geo_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_name text NOT NULL,
  site_url text NOT NULL,
  business_description text NOT NULL,
  target_audience text NOT NULL,
  niche_topics text NOT NULL,
  competitors text NOT NULL,
  posts_per_day integer NOT NULL DEFAULT 2,
  is_running boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.geo_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read geo_settings" ON public.geo_settings FOR SELECT TO public USING (true);
CREATE POLICY "Anyone can insert geo_settings" ON public.geo_settings FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Anyone can update geo_settings" ON public.geo_settings FOR UPDATE TO public USING (true) WITH CHECK (true);

CREATE TABLE public.geo_queries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  query text NOT NULL,
  query_type text,
  has_content boolean NOT NULL DEFAULT false,
  brand_cited boolean NOT NULL DEFAULT false,
  priority integer NOT NULL DEFAULT 0,
  last_tested timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.geo_queries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read geo_queries" ON public.geo_queries FOR SELECT TO public USING (true);

CREATE TABLE public.geo_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  body text NOT NULL,
  excerpt text,
  target_query text,
  published_at timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'published'
);
ALTER TABLE public.geo_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read published geo_posts" ON public.geo_posts FOR SELECT TO public USING (status = 'published');

CREATE TABLE public.geo_citations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  query text NOT NULL,
  brand_mentioned boolean NOT NULL DEFAULT false,
  confidence text,
  reason text,
  tested_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.geo_citations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read geo_citations" ON public.geo_citations FOR SELECT TO public USING (true);

CREATE TABLE public.geo_errors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  error_message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.geo_errors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read geo_errors" ON public.geo_errors FOR SELECT TO public USING (true);
