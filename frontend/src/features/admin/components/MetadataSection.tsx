import { useTranslation } from "react-i18next";
import styles from "@/pages/styles/ManagementPage.module.css";
import { LocalizedMetadataFields } from "./LocalizedMetadataFields";

interface MetadataSectionProps {
  isInviteRawUpload: boolean;
  isEnglishUi: boolean;
  titleDe: string;
  titleEn: string;
  genreDe: string;
  genreEn: string;
  descriptionDe: string;
  descriptionEn: string;
  durationSeconds: string;
  isMandatory: boolean;
  showMandatory: boolean;
  onTitleDeChange: (value: string) => void;
  onTitleEnChange: (value: string) => void;
  onGenreDeChange: (value: string) => void;
  onGenreEnChange: (value: string) => void;
  onDescriptionDeChange: (value: string) => void;
  onDescriptionEnChange: (value: string) => void;
  onDurationSecondsChange: (value: string) => void;
  onMandatoryChange: (value: boolean) => void;
}

export function MetadataSection({
  isInviteRawUpload,
  isEnglishUi,
  titleDe,
  titleEn,
  genreDe,
  genreEn,
  descriptionDe,
  descriptionEn,
  durationSeconds,
  isMandatory,
  showMandatory,
  onTitleDeChange,
  onTitleEnChange,
  onGenreDeChange,
  onGenreEnChange,
  onDescriptionDeChange,
  onDescriptionEnChange,
  onDurationSecondsChange,
  onMandatoryChange,
}: MetadataSectionProps) {
  const { t } = useTranslation();

  return (
    <>
      <LocalizedMetadataFields
        isInviteRawUpload={isInviteRawUpload}
        isEnglishUi={isEnglishUi}
        titleDe={titleDe}
        titleEn={titleEn}
        genreDe={genreDe}
        genreEn={genreEn}
        descriptionDe={descriptionDe}
        descriptionEn={descriptionEn}
        onTitleDeChange={onTitleDeChange}
        onTitleEnChange={onTitleEnChange}
        onGenreDeChange={onGenreDeChange}
        onGenreEnChange={onGenreEnChange}
        onDescriptionDeChange={onDescriptionDeChange}
        onDescriptionEnChange={onDescriptionEnChange}
      />

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

      {showMandatory && (
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
    </>
  );
}
