import { supabase } from "@/api/supabaseClient";
import {
  detectThumbnailPath,
  detectVideoHlsPath,
  getPlaylistPathForStream,
  toStorageRelativePath,
} from "@/shared/utils/videoPathUtils";
import { sanitizePathSegment, slugifyGenre } from "@/shared/utils/videoSanitization";
import { removeStorageFiles } from "@/shared/utils/videoStorageOps";
import { uploadAudioIcon, uploadMediaFolder } from "@/shared/utils/videoUploadHelpers";
import { clampVolume } from "@/shared/utils/videoValidators";
import type { UploadVideoInput } from "@/features/upload/lib/videoUploadTypes";

const ensureGenre = async (genreDe: string, genreEn?: string): Promise<string> => {
  const genreId = slugifyGenre(genreDe);

  const { error } = await supabase.from("video_genres").upsert(
    {
      id: genreId,
      label_de: genreDe,
      label_en: genreEn?.trim() || null,
    },
    { onConflict: "id" }
  );

  if (error) {
    throw new Error(error.message);
  }

  return genreId;
};

const ensureIcons = async (iconFileNames: string[]): Promise<void> => {
  if (iconFileNames.length === 0) {
    return;
  }

  const iconRows = iconFileNames.map((fileName) => ({ file_name: fileName }));
  const { error } = await supabase.from("icons").upsert(iconRows, { onConflict: "file_name" });

  if (error) {
    throw new Error(error.message);
  }
};

export const uploadVideo = async (input: UploadVideoInput): Promise<string> => {
  const videoId = crypto.randomUUID();
  const uploadedVideoPaths: string[] = [];
  const uploadedIconPaths: string[] = [];
  let videoRowCreated = false;

  const relativeMediaPaths = input.mediaFolderFiles.map((file) => toStorageRelativePath(file));
  const videoHlsPath = detectVideoHlsPath(relativeMediaPaths);
  const thumbnailPath = detectThumbnailPath(relativeMediaPaths);

  try {
    if (input.audioTracks.length === 0) {
      throw new Error("Mindestens ein Audio-Stream ist erforderlich.");
    }

    const genreId = await ensureGenre(input.genreDe.trim(), input.genreEn?.trim());

    const mediaPaths = await uploadMediaFolder(videoId, input.mediaFolderFiles);
    uploadedVideoPaths.push(...mediaPaths);

    const { error: insertVideoError } = await supabase.from("videos").insert({
      id: videoId,
      hls_url: videoHlsPath,
      thumbnail_url: thumbnailPath,
      genre_id: genreId,
      is_mandatory: input.isMandatory,
      duration_seconds: input.durationSeconds ?? null,
    });

    if (insertVideoError) {
      throw new Error(insertVideoError.message);
    }

    videoRowCreated = true;

    const { error: insertContentError } = await supabase.from("video_contents").insert({
      video_id: videoId,
      title_de: input.titleDe.trim(),
      title_en: input.titleEn?.trim() || null,
      description_de: input.descriptionDe?.trim() || null,
      description_en: input.descriptionEn?.trim() || null,
    });

    if (insertContentError) {
      throw new Error(insertContentError.message);
    }

    const audioRows: {
      id: string;
      video_id: string;
      hls_url: string;
      icon_url: string | null;
      default_volume: number;
    }[] = [];
    const iconFileNames: string[] = [];

    const audioContentRows: {
      audio_id: string;
      title_de: string;
      title_en: string | null;
    }[] = [];

    for (let index = 0; index < input.audioTracks.length; index += 1) {
      const track = input.audioTracks[index];
      const streamFolder = sanitizePathSegment(track.streamFolder);
      const audioId = crypto.randomUUID();
      const hlsPlaylistPath = getPlaylistPathForStream(streamFolder, relativeMediaPaths);

      let iconFileName: string | null = null;
      if (track.iconFile) {
        iconFileName = await uploadAudioIcon(videoId, streamFolder, track.iconFile);
        uploadedIconPaths.push(`icons/${iconFileName}`);
        iconFileNames.push(iconFileName);
      }

      const titleDe = track.titleDe.trim();
      if (!titleDe) {
        throw new Error(`Audio-Titel fuer ${streamFolder} darf nicht leer sein.`);
      }

      audioRows.push({
        id: audioId,
        video_id: videoId,
        hls_url: hlsPlaylistPath,
        icon_url: iconFileName,
        default_volume: clampVolume(track.defaultVolume),
      });

      audioContentRows.push({
        audio_id: audioId,
        title_de: titleDe,
        title_en: track.titleEn?.trim() || null,
      });
    }

    await ensureIcons(iconFileNames);

    const { error: insertAudioError } = await supabase.from("audios").insert(audioRows);
    if (insertAudioError) {
      throw new Error(insertAudioError.message);
    }

    const { error: insertAudioContentError } = await supabase.from("audio_contents").insert(audioContentRows);
    if (insertAudioContentError) {
      throw new Error(insertAudioContentError.message);
    }

    return videoId;
  } catch (error) {
    if (videoRowCreated) {
      const { error: rollbackError } = await supabase.from("videos").delete().eq("id", videoId);
      if (rollbackError) {
        console.error("Rollback fehlgeschlagen:", rollbackError.message);
      }
    }

    if (uploadedVideoPaths.length > 0) {
      try {
        await removeStorageFiles("videos", uploadedVideoPaths);
      } catch (cleanupError) {
        console.error("Storage-Cleanup fehlgeschlagen:", cleanupError);
      }
    }

    if (uploadedIconPaths.length > 0) {
      try {
        await removeStorageFiles("system", uploadedIconPaths);
      } catch (cleanupError) {
        console.error("Icon-Cleanup fehlgeschlagen:", cleanupError);
      }
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Upload fehlgeschlagen.");
  }
};
