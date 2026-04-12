import { supabase } from "@/api/supabaseClient";
import type { Audio } from "../types/media";

const readRelation = <T>(relation: T | T[] | null | undefined): T | null => {
    if (!relation) {
        return null;
    }

    return Array.isArray(relation) ? (relation[0] ?? null) : relation;
};

export const fetchAudioDetails = async (videoid: string): Promise<Audio[]> => {
    const { data, error } = await supabase
        .from('audios')
        .select(`
      id,
      video_id,
      hls_url,
      icon_url,
      default_volume,
      audio_contents(title),
      audio_types(label)
    `)
        .eq('video_id', videoid);

    if (error) throw error;

    return (data ?? []).map((row: any) => {
        const content = readRelation<{ title: string }>(row.audio_contents);
        const audioType = readRelation<{ label: string }>(row.audio_types);

        return {
            id: row.id,
            hls_url: row.hls_url,
            icon_url: row.icon_url,
            default_volume: row.default_volume,
            title: content?.title ?? '',
            type: audioType?.label ?? '',
        } satisfies Audio;
    });
};