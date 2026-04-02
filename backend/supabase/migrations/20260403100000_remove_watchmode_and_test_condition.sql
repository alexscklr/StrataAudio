-- Remove watch_mode-driven survey submissions and test_condition-driven audio configs.
-- Surveys are now submitted once after both watch modes are completed.

ALTER TABLE "public"."survey_responses"
    DROP CONSTRAINT IF EXISTS "survey_responses_unique_per_participant_video_watchmode";

ALTER TABLE "public"."survey_responses"
    DROP COLUMN IF EXISTS "watch_mode";

ALTER TABLE "public"."audio_configurations"
    DROP CONSTRAINT IF EXISTS "audio_configurations_unique_participant_video_condition";

ALTER TABLE "public"."audio_configurations"
    DROP COLUMN IF EXISTS "test_condition";

DROP TYPE IF EXISTS "public"."test_condition_type";
