CREATE TABLE IF NOT EXISTS study_settings (
    id int PRIMARY KEY DEFAULT 1,
    is_active boolean NOT NULL DEFAULT true,
    CONSTRAINT one_row CHECK (id=1)
);

ALTER TABLE "public"."study_settings" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to study_settings" ON "public"."study_settings" FOR
SELECT USING (true);

INSERT INTO study_settings (id, is_active) VALUES (1, true) ON CONFLICT DO NOTHING;

CREATE OR REPLACE FUNCTION register_participant(
    p_id uuid,
    p_user_hash text,
    p_browser_name text,
    p_browser_version text,
    p_os_name text,
    p_os_version text,
    p_screen_res_width int,
    p_screen_res_height int
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM study_settings WHERE is_active = true) THEN
        RAISE EXCEPTION 'STUDY_INACTIVE' USING DETAIL = 'The study is currently inactive. Please try again later.';
    END IF;

    INSERT INTO participants (
        id,
        user_hash,
        browser_name,
        browser_version,
        os_name,
        os_version,
        screen_res_width,
        screen_res_height
    ) VALUES (
        p_id,
        p_user_hash,
        p_browser_name,
        p_browser_version,
        p_os_name,
        p_os_version,
        p_screen_res_width,
        p_screen_res_height
    );
END;
$$;