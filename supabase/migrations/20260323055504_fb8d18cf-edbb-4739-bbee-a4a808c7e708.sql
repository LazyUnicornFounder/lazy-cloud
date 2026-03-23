CREATE TABLE public.early_access (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  source text DEFAULT 'lazy-blogger',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.early_access ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert early access" ON public.early_access
  FOR INSERT TO anon, authenticated WITH CHECK (true);
