
-- Add columns for paid listings with rich product pages
ALTER TABLE public.submissions 
  ADD COLUMN IF NOT EXISTS slug text UNIQUE,
  ADD COLUMN IF NOT EXISTS description text,
  ADD COLUMN IF NOT EXISTS features text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS logo_url text,
  ADD COLUMN IF NOT EXISTS screenshot_url text,
  ADD COLUMN IF NOT EXISTS is_paid boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS polar_customer_id text,
  ADD COLUMN IF NOT EXISTS polar_subscription_id text;

-- Generate slugs for existing rows
UPDATE public.submissions SET slug = lower(replace(name, ' ', '-')) WHERE slug IS NULL;

-- Allow public reads of paid submission detail pages
CREATE POLICY "Anyone can read paid submission details"
  ON public.submissions
  FOR SELECT
  USING (is_paid = true);

-- Allow updating submissions (for enriching product info after payment)
CREATE POLICY "Submissions can be updated by matching polar_customer_id"
  ON public.submissions
  FOR UPDATE
  USING (true)
  WITH CHECK (true);
