ALTER TABLE public.profiles
ADD COLUMN paid_tier text DEFAULT NULL,
ADD COLUMN polar_checkout_id text DEFAULT NULL;