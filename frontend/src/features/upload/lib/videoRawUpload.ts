import { uploadToSignedStorageUrl } from "@/shared/utils/storage";
import { sanitizeFileName, sanitizePathSegment } from "@/shared/utils/videoSanitization";
import { removeStorageFiles } from "@/shared/utils/videoStorageOps";
import { buildInfoFileContent } from "@/shared/utils/videoUploadHelpers";
import { createSignedUploadMap, finalizeSignedUpload } from "@/shared/utils/videoSignedUpload";
import type { UploadRawSourceInput } from "@/features/upload/lib/videoUploadTypes";

export const uploadRawSourcePackage = async (input: UploadRawSourceInput): Promise<string> => {
  const uploadId = crypto.randomUUID();
  const uploadedPaths: string[] = [];
  const filesToUpload: Array<{ path: string; file: File | Blob }> = [];

  try {
    if (input.audioFiles.length === 0) {
      throw new Error("Mindestens eine Audio-Datei ist erforderlich.");
    }

    const videoFileName = sanitizeFileName(input.videoFile.name);
    if (!videoFileName) {
      throw new Error("Videodateiname ist ungueltig.");
    }

    const videoExtension = videoFileName.includes(".") ? videoFileName.slice(videoFileName.lastIndexOf(".")) : "";
    const storedVideoPath = `${uploadId}/video${videoExtension}`;
    filesToUpload.push({ path: storedVideoPath, file: input.videoFile });

    let storedVideoAudioIconPath: string | null = null;
    if (input.containsVideoAudio) {
      const normalizedVideoAudioTitle = input.videoAudio?.title?.trim() || "";

      if (!normalizedVideoAudioTitle) {
        throw new Error("Audio-Titel fuer im Video eingebettete Audiospur darf nicht leer sein.");
      }

      if (input.videoAudio?.iconFile) {
        const iconName = sanitizeFileName(input.videoAudio.iconFile.name);
        const iconExtension = iconName.includes(".") ? iconName.slice(iconName.lastIndexOf(".")) : "";
        storedVideoAudioIconPath = `${uploadId}/icons/00-video-audio${iconExtension}`;
        filesToUpload.push({ path: storedVideoAudioIconPath, file: input.videoAudio.iconFile });
      }
    }

    let storedThumbnailPath: string | null = null;
    if (input.thumbnailFile) {
      const thumbnailFileName = sanitizeFileName(input.thumbnailFile.name);
      if (!thumbnailFileName) {
        throw new Error("Thumbnail-Dateiname ist ungueltig.");
      }

      const thumbnailExtension = thumbnailFileName.includes(".")
        ? thumbnailFileName.slice(thumbnailFileName.lastIndexOf("."))
        : "";
      storedThumbnailPath = `${uploadId}/thumbnail${thumbnailExtension}`;
      filesToUpload.push({ path: storedThumbnailPath, file: input.thumbnailFile });
    }

    for (let index = 0; index < input.audioFiles.length; index += 1) {
      const audio = input.audioFiles[index];
      const audioTitle = audio.title.trim();

      if (!audioTitle) {
        throw new Error(`Audio-Titel fuer Datei ${audio.file.name} darf nicht leer sein.`);
      }

      const audioName = sanitizeFileName(audio.file.name);
      const audioExtension = audioName.includes(".") ? audioName.slice(audioName.lastIndexOf(".")) : "";
      const storedAudioPath = `${uploadId}/audios/${String(index + 1).padStart(2, "0")}-${sanitizePathSegment(audioTitle)}${audioExtension}`;
      filesToUpload.push({ path: storedAudioPath, file: audio.file });

      if (audio.iconFile) {
        const iconName = sanitizeFileName(audio.iconFile.name);
        const iconExtension = iconName.includes(".") ? iconName.slice(iconName.lastIndexOf(".")) : "";
        const storedIconPath = `${uploadId}/icons/${String(index + 1).padStart(2, "0")}-${sanitizePathSegment(audioTitle)}${iconExtension}`;
        filesToUpload.push({ path: storedIconPath, file: audio.iconFile });
      }
    }

    const infoContent = buildInfoFileContent(
      input,
      uploadId,
      storedVideoPath.replace(`${uploadId}/`, ""),
      storedThumbnailPath?.replace(`${uploadId}/`, "") ?? null,
      storedVideoAudioIconPath?.replace(`${uploadId}/`, "") ?? null
    );
    const infoBlob = new Blob([infoContent], { type: "text/plain;charset=utf-8" });
    filesToUpload.push({ path: `${uploadId}/info.txt`, file: infoBlob });

    const signedUploadMap = await createSignedUploadMap(
      "user_uploads",
      uploadId,
      filesToUpload.map((entry) => ({
        path: entry.path,
        mimeType: entry.file.type || "application/octet-stream",
        sizeBytes: entry.file.size,
      })),
      input.inviteToken,
      input.captchaToken
    );

    for (const entry of filesToUpload) {
      const token = signedUploadMap.get(entry.path);
      if (!token) {
        throw new Error(`Signed Upload Token fehlt fuer ${entry.path}`);
      }

      await uploadToSignedStorageUrl("user_uploads", entry.path, token, entry.file);
      uploadedPaths.push(entry.path);
    }

    await finalizeSignedUpload("user_uploads", uploadId, input.inviteToken, input.captchaToken);

    return uploadId;
  } catch (error) {
    if (uploadedPaths.length > 0) {
      try {
        await removeStorageFiles("user_uploads", uploadedPaths);
      } catch (cleanupError) {
        console.error("Raw-Upload-Cleanup fehlgeschlagen:", cleanupError);
      }
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Raw-Upload fehlgeschlagen.");
  }
};
