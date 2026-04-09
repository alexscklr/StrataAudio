
ALTER TABLE "public"."videos" 
ADD COLUMN IF NOT EXISTS "is_mandatory" BOOLEAN DEFAULT false;

UPDATE "public"."videos" 
SET "is_mandatory" = false 
WHERE "is_mandatory" IS NULL;

ALTER TABLE "public"."videos" 
ALTER COLUMN "is_mandatory" SET NOT NULL;