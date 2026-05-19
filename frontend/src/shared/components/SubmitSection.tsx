import { useTranslation } from "react-i18next";
import styles from "@/pages/styles/ManagementPage.module.css";

interface SubmitSectionProps {
  disabled: boolean;
  isSubmitting: boolean;
  idleLabelKey: string;
  successLabelKey: string;
  isSuccess: boolean;
  errorMessage: string | null;
}

export function SubmitSection({
  disabled,
  isSubmitting,
  idleLabelKey,
  successLabelKey,
  isSuccess,
  errorMessage,
}: SubmitSectionProps) {
  const { t } = useTranslation();

  return (
    <>
      <div className={styles.fullWidth}>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={disabled}
        >
          {isSubmitting ? t("videoManagement.uploading") : t(idleLabelKey)}
        </button>
      </div>

      {isSuccess && <p className={styles.successText}>{t(successLabelKey)}</p>}
      {errorMessage && <p className={styles.errorText}>{errorMessage}</p>}
    </>
  );
}
