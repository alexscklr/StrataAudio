import { useEffect, useState, type RefObject } from "react";
import { useTranslation } from "react-i18next";
import styles from "@/pages/styles/VideoManagementPage.module.css";
import type {
  AudioTrackFormState,
  EmbeddedAudioFormState,
  RawAudioFileFormState,
  UploadMode,
} from "@/shared/types/videoManagement";
import { CaptchaWidget } from "./CaptchaWidget";
import {
  HCAPTCHA_SITE_KEY,
  CAPTCHA_ENABLED_FOR_PUBLIC_UPLOADS,
} from "@/config/captcha";

interface VideoManagementUploadSectionProps {
  canUpload: boolean;
  canUploadWithInvite: boolean;
  isAdmin: boolean;
  isEnglishUi: boolean;
  isInviteRawUpload: boolean;
  uploadMode: UploadMode;
  setUploadMode: (mode: UploadMode) => void;
  hasMaster: boolean;
  hasVideoPlaylist: boolean;
  hasThumbnail: boolean;
  mediaFolderInputRef: RefObject<HTMLInputElement | null>;
  detectedFiles: string[];
  audioTracks: AudioTrackFormState[];
  rawVideoFile: File | null;
  rawVideoContainsAudio: boolean;
  rawVideoAudioMeta: EmbeddedAudioFormState;
  rawThumbnailFile: File | null;
  rawAudioFiles: RawAudioFileFormState[];
  titleDe: string;
  titleEn: string;
  descriptionDe: string;
  descriptionEn: string;
  genreDe: string;
  genreEn: string;
  durationSeconds: string;
  isMandatory: boolean;
  isUploading: boolean;
  uploadSuccess: boolean;
  rawUploadSuccess: boolean;
  uploadErrorMessage: string | null;
  rawUploadErrorMessage: string | null;
  captchaToken: string | null;
  onCaptchaTokenChange: (token: string | null) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onMediaFolderFilesChange: (files: File[]) => void;
  onRawVideoFileChange: (file: File | null) => void;
  onRawVideoContainsAudioChange: (value: boolean) => void;
  updateRawVideoAudioMeta: (
    updater: (current: EmbeddedAudioFormState) => EmbeddedAudioFormState,
  ) => void;
  onRawThumbnailFileChange: (file: File | null) => void;
  onRawAudioFileChange: (index: number, file: File | null) => void;
  onTitleDeChange: (value: string) => void;
  onTitleEnChange: (value: string) => void;
  onDescriptionDeChange: (value: string) => void;
  onDescriptionEnChange: (value: string) => void;
  onGenreDeChange: (value: string) => void;
  onGenreEnChange: (value: string) => void;
  onDurationSecondsChange: (value: string) => void;
  onMandatoryChange: (value: boolean) => void;
  updateTrack: (
    streamFolder: string,
    updater: (current: AudioTrackFormState) => AudioTrackFormState,
  ) => void;
  updateRawAudio: (
    index: number,
    updater: (current: RawAudioFileFormState) => RawAudioFileFormState,
  ) => void;
}

