CREATE TABLE public.installs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  engine text NOT NULL,
  version text NOT NULL,
  site_url text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.installs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read installs" ON public.installs FOR SELECT TO public USING (true);
CREATE POLICY "Public can insert installs" ON public.installs FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Service role full access installs" ON public.installs FOR ALL TO service_role USING (true) WITH CHECK (true);