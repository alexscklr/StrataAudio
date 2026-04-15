import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { AuthContext } from "@/features/auth/context/AuthContext";
import LogInOutButton from "@/features/auth/components/LogInOutButton";
import { PageMeta } from "@/shared/components/Seo/PageMeta";
import {
  createUploadInvite,
  deleteVideo,
  fetchManagedVideos,
  uploadRawSourcePackage,
  uploadVideo,
} from "@/shared/lib/videoManagement";
import styles from "./styles/VideoManagementPage.module.css";
import mainPageStyles from "./styles/MainPageStyle.module.css";
import { VideoManagementAdminListSection } from "@/shared/components/VideoManagement/VideoManagementAdminListSection";
import { VideoManagementInviteSection } from "@/shared/components/VideoManagement/VideoManagementInviteSection";
import { VideoManagementUploadSection } from "@/shared/components/VideoManagement/VideoManagementUploadSection";
import type { AudioTrackFormState, RawAudioFileFormState, UploadMode } from "../shared/types/videoManagement";
import { compareStreamFolders, getFileIdentity, toRelativePath } from "../shared/utils/videoManagement";

function VideoManagementPage() {
  const { t, i18n } = useTranslation();
  const { user, loading } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const mediaFolderInputRef = useRef<HTMLInputElement | null>(null);

  const [uploadMode, setUploadMode] = useState<UploadMode>("raw");
  const [inviteGranted, setInviteGranted] = useState(false);
  const [inviteToken, setInviteToken] = useState<string | null>(null);
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
  const [rawVideoFile, setRawVideoFile] = useState<File | null>(null);
  const [rawThumbnailFile, setRawThumbnailFile] = useState<File | null>(null);
  const [rawAudioFiles, setRawAudioFiles] = useState<RawAudioFileFormState[]>([]);
  const [inviteLabel, setInviteLabel] = useState("");
  const [inviteExpiresHours, setInviteExpiresHours] = useState("72");
  const [inviteMaxUses, setInviteMaxUses] = useState("1");
  const [createdInviteLink, setCreatedInviteLink] = useState<string | null>(null);

  useEffect(() => {
    if (!mediaFolderInputRef.current) {
      return;
    }

    mediaFolderInputRef.current.setAttribute("webkitdirectory", "");
    mediaFolderInputRef.current.setAttribute("directory", "");
  }, []);

  useEffect(() => {
    const storedInviteToken = sessionStorage.getItem("upload-invite-token")?.trim() ?? "";

    const url = new URL(window.location.href);
    const inviteFromQuery = url.searchParams.get("invite")?.trim() ?? "";

    const hasStoredInvite = storedInviteToken.length > 0;
    const hasQueryInvite = inviteFromQuery.length > 0;

    if (hasQueryInvite) {
      sessionStorage.setItem("upload-invite-token", inviteFromQuery);
      setInviteToken(inviteFromQuery);
      url.searchParams.delete("invite");
      window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
    } else if (hasStoredInvite) {
      setInviteToken(storedInviteToken);
    }

    setInviteGranted(hasStoredInvite || hasQueryInvite);
  }, []);

  useEffect(() => {
    if (!user && inviteGranted) {
      setUploadMode("raw");
    }
  }, [inviteGranted, user]);

  const isAdmin = Boolean(user);
  const canUploadWithInvite = !isAdmin && inviteGranted;
  const canUpload = isAdmin || canUploadWithInvite;
  const isEnglishUi = i18n.resolvedLanguage?.startsWith("en") ?? false;
  const isInviteRawUpload = canUploadWithInvite && uploadMode === "raw";

  const detectedFiles = useMemo(() => mediaFolderFiles.map((file) => toRelativePath(file)), [mediaFolderFiles]);
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
    [detectedStreamFolders]
  );

  const hasMaster = detectedFiles.some((path) => path.toLowerCase() === "master.m3u8");
  const hasVideoPlaylist = detectedFiles.some((path) => path.toLowerCase() === "stream_0/playlist.m3u8");
  const hasThumbnail = detectedFiles.some((path) => /^thumbnail\./i.test(path));

  useEffect(() => {
    setAudioTracks((previous) =>
      audioStreamFolders.map((streamFolder) => {
        const existing = previous.find((entry) => entry.streamFolder === streamFolder);
        if (existing) {
          return existing;
        }

        return {
          streamFolder,
          titleDe: "",
          titleEn: "",
          typeDe: "",
          typeEn: "",
          defaultVolume: "1",
          iconFile: null,
        } satisfies AudioTrackFormState;
      })
    );
  }, [audioStreamFolders]);

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
    setRawVideoFile(null);
    setRawThumbnailFile(null);
    setRawAudioFiles([]);

    if (mediaFolderInputRef.current) {
      mediaFolderInputRef.current.value = "";
    }
  };

  const { data: videos = [], isLoading, error } = useQuery({
    queryKey: ["video-management"],
    queryFn: fetchManagedVideos,
    staleTime: 1000 * 30,
    enabled: isAdmin,
  });

  const uploadMutation = useMutation({
    mutationFn: uploadVideo,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["video-management"] });
      void queryClient.invalidateQueries({ queryKey: ["video-catalog"] });
      resetUploadForm();
    },
  });

  const rawUploadMutation = useMutation({
    mutationFn: uploadRawSourcePackage,
    onSuccess: () => {
      resetUploadForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteVideo,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["video-management"] });
      void queryClient.invalidateQueries({ queryKey: ["video-catalog"] });
    },
  });

  const createInviteMutation = useMutation({
    mutationFn: createUploadInvite,
    onSuccess: (result) => {
      const inviteUrl = new URL(window.location.href);
      inviteUrl.searchParams.set("invite", result.token);
      setCreatedInviteLink(inviteUrl.toString());
    },
  });

  const uploadErrorMessage = uploadMutation.error instanceof Error ? uploadMutation.error.message : null;
  const rawUploadErrorMessage = rawUploadMutation.error instanceof Error ? rawUploadMutation.error.message : null;
  const deleteErrorMessage = deleteMutation.error instanceof Error ? deleteMutation.error.message : null;
  const createInviteErrorMessage = createInviteMutation.error instanceof Error ? createInviteMutation.error.message : null;
  const isUploading = uploadMutation.isPending || rawUploadMutation.isPending;

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsedDuration = durationSeconds.trim() ? Number(durationSeconds.trim()) : null;

    if (uploadMode === "raw") {
      if (!rawVideoFile || rawAudioFiles.length === 0) {
        return;
      }

      const normalizedTitleDe = titleDe.trim() || titleEn.trim();
      const normalizedTitleEn = titleEn.trim() || titleDe.trim();
      const normalizedDescriptionDe = descriptionDe.trim() || descriptionEn.trim();
      const normalizedDescriptionEn = descriptionEn.trim() || descriptionDe.trim();
      const normalizedGenreDe = genreDe.trim() || genreEn.trim();
      const normalizedGenreEn = genreEn.trim() || genreDe.trim();

      rawUploadMutation.mutate({
        titleDe: normalizedTitleDe,
        titleEn: normalizedTitleEn,
        descriptionDe: normalizedDescriptionDe,
        descriptionEn: normalizedDescriptionEn,
        genreDe: normalizedGenreDe,
        genreEn: normalizedGenreEn,
        isMandatory: isInviteRawUpload ? false : isMandatory,
        durationSeconds: Number.isFinite(parsedDuration) ? parsedDuration : null,
        videoFile: rawVideoFile,
        thumbnailFile: rawThumbnailFile,
        inviteToken,
        audioFiles: rawAudioFiles.map((audio) => ({
          file: audio.file,
          titleDe: audio.titleDe.trim() || audio.titleEn.trim(),
          titleEn: audio.titleEn.trim() || audio.titleDe.trim(),
          typeDe: audio.typeDe.trim() || audio.typeEn.trim(),
          typeEn: audio.typeEn.trim() || audio.typeDe.trim(),
          defaultVolume: Number(audio.defaultVolume),
          iconFile: audio.iconFile,
        })),
      });

      return;
    }

    if (mediaFolderFiles.length === 0) {
      return;
    }

    if (!hasMaster || !hasVideoPlaylist || audioTracks.length === 0) {
      return;
    }

    uploadMutation.mutate({
      titleDe,
      titleEn,
      descriptionDe,
      descriptionEn,
      genreDe,
      genreEn,
      isMandatory,
      durationSeconds: Number.isFinite(parsedDuration) ? parsedDuration : null,
      mediaFolderFiles,
      audioTracks: audioTracks.map((track) => ({
        streamFolder: track.streamFolder,
        titleDe: track.titleDe,
        titleEn: track.titleEn,
        typeDe: track.typeDe,
        typeEn: track.typeEn,
        defaultVolume: Number(track.defaultVolume),
        iconFile: track.iconFile,
      })),
    });
  };

  const updateTrack = (streamFolder: string, updater: (current: AudioTrackFormState) => AudioTrackFormState) => {
    setAudioTracks((previous) =>
      previous.map((track) => (track.streamFolder === streamFolder ? updater(track) : track))
    );
  };

  const updateRawAudio = (index: number, updater: (current: RawAudioFileFormState) => RawAudioFileFormState) => {
    setRawAudioFiles((previous) => previous.map((audio, currentIndex) => (currentIndex === index ? updater(audio) : audio)));
  };

  const onRawAudioSelection = (files: FileList | null) => {
    const selectedFiles = Array.from(files ?? []);
    setRawAudioFiles((previous) => {
      const merged = [...previous];

      for (const file of selectedFiles) {
        const identity = getFileIdentity(file);
        const existingIndex = merged.findIndex((audio) => getFileIdentity(audio.file) === identity);

        if (existingIndex >= 0) {
          merged[existingIndex] = { ...merged[existingIndex], file };
          continue;
        }

        const fileBaseName = file.name.replace(/\.[^.]+$/, "");
        merged.push({
          file,
          titleDe: fileBaseName,
          titleEn: fileBaseName,
          typeDe: "",
          typeEn: "",
          defaultVolume: "1",
          iconFile: null,
        } satisfies RawAudioFileFormState);
      }

      return merged;
    });
  };

  const onDelete = (videoId: string, videoTitle: string) => {
    const shouldDelete = window.confirm(t("videoManagement.deleteConfirm", { title: videoTitle }));
    if (!shouldDelete) {
      return;
    }

    deleteMutation.mutate(videoId);
  };

  const onCreateInvite = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsedExpiresHours = Number(inviteExpiresHours);
    const parsedMaxUses = Number(inviteMaxUses);

    createInviteMutation.mutate({
      label: inviteLabel,
      expiresInHours: Number.isFinite(parsedExpiresHours) && parsedExpiresHours > 0 ? parsedExpiresHours : 72,
      maxUses: Number.isFinite(parsedMaxUses) && parsedMaxUses > 0 ? parsedMaxUses : 1,
    });
  };

  const copyInviteLink = async () => {
    if (!createdInviteLink || !navigator.clipboard) {
      return;
    }

    await navigator.clipboard.writeText(createdInviteLink);
  };

  if (loading && !inviteGranted) {
    return (
      <section className={mainPageStyles.pageGrid}>
        <section className={styles.sectionCard}>
          <p>{t("videoManagement.authLoading")}</p>
        </section>
      </section>
    );
  }

  if (!canUpload && !isAdmin) {
    return (
      <section className={mainPageStyles.pageGrid}>
        <PageMeta
          title={t("seo.videoManagement.title")}
          description={t("seo.videoManagement.description")}
        />
        <section className={styles.sectionCard}>
          <header className={styles.sectionHeader}>
            <h1>{t("videoManagement.title")}</h1>
            <p>{t("videoManagement.authRequired")}</p>
          </header>

          <div className={styles.authGate}>
            <p>{t("videoManagement.authHint")}</p>
            <p className={styles.sectionHint}>{t("videoManagement.inviteHint")}</p>
            <LogInOutButton popoverTarget="video-management-login" />
          </div>
        </section>
      </section>
    );
  }

  return (
    <section className={mainPageStyles.pageGrid}>
      <PageMeta
        title={t("seo.videoManagement.title")}
        description={t("seo.videoManagement.description")}
      />

      {isAdmin && (
        <VideoManagementAdminListSection
          videos={videos}
          isLoading={isLoading}
          error={error instanceof Error ? error : null}
          deleteErrorMessage={deleteErrorMessage}
          isDeleting={deleteMutation.isPending}
          onDelete={onDelete}
        />
      )}

      {isAdmin && (
        <VideoManagementInviteSection
          inviteLabel={inviteLabel}
          inviteExpiresHours={inviteExpiresHours}
          inviteMaxUses={inviteMaxUses}
          onInviteLabelChange={setInviteLabel}
          onInviteExpiresHoursChange={setInviteExpiresHours}
          onInviteMaxUsesChange={setInviteMaxUses}
          onCreateInvite={onCreateInvite}
          createInviteErrorMessage={createInviteErrorMessage}
          createdInviteLink={createdInviteLink}
          isCreatingInvite={createInviteMutation.isPending}
          onCopyInviteLink={() => {
            void copyInviteLink();
          }}
        />
      )}

      <VideoManagementUploadSection
        canUpload={canUpload}
        canUploadWithInvite={canUploadWithInvite}
        isAdmin={isAdmin}
        isEnglishUi={isEnglishUi}
        isInviteRawUpload={isInviteRawUpload}
        uploadMode={uploadMode}
        setUploadMode={setUploadMode}
        hasMaster={hasMaster}
        hasVideoPlaylist={hasVideoPlaylist}
        hasThumbnail={hasThumbnail}
        mediaFolderInputRef={mediaFolderInputRef}
        detectedFiles={detectedFiles}
        audioTracks={audioTracks}
        rawVideoFile={rawVideoFile}
        rawThumbnailFile={rawThumbnailFile}
        rawAudioFiles={rawAudioFiles}
        titleDe={titleDe}
        titleEn={titleEn}
        descriptionDe={descriptionDe}
        descriptionEn={descriptionEn}
        genreDe={genreDe}
        genreEn={genreEn}
        durationSeconds={durationSeconds}
        isMandatory={isMandatory}
        isUploading={isUploading}
        uploadSuccess={uploadMutation.isSuccess}
        rawUploadSuccess={rawUploadMutation.isSuccess}
        uploadErrorMessage={uploadErrorMessage}
        rawUploadErrorMessage={rawUploadErrorMessage}
        onSubmit={onSubmit}
        onMediaFolderFilesChange={setMediaFolderFiles}
        onRawVideoFileChange={setRawVideoFile}
        onRawThumbnailFileChange={setRawThumbnailFile}
        onRawAudioSelection={onRawAudioSelection}
        onTitleDeChange={setTitleDe}
        onTitleEnChange={setTitleEn}
        onDescriptionDeChange={setDescriptionDe}
        onDescriptionEnChange={setDescriptionEn}
        onGenreDeChange={setGenreDe}
        onGenreEnChange={setGenreEn}
        onDurationSecondsChange={setDurationSeconds}
        onMandatoryChange={setIsMandatory}
        updateTrack={updateTrack}
        updateRawAudio={updateRawAudio}
      />
      <LogInOutButton popoverTarget="video-management-login-inline" />
    </section>
  );
}

export default VideoManagementPage;
