import { supabase } from "@/api/supabaseClient";
import type { Video } from "../types/media";

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
      video_contents(title, description),
      video_genres(label)
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return mapVideoRow(data);
};