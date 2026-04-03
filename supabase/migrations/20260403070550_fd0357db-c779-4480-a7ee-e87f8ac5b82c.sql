CREATE POLICY "Authenticated users can read visitors"
ON public.visitors
FOR SELECT
TO authenticated
USING (true);