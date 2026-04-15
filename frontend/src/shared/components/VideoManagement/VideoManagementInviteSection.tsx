import { useTranslation } from "react-i18next";
import styles from "@/pages/styles/VideoManagementPage.module.css";

interface VideoManagementInviteSectionProps {
  inviteLabel: string;
  inviteExpiresHours: string;
  inviteMaxUses: string;
  onInviteLabelChange: (value: string) => void;
  onInviteExpiresHoursChange: (value: string) => void;
  onInviteMaxUsesChange: (value: string) => void;
  onCreateInvite: (event: React.FormEvent<HTMLFormElement>) => void;
  createInviteErrorMessage: string | null;
  createdInviteLink: string | null;
  isCreatingInvite: boolean;
  onCopyInviteLink: () => void;
}

export function VideoManagementInviteSection({
  inviteLabel,
  inviteExpiresHours,
  inviteMaxUses,
  onInviteLabelChange,
  onInviteExpiresHoursChange,
  onInviteMaxUsesChange,
  onCreateInvite,
  createInviteErrorMessage,
  createdInviteLink,
  isCreatingInvite,
  onCopyInviteLink,
}: VideoManagementInviteSectionProps) {
  const { t } = useTranslation();

  return (
    <section className={styles.sectionCard}>
      <h2>{t("videoManagement.inviteAdminTitle")}</h2>
      <p className={styles.sectionHint}>{t("videoManagement.inviteAdminHint")}</p>

      <form className={styles.formGrid} onSubmit={onCreateInvite}>
        <label>
          {t("videoManagement.inviteLabel")}
          <input
            value={inviteLabel}
            onChange={(event) => {
              onInviteLabelChange(event.target.value);
            }}
            placeholder={t("videoManagement.inviteLabelPlaceholder")}
          />
        </label>

        <label>
          {t("videoManagement.inviteExpiresHours")}
          <input
            type="number"
            min={1}
            value={inviteExpiresHours}
            onChange={(event) => {
              onInviteExpiresHoursChange(event.target.value);
            }}
          />
        </label>

        <label>
          {t("videoManagement.inviteMaxUses")}
          <input
            type="number"
            min={1}
            value={inviteMaxUses}
            onChange={(event) => {
              onInviteMaxUsesChange(event.target.value);
            }}
          />
        </label>

        <div className={styles.fullWidth}>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isCreatingInvite}
          >
            {isCreatingInvite ? t("videoManagement.inviteCreating") : t("videoManagement.inviteCreateAction")}
          </button>
        </div>
      </form>

      {createInviteErrorMessage && <p className={styles.errorText}>{createInviteErrorMessage}</p>}

      {createdInviteLink && (
        <div className={styles.inviteResultBox}>
          <p className={styles.successText}>{t("videoManagement.inviteCreateSuccess")}</p>
          <textarea readOnly value={createdInviteLink} rows={3} />
          <button
            type="button"
            className={styles.modeButton}
            onClick={onCopyInviteLink}
          >
            {t("videoManagement.inviteCopyAction")}
          </button>
        </div>
      )}
    </section>
  );
}
