ALTER TABLE "public"."videos"
    ADD COLUMN IF NOT EXISTS "duration_seconds" integer;