export function VideoManagementUploadSection({
  canUpload,
  canUploadWithInvite,
  isAdmin,
  isEnglishUi,
  isInviteRawUpload,
  uploadMode,
  setUploadMode,
  hasMaster,
  hasVideoPlaylist,
  hasThumbnail,
  mediaFolderInputRef,
  detectedFiles,
  audioTracks,
  rawVideoFile,
  rawVideoContainsAudio,
  rawVideoAudioMeta,
  rawThumbnailFile,
  rawAudioFiles,
  titleDe,
  titleEn,
  descriptionDe,
  descriptionEn,
  genreDe,
  genreEn,
  durationSeconds,
  isMandatory,
  isUploading,
  uploadSuccess,
  rawUploadSuccess,
  uploadErrorMessage,
  rawUploadErrorMessage,
  captchaToken,
  onCaptchaTokenChange,
  onSubmit,
  onMediaFolderFilesChange,
  onRawVideoFileChange,
  onRawVideoContainsAudioChange,
  updateRawVideoAudioMeta,
  onRawThumbnailFileChange,
  onRawAudioFileChange,
  onTitleDeChange,
  onTitleEnChange,
  onDescriptionDeChange,
  onDescriptionEnChange,
  onGenreDeChange,
  onGenreEnChange,
  onDurationSecondsChange,
  onMandatoryChange,
  updateTrack,
  updateRawAudio,
}: VideoManagementUploadSectionProps) {
  const { t } = useTranslation();
  const [rawAudioInputCount, setRawAudioInputCount] = useState(1);
  const [consentGiven, setConsentGiven] = useState(false);

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
  const minRawAudioFiles = rawVideoContainsAudio ? 1 : 2;
  const hasRequiredRawAudios = rawAudioFiles.length >= minRawAudioFiles;
  const hasRequiredRawVideoAudioMetadata =
    !rawVideoContainsAudio ||
    rawVideoAudioMeta.titleDe.trim() ||
    rawVideoAudioMeta.titleEn.trim();
  const hasRequiredRawAudioMetadata = rawAudioFiles.every(
    (audio) => audio.titleDe.trim() || audio.titleEn.trim(),
  );

  const uploadDisabled =
    isUploading ||
    (uploadMode === "catalog" &&
      (!hasMaster || !hasVideoPlaylist || audioTracks.length === 0)) ||
    (uploadMode === "raw" &&
      (!rawVideoFile ||
        !hasRequiredRawVideoAudioMetadata ||
        !hasRequiredRawAudios ||
        !hasRequiredRawAudioMetadata)) ||
    (canUploadWithInvite &&
      CAPTCHA_ENABLED_FOR_PUBLIC_UPLOADS &&
      !captchaToken) ||
    !consentGiven;

  return (
    <section className={styles.sectionCard}>
      <h2>
        {canUploadWithInvite
          ? t("videoManagement.uploadTitleInvite")
          : t("videoManagement.uploadTitle")}
      </h2>
      {isAdmin && (
        <div className={styles.modeSwitch}>
          <button
            type="button"
            className={`${styles.modeButton} ${uploadMode === "catalog" ? styles.modeButtonActive : ""}`}
            onClick={() => {
              setUploadMode("catalog");
            }}
          >
            {t("videoManagement.modeCatalog")}
          </button>
          <button
            type="button"
            className={`${styles.modeButton} ${uploadMode === "raw" ? styles.modeButtonActive : ""}`}
            onClick={() => {
              setUploadMode("raw");
            }}
          >
            {t("videoManagement.modeRaw")}
          </button>
        </div>
      )}

      {uploadMode === "catalog" && (
        <p className={styles.sectionHint}>{t("videoManagement.folderHint")}</p>
      )}

      <form className={styles.formGrid} onSubmit={onSubmit}>
        <label className={styles.switchLabel} style={{marginBottom: 8}}>
          <input
            type="checkbox"
            checked={consentGiven}
            onChange={e => setConsentGiven(e.target.checked)}
            required
          />
          {t("videoManagement.consentCheckboxLabel")}
        </label>
        {canUploadWithInvite && CAPTCHA_ENABLED_FOR_PUBLIC_UPLOADS && (
          <CaptchaWidget
            siteKey={HCAPTCHA_SITE_KEY}
            onTokenChange={onCaptchaTokenChange}
            isVisible={true}
          />
        )}

        {isInviteRawUpload ? (
          <>
            <label>
              {t("videoManagement.localizedTitle")}
              <input
                value={isEnglishUi ? titleEn : titleDe}
                onChange={(event) => {
                  const next = event.target.value;
                  if (isEnglishUi) {
                    onTitleEnChange(next);
                  } else {
                    onTitleDeChange(next);
                  }
                }}
                required
              />
            </label>

            <label>
              {t("videoManagement.localizedGenre")}
              <input
                value={isEnglishUi ? genreEn : genreDe}
                onChange={(event) => {
                  const next = event.target.value;
                  if (isEnglishUi) {
                    onGenreEnChange(next);
                  } else {
                    onGenreDeChange(next);
                  }
                }}
                required
              />
            </label>

            <label className={styles.fullWidth}>
              {t("videoManagement.localizedDescription")}
              <textarea
                value={isEnglishUi ? descriptionEn : descriptionDe}
                onChange={(event) => {
                  const next = event.target.value;
                  if (isEnglishUi) {
                    onDescriptionEnChange(next);
                  } else {
                    onDescriptionDeChange(next);
                  }
                }}
                rows={3}
              />
            </label>
          </>
        ) : (
          <>
            <label>
              {t("videoManagement.titleDe")}
              <input
                value={titleDe}
                onChange={(event) => {
                  onTitleDeChange(event.target.value);
                }}
                required
              />
            </label>

            <label>
              {t("videoManagement.titleEn")}
              <input
                value={titleEn}
                onChange={(event) => {
                  onTitleEnChange(event.target.value);
                }}
              />
            </label>

            <label>
              {t("videoManagement.genreDe")}
              <input
                value={genreDe}
                onChange={(event) => {
                  onGenreDeChange(event.target.value);
                }}
                required
              />
            </label>

            <label>
              {t("videoManagement.genreEn")}
              <input
                value={genreEn}
                onChange={(event) => {
                  onGenreEnChange(event.target.value);
                }}
              />
            </label>

            <label className={styles.fullWidth}>
              {t("videoManagement.descriptionDe")}
              <textarea
                value={descriptionDe}
                onChange={(event) => {
                  onDescriptionDeChange(event.target.value);
                }}
                rows={3}
              />
            </label>

            <label className={styles.fullWidth}>
              {t("videoManagement.descriptionEn")}
              <textarea
                value={descriptionEn}
                onChange={(event) => {
                  onDescriptionEnChange(event.target.value);
                }}
                rows={3}
              />
            </label>
          </>
        )}

        <label>
          {t("videoManagement.duration")}
          <input
            type="number"
            min={0}
            value={durationSeconds}
            onChange={(event) => {
              onDurationSecondsChange(event.target.value);
            }}
            placeholder="z. B. 147"
          />
        </label>

        {!isInviteRawUpload && (
          <label className={styles.switchLabel}>
            <input
              type="checkbox"
              checked={isMandatory}
              onChange={(event) => {
                onMandatoryChange(event.target.checked);
              }}
            />
            {t("videoManagement.mandatory")}
          </label>
        )}

        {uploadMode === "catalog" && isAdmin && (
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
        )}

        {uploadMode === "catalog" && isAdmin && audioTracks.length > 0 && (
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
                          typeDe: next,
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
                          typeEn: next,
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

        {uploadMode === "catalog" && isAdmin && detectedFiles.length > 0 && (
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

        {uploadMode === "raw" && canUpload && (
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
              <section
                className={`${styles.fullWidth} ${styles.containsAudioCard}`}
              >
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
                    {isInviteRawUpload ? (
                      <>
                        <label>
                          {t("videoManagement.localizedAudioContent")}
                          <input
                            value={
                              isEnglishUi
                                ? rawVideoAudioMeta.titleEn
                                : rawVideoAudioMeta.titleDe
                            }
                            required
                            onChange={(event) => {
                              const next = event.target.value;
                              updateRawVideoAudioMeta((current) =>
                                isEnglishUi
                                  ? { ...current, titleEn: next, typeEn: next }
                                  : { ...current, titleDe: next, typeDe: next },
                              );
                            }}
                          />
                        </label>
                      </>
                    ) : (
                      <>
                        <label>
                          {t("videoManagement.audioContentDe")}
                          <input
                            value={rawVideoAudioMeta.titleDe}
                            required
                            onChange={(event) => {
                              const next = event.target.value;
                              updateRawVideoAudioMeta((current) => ({
                                ...current,
                                titleDe: next,
                                typeDe: next,
                              }));
                            }}
                          />
                        </label>

                        <label>
                          {t("videoManagement.audioContentEn")}
                          <input
                            value={rawVideoAudioMeta.titleEn}
                            onChange={(event) => {
                              const next = event.target.value;
                              updateRawVideoAudioMeta((current) => ({
                                ...current,
                                titleEn: next,
                                typeEn: next,
                              }));
                            }}
                          />
                        </label>
                      </>
                    )}

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
                            index < minRawAudioFiles &&
                            rawAudioFiles.length <= index
                          }
                          accept=".aiff,.aif,.wav,.mp3,.aac,.flac,.m4a,.ogg,audio/*"
                          onChange={(event) => {
                            onRawAudioFileChange(
                              index,
                              event.target.files?.[0] ?? null,
                            );
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
              <div
                className={`${styles.fullWidth} ${styles.audioTracksSection}`}
              >
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

                      {isInviteRawUpload ? (
                        <>
                          <label>
                            {t("videoManagement.localizedAudioContent")}
                            <input
                              value={
                                isEnglishUi ? audio.titleEn : audio.titleDe
                              }
                              required
                              onChange={(event) => {
                                const next = event.target.value;
                                updateRawAudio(index, (current) =>
                                  isEnglishUi
                                    ? {
                                        ...current,
                                        titleEn: next,
                                        typeEn: next,
                                      }
                                    : {
                                        ...current,
                                        titleDe: next,
                                        typeDe: next,
                                      },
                                );
                              }}
                            />
                          </label>
                        </>
                      ) : (
                        <>
                          <label>
                            {t("videoManagement.audioContentDe")}
                            <input
                              value={audio.titleDe}
                              required
                              onChange={(event) => {
                                const next = event.target.value;
                                updateRawAudio(index, (current) => ({
                                  ...current,
                                  titleDe: next,
                                  typeDe: next,
                                }));
                              }}
                            />
                          </label>

                          <label>
                            {t("videoManagement.audioContentEn")}
                            <input
                              value={audio.titleEn}
                              onChange={(event) => {
                                const next = event.target.value;
                                updateRawAudio(index, (current) => ({
                                  ...current,
                                  titleEn: next,
                                  typeEn: next,
                                }));
                              }}
                            />
                          </label>
                        </>
                      )}

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
        )}

        <div className={styles.fullWidth}>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={uploadDisabled}
          >
            {isUploading
              ? t("videoManagement.uploading")
              : uploadMode === "catalog"
                ? t("videoManagement.uploadAction")
                : t("videoManagement.rawUploadAction")}
          </button>
        </div>
      </form>

      {uploadSuccess && (
        <p className={styles.successText}>
          {t("videoManagement.uploadSuccess")}
        </p>
      )}
      {rawUploadSuccess && (
        <p className={styles.successText}>
          {t("videoManagement.rawUploadSuccess")}
        </p>
      )}
      {uploadErrorMessage && (
        <p className={styles.errorText}>{uploadErrorMessage}</p>
      )}
      {rawUploadErrorMessage && (
        <p className={styles.errorText}>{rawUploadErrorMessage}</p>
      )}
    </section>
  );
}
