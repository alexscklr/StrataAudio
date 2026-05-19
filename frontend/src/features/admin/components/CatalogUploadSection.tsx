import { useTranslation } from "react-i18next";
import styles from "@/pages/styles/ManagementPage.module.css";
import { useCatalogUploadForm } from "@/features/admin/hooks/useCatalogUploadForm";
import { useCatalogUpload } from "@/features/admin/hooks/useCatalogUpload";
import {
  normalizeLocalizedMetadata,
  normalizeLocalizedValue,
  parseOptionalNumber,
} from "@/shared/utils/videos";
import { SubmitSection } from "@/shared/components/SubmitSection";
import { CatalogUploadFields } from "./CatalogUploadFields";
import { MetadataSection } from "./MetadataSection";

export function CatalogUploadSection() {
  const { t } = useTranslation();

  const {
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
  } = useCatalogUploadForm();

  const { uploadMutation, uploadErrorMessage, isUploading } = useCatalogUpload(
    { resetUploadForm },
  );

  const uploadDisabled = isUploading || !isCatalogUploadReady;

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isCatalogUploadReady) {
      return;
    }

    const normalizedMetadata = normalizeLocalizedMetadata({
      titleDe,
      titleEn,
      descriptionDe,
      descriptionEn,
      genreDe,
      genreEn,
    });

    uploadMutation.mutate({
      ...normalizedMetadata,
      isMandatory,
      durationSeconds: parseOptionalNumber(durationSeconds),
      mediaFolderFiles,
      audioTracks: audioTracks.map((track) => ({
        streamFolder: track.streamFolder,
        titleDe: normalizeLocalizedValue(track.titleDe, track.titleEn),
        titleEn: normalizeLocalizedValue(track.titleEn, track.titleDe),
        defaultVolume: Number(track.defaultVolume),
        iconFile: track.iconFile,
      })),
    });
  };

  return (
    <section className={styles.sectionCard}>
      <h2>{t("videoManagement.uploadTitle")}</h2>
      <p className={styles.sectionHint}>{t("videoManagement.folderHint")}</p>

      <form className={styles.formGrid} onSubmit={onSubmit}>
        <MetadataSection
          isInviteRawUpload={false}
          isEnglishUi={false}
          titleDe={titleDe}
          titleEn={titleEn}
          genreDe={genreDe}
          genreEn={genreEn}
          descriptionDe={descriptionDe}
          descriptionEn={descriptionEn}
          durationSeconds={durationSeconds}
          isMandatory={isMandatory}
          showMandatory={true}
          onTitleDeChange={setTitleDe}
          onTitleEnChange={setTitleEn}
          onGenreDeChange={setGenreDe}
          onGenreEnChange={setGenreEn}
          onDescriptionDeChange={setDescriptionDe}
          onDescriptionEnChange={setDescriptionEn}
          onDurationSecondsChange={setDurationSeconds}
          onMandatoryChange={setIsMandatory}
        />

        <CatalogUploadFields
          hasMaster={hasMaster}
          hasVideoPlaylist={hasVideoPlaylist}
          hasThumbnail={hasThumbnail}
          mediaFolderInputRef={mediaFolderInputRef}
          onMediaFolderFilesChange={setMediaFolderFiles}
          audioTracks={audioTracks}
          updateTrack={updateTrack}
          detectedFiles={detectedFiles}
        />

        <SubmitSection
          disabled={uploadDisabled}
          isSubmitting={isUploading}
          idleLabelKey="videoManagement.uploadAction"
          successLabelKey="videoManagement.uploadSuccess"
          isSuccess={uploadMutation.isSuccess}
          errorMessage={uploadErrorMessage}
        />
      </form>
    </section>
  );
}
