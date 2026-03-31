import { supabase } from "@/api/supabaseClient";
import type { Video } from "../types/media";

export const fetchVideoDetails = async (id: string): Promise<Video> => {
  const { data, error } = await supabase
    .from('videos')
    .select(`
      *
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Video;
};