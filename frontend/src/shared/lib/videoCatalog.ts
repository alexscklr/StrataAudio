import { supabase } from "@/api/supabaseClient";
import type { Video } from "../types/media";

export const fetchVideoCatalog = async (): Promise<Video[]> => {
  const { data, error } = await supabase
    .from('videos')
    .select(`id, title, hls_url, thumbnail_url, created_at, description`)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Fehler beim Laden des Katalogs:", error.message);
    throw new Error(error.message);
  }

  return data as Video[];
};