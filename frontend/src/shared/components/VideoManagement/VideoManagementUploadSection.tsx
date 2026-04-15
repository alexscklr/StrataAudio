import type { RefObject } from "react";
import { useTranslation } from "react-i18next";
import styles from "@/pages/styles/VideoManagementPage.module.css";
import type { AudioTrackFormState, RawAudioFileFormState, UploadMode } from "@/shared/types/videoManagement";

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
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onMediaFolderFilesChange: (files: File[]) => void;
  onRawVideoFileChange: (file: File | null) => void;
  onRawThumbnailFileChange: (file: File | null) => void;
  onRawAudioSelection: (files: FileList | null) => void;
  onTitleDeChange: (value: string) => void;
  onTitleEnChange: (value: string) => void;
  onDescriptionDeChange: (value: string) => void;
  onDescriptionEnChange: (value: string) => void;
  onGenreDeChange: (value: string) => void;
  onGenreEnChange: (value: string) => void;
  onDurationSecondsChange: (value: string) => void;
  onMandatoryChange: (value: boolean) => void;
  updateTrack: (streamFolder: string, updater: (current: AudioTrackFormState) => AudioTrackFormState) => void;
  updateRawAudio: (index: number, updater: (current: RawAudioFileFormState) => RawAudioFileFormState) => void;
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
  onSubmit,
  onMediaFolderFilesChange,
  onRawVideoFileChange,
  onRawThumbnailFileChange,
  onRawAudioSelection,
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

  const uploadDisabled = isUploading
    || (uploadMode === "catalog" && (!hasMaster || !hasVideoPlaylist || audioTracks.length === 0))
    || (uploadMode === "raw" && (!rawVideoFile || rawAudioFiles.length === 0));

  return (
    <section className={styles.sectionCard}>
      <h2>{canUploadWithInvite ? t("videoManagement.uploadTitleInvite") : t("videoManagement.uploadTitle")}</h2>
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

      {canUploadWithInvite && (
        <p className={styles.sectionHint}>{t("videoManagement.inviteActive")}</p>
      )}

      <p className={styles.sectionHint}>
        {uploadMode === "catalog" ? t("videoManagement.folderHint") : t("videoManagement.rawHint")}
      </p>

      {uploadMode === "catalog" && isAdmin && (
        <div className={styles.uploadChecks}>
          <span className={hasMaster ? styles.checkOk : styles.checkMissing}>
            {hasMaster ? t("videoManagement.checkMasterOk") : t("videoManagement.checkMasterMissing")}
          </span>
          <span className={hasVideoPlaylist ? styles.checkOk : styles.checkMissing}>
            {hasVideoPlaylist ? t("videoManagement.checkStream0Ok") : t("videoManagement.checkStream0Missing")}
          </span>
          <span className={hasThumbnail ? styles.checkOk : styles.checkMissing}>
            {hasThumbnail ? t("videoManagement.checkThumbnailOk") : t("videoManagement.checkThumbnailMissing")}
          </span>
          <span className={audioTracks.length > 0 ? styles.checkOk : styles.checkMissing}>
            {audioTracks.length > 0
              ? t("videoManagement.checkAudioTracksOk", { count: audioTracks.length })
              : t("videoManagement.checkAudioTracksMissing")}
          </span>
        </div>
      )}

      {uploadMode === "raw" && (
        <div className={styles.uploadChecks}>
          <span className={rawVideoFile ? styles.checkOk : styles.checkMissing}>
            {rawVideoFile ? t("videoManagement.checkRawVideoOk") : t("videoManagement.checkRawVideoMissing")}
          </span>
          <span className={rawThumbnailFile ? styles.checkOk : styles.checkMissing}>
            {rawThumbnailFile ? t("videoManagement.checkRawThumbnailOk") : t("videoManagement.checkRawThumbnailMissing")}
          </span>
          <span className={rawAudioFiles.length > 0 ? styles.checkOk : styles.checkMissing}>
            {rawAudioFiles.length > 0
              ? t("videoManagement.checkRawAudiosOk", { count: rawAudioFiles.length })
              : t("videoManagement.checkRawAudiosMissing")}
          </span>
          <span className={styles.checkOk}>{t("videoManagement.checkInfoTxtAuto")}</span>
        </div>
      )}

      <form className={styles.formGrid} onSubmit={onSubmit}>
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
              <input value={titleDe} onChange={(event) => { onTitleDeChange(event.target.value); }} required />
            </label>

            <label>
              {t("videoManagement.titleEn")}
              <input value={titleEn} onChange={(event) => { onTitleEnChange(event.target.value); }} />
            </label>

            <label>
              {t("videoManagement.genreDe")}
              <input value={genreDe} onChange={(event) => { onGenreDeChange(event.target.value); }} required />
            </label>

            <label>
              {t("videoManagement.genreEn")}
              <input value={genreEn} onChange={(event) => { onGenreEnChange(event.target.value); }} />
            </label>

            <label className={styles.fullWidth}>
              {t("videoManagement.descriptionDe")}
              <textarea value={descriptionDe} onChange={(event) => { onDescriptionDeChange(event.target.value); }} rows={3} />
            </label>

            <label className={styles.fullWidth}>
              {t("videoManagement.descriptionEn")}
              <textarea value={descriptionEn} onChange={(event) => { onDescriptionEnChange(event.target.value); }} rows={3} />
            </label>
          </>
        )}

        <label>
          {t("videoManagement.duration")}
          <input
            type="number"
            min={0}
            value={durationSeconds}
            onChange={(event) => { onDurationSecondsChange(event.target.value); }}
            placeholder="z. B. 147"
          />
        </label>

        {!isInviteRawUpload && (
          <label className={styles.switchLabel}>
            <input
              type="checkbox"
              checked={isMandatory}
              onChange={(event) => { onMandatoryChange(event.target.checked); }}
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
          </label>
        )}

        {uploadMode === "catalog" && isAdmin && audioTracks.length > 0 && (
          <div className={`${styles.fullWidth} ${styles.audioTracksSection}`}>
            <h3>{t("videoManagement.audioTracksTitle")}</h3>
            <p className={styles.sectionHint}>{t("videoManagement.audioTracksHint")}</p>

            <div className={styles.audioTracksGrid}>
              {audioTracks.map((track) => (
                <article key={track.streamFolder} className={styles.audioTrackCard}>
                  <h4>{track.streamFolder}</h4>

                  <label>
                    {t("videoManagement.audioTitleDe")}
                    <input
                      value={track.titleDe}
                      required
                      onChange={(event) => {
                        updateTrack(track.streamFolder, (current) => ({ ...current, titleDe: event.target.value }));
                      }}
                    />
                  </label>

                  <label>
                    {t("videoManagement.audioTitleEn")}
                    <input
                      value={track.titleEn}
                      onChange={(event) => {
                        updateTrack(track.streamFolder, (current) => ({ ...current, titleEn: event.target.value }));
                      }}
                    />
                  </label>

                  <label>
                    {t("videoManagement.audioTypeDe")}
                    <input
                      value={track.typeDe}
                      required
                      onChange={(event) => {
                        updateTrack(track.streamFolder, (current) => ({ ...current, typeDe: event.target.value }));
                      }}
                    />
                  </label>

                  <label>
                    {t("videoManagement.audioTypeEn")}
                    <input
                      value={track.typeEn}
                      onChange={(event) => {
                        updateTrack(track.streamFolder, (current) => ({ ...current, typeEn: event.target.value }));
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

                  <label>
                    {t("videoManagement.audioIcon")}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => {
                        const icon = event.target.files?.[0] ?? null;
                        updateTrack(track.streamFolder, (current) => ({ ...current, iconFile: icon }));
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
              <p className={styles.sectionHint}>{t("videoManagement.moreFiles", { count: detectedFiles.length - 24 })}</p>
            )}
          </div>
        )}

        {uploadMode === "raw" && canUpload && (
          <>
            <label className={styles.fullWidth}>
              {t("videoManagement.rawVideoFile")}
              <input
                type="file"
                required
                accept="video/*"
                onChange={(event) => {
                  onRawVideoFileChange(event.target.files?.[0] ?? null);
                }}
              />
            </label>

            <label className={styles.fullWidth}>
              {t("videoManagement.rawThumbnailFile")}
              <input
                type="file"
                accept="image/*"
                onChange={(event) => {
                  onRawThumbnailFileChange(event.target.files?.[0] ?? null);
                }}
              />
            </label>

            <label className={styles.fullWidth}>
              {t("videoManagement.rawAudioFiles")}
              <input
                type="file"
                multiple
                required
                accept="audio/*,.aiff,.wav,.mp3,.aac,.flac,.m4a"
                onChange={(event) => {
                  onRawAudioSelection(event.target.files);
                }}
              />
            </label>

            {rawAudioFiles.length > 0 && (
              <div className={`${styles.fullWidth} ${styles.audioTracksSection}`}>
                <h3>{t("videoManagement.rawAudioMetaTitle")}</h3>
                <p className={styles.sectionHint}>{t("videoManagement.rawAudioMetaHint")}</p>

                <div className={styles.audioTracksGrid}>
                  {rawAudioFiles.map((audio, index) => (
                    <article key={`${audio.file.name}-${audio.file.size}`} className={styles.audioTrackCard}>
                      <h4>{audio.file.name}</h4>

                      {isInviteRawUpload ? (
                        <>
                          <label>
                            {t("videoManagement.localizedAudioTitle")}
                            <input
                              value={isEnglishUi ? audio.titleEn : audio.titleDe}
                              required
                              onChange={(event) => {
                                const next = event.target.value;
                                updateRawAudio(index, (current) => (
                                  isEnglishUi
                                    ? { ...current, titleEn: next }
                                    : { ...current, titleDe: next }
                                ));
                              }}
                            />
                          </label>

                          <label>
                            {t("videoManagement.localizedAudioType")}
                            <input
                              value={isEnglishUi ? audio.typeEn : audio.typeDe}
                              required
                              onChange={(event) => {
                                const next = event.target.value;
                                updateRawAudio(index, (current) => (
                                  isEnglishUi
                                    ? { ...current, typeEn: next }
                                    : { ...current, typeDe: next }
                                ));
                              }}
                            />
                          </label>
                        </>
                      ) : (
                        <>
                          <label>
                            {t("videoManagement.audioTitleDe")}
                            <input
                              value={audio.titleDe}
                              required
                              onChange={(event) => {
                                updateRawAudio(index, (current) => ({ ...current, titleDe: event.target.value }));
                              }}
                            />
                          </label>

                          <label>
                            {t("videoManagement.audioTitleEn")}
                            <input
                              value={audio.titleEn}
                              onChange={(event) => {
                                updateRawAudio(index, (current) => ({ ...current, titleEn: event.target.value }));
                              }}
                            />
                          </label>

                          <label>
                            {t("videoManagement.audioTypeDe")}
                            <input
                              value={audio.typeDe}
                              required
                              onChange={(event) => {
                                updateRawAudio(index, (current) => ({ ...current, typeDe: event.target.value }));
                              }}
                            />
                          </label>

                          <label>
                            {t("videoManagement.audioTypeEn")}
                            <input
                              value={audio.typeEn}
                              onChange={(event) => {
                                updateRawAudio(index, (current) => ({ ...current, typeEn: event.target.value }));
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
                            updateRawAudio(index, (current) => ({ ...current, defaultVolume: event.target.value }));
                          }}
                        />
                      </label>

                      <label>
                        {t("videoManagement.audioIcon")}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(event) => {
                            updateRawAudio(index, (current) => ({ ...current, iconFile: event.target.files?.[0] ?? null }));
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
          <button type="submit" className={styles.submitButton} disabled={uploadDisabled}>
            {isUploading
              ? t("videoManagement.uploading")
              : uploadMode === "catalog"
                ? t("videoManagement.uploadAction")
                : t("videoManagement.rawUploadAction")}
          </button>
        </div>
      </form>

      {uploadSuccess && <p className={styles.successText}>{t("videoManagement.uploadSuccess")}</p>}
      {rawUploadSuccess && <p className={styles.successText}>{t("videoManagement.rawUploadSuccess")}</p>}
      {uploadErrorMessage && <p className={styles.errorText}>{uploadErrorMessage}</p>}
      {rawUploadErrorMessage && <p className={styles.errorText}>{rawUploadErrorMessage}</p>}
    </section>
  );
}
