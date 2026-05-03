ALTER TABLE public.upload_invite_upload_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.upload_request_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow service role full access to upload_invite_upload_sessions" ON public.upload_invite_upload_sessions;
CREATE POLICY "Allow service role full access to upload_invite_upload_sessions"
ON public.upload_invite_upload_sessions
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow service role full access to upload_request_events" ON public.upload_request_events;
CREATE POLICY "Allow service role full access to upload_request_events"
ON public.upload_request_events
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
