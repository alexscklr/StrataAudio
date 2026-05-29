CREATE TABLE IF NOT EXISTS "public"."participant_analysis_flags" (
    "participant_id" uuid PRIMARY KEY REFERENCES "public"."participants"("id") ON DELETE CASCADE,
    "is_biased" boolean NOT NULL DEFAULT false,
    "reason" text
);

ALTER TABLE "public"."participant_analysis_flags" ENABLE ROW LEVEL SECURITY;

DROP TRIGGER IF EXISTS "set_participant_analysis_flags_updated_at"
ON "public"."participant_analysis_flags";

CREATE TRIGGER "set_participant_analysis_flags_updated_at"
BEFORE UPDATE ON "public"."participant_analysis_flags"
FOR EACH ROW
EXECUTE FUNCTION "public"."set_current_timestamp_updated_at"();

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE "public"."participant_analysis_flags" TO authenticated;

DROP POLICY IF EXISTS "Allow authenticated select from participant_analysis_flags"
ON "public"."participant_analysis_flags";

CREATE POLICY "Allow authenticated select from participant_analysis_flags"
ON "public"."participant_analysis_flags"
FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Allow authenticated insert to participant_analysis_flags"
ON "public"."participant_analysis_flags";

CREATE POLICY "Allow authenticated insert to participant_analysis_flags"
ON "public"."participant_analysis_flags"
FOR INSERT
TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated update to participant_analysis_flags"
ON "public"."participant_analysis_flags";

CREATE POLICY "Allow authenticated update to participant_analysis_flags"
ON "public"."participant_analysis_flags"
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated delete to participant_analysis_flags"
ON "public"."participant_analysis_flags";

CREATE POLICY "Allow authenticated delete to participant_analysis_flags"
ON "public"."participant_analysis_flags"
FOR DELETE
TO authenticated
USING (true);
