-- Harden semi-public upload collection flow:
-- 1) defer invite consumption until upload finalize
-- 2) add server-side request logging + rate limiting helpers

CREATE TABLE IF NOT EXISTS public.upload_invite_upload_sessions (
    upload_id uuid PRIMARY KEY,
    invite_id uuid NOT NULL REFERENCES public.upload_invites(id) ON DELETE CASCADE,
    created_ip inet,
    issued_at timestamptz NOT NULL DEFAULT now(),
    finalized_at timestamptz,
    CONSTRAINT upload_invite_upload_sessions_finalized_after_issue
      CHECK (finalized_at IS NULL OR finalized_at >= issued_at)
);

CREATE INDEX IF NOT EXISTS upload_invite_upload_sessions_invite_id_idx
  ON public.upload_invite_upload_sessions(invite_id);

CREATE INDEX IF NOT EXISTS upload_invite_upload_sessions_issued_at_idx
  ON public.upload_invite_upload_sessions(issued_at DESC);

CREATE TABLE IF NOT EXISTS public.upload_request_events (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    invite_hash text,
    request_ip inet,
    action text NOT NULL,
    paths_count int4 NOT NULL,
    total_bytes int8 NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT upload_request_events_action_check
      CHECK (action IN ('issue', 'finalize')),
    CONSTRAINT upload_request_events_paths_count_check
      CHECK (paths_count >= 0),
    CONSTRAINT upload_request_events_total_bytes_check
      CHECK (total_bytes >= 0)
);

CREATE INDEX IF NOT EXISTS upload_request_events_invite_hash_created_at_idx
  ON public.upload_request_events(invite_hash, created_at DESC);

CREATE INDEX IF NOT EXISTS upload_request_events_ip_created_at_idx
  ON public.upload_request_events(request_ip, created_at DESC);

