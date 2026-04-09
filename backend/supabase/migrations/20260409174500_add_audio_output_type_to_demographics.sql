ALTER TABLE "public"."demographics"
    DROP CONSTRAINT IF EXISTS "demographics_audio_output_type_check";

ALTER TABLE "public"."demographics"
    ADD COLUMN IF NOT EXISTS "audio_output_type" text;

ALTER TABLE "public"."demographics"
    ADD CONSTRAINT "demographics_audio_output_type_check"
        CHECK (
            "audio_output_type" IS NULL
            OR "audio_output_type" IN ('built_in_speakers', 'headphones', 'external_speakers')
        );