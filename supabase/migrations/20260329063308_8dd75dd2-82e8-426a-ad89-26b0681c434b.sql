
-- =============================================
-- SECURITY HARDENING: Lock down all RLS policies
-- =============================================

-- 1. VOICE_SETTINGS: Remove public read/write of API keys
DROP POLICY IF EXISTS "Allow public read voice_settings" ON public.voice_settings;
DROP POLICY IF EXISTS "Allow public insert voice_settings" ON public.voice_settings;
DROP POLICY IF EXISTS "Allow public update voice_settings" ON public.voice_settings;

CREATE POLICY "Service role can read voice_settings" ON public.voice_settings
  FOR SELECT TO service_role USING (true);
CREATE POLICY "Service role can insert voice_settings" ON public.voice_settings
  FOR INSERT TO service_role WITH CHECK (true);
CREATE POLICY "Service role can update voice_settings" ON public.voice_settings
  FOR UPDATE TO service_role USING (true) WITH CHECK (true);

-- 2. STREAM_SETTINGS: Remove public ALL policy exposing twitch secrets
DROP POLICY IF EXISTS "Service can manage stream_settings" ON public.stream_settings;

CREATE POLICY "Service role can manage stream_settings" ON public.stream_settings
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 3. GRANOLA_SETTINGS: Remove public read/write of slack webhook
DROP POLICY IF EXISTS "Public read granola_settings" ON public.granola_settings;
DROP POLICY IF EXISTS "Public insert granola_settings" ON public.granola_settings;
DROP POLICY IF EXISTS "Public update granola_settings" ON public.granola_settings;

CREATE POLICY "Service role can read granola_settings" ON public.granola_settings
  FOR SELECT TO service_role USING (true);
CREATE POLICY "Service role can insert granola_settings" ON public.granola_settings
  FOR INSERT TO service_role WITH CHECK (true);
CREATE POLICY "Service role can update granola_settings" ON public.granola_settings
  FOR UPDATE TO service_role USING (true) WITH CHECK (true);

-- 4. GRANOLA_MEETINGS: Remove public read of sensitive meeting data
DROP POLICY IF EXISTS "Public read granola_meetings" ON public.granola_meetings;
DROP POLICY IF EXISTS "Public insert granola_meetings" ON public.granola_meetings;
DROP POLICY IF EXISTS "Public update granola_meetings" ON public.granola_meetings;

CREATE POLICY "Service role can read granola_meetings" ON public.granola_meetings
  FOR SELECT TO service_role USING (true);
CREATE POLICY "Service role can insert granola_meetings" ON public.granola_meetings
  FOR INSERT TO service_role WITH CHECK (true);
CREATE POLICY "Service role can update granola_meetings" ON public.granola_meetings
  FOR UPDATE TO service_role USING (true) WITH CHECK (true);

-- 5. GRANOLA_INTELLIGENCE: Remove public read of business intel
DROP POLICY IF EXISTS "Public read granola_intelligence" ON public.granola_intelligence;
DROP POLICY IF EXISTS "Public insert granola_intelligence" ON public.granola_intelligence;
DROP POLICY IF EXISTS "Public update granola_intelligence" ON public.granola_intelligence;

CREATE POLICY "Service role can read granola_intelligence" ON public.granola_intelligence
  FOR SELECT TO service_role USING (true);
CREATE POLICY "Service role can insert granola_intelligence" ON public.granola_intelligence
  FOR INSERT TO service_role WITH CHECK (true);
CREATE POLICY "Service role can update granola_intelligence" ON public.granola_intelligence
  FOR UPDATE TO service_role USING (true) WITH CHECK (true);

-- 6. GRANOLA_OUTPUTS: Remove public write
DROP POLICY IF EXISTS "Public insert granola_outputs" ON public.granola_outputs;
DROP POLICY IF EXISTS "Public read granola_outputs" ON public.granola_outputs;
DROP POLICY IF EXISTS "Public update granola_outputs" ON public.granola_outputs;

CREATE POLICY "Service role can manage granola_outputs" ON public.granola_outputs
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 7. GRANOLA_ERRORS: Remove public read
DROP POLICY IF EXISTS "Public read granola_errors" ON public.granola_errors;
DROP POLICY IF EXISTS "Public insert granola_errors" ON public.granola_errors;

CREATE POLICY "Service role can manage granola_errors" ON public.granola_errors
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 8. PROMPT_VERSIONS: Remove public write (prompt injection risk)
DROP POLICY IF EXISTS "Anyone can insert prompt_versions" ON public.prompt_versions;
DROP POLICY IF EXISTS "Anyone can update prompt_versions" ON public.prompt_versions;

CREATE POLICY "Service role can insert prompt_versions" ON public.prompt_versions
  FOR INSERT TO service_role WITH CHECK (true);
CREATE POLICY "Service role can update prompt_versions" ON public.prompt_versions
  FOR UPDATE TO service_role USING (true) WITH CHECK (true);

-- 9. PROMPT_RELEASES: Remove public write
DROP POLICY IF EXISTS "Anyone can insert prompt_releases" ON public.prompt_releases;
DROP POLICY IF EXISTS "Anyone can update prompt_releases" ON public.prompt_releases;

