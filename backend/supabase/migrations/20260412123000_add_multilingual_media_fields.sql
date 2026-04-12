ALTER TABLE "public"."video_contents"
    ADD COLUMN IF NOT EXISTS "title_de" text,
    ADD COLUMN IF NOT EXISTS "title_en" text,
    ADD COLUMN IF NOT EXISTS "description_de" text,
    ADD COLUMN IF NOT EXISTS "description_en" text;

UPDATE "public"."video_contents"
SET
    "title_de" = COALESCE("title_de", "title"),
    "description_de" = COALESCE("description_de", "description")
WHERE "title" IS NOT NULL;

ALTER TABLE "public"."video_contents"
    ALTER COLUMN "title_de" SET NOT NULL;

ALTER TABLE "public"."audio_contents"
    ADD COLUMN IF NOT EXISTS "title_de" text,
    ADD COLUMN IF NOT EXISTS "title_en" text;

UPDATE "public"."audio_contents"
SET "title_de" = COALESCE("title_de", "title")
WHERE "title" IS NOT NULL;

ALTER TABLE "public"."audio_contents"
    ALTER COLUMN "title_de" SET NOT NULL;

ALTER TABLE "public"."video_genres"
    ADD COLUMN IF NOT EXISTS "label_de" text,
    ADD COLUMN IF NOT EXISTS "label_en" text;

UPDATE "public"."video_genres"
SET "label_de" = COALESCE("label_de", "label")
WHERE "label" IS NOT NULL;

ALTER TABLE "public"."video_genres"
    ALTER COLUMN "label_de" SET NOT NULL;

ALTER TABLE "public"."audio_types"
    ADD COLUMN IF NOT EXISTS "label_de" text,
    ADD COLUMN IF NOT EXISTS "label_en" text;

UPDATE "public"."audio_types"
SET "label_de" = COALESCE("label_de", "label")
WHERE "label" IS NOT NULL;

ALTER TABLE "public"."audio_types"
    ALTER COLUMN "label_de" SET NOT NULL;

ALTER TABLE "public"."video_genres"
    DROP CONSTRAINT IF EXISTS "video_genres_label_key";

ALTER TABLE "public"."audio_types"
    DROP CONSTRAINT IF EXISTS "audio_types_label_key";

ALTER TABLE "public"."video_contents"
    DROP COLUMN IF EXISTS "title",
    DROP COLUMN IF EXISTS "description";

ALTER TABLE "public"."audio_contents"
    DROP COLUMN IF EXISTS "title";

ALTER TABLE "public"."video_genres"
    DROP COLUMN IF EXISTS "label";

ALTER TABLE "public"."audio_types"
    DROP COLUMN IF EXISTS "label";

CREATE OR REPLACE FUNCTION get_audio_urls(video_uuid uuid)
RETURNS TABLE (
    id uuid,
    title text,
    hls_url text,
    type text,
    icon_url text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
    RETURN QUERY
    SELECT
        a.id,
        ac.title_de,
        a.hls_url,
        at.label_de,
        a.icon_url
    FROM public.audios a
    JOIN public.audio_contents ac ON ac.audio_id = a.id
    JOIN public.audio_types at ON at.id = a.audio_type_id
    WHERE a.video_id = video_uuid;
END;
$function$;
