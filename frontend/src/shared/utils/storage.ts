import { supabase } from '@/api/supabaseClient';

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