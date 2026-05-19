import { useTranslation } from "react-i18next";

interface AudioContentFieldsProps {
  title: string;
  onTitleChange: (value: string) => void;
}

export function AudioContentFields({
  title,
  onTitleChange,
}: AudioContentFieldsProps) {
  const { t } = useTranslation();

  return (
    <label>
      {t("videoManagement.localizedAudioContent")}
      <input
        value={title}
        required
        onChange={(event) => {
          onTitleChange(event.target.value);
        }}
      />
    </label>
  );
}
