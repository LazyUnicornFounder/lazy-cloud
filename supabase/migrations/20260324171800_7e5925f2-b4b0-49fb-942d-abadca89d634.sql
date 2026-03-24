
-- Voice settings table
CREATE TABLE public.voice_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  elevenlabs_api_key text,
  voice_id text,
  podcast_title text,
  podcast_description text,
  podcast_author text,
  site_url text,
  is_running boolean NOT NULL DEFAULT true,
  setup_complete boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.voice_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read voice_settings" ON public.voice_settings
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert voice_settings" ON public.voice_settings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update voice_settings" ON public.voice_settings
  FOR UPDATE USING (true) WITH CHECK (true);

-- Voice episodes table
CREATE TABLE public.voice_episodes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid,
  post_slug text NOT NULL,
  post_title text NOT NULL,
  audio_url text,
  duration_seconds integer DEFAULT 0,
  file_size_bytes integer DEFAULT 0,
  status text NOT NULL DEFAULT 'processing',
  created_at timestamptz NOT NULL DEFAULT now(),
  published_at timestamptz
);

ALTER TABLE public.voice_episodes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read voice_episodes" ON public.voice_episodes
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert voice_episodes" ON public.voice_episodes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update voice_episodes" ON public.voice_episodes
  FOR UPDATE USING (true) WITH CHECK (true);

-- Voice errors table
CREATE TABLE public.voice_errors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  error_message text NOT NULL,
  post_slug text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.voice_errors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read voice_errors" ON public.voice_errors
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert voice_errors" ON public.voice_errors
  FOR INSERT WITH CHECK (true);

-- Voice audio storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('voice-audio', 'voice-audio', true);

CREATE POLICY "Allow public read voice-audio" ON storage.objects
  FOR SELECT USING (bucket_id = 'voice-audio');

CREATE POLICY "Allow public insert voice-audio" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'voice-audio');
