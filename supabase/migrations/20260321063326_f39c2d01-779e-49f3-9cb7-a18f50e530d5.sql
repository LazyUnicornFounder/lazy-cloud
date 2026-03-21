
-- Create visitors table for tracking
CREATE TABLE public.visitors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_hash text NOT NULL,
  country text,
  country_code text,
  city text,
  region text,
  latitude double precision,
  longitude double precision,
  user_agent text,
  page text,
  referrer text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.visitors ENABLE ROW LEVEL SECURITY;

-- No public read access - only service role (admin) can read
-- Insert allowed from edge function via service role

-- Index for analytics queries
CREATE INDEX idx_visitors_created_at ON public.visitors (created_at DESC);
CREATE INDEX idx_visitors_country_code ON public.visitors (country_code);
CREATE INDEX idx_visitors_ip_hash ON public.visitors (ip_hash);
