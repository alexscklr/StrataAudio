/**
 * Helper functions for video and media file upload workflows.
 * Handles icon uploads, media folder uploads, and info file generation.
 */

import { uploadFileToStorage } from "@/shared/utils/storage";
import { sanitizeFileName, sanitizePathSegment } from "./videoSanitization";
import { clampVolume } from "./videoValidators";
import type { UploadRawSourceInput } from "@/features/upload/lib/videoUploadTypes";

export const uploadAudioIcon = async (
  videoId: string,
  streamFolder: string,
  file: File
): Promise<string> => {
  const baseName = sanitizeFileName(file.name);
  if (!baseName) {
    throw new Error("Icon-Dateiname ist ungueltig.");
  }

  const iconFileName = `${videoId}-${streamFolder}-${baseName}`;
  const iconStoragePath = `icons/${iconFileName}`;
  await uploadFileToStorage({
    bucket: "system",
    path: iconStoragePath,
    file,
    upsert: false,
    cacheControl: "3600",
  });

  return iconFileName;
};

export const uploadMediaFolder = async (
  videoId: string,
  files: File[]
): Promise<string[]> => {
  if (files.length === 0) {
    throw new Error("Es wurden keine Dateien fuer den Medienordner ausgewaehlt.");
  }

  const uploadedPaths: string[] = [];
  for (const file of files) {
    // This is imported from videoPathUtils but used here in context of upload
    const relativePath = file.webkitRelativePath || file.name;
    const segments = relativePath.split("/").filter(Boolean);
    const innerSegments = segments.length > 1 ? segments.slice(1) : segments;

    const sanitizedSegments = innerSegments.map((segment, index) => {
      const normalized = sanitizePathSegment(segment);
      if (!normalized) {
        throw new Error(`Ungueltiger Datei- oder Ordnername in Pfad: ${relativePath}`);
      }

      if (index === innerSegments.length - 1 && segment.includes(".")) {
        return sanitizeFileName(segment);
      }

      return normalized;
    });

    const storagePath = sanitizedSegments.join("/");
    const targetPath = `${videoId}/${storagePath}`;

    await uploadFileToStorage({
      bucket: "videos",
      path: targetPath,
      file,
      upsert: false,
      cacheControl: "3600",
    });

    uploadedPaths.push(targetPath);
  }

  return uploadedPaths;
};

export const buildInfoFileContent = (
  input: UploadRawSourceInput,
  uploadId: string,
  uploadedVideoPath: string,
  uploadedThumbnailPath: string | null,
  uploadedVideoAudioIconPath: string | null
): string => {
  const lines = [
    `upload_id=${uploadId}`,
    `title=${input.title.trim()}`,
    `description=${input.description.trim()}`,
    `is_mandatory=${input.isMandatory ? "true" : "false"}`,
    `duration_seconds=${input.durationSeconds ?? ""}`,
    `video_path=${uploadedVideoPath}`,
    `video_contains_audio=${input.containsVideoAudio ? "true" : "false"}`,
    `video_audio_title=${input.videoAudio?.title?.trim() || ""}`,
    `video_audio_default_volume=${input.videoAudio ? clampVolume(input.videoAudio.defaultVolume) : ""}`,
    `video_audio_icon=${uploadedVideoAudioIconPath ?? ""}`,
    `thumbnail_path=${uploadedThumbnailPath ?? ""}`,
  ];
  if (input.consentGiven) {
    lines.push(`consent_given_at=${new Date().toISOString()}`);
  }
  lines.push("", "[audios]");

  input.audioFiles.forEach((audio, index) => {
    const sanitizedAudioName = sanitizeFileName(audio.file.name);
    const audioExtension = sanitizedAudioName.includes(".")
      ? sanitizedAudioName.slice(sanitizedAudioName.lastIndexOf("."))
      : "";
    const storedAudioPath = `audios/${String(index + 1).padStart(2, "0")}-${sanitizePathSegment(audio.title || `audio_${index + 1}`)}${audioExtension}`;
    const iconExtension = audio.iconFile?.name.includes(".")
      ? audio.iconFile.name.slice(audio.iconFile.name.lastIndexOf("."))
      : "";
    const storedIconPath = audio.iconFile
      ? `icons/${String(index + 1).padStart(2, "0")}-${sanitizePathSegment(audio.title || `audio_${index + 1}`)}${iconExtension}`
      : "";

    lines.push(`audio_${index + 1}_file=${storedAudioPath}`);
    lines.push(`audio_${index + 1}_title=${audio.title.trim()}`);
    lines.push(`audio_${index + 1}_default_volume=${clampVolume(audio.defaultVolume)}`);
    lines.push(`audio_${index + 1}_icon=${storedIconPath}`);
    lines.push("");
  });

  return lines.join("\n");
};
