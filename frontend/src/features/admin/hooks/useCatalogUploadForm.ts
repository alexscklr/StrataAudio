import { useEffect, useMemo, useRef, useState } from "react";
import type { AudioTrackFormState } from "@/shared/types/videos";
import {
  compareStreamFolders,
  toRelativePath,
} from "@/shared/utils/videos";

export function useCatalogUploadForm() {
  const mediaFolderInputRef = useRef<HTMLInputElement | null>(null);

  const [titleDe, setTitleDe] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [descriptionDe, setDescriptionDe] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [genreDe, setGenreDe] = useState("");
  const [genreEn, setGenreEn] = useState("");
  const [durationSeconds, setDurationSeconds] = useState("");
  const [isMandatory, setIsMandatory] = useState(false);
  const [mediaFolderFiles, setMediaFolderFiles] = useState<File[]>([]);
  const [audioTracks, setAudioTracks] = useState<AudioTrackFormState[]>([]);

  useEffect(() => {
    if (!mediaFolderInputRef.current) {
      return;
    }

    mediaFolderInputRef.current.setAttribute("webkitdirectory", "");
    mediaFolderInputRef.current.setAttribute("directory", "");
  }, []);

  const detectedFiles = useMemo(
    () => mediaFolderFiles.map((file) => toRelativePath(file)),
    [mediaFolderFiles],
  );

  const detectedStreamFolders = useMemo(() => {
    const folders = new Set<string>();
    for (const path of detectedFiles) {
      const topFolder = path.split("/")[0];
      if (/^stream_\d+$/i.test(topFolder)) {
        folders.add(topFolder.toLowerCase());
      }
    }

    return Array.from(folders).sort(compareStreamFolders);
  }, [detectedFiles]);

  const audioStreamFolders = useMemo(
    () => detectedStreamFolders.filter((folder) => folder !== "stream_0"),
    [detectedStreamFolders],
  );

  const hasMaster = detectedFiles.some(
    (path) => path.toLowerCase() === "master.m3u8",
  );
  const hasVideoPlaylist = detectedFiles.some(
    (path) => path.toLowerCase() === "stream_0/playlist.m3u8",
  );
  const hasThumbnail = detectedFiles.some((path) => /^thumbnail\./i.test(path));
  const isCatalogUploadReady =
    hasMaster && hasVideoPlaylist && audioTracks.length > 0;

  useEffect(() => {
    setAudioTracks((previous) =>
      audioStreamFolders.map((streamFolder) => {
        const existing = previous.find(
          (entry) => entry.streamFolder === streamFolder,
        );
        if (existing) {
          return existing;
        }

        return {
          streamFolder,
          titleDe: "",
          titleEn: "",
          defaultVolume: "1",
          iconFile: null,
        } satisfies AudioTrackFormState;
      }),
    );
  }, [audioStreamFolders]);

  const updateTrack = (
    streamFolder: string,
    updater: (current: AudioTrackFormState) => AudioTrackFormState,
  ) => {
    setAudioTracks((previous) =>
      previous.map((track) =>
        track.streamFolder === streamFolder ? updater(track) : track,
      ),
    );
  };

  const resetUploadForm = () => {
    setTitleDe("");
    setTitleEn("");
    setDescriptionDe("");
    setDescriptionEn("");
    setGenreDe("");
    setGenreEn("");
    setDurationSeconds("");
    setIsMandatory(false);
    setMediaFolderFiles([]);
    setAudioTracks([]);

    if (mediaFolderInputRef.current) {
      mediaFolderInputRef.current.value = "";
    }
  };

  return {
    mediaFolderInputRef,
    titleDe,
    setTitleDe,
    titleEn,
    setTitleEn,
    descriptionDe,
    setDescriptionDe,
    descriptionEn,
    setDescriptionEn,
    genreDe,
    setGenreDe,
    genreEn,
    setGenreEn,
    durationSeconds,
    setDurationSeconds,
    isMandatory,
    setIsMandatory,
    mediaFolderFiles,
    setMediaFolderFiles,
    audioTracks,
    detectedFiles,
    hasMaster,
    hasVideoPlaylist,
    hasThumbnail,
    isCatalogUploadReady,
    updateTrack,
    resetUploadForm,
  };
}
