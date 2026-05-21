import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "@/pages/styles/ManagementPage.module.css";
import type {
  EmbeddedAudioFormState,
  RawAudioFileFormState,
} from "@/shared/types/videos";
import { AudioContentFields } from "./AudioContentFields";

interface RawUploadFieldsProps {
  rawVideoFile: File | null;
  onRawVideoFileChange: (file: File | null) => void;
  rawVideoContainsAudio: boolean;
  onRawVideoContainsAudioChange: (value: boolean) => void;
  rawVideoAudioMeta: EmbeddedAudioFormState;
  updateRawVideoAudioMeta: (
    updater: (current: EmbeddedAudioFormState) => EmbeddedAudioFormState,
  ) => void;
  hasRequiredRawVideoAudioMetadata: boolean;
  rawThumbnailFile: File | null;
  onRawThumbnailFileChange: (file: File | null) => void;
  rawAudioFiles: RawAudioFileFormState[];
  onRawAudioFileChange: (index: number, file: File | null) => void;
  minRawAudioFiles: number;
  hasRequiredRawAudios: boolean;
  hasRequiredRawAudioMetadata: boolean;
  updateRawAudio: (
    index: number,
    updater: (current: RawAudioFileFormState) => RawAudioFileFormState,
  ) => void;
}

export function RawUploadFields({
  rawVideoFile,
  onRawVideoFileChange,
  rawVideoContainsAudio,
  onRawVideoContainsAudioChange,
  rawVideoAudioMeta,
  updateRawVideoAudioMeta,
  hasRequiredRawVideoAudioMetadata,
  rawThumbnailFile,
  onRawThumbnailFileChange,
  rawAudioFiles,
  onRawAudioFileChange,
  minRawAudioFiles,
  hasRequiredRawAudios,
  hasRequiredRawAudioMetadata,
  updateRawAudio,
}: RawUploadFieldsProps) {
  const { t } = useTranslation();
  const [rawAudioInputCount, setRawAudioInputCount] = useState(1);

  useEffect(() => {
    setRawAudioInputCount((previous) =>
      Math.max(previous, rawAudioFiles.length + 1),
    );
  }, [rawAudioFiles.length]);

  const rawAudioInputSlots = Math.max(
    rawAudioInputCount,
    rawAudioFiles.length + 1,
  );
  const maxRawAudioInputSlots = 32;

  return (
    <>
      <label className={styles.fullWidth}>
        {t("videoManagement.rawVideoFile")}
        <div className={styles.fileInputStatusRow}>
          <input
            type="file"
            required
            accept=".mp4,.mov,.mkv,.webm,.m4v,video/*"
            onChange={(event) => {
              onRawVideoFileChange(event.target.files?.[0] ?? null);
            }}
          />
          <span
            className={`${styles.statusText} ${rawVideoFile ? styles.statusTextOk : styles.statusTextError}`}
          >
            {rawVideoFile
              ? t("videoManagement.checkRawVideoOk")
              : t("videoManagement.checkRawVideoMissing")}
          </span>
        </div>
        <p className={styles.uploadInputHint}>
          {t("videoManagement.rawVideoFileHint")}
        </p>
      </label>

      <label className={`${styles.fullWidth} ${styles.switchLabel}`}>
        <input
          type="checkbox"
          checked={rawVideoContainsAudio}
          onChange={(event) => {
            onRawVideoContainsAudioChange(event.target.checked);
          }}
        />
        {t("videoManagement.rawVideoContainsAudio")}
      </label>

      {rawVideoContainsAudio && (
        <section className={`${styles.fullWidth} ${styles.containsAudioCard}`}>
          <h3>{t("videoManagement.rawVideoContainsAudioTitle")}</h3>

          <div className={styles.inlineStatusRow}>
            <span
              className={`${styles.statusText} ${hasRequiredRawVideoAudioMetadata ? styles.statusTextOk : styles.statusTextError}`}
            >
              {hasRequiredRawVideoAudioMetadata
                ? t("videoManagement.rawVideoAudioMetaComplete")
                : t("videoManagement.rawVideoAudioMetaRequired")}
            </span>
          </div>

          <div className={styles.audioTracksGrid}>
            <article className={styles.audioTrackCard}>
              <AudioContentFields
                title={rawVideoAudioMeta.title}
                onTitleChange={(value) => {
                  updateRawVideoAudioMeta((current) => ({
                    ...current,
                    title: value,
                  }));
                }}
              />

              <label>
                {t("videoManagement.audioDefaultVolume")}
                <input
                  type="number"
                  min={0}
                  max={1}
                  step={0.05}
                  value={rawVideoAudioMeta.defaultVolume}
                  onChange={(event) => {
                    updateRawVideoAudioMeta((current) => ({
                      ...current,
                      defaultVolume: event.target.value,
                    }));
                  }}
                />
              </label>
            </article>
          </div>
        </section>
      )}

      <label className={styles.fullWidth}>
        {t("videoManagement.rawThumbnailFile")}
        <div className={styles.fileInputStatusRow}>
          <input
            type="file"
            accept=".png,.jpg,.jpeg,.webp,.gif,.avif,image/*"
            onChange={(event) => {
              onRawThumbnailFileChange(event.target.files?.[0] ?? null);
            }}
          />
          <span
            className={`${styles.statusText} ${rawThumbnailFile ? styles.statusTextOk : styles.statusTextOptional}`}
          >
            {rawThumbnailFile
              ? t("videoManagement.checkRawThumbnailOk")
              : t("videoManagement.checkRawThumbnailMissing")}
          </span>
        </div>
        <p className={styles.uploadInputHint}>
          {t("videoManagement.rawThumbnailFileHint")}
        </p>
      </label>

      <div
        className={`${styles.fullWidth} ${styles.sectionDivider}`}
        aria-hidden="true"
      />

      <div className={`${styles.fullWidth} ${styles.audioTracksSection}`}>
        <h3>{t("videoManagement.rawAudioFiles")}</h3>
        <p className={styles.sectionHint}>
          {t("videoManagement.rawAudioPickerHint")}
        </p>
        <div className={styles.inlineStatusRow}>
          <span
            className={`${styles.statusText} ${hasRequiredRawAudios ? styles.statusTextOk : styles.statusTextError}`}
          >
            {hasRequiredRawAudios
              ? t("videoManagement.checkRawAudiosOk", {
                  count: rawAudioFiles.length,
                })
              : t("videoManagement.rawAudioMinRequired", {
                  count: minRawAudioFiles,
                })}
          </span>
        </div>

        <div className={styles.audioTracksGrid}>
          {Array.from({ length: rawAudioInputSlots }, (_, index) => {
            const currentAudio = rawAudioFiles[index] ?? null;

            return (
              <article
                key={`raw-audio-input-${index}`}
                className={styles.audioTrackCard}
              >
                <label>
                  <span className={styles.audioFileLabelLine}>
                    {t("videoManagement.rawAudioFileLabel", {
                      index: index + 1,
                    })}
                  </span>
                  <input
                    type="file"
                    required={
                      index < minRawAudioFiles && rawAudioFiles.length <= index
                    }
                    accept=".aiff,.aif,.wav,.mp3,.aac,.flac,.m4a,.ogg,audio/*"
                    onChange={(event) => {
                      onRawAudioFileChange(index, event.target.files?.[0] ?? null);
                    }}
                  />
                  <p className={styles.uploadInputHint}>
                    {t("videoManagement.rawAudioFileHint")}
                  </p>
                  {currentAudio && (
                    <span className={styles.audioFileName}>
                      {currentAudio.file.name}
                    </span>
                  )}
                </label>

                {currentAudio && (
                  <button
                    type="button"
                    className={styles.modeButton}
                    onClick={() => {
                      onRawAudioFileChange(index, null);
                    }}
                  >
                    {t("videoManagement.removeAudioFileAction")}
                  </button>
                )}
              </article>
            );
          })}
        </div>

        <button
          type="button"
          className={styles.modeButton}
          disabled={rawAudioInputSlots >= maxRawAudioInputSlots}
          onClick={() => {
            setRawAudioInputCount((previous) =>
              Math.min(previous + 1, maxRawAudioInputSlots),
            );
          }}
        >
          {t("videoManagement.addAudioFileAction")}
        </button>
      </div>

      {rawAudioFiles.length > 0 && (
        <div className={`${styles.fullWidth} ${styles.audioTracksSection}`}>
          <h3>{t("videoManagement.rawAudioMetaTitle")}</h3>
          <p className={styles.sectionHint}>
            {t("videoManagement.rawAudioMetaHint")}
          </p>
          <div className={styles.inlineStatusRow}>
            <span
              className={`${styles.statusText} ${hasRequiredRawAudioMetadata ? styles.statusTextOk : styles.statusTextError}`}
            >
              {hasRequiredRawAudioMetadata
                ? t("videoManagement.rawAudioMetaComplete")
                : t("videoManagement.rawAudioMetaRequired")}
            </span>
          </div>

          <div
            className={`${styles.fullWidth} ${styles.sectionDivider}`}
            aria-hidden="true"
          />

          <div className={styles.audioTracksGrid}>
            {rawAudioFiles.map((audio, index) => (
              <article
                key={`${audio.file.name}-${audio.file.size}`}
                className={styles.audioTrackCard}
              >
                <h4>{audio.file.name}</h4>

                <AudioContentFields
                  title={audio.title}
                  onTitleChange={(value) => {
                    updateRawAudio(index, (current) => ({
                      ...current,
                      title: value,
                    }));
                  }}
                />

                <label>
                  {t("videoManagement.audioDefaultVolume")}
                  <input
                    type="number"
                    min={0}
                    max={1}
                    step={0.05}
                    value={audio.defaultVolume}
                    onChange={(event) => {
                      updateRawAudio(index, (current) => ({
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
    </>
  );
}
