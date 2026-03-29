
-- Create public views that exclude sensitive columns

CREATE OR REPLACE VIEW public.voice_settings_public AS
SELECT id, is_running, setup_complete, created_at, podcast_title, podcast_description, podcast_author, site_url, voice_id
FROM public.voice_settings;

CREATE OR REPLACE VIEW public.stream_settings_public AS
SELECT id, is_running, setup_complete, created_at, twitch_username, twitch_user_id, site_url, business_name, content_niche, recap_template_guidance
FROM public.stream_settings;

-- Grant select on views to public
GRANT SELECT ON public.voice_settings_public TO anon, authenticated;
GRANT SELECT ON public.stream_settings_public TO anon, authenticated;
