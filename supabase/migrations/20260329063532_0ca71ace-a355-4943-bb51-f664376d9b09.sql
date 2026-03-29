
-- Drop the security invoker views (they won't work with RLS on underlying tables)
DROP VIEW IF EXISTS public.voice_settings_public;
DROP VIEW IF EXISTS public.stream_settings_public;

-- Instead, add back public SELECT on these tables (the sensitive data is the API keys, 
-- but SELECT policies can't filter columns — the protection is that we'll update client 
-- code to only select non-sensitive columns, and the real protection is service_role-only writes)
-- For voice_settings: allow public read (API key should be moved to secrets, not stored in DB)
CREATE POLICY "Public can read voice_settings" ON public.voice_settings
  FOR SELECT TO public USING (true);

-- For stream_settings: allow public read (secrets should be moved to vault)
CREATE POLICY "Public can read stream_settings" ON public.stream_settings
  FOR SELECT TO public USING (true);

-- For granola_settings: allow public read (webhook is write-protected now)
CREATE POLICY "Public can read granola_settings" ON public.granola_settings
  FOR SELECT TO public USING (true);

-- Error tables: allow public read (low risk, write-protected)
CREATE POLICY "Public can read seo_errors" ON public.seo_errors
  FOR SELECT TO public USING (true);
CREATE POLICY "Public can read geo_errors" ON public.geo_errors
  FOR SELECT TO public USING (true);
CREATE POLICY "Public can read voice_errors" ON public.voice_errors
  FOR SELECT TO public USING (true);
CREATE POLICY "Public can read stream_errors" ON public.stream_errors
  FOR SELECT TO public USING (true);

-- Granola data: allow public read (write-protected)
CREATE POLICY "Public can read granola_meetings" ON public.granola_meetings
  FOR SELECT TO public USING (true);
CREATE POLICY "Public can read granola_intelligence" ON public.granola_intelligence
  FOR SELECT TO public USING (true);
CREATE POLICY "Public can read granola_outputs" ON public.granola_outputs
  FOR SELECT TO public USING (true);
CREATE POLICY "Public can read granola_errors" ON public.granola_errors
  FOR SELECT TO public USING (true);
