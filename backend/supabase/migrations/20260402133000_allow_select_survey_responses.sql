-- Allow frontend catalog to read survey responses for watched-state detection
CREATE POLICY "Allow anonymous select from survey_responses"
ON "public"."survey_responses"
FOR SELECT
USING (true);