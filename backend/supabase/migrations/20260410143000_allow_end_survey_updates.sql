ALTER TABLE "public"."end_survey_responses"
    ADD COLUMN IF NOT EXISTS "updated_at" timestamptz DEFAULT now() NOT NULL;

CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_updated_at"()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS "set_end_survey_responses_updated_at"
ON "public"."end_survey_responses";

CREATE TRIGGER "set_end_survey_responses_updated_at"
BEFORE UPDATE ON "public"."end_survey_responses"
FOR EACH ROW
EXECUTE FUNCTION "public"."set_current_timestamp_updated_at"();

GRANT SELECT, UPDATE ON TABLE "public"."end_survey_responses" TO anon, authenticated;

DROP POLICY IF EXISTS "Allow anonymous select from end_survey_responses"
ON "public"."end_survey_responses";

CREATE POLICY "Allow anonymous select from end_survey_responses"
ON "public"."end_survey_responses"
FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Allow anonymous update to end_survey_responses"
ON "public"."end_survey_responses";

CREATE POLICY "Allow anonymous update to end_survey_responses"
ON "public"."end_survey_responses"
FOR UPDATE
USING (true)
WITH CHECK (true);
