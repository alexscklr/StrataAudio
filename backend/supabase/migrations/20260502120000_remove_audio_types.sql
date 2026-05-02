DROP TRIGGER IF EXISTS trigger_translate_audio_types_on_insert ON public.audio_types;

ALTER TABLE public.audios
    DROP CONSTRAINT IF EXISTS audios_audio_type_id_fkey;

ALTER TABLE public.audios
    DROP COLUMN IF EXISTS audio_type_id;

DROP TABLE IF EXISTS public.audio_types CASCADE;

DROP FUNCTION IF EXISTS public.get_audio_urls(uuid);

CREATE OR REPLACE FUNCTION get_audio_urls(video_uuid uuid)
RETURNS TABLE (
    id uuid,
    title text,
    hls_url text,
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
        a.icon_url
    FROM public.audios a
    JOIN public.audio_contents ac ON ac.audio_id = a.id
    WHERE a.video_id = video_uuid;
END;
$function$;