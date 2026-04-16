import { supabase } from "@/api/supabaseClient";
import { fetchVideoCatalog } from "@/shared/lib/videoCatalog";
import type { Video } from "@/shared/types/media";

const sanitizeFileName = (name: string): string =>
  name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9._/-]/g, "")
    .replace(/^-+|-+$/g, "");

const sanitizePathSegment = (name: string): string =>
  name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9._-]/g, "")
    .replace(/^-+|-+$/g, "");

const slugifyGenre = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "") || "genre";

const slugifyAudioType = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "") || "audio_type";

const clampVolume = (value: number): number => {
  if (!Number.isFinite(value)) {
    return 1;
  }

  return Math.min(1, Math.max(0, value));
};

const chunkArray = <T>(values: T[], chunkSize: number): T[][] => {
  const chunks: T[][] = [];
  for (let index = 0; index < values.length; index += chunkSize) {
    chunks.push(values.slice(index, index + chunkSize));
  }
  return chunks;
};

const toStorageRelativePath = (file: File): string => {
  const rawPath = file.webkitRelativePath || file.name;
  const segments = rawPath.split("/").filter(Boolean);
  const innerSegments = segments.length > 1 ? segments.slice(1) : segments;

  const sanitizedSegments = innerSegments.map((segment, index) => {
    const normalized = sanitizePathSegment(segment);
    if (!normalized) {
      throw new Error(`Ungueltiger Datei- oder Ordnername in Pfad: ${rawPath}`);
    }

    // Keep extension characters for file names while preserving folder names.
    if (index === innerSegments.length - 1 && segment.includes(".")) {
      return sanitizeFileName(segment);
    }

    return normalized;
  });

  if (sanitizedSegments.length === 0) {
    throw new Error("Ordnerstruktur konnte nicht erkannt werden.");
  }

  return sanitizedSegments.join("/");
};

const getPlaylistPathForStream = (streamFolder: string, availablePaths: string[]): string => {
  const defaultPath = `${streamFolder}/playlist.m3u8`;
  const hasDefaultPath = availablePaths.some((path) => path === defaultPath);

  if (hasDefaultPath) {
    return defaultPath;
  }

  const fallbackPath = availablePaths.find(
    (path) => path.startsWith(`${streamFolder}/`) && path.toLowerCase().endsWith(".m3u8")
  );

  if (!fallbackPath) {
    throw new Error(`Keine Playlist fuer ${streamFolder} gefunden.`);
  }

  return fallbackPath;
};

const listStorageFilesRecursively = async (bucket: string, prefix: string): Promise<string[]> => {
  const filePaths: string[] = [];
  const stack: string[] = [prefix];

  while (stack.length > 0) {
    const currentPrefix = stack.pop();
    if (!currentPrefix) {
      continue;
    }

    const { data, error } = await supabase.storage.from(bucket).list(currentPrefix, {
      limit: 1000,
      offset: 0,
      sortBy: { column: "name", order: "asc" },
    });

    if (error) {
      throw new Error(error.message);
    }

    for (const entry of data ?? []) {
      const name = (entry as { name?: string }).name;
      if (!name) {
        continue;
      }

      const fullPath = `${currentPrefix}/${name}`;
      const isFolder = (entry as { id?: string | null; metadata?: object | null }).id === null
        || (entry as { metadata?: object | null }).metadata === null;

      if (isFolder) {
        stack.push(fullPath);
      } else {
        filePaths.push(fullPath);
      }
    }
  }

  return filePaths;
};

const removeStorageFiles = async (bucket: string, paths: string[]): Promise<void> => {
  for (const chunk of chunkArray(paths, 100)) {
    const { error } = await supabase.storage.from(bucket).remove(chunk);
    if (error) {
      throw new Error(error.message);
    }
  }
};

