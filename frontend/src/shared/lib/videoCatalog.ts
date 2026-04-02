import { supabase } from "@/api/supabaseClient";
import type { Video, VideoCatalogItem } from "../types/media";

export const fetchVideoCatalog = async (): Promise<Video[]> => {
  const { data, error } = await supabase
    .from('videos')
    .select(`id, title, hls_url, thumbnail_url, created_at, description, genre`)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Fehler beim Laden des Katalogs:", error.message);
    throw new Error(error.message);
  }

  return data as Video[];
};

export const fetchParticipantWatchedVideoIds = async (participantId: string): Promise<string[]> => {
  const { data, error } = await supabase
    .from('survey_responses')
    .select('video_id')
    .eq('participant_id', participantId)
    .eq('survey_type', 'single')
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