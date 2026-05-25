-- Analysis dashboard needs read access for authenticated admin users.
-- Note: This currently allows all authenticated users to read these tables.

GRANT SELECT ON TABLE "public"."participants" TO authenticated;
GRANT SELECT ON TABLE "public"."demographics" TO authenticated;
GRANT SELECT ON TABLE "public"."audio_configurations" TO authenticated;

DROP POLICY IF EXISTS "Allow authenticated select from participants" ON "public"."participants";
CREATE POLICY "Allow authenticated select from participants"
ON "public"."participants"
FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Allow authenticated select from demographics" ON "public"."demographics";
CREATE POLICY "Allow authenticated select from demographics"
ON "public"."demographics"
FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Allow authenticated select from audio_configurations" ON "public"."audio_configurations";
CREATE POLICY "Allow authenticated select from audio_configurations"
ON "public"."audio_configurations"
FOR SELECT
TO authenticated
USING (true);