CREATE OR REPLACE FUNCTION public.validate_upload_invite_issue(
  p_token_hash text,
  p_upload_id uuid,
  p_request_ip inet
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_invite public.upload_invites%ROWTYPE;
  v_existing_invite_id uuid;
BEGIN
  IF p_token_hash IS NULL OR length(trim(p_token_hash)) = 0 THEN
    RAISE EXCEPTION 'Invite token missing';
  END IF;

  IF p_upload_id IS NULL THEN
    RAISE EXCEPTION 'Upload id missing';
  END IF;

  SELECT *
  INTO v_invite
  FROM public.upload_invites
  WHERE token_hash = p_token_hash
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invalid invite token';
  END IF;

  IF v_invite.expires_at IS NOT NULL AND v_invite.expires_at < now() THEN
    RAISE EXCEPTION 'Invite expired';
  END IF;

  IF v_invite.max_uses IS NOT NULL AND v_invite.use_count >= v_invite.max_uses THEN
    RAISE EXCEPTION 'Invite usage limit reached';
  END IF;

  INSERT INTO public.upload_invite_upload_sessions (upload_id, invite_id, created_ip)
  VALUES (p_upload_id, v_invite.id, p_request_ip)
  ON CONFLICT (upload_id) DO NOTHING;

  SELECT invite_id
  INTO v_existing_invite_id
  FROM public.upload_invite_upload_sessions
  WHERE upload_id = p_upload_id;

  IF v_existing_invite_id IS DISTINCT FROM v_invite.id THEN
    RAISE EXCEPTION 'Upload id already bound to another invite';
  END IF;

  RETURN v_invite.id;
END;
$$;

CREATE OR REPLACE FUNCTION public.finalize_upload_invite(
  p_token_hash text,
  p_upload_id uuid
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_invite public.upload_invites%ROWTYPE;
  v_session public.upload_invite_upload_sessions%ROWTYPE;
BEGIN
  IF p_token_hash IS NULL OR length(trim(p_token_hash)) = 0 THEN
    RAISE EXCEPTION 'Invite token missing';
  END IF;

  IF p_upload_id IS NULL THEN
    RAISE EXCEPTION 'Upload id missing';
  END IF;

  SELECT *
  INTO v_invite
  FROM public.upload_invites
  WHERE token_hash = p_token_hash
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invalid invite token';
  END IF;

  SELECT *
  INTO v_session
  FROM public.upload_invite_upload_sessions
  WHERE upload_id = p_upload_id
    AND invite_id = v_invite.id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Upload session not found';
  END IF;

  IF v_session.finalized_at IS NOT NULL THEN
    RETURN v_invite.id;
  END IF;

  IF v_invite.expires_at IS NOT NULL AND v_invite.expires_at < now() THEN
    RAISE EXCEPTION 'Invite expired';
  END IF;

  IF v_invite.max_uses IS NOT NULL AND v_invite.use_count >= v_invite.max_uses THEN
    RAISE EXCEPTION 'Invite usage limit reached';
  END IF;

  UPDATE public.upload_invites
  SET use_count = use_count + 1
  WHERE id = v_invite.id
    AND (max_uses IS NULL OR use_count < max_uses);

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invite usage limit reached';
  END IF;

  UPDATE public.upload_invite_upload_sessions
  SET finalized_at = now()
  WHERE upload_id = p_upload_id;

  RETURN v_invite.id;
END;
$$;

CREATE OR REPLACE FUNCTION public.log_and_enforce_upload_request(
  p_invite_hash text,
  p_request_ip inet,
  p_action text,
  p_paths_count int4,
  p_total_bytes int8
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_invite_issue_10m_count int4 := 0;
  v_ip_issue_10m_count int4 := 0;
  v_invite_issue_1h_bytes int8 := 0;
  v_max_invite_issue_10m constant int4 := 25;
  v_max_ip_issue_10m constant int4 := 120;
  v_max_invite_issue_1h_bytes constant int8 := 21474836480; -- 20 GiB
BEGIN
  IF p_action NOT IN ('issue', 'finalize') THEN
    RAISE EXCEPTION 'Invalid action';
  END IF;

  IF p_paths_count < 0 OR p_total_bytes < 0 THEN
    RAISE EXCEPTION 'Invalid request counters';
  END IF;

  IF p_action = 'issue' THEN
    IF p_invite_hash IS NOT NULL THEN
      SELECT count(*)::int4
      INTO v_invite_issue_10m_count
      FROM public.upload_request_events
      WHERE invite_hash = p_invite_hash
        AND action = 'issue'
        AND created_at >= now() - interval '10 minutes';

      IF v_invite_issue_10m_count >= v_max_invite_issue_10m THEN
        RAISE EXCEPTION 'Invite rate limit exceeded';
      END IF;

      SELECT coalesce(sum(total_bytes), 0)::int8
      INTO v_invite_issue_1h_bytes
      FROM public.upload_request_events
      WHERE invite_hash = p_invite_hash
        AND action = 'issue'
        AND created_at >= now() - interval '1 hour';

      IF v_invite_issue_1h_bytes + p_total_bytes > v_max_invite_issue_1h_bytes THEN
        RAISE EXCEPTION 'Invite hourly upload budget exceeded';
      END IF;
    END IF;

    IF p_request_ip IS NOT NULL THEN
      SELECT count(*)::int4
      INTO v_ip_issue_10m_count
      FROM public.upload_request_events
      WHERE request_ip = p_request_ip
        AND action = 'issue'
        AND created_at >= now() - interval '10 minutes';

      IF v_ip_issue_10m_count >= v_max_ip_issue_10m THEN
        RAISE EXCEPTION 'IP rate limit exceeded';
      END IF;
    END IF;
  END IF;

  INSERT INTO public.upload_request_events (invite_hash, request_ip, action, paths_count, total_bytes)
  VALUES (p_invite_hash, p_request_ip, p_action, p_paths_count, p_total_bytes);
END;
$$;

GRANT EXECUTE ON FUNCTION public.validate_upload_invite_issue(text, uuid, inet) TO service_role;
GRANT EXECUTE ON FUNCTION public.finalize_upload_invite(text, uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.log_and_enforce_upload_request(text, inet, text, int4, int8) TO service_role;
