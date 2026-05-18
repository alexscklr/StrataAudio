import { supabase } from "@/api/supabaseClient";
import type { IconAttribution } from "@/shared/types/media";

export const fetchIconAttributions = async (): Promise<IconAttribution[]> => {
  const { data, error } = await supabase
    .from("icons")
    .select("id, file_name, source_name, source_url, author_name, author_url")
    .order("file_name", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []) as IconAttribution[];
};