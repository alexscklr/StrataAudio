import { useTranslation } from "react-i18next";
import { PageMeta } from "@/shared/components/Seo/PageMeta";
import mainPageStyles from "./styles/MainPageStyle.module.css";
import { useAdminVideos } from "@/features/admin/hooks/useAdminVideos";
import { AdminListSection } from "@/features/admin/components/AdminListSection";
import { InviteSection } from "@/features/admin/components/InviteSection";
import { CatalogUploadSection } from "@/features/admin/components/CatalogUploadSection";

function AdminPage() {
  const { t } = useTranslation();

  const {
    videos,
    isLoading,
    error,
    deleteMutation,
    createInviteMutation,
    createdInviteLink,
    deleteErrorMessage,
    createInviteErrorMessage,
    copyInviteLink,
    inviteLabel,
    inviteExpiresHours,
    inviteMaxUses,
    setInviteLabel,
    setInviteExpiresHours,
    setInviteMaxUses,
    createInvite,
  } = useAdminVideos();

  const onDelete = (videoId: string, videoTitle: string) => {
    const shouldDelete = window.confirm(
      t("videoManagement.deleteConfirm", { title: videoTitle }),
    );
    if (!shouldDelete) {
      return;
    }

    deleteMutation.mutate(videoId);
  };

  const onCreateInvite = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    createInvite();
  };

  return (
    <section className={mainPageStyles.pageGrid}>
      <PageMeta
        title={t("seo.videoManagement.title")}
        description={t("seo.videoManagement.description")}
      />

      <AdminListSection
        videos={videos}
        isLoading={isLoading}
        error={error instanceof Error ? error : null}
        deleteErrorMessage={deleteErrorMessage}
        isDeleting={deleteMutation.isPending}
        onDelete={onDelete}
      />

      <InviteSection
        inviteLabel={inviteLabel}
        inviteExpiresHours={inviteExpiresHours}
        inviteMaxUses={inviteMaxUses}
        onInviteLabelChange={setInviteLabel}
        onInviteExpiresHoursChange={setInviteExpiresHours}
        onInviteMaxUsesChange={setInviteMaxUses}
        onCreateInvite={onCreateInvite}
        createInviteErrorMessage={createInviteErrorMessage}
        createdInviteLink={createdInviteLink}
        isCreatingInvite={createInviteMutation.isPending}
        onCopyInviteLink={() => {
          void copyInviteLink();
        }}
      />

      <CatalogUploadSection />
    </section>
  );
}

export default AdminPage;
