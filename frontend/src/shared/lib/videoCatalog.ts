import { supabase } from "@/api/supabaseClient";
import { localizedNullableText, localizedText, readRelation, resolveLocale } from "./mediaLocalization";
import type { Video, VideoCatalogItem } from "../types/media";

const mapVideoRow = (row: any): Video => {
  const locale = resolveLocale();
  const content = readRelation<{ title_de: string; title_en: string | null; description_de: string | null; description_en: string | null }>(row.video_contents);
  const genre = readRelation<{ label_de: string; label_en: string | null }>(row.video_genres);

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
  };
};

export const fetchVideoCatalog = async (): Promise<Video[]> => {
  const { data, error } = await supabase
    .from('videos')
    .select(`
      id,
      created_at,
      hls_url,
      thumbnail_url,
      is_mandatory,
      duration_seconds,
      video_contents(title_de, title_en, description_de, description_en),
      video_genres(label_de, label_en)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Fehler beim Laden des Katalogs:", error.message);
    throw new Error(error.message);
  }

  return (data ?? []).map(mapVideoRow);
};

const fetchParticipantWatchedVideoIds = async (participantId: string): Promise<string[]> => {
  const { data, error } = await supabase
    .from('survey_responses')
    .select('video_id')
    .eq('participant_id', participantId)
    .not('video_id', 'is', null);

  if (error) {
    console.error('Fehler beim Laden der angesehenen Videos:', error.message);
    throw new Error(error.message);
  }

  const watchedVideoIds = (data ?? [])
    .map((row) => row.video_id as string)
    .filter(Boolean);

  return Array.from(new Set(watchedVideoIds));
};

export const fetchVideoCatalogWithWatchStatus = async (participantId: string | null): Promise<VideoCatalogItem[]> => {
  const [catalog, watchedVideoIds] = await Promise.all([
    fetchVideoCatalog(),
    participantId ? fetchParticipantWatchedVideoIds(participantId) : Promise.resolve([] as string[]),
  ]);

  const watchedSet = new Set(watchedVideoIds);

  return catalog.map((video) => ({
    ...video,
    watched: watchedSet.has(video.id),
  }));
};