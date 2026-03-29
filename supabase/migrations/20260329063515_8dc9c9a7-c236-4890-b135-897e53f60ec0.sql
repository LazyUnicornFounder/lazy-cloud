
-- Fix security definer views by setting them to SECURITY INVOKER
ALTER VIEW public.voice_settings_public SET (security_invoker = on);
ALTER VIEW public.stream_settings_public SET (security_invoker = on);
