
-- Create submissions table for the submit form
CREATE TABLE public.submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  tagline TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Anyone can insert a submission (public form)
CREATE POLICY "Anyone can submit a company"
ON public.submissions
FOR INSERT
WITH CHECK (true);

-- Only admins should read submissions (no public reads for now)
-- Submissions are reviewed internally
