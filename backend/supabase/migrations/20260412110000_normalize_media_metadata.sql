CREATE TABLE IF NOT EXISTS "public"."video_genres" (
    "id" text PRIMARY KEY,
    "label" text NOT NULL UNIQUE,
    "created_at" timestamptz DEFAULT now()
);

ALTER TABLE "public"."video_genres" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to video_genres"
ON "public"."video_genres"
FOR SELECT USING (true);

CREATE TABLE IF NOT EXISTS "public"."audio_types" (
    "id" text PRIMARY KEY,
    "label" text NOT NULL UNIQUE,
    "created_at" timestamptz DEFAULT now()
);

ALTER TABLE "public"."audio_types" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to audio_types"
ON "public"."audio_types"
FOR SELECT USING (true);

CREATE TABLE IF NOT EXISTS "public"."video_contents" (
    "video_id" uuid PRIMARY KEY REFERENCES "public"."videos"("id") ON DELETE CASCADE,
    "title" text NOT NULL,
    "description" text,
    "created_at" timestamptz DEFAULT now()
);

ALTER TABLE "public"."video_contents" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to video_contents"
ON "public"."video_contents"
FOR SELECT USING (true);

CREATE TABLE IF NOT EXISTS "public"."audio_contents" (
    "audio_id" uuid PRIMARY KEY REFERENCES "public"."audios"("id") ON DELETE CASCADE,
    "title" text NOT NULL,
    "created_at" timestamptz DEFAULT now()
);

ALTER TABLE "public"."audio_contents" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to audio_contents"
ON "public"."audio_contents"
FOR SELECT USING (true);

ALTER TABLE "public"."videos"
    ADD COLUMN IF NOT EXISTS "genre_id" text;

ALTER TABLE "public"."audios"
    ADD COLUMN IF NOT EXISTS "audio_type_id" text;

INSERT INTO "public"."video_genres" ("id", "label")
SELECT DISTINCT
    regexp_replace(lower(trim("genre")), '[^a-z0-9]+', '_', 'g') AS "id",
    "genre" AS "label"
FROM "public"."videos"
WHERE "genre" IS NOT NULL
ON CONFLICT ("id") DO UPDATE
SET "label" = EXCLUDED."label";

INSERT INTO "public"."audio_types" ("id", "label")
SELECT DISTINCT
    regexp_replace(lower(trim("type")), '[^a-z0-9]+', '_', 'g') AS "id",
    "type" AS "label"
FROM "public"."audios"
WHERE "type" IS NOT NULL
ON CONFLICT ("id") DO UPDATE
SET "label" = EXCLUDED."label";

UPDATE "public"."videos"
SET "genre_id" = regexp_replace(lower(trim("genre")), '[^a-z0-9]+', '_', 'g')
WHERE "genre" IS NOT NULL
  AND "genre_id" IS NULL;

UPDATE "public"."audios"
SET "audio_type_id" = regexp_replace(lower(trim("type")), '[^a-z0-9]+', '_', 'g')
WHERE "type" IS NOT NULL
  AND "audio_type_id" IS NULL;

INSERT INTO "public"."video_contents" ("video_id", "title", "description")
SELECT
    "id",
    "title",
    "description"
FROM "public"."videos"
ON CONFLICT ("video_id") DO UPDATE
SET
    "title" = EXCLUDED."title",
    "description" = EXCLUDED."description";

INSERT INTO "public"."audio_contents" ("audio_id", "title")
SELECT
    "id",
    "title"
FROM "public"."audios"
ON CONFLICT ("audio_id") DO UPDATE
SET "title" = EXCLUDED."title";

ALTER TABLE "public"."videos"
    DROP CONSTRAINT IF EXISTS "videos_genre_id_fkey",
    ADD CONSTRAINT "videos_genre_id_fkey"
        FOREIGN KEY ("genre_id") REFERENCES "public"."video_genres"("id");

ALTER TABLE "public"."videos"
    ALTER COLUMN "genre_id" SET NOT NULL;

ALTER TABLE "public"."audios"
    DROP CONSTRAINT IF EXISTS "audios_audio_type_id_fkey",
    ADD CONSTRAINT "audios_audio_type_id_fkey"
        FOREIGN KEY ("audio_type_id") REFERENCES "public"."audio_types"("id");

ALTER TABLE "public"."audios"
    ALTER COLUMN "audio_type_id" SET NOT NULL;

ALTER TABLE "public"."videos"
    DROP COLUMN IF EXISTS "title",
    DROP COLUMN IF EXISTS "description",
    DROP COLUMN IF EXISTS "genre";

ALTER TABLE "public"."audios"
    DROP COLUMN IF EXISTS "title",
    DROP COLUMN IF EXISTS "type";

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
        ac.title,
        a.hls_url,
        at.label,
        a.icon_url
    FROM public.audios a
    JOIN public.audio_contents ac ON ac.audio_id = a.id
    JOIN public.audio_types at ON at.id = a.audio_type_id
    WHERE a.video_id = video_uuid;
END;
$function$;