-- Add video_id (FK) and watch_mode columns to survey_responses
-- and enforce that a participant can only submit one response per video + watch mode

ALTER TABLE "public"."survey_responses"
    ADD COLUMN "video_id" "uuid" NOT NULL REFERENCES "public"."videos"("id"),
    ADD COLUMN "watch_mode" "text" NOT NULL CHECK ("watch_mode" IN ('standard', 'mixer'));

ALTER TABLE "public"."survey_responses"
    ADD CONSTRAINT "survey_responses_unique_per_participant_video_watchmode"
    UNIQUE ("participant_id", "video_id", "watch_mode");
