import { supabase } from "@/api/supabaseClient";
import type { Audio } from "../types/media";

export const fetchAudioDetails = async (videoid: string): Promise<Audio[]> => {
    const { data, error } = await supabase
        .from('audios')
        .select(`
      *
    `)
        .eq('video_id', videoid);

    if (error) throw error;
    return data as Audio[];
};