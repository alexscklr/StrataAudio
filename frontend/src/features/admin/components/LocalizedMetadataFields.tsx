import { useTranslation } from "react-i18next";
import styles from "@/pages/styles/ManagementPage.module.css";

interface LocalizedMetadataFieldsProps {
  isInviteRawUpload: boolean;
  isEnglishUi: boolean;
  titleDe: string;
  titleEn: string;
  genreDe: string;
  genreEn: string;
  descriptionDe: string;
  descriptionEn: string;
  onTitleDeChange: (value: string) => void;
  onTitleEnChange: (value: string) => void;
  onGenreDeChange: (value: string) => void;
  onGenreEnChange: (value: string) => void;
  onDescriptionDeChange: (value: string) => void;
  onDescriptionEnChange: (value: string) => void;
}

export function LocalizedMetadataFields({
  isInviteRawUpload,
  isEnglishUi,
  titleDe,
  titleEn,
  genreDe,
  genreEn,
  descriptionDe,
  descriptionEn,
  onTitleDeChange,
  onTitleEnChange,
  onGenreDeChange,
  onGenreEnChange,
  onDescriptionDeChange,
  onDescriptionEnChange,
}: LocalizedMetadataFieldsProps) {
  const { t } = useTranslation();

  if (isInviteRawUpload) {
    return (
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
    );
  }

  return (
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
  );
}
