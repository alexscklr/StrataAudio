import { supabase } from '@/api/supabaseClient';

/**
 * Generiert die öffentliche URL für ein Asset im Supabase Storage.
 * @param videoId - Die UUID des Videos (gleichzeitig der Ordnername)
 * @param fileName - Der Name der Datei (z.B. track1.mp3)
 * @param bucket - Der Name des Buckets (Standard: 'videos')
 */
export const getPublicUrl = (
    url: string,
    bucket: string = 'videos'
): string => {
    if (!url) return '';

    const { data } = supabase
        .storage
        .from(bucket)
        .getPublicUrl(`${url}`);

    return data.publicUrl;
};