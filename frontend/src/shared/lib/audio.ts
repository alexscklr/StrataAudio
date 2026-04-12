import { supabase } from "@/api/supabaseClient";
import i18n from "@/i18n";
import type { Audio } from "../types/media";

const readRelation = <T>(relation: T | T[] | null | undefined): T | null => {
    if (!relation) {
        return null;
    }

    return Array.isArray(relation) ? (relation[0] ?? null) : relation;
};

const resolveLocale = (): "de" | "en" => (i18n.language?.toLowerCase().startsWith("en") ? "en" : "de");

const localizedText = (
    deValue: string | null | undefined,
    enValue: string | null | undefined,
    locale: "de" | "en"
): string => {
    if (locale === "en") {
        return enValue ?? deValue ?? '';
    }

    return deValue ?? enValue ?? '';
};

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
            audio_contents(title_de, title_en),
            audio_types(label_de, label_en)
    `)
        .eq('video_id', videoid);

    if (error) throw error;

    return (data ?? []).map((row: any) => {
        const content = readRelation<{ title_de: string; title_en: string | null }>(row.audio_contents);
        const audioType = readRelation<{ label_de: string; label_en: string | null }>(row.audio_types);

        return {
            id: row.id,
            hls_url: row.hls_url,
            icon_url: row.icon_url,
            default_volume: row.default_volume,
            title: localizedText(content?.title_de, content?.title_en, locale),
            type: localizedText(audioType?.label_de, audioType?.label_en, locale),
        } satisfies Audio;
    });
};