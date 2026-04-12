import { supabase } from "@/api/supabaseClient";
import type { Video, VideoCatalogItem } from "../types/media";

const readRelation = <T>(relation: T | T[] | null | undefined): T | null => {
  if (!relation) {
    return null;
  }

  return Array.isArray(relation) ? (relation[0] ?? null) : relation;
};

const mapVideoRow = (row: any): Video => {
  const content = readRelation<{ title: string; description: string | null }>(row.video_contents);
  const genre = readRelation<{ label: string }>(row.video_genres);

  return {
    id: row.id,
    created_at: row.created_at,
    hls_url: row.hls_url,
    thumbnail_url: row.thumbnail_url,
    is_mandatory: row.is_mandatory,
    duration_seconds: row.duration_seconds,
    title: content?.title ?? "",
    description: content?.description ?? null,
    genre: genre?.label ?? "",
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
      video_contents(title, description),
      video_genres(label)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Fehler beim Laden des Katalogs:", error.message);
    throw new Error(error.message);
  }

  return (data ?? []).map(mapVideoRow);
};

export const fetchParticipantWatchedVideoIds = async (participantId: string): Promise<string[]> => {
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
  const catalog = await fetchVideoCatalog();

  if (!participantId) {
    return catalog.map((video) => ({ ...video, watched: false }));
  }

  const watchedVideoIds = await fetchParticipantWatchedVideoIds(participantId);
  const watchedSet = new Set(watchedVideoIds);

  return catalog.map((video) => ({
    ...video,
    watched: watchedSet.has(video.id),
  }));
};