const ensureGenre = async (genreDe: string, genreEn?: string): Promise<string> => {
  const genreId = slugifyGenre(genreDe);

  const { error } = await supabase
    .from("video_genres")
    .upsert(
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

const ensureAudioType = async (typeDe: string, typeEn?: string): Promise<string> => {
  const audioTypeId = slugifyAudioType(typeDe);

  const { error } = await supabase
    .from("audio_types")
    .upsert(
      {
        id: audioTypeId,
        label_de: typeDe,
        label_en: typeEn?.trim() || null,
      },
      { onConflict: "id" }
    );

  if (error) {
    throw new Error(error.message);
  }

  return audioTypeId;
};

const uploadAudioIcon = async (videoId: string, streamFolder: string, file: File): Promise<string> => {
  const baseName = sanitizeFileName(file.name);
  if (!baseName) {
    throw new Error("Icon-Dateiname ist ungueltig.");
  }

  const iconFileName = `${videoId}-${streamFolder}-${baseName}`;
  const iconStoragePath = `icons/${iconFileName}`;
  const { error } = await supabase.storage.from("system").upload(iconStoragePath, file, {
    upsert: false,
    cacheControl: "3600",
  });

  if (error) {
    throw new Error(error.message);
  }

  return iconFileName;
};

const uploadMediaFolder = async (videoId: string, files: File[]): Promise<string[]> => {
  if (files.length === 0) {
    throw new Error("Es wurden keine Dateien fuer den Medienordner ausgewaehlt.");
  }

  const uploadedPaths: string[] = [];
  for (const file of files) {
    const relativePath = toStorageRelativePath(file);
    const targetPath = `${videoId}/${relativePath}`;

    const { error } = await supabase.storage.from("videos").upload(targetPath, file, {
      upsert: false,
      cacheControl: "3600",
    });

    if (error) {
      throw new Error(error.message);
    }

    uploadedPaths.push(targetPath);
  }

  return uploadedPaths;
};

const detectVideoHlsPath = (relativePaths: string[]): string => {
  if (relativePaths.includes("stream_0/playlist.m3u8")) {
    return "stream_0/playlist.m3u8";
  }

  if (relativePaths.includes("master.m3u8")) {
    return "master.m3u8";
  }

  const fallback = relativePaths.find((path) => path.toLowerCase().endsWith(".m3u8"));
  if (!fallback) {
    throw new Error("Keine m3u8-Datei fuer den Video-Einstieg gefunden.");
  }

  return fallback;
};

const detectThumbnailPath = (relativePaths: string[]): string | null => {
  const thumbnailPath = relativePaths.find((path) => /^thumbnail\./i.test(path));
  return thumbnailPath ?? null;
};

export interface UploadVideoInput {
  titleDe: string;
  titleEn?: string;
  descriptionDe?: string;
  descriptionEn?: string;
  genreDe: string;
  genreEn?: string;
  isMandatory: boolean;
  durationSeconds?: number | null;
  mediaFolderFiles: File[];
  audioTracks: {
    streamFolder: string;
    titleDe: string;
    titleEn?: string;
    typeDe: string;
    typeEn?: string;
    defaultVolume: number;
    iconFile?: File | null;
  }[];
}

export interface UploadRawSourceInput {
  titleDe: string;
  titleEn?: string;
  descriptionDe?: string;
  descriptionEn?: string;
  genreDe: string;
  genreEn?: string;
  isMandatory: boolean;
  durationSeconds?: number | null;
  videoFile: File;
  containsVideoAudio?: boolean;
  videoAudio?: {
    titleDe: string;
    titleEn?: string;
    typeDe: string;
    typeEn?: string;
    defaultVolume: number;
    iconFile?: File | null;
  };
  thumbnailFile?: File | null;
  audioFiles: {
    file: File;
    titleDe: string;
    titleEn?: string;
    typeDe: string;
    typeEn?: string;
    defaultVolume: number;
    iconFile?: File | null;
  }[];
  inviteToken?: string | null;
  captchaToken?: string | null;
}

export interface CreateUploadInviteInput {
  label?: string;
  expiresInHours?: number;
  maxUses?: number;
}

export interface CreateUploadInviteResult {
  token: string;
  expiresAt: string;
  maxUses: number;
  label: string | null;
}

export const fetchManagedVideos = async (): Promise<Video[]> => fetchVideoCatalog();

export const createUploadInvite = async (
  input: CreateUploadInviteInput
): Promise<CreateUploadInviteResult> => {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) {
    throw new Error(sessionError.message);
  }

  const { data: refreshedData, error: refreshError } = await supabase.auth.refreshSession();
  let currentSession = refreshedData.session ?? sessionData.session;

  if (refreshError && !currentSession) {
    throw new Error('Admin-Session abgelaufen. Bitte neu einloggen.');
  }

  const accessToken = currentSession?.access_token;
  if (!accessToken) {
    throw new Error('Nicht eingeloggt. Bitte als Admin anmelden.');
  }

  supabase.functions.setAuth(accessToken);

  const { data, error } = await supabase.functions.invoke('create-upload-invite', {
    body: {
      label: input.label?.trim() || null,
      expiresInHours: input.expiresInHours,
      maxUses: input.maxUses,
    },
  });

  if (error) {
    if (error.message.includes('401')) {
      throw new Error('Nicht autorisiert. Bitte erneut als Admin einloggen.');
    }

    if (error.message.includes('403')) {
      throw new Error('Kein Zugriff. Dein Account ist nicht fuer Upload-Invites freigeschaltet.');
    }

    throw new Error(error.message);
  }

  const parsed = data as Partial<CreateUploadInviteResult> | null;
  if (!parsed?.token || !parsed?.expiresAt || typeof parsed.maxUses !== 'number') {
    throw new Error('Ungueltige Antwort beim Erstellen des Upload-Invites.');
  }

  return {
    token: parsed.token,
    expiresAt: parsed.expiresAt,
    maxUses: parsed.maxUses,
    label: parsed.label ?? null,
  };
};

type SignedUploadFileDescriptor = {
  path: string;
  mimeType: string;
  sizeBytes: number;
};

const createSignedUploadMap = async (
  bucket: string,
  uploadId: string,
  files: SignedUploadFileDescriptor[],
  inviteToken?: string | null,
  captchaToken?: string | null
): Promise<Map<string, string>> => {
  const { data, error } = await supabase.functions.invoke('create-user-upload-urls', {
    body: {
      action: 'issue',
      bucket,
      uploadId,
      files,
      inviteToken: inviteToken ?? null,
      captchaToken: captchaToken ?? null,
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  const uploads = (data as { uploads?: Array<{ path?: string; token?: string }> } | null)?.uploads ?? [];
  const tokenMap = new Map<string, string>();

  for (const upload of uploads) {
    if (!upload.path || !upload.token) {
      continue;
    }

    tokenMap.set(upload.path, upload.token);
  }

  if (tokenMap.size !== files.length) {
    throw new Error('Signed upload URLs konnten nicht vollstaendig erstellt werden.');
  }

  return tokenMap;
};

const finalizeSignedUpload = async (
  bucket: string,
  uploadId: string,
  inviteToken?: string | null,
  captchaToken?: string | null
): Promise<void> => {
  const { error } = await supabase.functions.invoke('create-user-upload-urls', {
    body: {
      action: 'finalize',
      bucket,
      uploadId,
      inviteToken: inviteToken ?? null,
      captchaToken: captchaToken ?? null,
    },
  });

  if (error) {
    throw new Error(error.message);
  }
};

const buildInfoFileContent = (
  input: UploadRawSourceInput,
  uploadId: string,
  uploadedVideoPath: string,
  uploadedThumbnailPath: string | null,
  uploadedVideoAudioIconPath: string | null
) => {
  const lines = [
    `upload_id=${uploadId}`,
    `title_de=${input.titleDe.trim()}`,
    `title_en=${input.titleEn?.trim() || ""}`,
    `description_de=${input.descriptionDe?.trim() || ""}`,
    `description_en=${input.descriptionEn?.trim() || ""}`,
    `genre_de=${input.genreDe.trim()}`,
    `genre_en=${input.genreEn?.trim() || ""}`,
    `is_mandatory=${input.isMandatory ? "true" : "false"}`,
    `duration_seconds=${input.durationSeconds ?? ""}`,
    `video_path=${uploadedVideoPath}`,
    `video_contains_audio=${input.containsVideoAudio ? "true" : "false"}`,
    `video_audio_title_de=${input.videoAudio?.titleDe?.trim() || ""}`,
    `video_audio_title_en=${input.videoAudio?.titleEn?.trim() || ""}`,
    `video_audio_type_de=${input.videoAudio?.typeDe?.trim() || ""}`,
    `video_audio_type_en=${input.videoAudio?.typeEn?.trim() || ""}`,
    `video_audio_default_volume=${input.videoAudio ? clampVolume(input.videoAudio.defaultVolume) : ""}`,
    `video_audio_icon=${uploadedVideoAudioIconPath ?? ""}`,
    `thumbnail_path=${uploadedThumbnailPath ?? ""}`,
    "",
    "[audios]",
  ];

  input.audioFiles.forEach((audio, index) => {
    const sanitizedAudioName = sanitizeFileName(audio.file.name);
    const audioExtension = sanitizedAudioName.includes(".") ? sanitizedAudioName.slice(sanitizedAudioName.lastIndexOf(".")) : "";
    const storedAudioPath = `audios/${String(index + 1).padStart(2, "0")}-${sanitizePathSegment(audio.titleDe || `audio_${index + 1}`)}${audioExtension}`;
    const iconExtension = audio.iconFile?.name.includes(".")
      ? audio.iconFile.name.slice(audio.iconFile.name.lastIndexOf("."))
      : "";
    const storedIconPath = audio.iconFile
      ? `icons/${String(index + 1).padStart(2, "0")}-${sanitizePathSegment(audio.titleDe || `audio_${index + 1}`)}${iconExtension}`
      : "";

    lines.push(`audio_${index + 1}_file=${storedAudioPath}`);
    lines.push(`audio_${index + 1}_title_de=${audio.titleDe.trim()}`);
    lines.push(`audio_${index + 1}_title_en=${audio.titleEn?.trim() || ""}`);
    lines.push(`audio_${index + 1}_type_de=${audio.typeDe.trim()}`);
    lines.push(`audio_${index + 1}_type_en=${audio.typeEn?.trim() || ""}`);
    lines.push(`audio_${index + 1}_default_volume=${clampVolume(audio.defaultVolume)}`);
    lines.push(`audio_${index + 1}_icon=${storedIconPath}`);
    lines.push("");
  });

  return lines.join("\n");
};

export const uploadRawSourcePackage = async (input: UploadRawSourceInput): Promise<string> => {
  const uploadId = crypto.randomUUID();
  const uploadedPaths: string[] = [];
  const filesToUpload: Array<{ path: string; file: File | Blob }> = [];
  let infoPath = '';

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
      const normalizedVideoAudioTitle = input.videoAudio?.titleDe?.trim() || input.videoAudio?.titleEn?.trim() || "";
      const normalizedVideoAudioType = input.videoAudio?.typeDe?.trim() || input.videoAudio?.typeEn?.trim() || "";

      if (!normalizedVideoAudioTitle) {
        throw new Error("Audio-Titel fuer im Video eingebettete Audiospur darf nicht leer sein.");
      }

      if (!normalizedVideoAudioType) {
        throw new Error("Audio-Typ fuer im Video eingebettete Audiospur darf nicht leer sein.");
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
      const audioTitle = audio.titleDe.trim();
      const audioType = audio.typeDe.trim();

      if (!audioTitle) {
        throw new Error(`Audio-Titel fuer Datei ${audio.file.name} darf nicht leer sein.`);
      }

      if (!audioType) {
        throw new Error(`Audio-Typ fuer Datei ${audio.file.name} darf nicht leer sein.`);
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
    infoPath = `${uploadId}/info.txt`;
    filesToUpload.push({ path: infoPath, file: infoBlob });

    const signedUploadMap = await createSignedUploadMap(
      'user_uploads',
      uploadId,
      filesToUpload.map((entry) => ({
        path: entry.path,
        mimeType: entry.file.type || 'application/octet-stream',
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

      const { error: uploadError } = await supabase.storage
        .from('user_uploads')
        .uploadToSignedUrl(entry.path, token, entry.file);

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      uploadedPaths.push(entry.path);
    }

    await finalizeSignedUpload('user_uploads', uploadId, input.inviteToken, input.captchaToken);

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

    const audioTypeIds = await Promise.all(
      input.audioTracks.map(async (track) => {
        const normalizedType = track.typeDe.trim();
        if (!normalizedType) {
          throw new Error(`Audio-Typ fuer ${track.streamFolder} darf nicht leer sein.`);
        }

        return ensureAudioType(normalizedType, track.typeEn?.trim());
      })
    );

    const audioRows: {
      id: string;
      video_id: string;
      hls_url: string;
      audio_type_id: string;
      icon_url: string | null;
      default_volume: number;
    }[] = [];

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
      }

      const titleDe = track.titleDe.trim();
      if (!titleDe) {
        throw new Error(`Audio-Titel fuer ${streamFolder} darf nicht leer sein.`);
      }

      audioRows.push({
        id: audioId,
        video_id: videoId,
        hls_url: hlsPlaylistPath,
        audio_type_id: audioTypeIds[index],
        icon_url: iconFileName,
        default_volume: clampVolume(track.defaultVolume),
      });

      audioContentRows.push({
        audio_id: audioId,
        title_de: titleDe,
        title_en: track.titleEn?.trim() || null,
      });
    }

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
