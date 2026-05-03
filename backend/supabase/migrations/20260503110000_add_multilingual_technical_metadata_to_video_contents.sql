ALTER TABLE public.video_contents
    ADD COLUMN IF NOT EXISTS technical_metadata_de jsonb NOT NULL DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS technical_metadata_en jsonb NOT NULL DEFAULT '[]'::jsonb;

ALTER TABLE public.video_contents
    DROP CONSTRAINT IF EXISTS video_contents_technical_metadata_de_is_array,
    ADD CONSTRAINT video_contents_technical_metadata_de_is_array
        CHECK (jsonb_typeof(technical_metadata_de) = 'array');

ALTER TABLE public.video_contents
    DROP CONSTRAINT IF EXISTS video_contents_technical_metadata_en_is_array,
    ADD CONSTRAINT video_contents_technical_metadata_en_is_array
        CHECK (jsonb_typeof(technical_metadata_en) = 'array');