CREATE POLICY "Service role can insert prompt_releases" ON public.prompt_releases
  FOR INSERT TO service_role WITH CHECK (true);
CREATE POLICY "Service role can update prompt_releases" ON public.prompt_releases
  FOR UPDATE TO service_role USING (true) WITH CHECK (true);

-- 10. SEO_SETTINGS: Remove public write
DROP POLICY IF EXISTS "Anyone can insert seo_settings" ON public.seo_settings;
DROP POLICY IF EXISTS "Anyone can update seo_settings" ON public.seo_settings;

CREATE POLICY "Service role can insert seo_settings" ON public.seo_settings
  FOR INSERT TO service_role WITH CHECK (true);
CREATE POLICY "Service role can update seo_settings" ON public.seo_settings
  FOR UPDATE TO service_role USING (true) WITH CHECK (true);

-- 11. GEO_SETTINGS: Remove public write
DROP POLICY IF EXISTS "Anyone can insert geo_settings" ON public.geo_settings;
DROP POLICY IF EXISTS "Anyone can update geo_settings" ON public.geo_settings;

CREATE POLICY "Service role can insert geo_settings" ON public.geo_settings
  FOR INSERT TO service_role WITH CHECK (true);
CREATE POLICY "Service role can update geo_settings" ON public.geo_settings
  FOR UPDATE TO service_role USING (true) WITH CHECK (true);

-- 12. BLOG_SETTINGS: Remove public write
DROP POLICY IF EXISTS "Anyone can insert blog_settings" ON public.blog_settings;
DROP POLICY IF EXISTS "Anyone can update blog_settings" ON public.blog_settings;

CREATE POLICY "Service role can insert blog_settings" ON public.blog_settings
  FOR INSERT TO service_role WITH CHECK (true);
CREATE POLICY "Service role can update blog_settings" ON public.blog_settings
  FOR UPDATE TO service_role USING (true) WITH CHECK (true);

-- 13. PRODUCT_PUBLISH_SETTINGS: Remove public write
DROP POLICY IF EXISTS "Anyone can insert product_publish_settings" ON public.product_publish_settings;
DROP POLICY IF EXISTS "Anyone can update product_publish_settings" ON public.product_publish_settings;

CREATE POLICY "Service role can insert product_publish_settings" ON public.product_publish_settings
  FOR INSERT TO service_role WITH CHECK (true);
CREATE POLICY "Service role can update product_publish_settings" ON public.product_publish_settings
  FOR UPDATE TO service_role USING (true) WITH CHECK (true);

-- 14. ERROR TABLES: Restrict reads to service_role only
DROP POLICY IF EXISTS "Anyone can read seo_errors" ON public.seo_errors;
CREATE POLICY "Service role can read seo_errors" ON public.seo_errors
  FOR SELECT TO service_role USING (true);

DROP POLICY IF EXISTS "Anyone can read geo_errors" ON public.geo_errors;
CREATE POLICY "Service role can read geo_errors" ON public.geo_errors
  FOR SELECT TO service_role USING (true);

DROP POLICY IF EXISTS "Allow public read voice_errors" ON public.voice_errors;
DROP POLICY IF EXISTS "Allow public insert voice_errors" ON public.voice_errors;
CREATE POLICY "Service role can manage voice_errors" ON public.voice_errors
  FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service can manage stream_errors" ON public.stream_errors;
CREATE POLICY "Service role can manage stream_errors" ON public.stream_errors
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 15. STREAM sub-tables: Restrict to service_role
DROP POLICY IF EXISTS "Service can manage stream_sessions" ON public.stream_sessions;
DROP POLICY IF EXISTS "Public can read stream sessions" ON public.stream_sessions;
CREATE POLICY "Service role can manage stream_sessions" ON public.stream_sessions
  FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Public can read stream_sessions" ON public.stream_sessions
  FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Service can manage stream_transcripts" ON public.stream_transcripts;
CREATE POLICY "Service role can manage stream_transcripts" ON public.stream_transcripts
  FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service can manage stream_clips" ON public.stream_clips;
DROP POLICY IF EXISTS "Public can read stream clips" ON public.stream_clips;
CREATE POLICY "Service role can manage stream_clips" ON public.stream_clips
  FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Public can read stream_clips" ON public.stream_clips
  FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Service can manage stream_content" ON public.stream_content;
DROP POLICY IF EXISTS "Public can read stream content" ON public.stream_content;
CREATE POLICY "Service role can manage stream_content" ON public.stream_content
  FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Public can read stream_content" ON public.stream_content
  FOR SELECT TO public USING (status = 'published');

DROP POLICY IF EXISTS "Service can manage stream_optimisation_log" ON public.stream_optimisation_log;
CREATE POLICY "Service role can manage stream_optimisation_log" ON public.stream_optimisation_log
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 16. VOICE sub-tables: Restrict writes
DROP POLICY IF EXISTS "Allow public insert voice_episodes" ON public.voice_episodes;
DROP POLICY IF EXISTS "Allow public update voice_episodes" ON public.voice_episodes;
CREATE POLICY "Service role can insert voice_episodes" ON public.voice_episodes
  FOR INSERT TO service_role WITH CHECK (true);
CREATE POLICY "Service role can update voice_episodes" ON public.voice_episodes
  FOR UPDATE TO service_role USING (true) WITH CHECK (true);
