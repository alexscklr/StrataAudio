ALTER TABLE "public"."survey_responses"
    ADD COLUMN IF NOT EXISTS "first_watch_mode" text;

ALTER TABLE "public"."survey_responses"
    ADD CONSTRAINT "survey_responses_first_watch_mode_check"
    CHECK ("first_watch_mode" IN ('standard', 'mixer')) NOT VALID,
    ADD CONSTRAINT "survey_responses_first_watch_mode_required_check"
    CHECK ("first_watch_mode" IS NOT NULL) NOT VALID;

ALTER TABLE "public"."survey_responses"
    ADD CONSTRAINT "survey_responses_unique_participant_video"
    UNIQUE ("participant_id", "video_id");
