
-- granola_settings
CREATE TABLE public.granola_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_name text,
  site_url text,
  meeting_types_to_process text DEFAULT 'all',
  publish_blog_posts boolean DEFAULT true,
  create_linear_issues boolean DEFAULT true,
  send_slack_summary boolean DEFAULT true,
  publish_product_updates boolean DEFAULT true,
  feed_customer_intelligence boolean DEFAULT true,
  weekly_digest_enabled boolean DEFAULT true,
  weekly_digest_day text DEFAULT 'monday',
  slack_webhook_url text,
  is_running boolean DEFAULT true,
  setup_complete boolean DEFAULT false,
  prompt_version text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.granola_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read granola_settings" ON public.granola_settings FOR SELECT USING (true);
CREATE POLICY "Public insert granola_settings" ON public.granola_settings FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update granola_settings" ON public.granola_settings FOR UPDATE USING (true);

-- granola_meetings
CREATE TABLE public.granola_meetings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  granola_meeting_id text UNIQUE,
  title text,
  meeting_type text,
  participants text,
  started_at timestamptz,
  ended_at timestamptz,
  duration_minutes integer,
  raw_notes text,
  enhanced_notes text,
  action_items text,
  decisions text,
  key_insights text,
  processed boolean DEFAULT false,
  processing_status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.granola_meetings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read granola_meetings" ON public.granola_meetings FOR SELECT USING (true);
CREATE POLICY "Public insert granola_meetings" ON public.granola_meetings FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update granola_meetings" ON public.granola_meetings FOR UPDATE USING (true);

-- granola_outputs
CREATE TABLE public.granola_outputs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id uuid REFERENCES public.granola_meetings(id),
  output_type text,
  title text,
  content text,
  published boolean DEFAULT false,
  published_at timestamptz,
  external_id text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.granola_outputs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read granola_outputs" ON public.granola_outputs FOR SELECT USING (true);
CREATE POLICY "Public insert granola_outputs" ON public.granola_outputs FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update granola_outputs" ON public.granola_outputs FOR UPDATE USING (true);

-- granola_intelligence
CREATE TABLE public.granola_intelligence (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id uuid REFERENCES public.granola_meetings(id),
  intel_type text,
  content text,
  speaker_context text,
  meeting_title text,
  meeting_date date,
  actioned boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.granola_intelligence ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read granola_intelligence" ON public.granola_intelligence FOR SELECT USING (true);
CREATE POLICY "Public insert granola_intelligence" ON public.granola_intelligence FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update granola_intelligence" ON public.granola_intelligence FOR UPDATE USING (true);

-- granola_errors
CREATE TABLE public.granola_errors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  function_name text,
  error_message text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.granola_errors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read granola_errors" ON public.granola_errors FOR SELECT USING (true);
CREATE POLICY "Public insert granola_errors" ON public.granola_errors FOR INSERT WITH CHECK (true);
