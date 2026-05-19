import type { RefObject } from "react";
import { useTranslation } from "react-i18next";
import styles from "@/pages/styles/ManagementPage.module.css";
import type { AudioTrackFormState } from "@/shared/types/videos";

interface CatalogUploadFieldsProps {
  hasMaster: boolean;
  hasVideoPlaylist: boolean;
  hasThumbnail: boolean;
  mediaFolderInputRef: RefObject<HTMLInputElement | null>;
  onMediaFolderFilesChange: (files: File[]) => void;
  audioTracks: AudioTrackFormState[];
  updateTrack: (
    streamFolder: string,
    updater: (current: AudioTrackFormState) => AudioTrackFormState,
  ) => void;
  detectedFiles: string[];
}

export function CatalogUploadFields({
  hasMaster,
  hasVideoPlaylist,
  hasThumbnail,
  mediaFolderInputRef,
  onMediaFolderFilesChange,
  audioTracks,
  updateTrack,
  detectedFiles,
}: CatalogUploadFieldsProps) {
  const { t } = useTranslation();

  return (
    <>
      <label className={styles.fullWidth}>
        {t("videoManagement.mediaFolder")}
        <input
          ref={mediaFolderInputRef}
          type="file"
          multiple
          required
          onChange={(event) => {
            const selectedFiles = Array.from(event.target.files ?? []);
            onMediaFolderFilesChange(selectedFiles);
          }}
        />
        <p className={styles.uploadInputHint}>
          {t("videoManagement.mediaFolderHintDetailed")}
        </p>
        <div className={styles.inlineStatusRow}>
          <span
            className={`${styles.statusText} ${hasMaster ? styles.statusTextOk : styles.statusTextError}`}
          >
            {hasMaster
              ? t("videoManagement.checkMasterOk")
              : t("videoManagement.checkMasterMissing")}
          </span>
          <span
            className={`${styles.statusText} ${hasVideoPlaylist ? styles.statusTextOk : styles.statusTextError}`}
          >
            {hasVideoPlaylist
              ? t("videoManagement.checkStream0Ok")
              : t("videoManagement.checkStream0Missing")}
          </span>
          <span
            className={`${styles.statusText} ${hasThumbnail ? styles.statusTextOk : styles.statusTextOptional}`}
          >
            {hasThumbnail
              ? t("videoManagement.checkThumbnailOk")
              : t("videoManagement.checkThumbnailMissing")}
          </span>
        </div>
      </label>

      {audioTracks.length > 0 && (
        <div className={`${styles.fullWidth} ${styles.audioTracksSection}`}>
          <h3>{t("videoManagement.audioTracksTitle")}</h3>
          <p className={styles.sectionHint}>
            {t("videoManagement.audioTracksHint")}
          </p>
          <div className={styles.inlineStatusRow}>
            <span
              className={`${styles.statusText} ${audioTracks.length > 0 ? styles.statusTextOk : styles.statusTextError}`}
            >
              {audioTracks.length > 0
                ? t("videoManagement.checkAudioTracksOk", {
                    count: audioTracks.length,
                  })
                : t("videoManagement.checkAudioTracksMissing")}
            </span>
          </div>

          <div className={styles.audioTracksGrid}>
            {audioTracks.map((track) => (
              <article
                key={track.streamFolder}
                className={styles.audioTrackCard}
              >
                <h4>{track.streamFolder}</h4>

                <label>
                  {t("videoManagement.audioContentDe")}
                  <input
                    value={track.titleDe}
                    required
                    onChange={(event) => {
                      const next = event.target.value;
                      updateTrack(track.streamFolder, (current) => ({
                        ...current,
                        titleDe: next,
                      }));
                    }}
                  />
                </label>

                <label>
                  {t("videoManagement.audioContentEn")}
                  <input
                    value={track.titleEn}
                    onChange={(event) => {
                      const next = event.target.value;
                      updateTrack(track.streamFolder, (current) => ({
                        ...current,
                        titleEn: next,
                      }));
                    }}
                  />
                </label>

                <label>
                  {t("videoManagement.audioDefaultVolume")}
                  <input
                    type="number"
                    min={0}
                    max={1}
                    step={0.05}
                    value={track.defaultVolume}
                    onChange={(event) => {
                      updateTrack(track.streamFolder, (current) => ({
                        ...current,
                        defaultVolume: event.target.value,
                      }));
                    }}
                  />
                </label>
              </article>
            ))}
          </div>
        </div>
      )}

      {detectedFiles.length > 0 && (
        <div className={`${styles.fullWidth} ${styles.filePreviewBlock}`}>
          <h3>{t("videoManagement.detectedFiles")}</h3>
          <ul className={styles.filePreviewList}>
            {detectedFiles.slice(0, 24).map((path) => (
              <li key={path}>{path}</li>
            ))}
          </ul>
          {detectedFiles.length > 24 && (
            <p className={styles.sectionHint}>
              {t("videoManagement.moreFiles", {
                count: detectedFiles.length - 24,
              })}
            </p>
          )}
        </div>
      )}
    </>
  );
}
