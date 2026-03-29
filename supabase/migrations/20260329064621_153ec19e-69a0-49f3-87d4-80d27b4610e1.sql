
DROP POLICY "Public can read voice_settings" ON public.voice_settings;
DROP POLICY "Service role can read voice_settings" ON public.voice_settings;

CREATE POLICY "Service role can read voice_settings"
ON public.voice_settings
FOR SELECT
TO service_role
USING (true);
