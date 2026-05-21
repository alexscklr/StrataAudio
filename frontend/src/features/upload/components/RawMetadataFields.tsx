import { useTranslation } from "react-i18next";
import styles from "@/pages/styles/ManagementPage.module.css";

interface RawMetadataFieldsProps {
  title: string;
  description: string;
  durationSeconds: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onDurationSecondsChange: (value: string) => void;
}

export function RawMetadataFields({
  title,
  description,
  durationSeconds,
  onTitleChange,
  onDescriptionChange,
  onDurationSecondsChange,
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
    </>
  );
}
