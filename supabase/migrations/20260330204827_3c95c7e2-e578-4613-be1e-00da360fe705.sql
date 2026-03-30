CREATE TABLE public.daily_ideas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  source_event text NOT NULL,
  source_url text,
  tag text NOT NULL,
  is_featured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_daily_ideas_date ON public.daily_ideas (date);

ALTER TABLE public.daily_ideas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read for daily_ideas"
  ON public.daily_ideas FOR SELECT
  USING (true);