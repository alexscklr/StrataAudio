import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { getPublicUrl } from "@/shared/utils/storage";
import type { Video } from "@/shared/types/media";
import styles from "@/pages/styles/ManagementPage.module.css";

interface AdminListSectionProps {
  videos: Video[];
  isLoading: boolean;
  error: Error | null;
  deleteErrorMessage: string | null;
  isDeleting: boolean;
  onDelete: (videoId: string, videoTitle: string) => void;
}

export function AdminListSection({
  videos,
  isLoading,
  error,
  deleteErrorMessage,
  isDeleting,
  onDelete,
}: AdminListSectionProps) {
  const { t } = useTranslation();

  const orderedVideos = useMemo(
    () => [...videos].sort((a, b) => Number(b.is_mandatory) - Number(a.is_mandatory)),
    [videos]
  );

  return (
    <section className={styles.sectionCard}>
      <header className={styles.sectionHeader}>
        <h1>{t("videoManagement.title")}</h1>
        <p>{t("videoManagement.subtitle")}</p>
      </header>

      {isLoading && <p>{t("videoManagement.loading")}</p>}
      {error && <p className={styles.errorText}>{t("videoManagement.loadError", { message: error.message })}</p>}
      {deleteErrorMessage && <p className={styles.errorText}>{deleteErrorMessage}</p>}

      {!isLoading && orderedVideos.length === 0 && <p>{t("videoManagement.empty")}</p>}

      {orderedVideos.length > 0 && (
        <ul className={styles.videoList}>
          {orderedVideos.map((video) => {
            const thumbnailUrl = video.thumbnail_url
              ? getPublicUrl(`${video.id}/${video.thumbnail_url}`, "videos")
              : "";
            const hlsUrl = getPublicUrl(`${video.id}/${video.hls_url}`, "videos");

            return (
              <li key={video.id} className={styles.videoItem}>
                <div className={styles.videoMeta}>
                  <h2>{video.title}</h2>
                  <p><strong>ID:</strong> {video.id}</p>
                  <p><strong>{t("videoManagement.genre")}:</strong> {video.genre}</p>
                  <p>
                    <strong>{t("videoManagement.mandatory")}:</strong>{" "}
                    {video.is_mandatory ? t("videoManagement.yes") : t("videoManagement.no")}
                  </p>
                  <p>
                    <strong>{t("videoManagement.duration")}:</strong>{" "}
                    {video.duration_seconds ?? t("videoManagement.noDuration")}
                  </p>
                  <p>
                    <a href={hlsUrl} target="_blank" rel="noreferrer">
                      {video.hls_url}
                    </a>
                  </p>
                </div>

                <div className={styles.videoActions}>
                  {thumbnailUrl && (
                    <img
                      src={thumbnailUrl}
                      alt={t("videoManagement.thumbnailAlt", { title: video.title })}
                      className={styles.thumbnail}
                    />
                  )}
                  <button
                    type="button"
                    className={styles.deleteButton}
                    onClick={() => {
                      onDelete(video.id, video.title);
                    }}
                    disabled={isDeleting}
                  >
                    {isDeleting ? t("videoManagement.deleting") : t("videoManagement.deleteAction")}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
