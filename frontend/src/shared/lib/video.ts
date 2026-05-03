import { supabase } from "@/api/supabaseClient";
import i18n from "@/i18n";
import type { Video, VideoTechnicalMetadataItem } from "../types/media";

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
    return enValue ?? deValue ?? "";
  }

  return deValue ?? enValue ?? "";
};

const localizedNullableText = (
  deValue: string | null | undefined,
  enValue: string | null | undefined,
  locale: "de" | "en"
): string | null => {
  const value = localizedText(deValue, enValue, locale);
  return value.length > 0 ? value : null;
};

const toTechnicalMetadataItems = (value: unknown): VideoTechnicalMetadataItem[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((entry) => {
      if (!entry || typeof entry !== "object") {
        return null;
      }

      const entryRecord = entry as Record<string, unknown>;
      const category = typeof entryRecord.category === "string" ? entryRecord.category.trim() : "";
      const source = typeof entryRecord.source === "string" ? entryRecord.source.trim() : "";
      const license = typeof entryRecord.license === "string" ? entryRecord.license.trim() : "";

      if (!category && !source && !license) {
        return null;
      }

      return {
        category,
        source,
        license,
      };
    })
    .filter((entry): entry is VideoTechnicalMetadataItem => Boolean(entry));
};

const mapVideoRow = (row: any): Video => {
  const locale = resolveLocale();
  const content = readRelation<{
    title_de: string;
    title_en: string | null;
    description_de: string | null;
    description_en: string | null;
    technical_metadata_de: unknown;
    technical_metadata_en: unknown;
  }>(row.video_contents);
  const genre = readRelation<{ label_de: string; label_en: string | null }>(row.video_genres);
  const localizedTechnicalMetadata = locale === "en"
    ? (content?.technical_metadata_en ?? content?.technical_metadata_de)
    : (content?.technical_metadata_de ?? content?.technical_metadata_en);

  return {
    id: row.id,
    created_at: row.created_at,
    hls_url: row.hls_url,
    thumbnail_url: row.thumbnail_url,
    is_mandatory: row.is_mandatory,
    duration_seconds: row.duration_seconds,
    title: localizedText(content?.title_de, content?.title_en, locale),
    description: localizedNullableText(content?.description_de, content?.description_en, locale),
    genre: localizedText(genre?.label_de, genre?.label_en, locale),
    technical_metadata: toTechnicalMetadataItems(localizedTechnicalMetadata),
  };
};

export const fetchVideoDetails = async (id: string): Promise<Video> => {
  const { data, error } = await supabase
    .from('videos')
    .select(`
      id,
      created_at,
      hls_url,
      thumbnail_url,
      is_mandatory,
      duration_seconds,
      video_contents(title_de, title_en, description_de, description_en, technical_metadata_de, technical_metadata_en),
      video_genres(label_de, label_en)
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return mapVideoRow(data);
};