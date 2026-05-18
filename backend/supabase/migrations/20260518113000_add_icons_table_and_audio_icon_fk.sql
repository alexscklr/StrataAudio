CREATE TABLE IF NOT EXISTS public.icons (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    file_name text NOT NULL UNIQUE,
    source_name text NOT NULL DEFAULT 'Flaticon',
    source_url text NOT NULL DEFAULT 'https://www.flaticon.com/',
    author_name text NOT NULL DEFAULT 'Unknown',
    author_url text,
    created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.icons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to icons" ON public.icons;
CREATE POLICY "Allow public read access to icons"
ON public.icons
FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Allow authenticated insert to icons" ON public.icons;
CREATE POLICY "Allow authenticated insert to icons"
ON public.icons
FOR INSERT
TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated update to icons" ON public.icons;
CREATE POLICY "Allow authenticated update to icons"
ON public.icons
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated delete to icons" ON public.icons;
CREATE POLICY "Allow authenticated delete to icons"
ON public.icons
FOR DELETE
TO authenticated
USING (true);

INSERT INTO public.icons (file_name)
SELECT DISTINCT a.icon_url
FROM public.audios a
WHERE a.icon_url IS NOT NULL
  AND btrim(a.icon_url) <> ''
ON CONFLICT (file_name) DO NOTHING;

ALTER TABLE public.audios
DROP CONSTRAINT IF EXISTS audios_icon_url_fkey;

ALTER TABLE public.audios
ADD CONSTRAINT audios_icon_url_fkey
FOREIGN KEY (icon_url)
REFERENCES public.icons (file_name)
ON UPDATE CASCADE
ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS audios_icon_url_idx ON public.audios (icon_url);