import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { AuthContext } from "@/features/auth/context/AuthContext";
import styles from "@/pages/styles/ManagementPage.module.css";
import { useRawUploadForm } from "@/features/upload/hooks/useRawUploadForm";
import { useRawUpload } from "@/features/upload/hooks/useRawUpload";
import {
  HCAPTCHA_SITE_KEY,
} from "@/config/captcha";
import { parseOptionalNumber } from "@/shared/utils/videos";
import { SubmitSection } from "@/shared/components/SubmitSection";
import { CaptchaWidget } from "./CaptchaWidget";
import { RawMetadataFields } from "./RawMetadataFields";
import { RawUploadFields } from "./RawUploadFields";

export function RawUploadSection() {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const isAdmin = Boolean(user);

  const {
    inviteToken,
    title,
    setTitle,
    description,
    setDescription,
    durationSeconds,
    setDurationSeconds,
    isMandatory,
    setIsMandatory,
    rawVideoFile,
    setRawVideoFile,
    rawVideoContainsAudio,
    setRawVideoContainsAudio,
    rawVideoAudioMeta,
    rawThumbnailFile,
    setRawThumbnailFile,
    rawAudioFiles,
    captchaToken,
    setCaptchaToken,
    consentGiven,
    setConsentGiven,
    updateRawVideoAudioMeta,
    updateRawAudio,
    onRawAudioFileChange,
    resetUploadForm,
    canUploadWithInvite,
    canUpload,
    isInviteRawUpload,
    minRawAudioFiles,
    hasRequiredRawAudios,
    hasRequiredRawVideoAudioMetadata,
    hasRequiredRawAudioMetadata,
    showCaptcha,
    isRawUploadReady,
  } = useRawUploadForm({ isAdmin });

  const { rawUploadMutation, rawUploadErrorMessage, isUploading } =
    useRawUpload({ resetUploadForm });

  const uploadDisabled = isUploading || !isRawUploadReady;

  if (!canUpload) {
    return (
      <section className={styles.sectionCard}>
        <header className={styles.sectionHeader}>
          <h1>{t("videoManagement.title")}</h1>
          <p>{t("videoManagement.authRequired")}</p>
        </header>
        <p className={styles.sectionHint}>{t("videoManagement.inviteHint")}</p>
      </section>
    );
  }

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!rawVideoFile || !isRawUploadReady) {
      return;
    }

    rawUploadMutation.mutate({
      title: title.trim(),
      description: description.trim(),
      isMandatory: isInviteRawUpload ? false : isMandatory,
      durationSeconds: parseOptionalNumber(durationSeconds),
      videoFile: rawVideoFile,
      containsVideoAudio: rawVideoContainsAudio,
      videoAudio: rawVideoContainsAudio
        ? {
            title: rawVideoAudioMeta.title.trim(),
            defaultVolume: Number(rawVideoAudioMeta.defaultVolume),
            iconFile: rawVideoAudioMeta.iconFile,
          }
        : undefined,
      thumbnailFile: rawThumbnailFile,
      inviteToken,
      captchaToken,
      consentGiven: canUploadWithInvite ? consentGiven : undefined,
      audioFiles: rawAudioFiles.map((audio) => ({
        file: audio.file,
        title: audio.title.trim(),
        defaultVolume: Number(audio.defaultVolume),
        iconFile: audio.iconFile,
      })),
    });
  };

  return (
    <section className={styles.sectionCard}>
      <h2>
        {canUploadWithInvite
          ? t("videoManagement.uploadTitleInvite")
          : t("videoManagement.uploadTitle")}
      </h2>

      <form className={styles.formGrid} onSubmit={onSubmit}>
        {canUploadWithInvite && (
          <>
            <p className={`${styles.fullWidth} ${styles.sectionHint}`}>
              {t("videoManagement.inviteAttributionHint")}
            </p>
            <label className={`${styles.fullWidth} ${styles.switchLabel}`}>
              <input
                type="checkbox"
                checked={consentGiven}
                onChange={(event) => setConsentGiven(event.target.checked)}
                required
              />
              {t("videoManagement.inviteConsentLabel")}
            </label>
          </>
        )}
        {showCaptcha && (
          <CaptchaWidget
            siteKey={HCAPTCHA_SITE_KEY}
            onTokenChange={setCaptchaToken}
            isVisible={true}
          />
        )}

        <RawMetadataFields
          title={title}
          description={description}
          durationSeconds={durationSeconds}
          isMandatory={isMandatory}
          showMandatory={!isInviteRawUpload}
          onTitleChange={setTitle}
          onDescriptionChange={setDescription}
          onDurationSecondsChange={setDurationSeconds}
          onMandatoryChange={setIsMandatory}
        />

        <RawUploadFields
          canUpload={canUpload}
          rawVideoFile={rawVideoFile}
          onRawVideoFileChange={setRawVideoFile}
          rawVideoContainsAudio={rawVideoContainsAudio}
          onRawVideoContainsAudioChange={setRawVideoContainsAudio}
          rawVideoAudioMeta={rawVideoAudioMeta}
          updateRawVideoAudioMeta={updateRawVideoAudioMeta}
          hasRequiredRawVideoAudioMetadata={hasRequiredRawVideoAudioMetadata}
          rawThumbnailFile={rawThumbnailFile}
          onRawThumbnailFileChange={setRawThumbnailFile}
          rawAudioFiles={rawAudioFiles}
          onRawAudioFileChange={onRawAudioFileChange}
          minRawAudioFiles={minRawAudioFiles}
          hasRequiredRawAudios={hasRequiredRawAudios}
          hasRequiredRawAudioMetadata={hasRequiredRawAudioMetadata}
          updateRawAudio={updateRawAudio}
        />

        <SubmitSection
          disabled={uploadDisabled}
          isSubmitting={isUploading}
          idleLabelKey="videoManagement.rawUploadAction"
          successLabelKey="videoManagement.rawUploadSuccess"
          isSuccess={rawUploadMutation.isSuccess}
          errorMessage={rawUploadErrorMessage}
        />
      </form>
    </section>
  );
}
