import { supabase } from "@/api/supabaseClient";
import { localizedText, readRelation, resolveLocale } from "./mediaLocalization";
import type { Audio } from "../types/media";

export const fetchAudioDetails = async (videoid: string): Promise<Audio[]> => {
    const locale = resolveLocale();
    const { data, error } = await supabase
        .from('audios')
        .select(`
      id,
      video_id,
      hls_url,
      icon_url,
      default_volume,
                        audio_contents(title_de, title_en)
    `)
        .eq('video_id', videoid);

    if (error) throw error;

    return (data ?? []).map((row: any) => {
        const content = readRelation<{ title_de: string; title_en: string | null }>(row.audio_contents);

        return {
            id: row.id,
            hls_url: row.hls_url,
            icon_url: row.icon_url,
            default_volume: row.default_volume,
            title: localizedText(content?.title_de, content?.title_en, locale),
        } satisfies Audio;
    });
};