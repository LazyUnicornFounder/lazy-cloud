
-- Stream settings
CREATE TABLE public.stream_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  twitch_client_id text,
  twitch_client_secret text,
  twitch_username text,
  twitch_user_id text,
  site_url text,
  business_name text,
  content_niche text,
  is_running boolean NOT NULL DEFAULT true,
  setup_complete boolean NOT NULL DEFAULT false,
  recap_template_guidance text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Stream sessions
CREATE TABLE public.stream_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  twitch_stream_id text UNIQUE NOT NULL,
  title text NOT NULL,
  game_name text,
  started_at timestamptz,
  ended_at timestamptz,
  duration_minutes integer,
  peak_viewers integer,
  average_viewers integer,
  status text NOT NULL DEFAULT 'live',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Stream content
CREATE TABLE public.stream_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES public.stream_sessions(id) ON DELETE CASCADE,
  content_type text NOT NULL,
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  body text NOT NULL,
  target_keyword text,
  published_at timestamptz DEFAULT now(),
  status text NOT NULL DEFAULT 'published',
  views integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Stream clips
CREATE TABLE public.stream_clips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES public.stream_sessions(id) ON DELETE CASCADE,
  twitch_clip_id text UNIQUE NOT NULL,
  title text NOT NULL,
  clip_url text,
  thumbnail_url text,
  view_count integer DEFAULT 0,
  duration_seconds numeric,
  published_at timestamptz DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Stream transcripts
CREATE TABLE public.stream_transcripts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid UNIQUE REFERENCES public.stream_sessions(id) ON DELETE CASCADE,
  transcript_text text NOT NULL,
  word_count integer,
  processed_at timestamptz DEFAULT now()
);

-- Stream optimisation log
CREATE TABLE public.stream_optimisation_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type text,
  old_template text,
  new_template text,
  trigger_reason text,
  optimised_at timestamptz DEFAULT now()
);

-- Stream errors
CREATE TABLE public.stream_errors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  function_name text NOT NULL,
  error_message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- RLS policies (public read for content, settings restricted)
ALTER TABLE public.stream_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stream_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stream_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stream_clips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stream_transcripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stream_optimisation_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stream_errors ENABLE ROW LEVEL SECURITY;

-- Public read for content pages
CREATE POLICY "Public can read stream sessions" ON public.stream_sessions FOR SELECT USING (true);
CREATE POLICY "Public can read stream content" ON public.stream_content FOR SELECT USING (true);
CREATE POLICY "Public can read stream clips" ON public.stream_clips FOR SELECT USING (true);

-- Service role can do everything (edge functions use service role)
CREATE POLICY "Service can manage stream_settings" ON public.stream_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service can manage stream_sessions" ON public.stream_sessions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service can manage stream_content" ON public.stream_content FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service can manage stream_clips" ON public.stream_clips FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service can manage stream_transcripts" ON public.stream_transcripts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service can manage stream_optimisation_log" ON public.stream_optimisation_log FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service can manage stream_errors" ON public.stream_errors FOR ALL USING (true) WITH CHECK (true);

-- Enable realtime for live status
ALTER PUBLICATION supabase_realtime ADD TABLE public.stream_sessions;
