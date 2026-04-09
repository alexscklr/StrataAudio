ALTER TABLE "public"."demographics"
    DROP CONSTRAINT IF EXISTS "demographics_audio_experience_check",
    DROP CONSTRAINT IF EXISTS "demographics_playback_device_check",
    DROP CONSTRAINT IF EXISTS "demographics_age_group_check",
    DROP CONSTRAINT IF EXISTS "demographics_gender_check",
    DROP CONSTRAINT IF EXISTS "demographics_streaming_usage_check",
    DROP CONSTRAINT IF EXISTS "demographics_audio_balance_disturbance_check",
    DROP CONSTRAINT IF EXISTS "demographics_audio_settings_satisfaction_check";

ALTER TABLE "public"."demographics"
    DROP COLUMN IF EXISTS "audio_experience",
    DROP COLUMN IF EXISTS "playback_device",
    DROP COLUMN IF EXISTS "hearing_impairment",
    ADD COLUMN IF NOT EXISTS "streaming_usage" text,
    ADD COLUMN IF NOT EXISTS "audio_balance_disturbance" int2,
    ADD COLUMN IF NOT EXISTS "audio_settings_satisfaction" int2;

UPDATE "public"."demographics"
SET
    "gender" = CASE
        WHEN "gender" = 'non-binary' THEN 'diverse'
        WHEN "gender" = 'prefer not to say' THEN 'no_answer'
        ELSE "gender"
    END,
    "age_group" = CASE
        WHEN "age_group" = '<18' THEN 'under_18'
        WHEN "age_group" = '18-24' THEN '18_24'
        WHEN "age_group" = '25-34' THEN '25_34'
        WHEN "age_group" = '35-44' THEN '35_44'
        WHEN "age_group" = '45-54' THEN '45_54'
        WHEN "age_group" = '55+' THEN '65_plus'
        ELSE "age_group"
    END;

ALTER TABLE "public"."demographics"
    ADD CONSTRAINT "demographics_streaming_usage_check"
        CHECK ("streaming_usage" IN ('daily', 'multiple_per_week', 'weekly', 'multiple_per_month', 'rarely')),
    ADD CONSTRAINT "demographics_audio_balance_disturbance_check"
        CHECK ("audio_balance_disturbance" BETWEEN 1 AND 7),
    ADD CONSTRAINT "demographics_audio_settings_satisfaction_check"
        CHECK ("audio_settings_satisfaction" BETWEEN 1 AND 7),
    ADD CONSTRAINT "demographics_age_group_check"
        CHECK ("age_group" IN ('under_18', '18_24', '25_34', '35_44', '45_54', '55_64', '65_plus')),
    ADD CONSTRAINT "demographics_gender_check"
        CHECK ("gender" IN ('female', 'male', 'diverse', 'no_answer'));

DROP POLICY IF EXISTS "Allow anonymous update to demographics" ON "public"."demographics";

CREATE POLICY "Allow anonymous update to demographics"
    ON "public"."demographics"
    FOR UPDATE
    USING (true)
    WITH CHECK (true);