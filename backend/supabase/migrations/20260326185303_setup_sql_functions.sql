-- get audio urls for a video
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
        a.title,
        a.hls_url,
        a.type,
        a.icon_url
    FROM public.audios a
    WHERE a.video_id = video_uuid;
END;
$function$;