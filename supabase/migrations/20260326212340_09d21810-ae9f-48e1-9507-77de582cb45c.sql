INSERT INTO storage.buckets (id, name, public)
VALUES ('audio', 'audio', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read audio" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'audio');

CREATE POLICY "Service upload audio" ON storage.objects
  FOR INSERT TO public
  WITH CHECK (bucket_id = 'audio');

CREATE POLICY "Service update audio" ON storage.objects
  FOR UPDATE TO public
  USING (bucket_id = 'audio')
  WITH CHECK (bucket_id = 'audio');