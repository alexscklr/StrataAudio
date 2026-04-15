-- DB policies for authenticated admin management (single admin user scenario)

DROP POLICY IF EXISTS "Allow authenticated insert to videos" ON "public"."videos";
CREATE POLICY "Allow authenticated insert to videos"
ON "public"."videos"
FOR INSERT
TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated update to videos" ON "public"."videos";
CREATE POLICY "Allow authenticated update to videos"
ON "public"."videos"
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated delete to videos" ON "public"."videos";
CREATE POLICY "Allow authenticated delete to videos"
ON "public"."videos"
FOR DELETE
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Allow authenticated insert to video_contents" ON "public"."video_contents";
CREATE POLICY "Allow authenticated insert to video_contents"
ON "public"."video_contents"
FOR INSERT
TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated update to video_contents" ON "public"."video_contents";
CREATE POLICY "Allow authenticated update to video_contents"
ON "public"."video_contents"
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated delete to video_contents" ON "public"."video_contents";
CREATE POLICY "Allow authenticated delete to video_contents"
ON "public"."video_contents"
FOR DELETE
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Allow authenticated insert to audios" ON "public"."audios";
CREATE POLICY "Allow authenticated insert to audios"
ON "public"."audios"
FOR INSERT
TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated update to audios" ON "public"."audios";
CREATE POLICY "Allow authenticated update to audios"
ON "public"."audios"
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated delete to audios" ON "public"."audios";
CREATE POLICY "Allow authenticated delete to audios"
ON "public"."audios"
FOR DELETE
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Allow authenticated insert to audio_contents" ON "public"."audio_contents";
CREATE POLICY "Allow authenticated insert to audio_contents"
ON "public"."audio_contents"
FOR INSERT
TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated update to audio_contents" ON "public"."audio_contents";
CREATE POLICY "Allow authenticated update to audio_contents"
ON "public"."audio_contents"
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated delete to audio_contents" ON "public"."audio_contents";
CREATE POLICY "Allow authenticated delete to audio_contents"
ON "public"."audio_contents"
FOR DELETE
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Allow authenticated insert to video_genres" ON "public"."video_genres";
CREATE POLICY "Allow authenticated insert to video_genres"
ON "public"."video_genres"
FOR INSERT
TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated update to video_genres" ON "public"."video_genres";
CREATE POLICY "Allow authenticated update to video_genres"
ON "public"."video_genres"
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated insert to audio_types" ON "public"."audio_types";
CREATE POLICY "Allow authenticated insert to audio_types"
ON "public"."audio_types"
FOR INSERT
TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated update to audio_types" ON "public"."audio_types";
CREATE POLICY "Allow authenticated update to audio_types"
ON "public"."audio_types"
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Storage write policies for authenticated admin uploads and cleanup
DROP POLICY IF EXISTS "Allow authenticated insert to videos bucket" ON storage.objects;
CREATE POLICY "Allow authenticated insert to videos bucket"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'videos');

DROP POLICY IF EXISTS "Allow authenticated update to videos bucket" ON storage.objects;
CREATE POLICY "Allow authenticated update to videos bucket"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'videos')
WITH CHECK (bucket_id = 'videos');

DROP POLICY IF EXISTS "Allow authenticated delete to videos bucket" ON storage.objects;
CREATE POLICY "Allow authenticated delete to videos bucket"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'videos');

DROP POLICY IF EXISTS "Allow authenticated insert to system bucket" ON storage.objects;
CREATE POLICY "Allow authenticated insert to system bucket"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'system');

DROP POLICY IF EXISTS "Allow authenticated update to system bucket" ON storage.objects;
CREATE POLICY "Allow authenticated update to system bucket"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'system')
WITH CHECK (bucket_id = 'system');

DROP POLICY IF EXISTS "Allow authenticated delete to system bucket" ON storage.objects;
CREATE POLICY "Allow authenticated delete to system bucket"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'system');
