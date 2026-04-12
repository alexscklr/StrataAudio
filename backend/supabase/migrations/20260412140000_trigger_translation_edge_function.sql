CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pgjwt WITH SCHEMA extensions;

CREATE OR REPLACE FUNCTION public.trigger_media_translation_webhook()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
    base_url text := COALESCE(NULLIF(current_setting('app.settings.supabase_url', true), ''), 'http://kong:8000');
    request_url text;
    headers jsonb := jsonb_build_object('Content-Type', 'application/json');
    webhook_secret text := NULLIF(current_setting('app.settings.translation_webhook_secret', true), '');
    jwt_secret text := current_setting('app.settings.jwt_secret', true);
    service_jwt text;
BEGIN
    IF right(base_url, 1) = '/' THEN
        base_url := left(base_url, length(base_url) - 1);
    END IF;

    IF base_url LIKE '%/functions/v1' THEN
        request_url := base_url || '/translate-media-en';
    ELSE
        request_url := base_url || '/functions/v1/translate-media-en';
    END IF;

    IF jwt_secret IS NOT NULL AND jwt_secret <> '' THEN
        service_jwt := extensions.sign(
            json_build_object(
                'role', 'service_role',
                'iss', 'supabase',
                'exp', (extract(epoch from now())::int + 300)
            ),
            jwt_secret
        );

        headers := headers || jsonb_build_object(
            'Authorization', 'Bearer ' || service_jwt
        );
    END IF;

    IF webhook_secret IS NOT NULL THEN
        headers := headers || jsonb_build_object('x-translation-webhook-secret', webhook_secret);
    END IF;

    PERFORM net.http_post(
        url := request_url,
        headers := headers,
        body := jsonb_build_object(
            'table', TG_TABLE_NAME,
            'record', to_jsonb(NEW)
        )
    );

    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS trigger_translate_video_contents_on_insert ON public.video_contents;
CREATE TRIGGER trigger_translate_video_contents_on_insert
AFTER INSERT ON public.video_contents
FOR EACH ROW
WHEN (NEW.title_en IS NULL OR NEW.description_en IS NULL)
EXECUTE FUNCTION public.trigger_media_translation_webhook();

DROP TRIGGER IF EXISTS trigger_translate_audio_contents_on_insert ON public.audio_contents;
CREATE TRIGGER trigger_translate_audio_contents_on_insert
AFTER INSERT ON public.audio_contents
FOR EACH ROW
WHEN (NEW.title_en IS NULL)
EXECUTE FUNCTION public.trigger_media_translation_webhook();

DROP TRIGGER IF EXISTS trigger_translate_video_genres_on_insert ON public.video_genres;
CREATE TRIGGER trigger_translate_video_genres_on_insert
AFTER INSERT ON public.video_genres
FOR EACH ROW
WHEN (NEW.label_en IS NULL)
EXECUTE FUNCTION public.trigger_media_translation_webhook();

DROP TRIGGER IF EXISTS trigger_translate_audio_types_on_insert ON public.audio_types;
CREATE TRIGGER trigger_translate_audio_types_on_insert
AFTER INSERT ON public.audio_types
FOR EACH ROW
WHEN (NEW.label_en IS NULL)
EXECUTE FUNCTION public.trigger_media_translation_webhook();
