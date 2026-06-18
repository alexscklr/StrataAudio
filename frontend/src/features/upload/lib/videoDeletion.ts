import { supabase } from "@/api/supabaseClient";
import { listStorageFilesRecursively, removeStorageFiles } from "@/shared/utils/videoStorageOps";

export const deleteVideo = async (videoId: string): Promise<void> => {
  const { data: audioRows, error: fetchAudioError } = await supabase
    .from("audios")
    .select("icon_url")
    .eq("video_id", videoId);

  if (fetchAudioError) {
    throw new Error(fetchAudioError.message);
  }

  const { error: deleteVideoError } = await supabase.from("videos").delete().eq("id", videoId);

  if (deleteVideoError) {
    throw new Error(deleteVideoError.message);
  }

  const allVideoFiles = await listStorageFilesRecursively("videos", videoId);

  if (allVideoFiles.length > 0) {
    await removeStorageFiles("videos", allVideoFiles);
  }

  const iconPathsToRemove = (audioRows ?? [])
    .map((row) => row.icon_url)
    .filter((iconName): iconName is string => Boolean(iconName) && iconName.startsWith(`${videoId}-`))
    .map((iconName) => `icons/${iconName}`);

  if (iconPathsToRemove.length > 0) {
    try {
      await removeStorageFiles("system", iconPathsToRemove);
    } catch (error) {
      console.warn("Icon-Dateien konnten nicht vollstaendig entfernt werden:", error);
    }
  }
};
