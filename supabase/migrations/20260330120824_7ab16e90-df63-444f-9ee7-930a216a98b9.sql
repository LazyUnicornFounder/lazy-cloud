CREATE TABLE public.watch_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  is_running boolean NOT NULL DEFAULT false,
  setup_complete boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.watch_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read for watch_settings"
  ON public.watch_settings FOR SELECT
  USING (true);
