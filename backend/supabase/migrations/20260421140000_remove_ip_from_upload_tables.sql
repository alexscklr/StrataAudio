-- Migration: Entferne Speicherung der IP-Adressen aus Upload-Tabellen und Funktionen
-- 1. Spalten entfernen
ALTER TABLE public.upload_invite_upload_sessions DROP COLUMN IF EXISTS created_ip;
ALTER TABLE public.upload_request_events DROP COLUMN IF EXISTS request_ip;

-- 2. Funktionen anpassen (nur Parameter entfernen, keine Speicherung/Prüfung mehr)
-- validate_upload_invite_issue
CREATE OR REPLACE FUNCTION public.validate_upload_invite_issue(
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

  INSERT INTO public.upload_invite_upload_sessions (upload_id, invite_id)
  VALUES (p_upload_id, v_invite.id)
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

-- log_and_enforce_upload_request
CREATE OR REPLACE FUNCTION public.log_and_enforce_upload_request(
  p_invite_hash text,
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
  v_invite_issue_1h_bytes int8 := 0;
  v_max_invite_issue_10m constant int4 := 25;
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
  END IF;

  INSERT INTO public.upload_request_events (invite_hash, action, paths_count, total_bytes)
  VALUES (p_invite_hash, p_action, p_paths_count, p_total_bytes);
END;
$$;

-- Rechte für service_role
GRANT EXECUTE ON FUNCTION public.validate_upload_invite_issue(text, uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.finalize_upload_invite(text, uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.log_and_enforce_upload_request(text, text, int4, int8) TO service_role;
