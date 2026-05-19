import { useTranslation } from "react-i18next";
import styles from "@/pages/styles/ManagementPage.module.css";

interface RawMetadataFieldsProps {
  title: string;
  description: string;
  durationSeconds: string;
  isMandatory: boolean;
  showMandatory: boolean;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onDurationSecondsChange: (value: string) => void;
  onMandatoryChange: (value: boolean) => void;
}

export function RawMetadataFields({
  title,
  description,
  durationSeconds,
  isMandatory,
  showMandatory,
  onTitleChange,
  onDescriptionChange,
  onDurationSecondsChange,
  onMandatoryChange,
}: RawMetadataFieldsProps) {
  const { t } = useTranslation();

  return (
    <>
      <label>
        {t("videoManagement.localizedTitle")}
        <input
          value={title}
          required
          onChange={(event) => {
            onTitleChange(event.target.value);
          }}
        />
      </label>

      <label className={styles.fullWidth}>
        {t("videoManagement.localizedDescription")}
        <textarea
          value={description}
          required
          rows={3}
          onChange={(event) => {
            onDescriptionChange(event.target.value);
          }}
        />
      </label>

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
