import { useVideoCatalog } from "@/shared/hooks/useVideoCatalog";
import styles from "./styles/VideoCatalogPage.module.css";
import mainPageStyles from "./styles/MainPageStyle.module.css";
import ProgressBar from "@/shared/components/ProgressBar/ProgressBar";
import { useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/features/auth/context/AuthContext";
import type { CatalogItemStatus, VideoCatalogItem } from "@/shared/types/media";
import { useTranslation } from 'react-i18next';
import { PageMeta } from "@/shared/components/Seo/PageMeta";
import { getPublicUrl } from "@/shared/utils/storage";
import CatalogVideoList from "./components/CatalogVideoList";


function VideoCatalogPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { participantId } = useContext(AuthContext);
    const { data: videoCatalog, isLoading, error } = useVideoCatalog(participantId);
    const loadingPlaceholders = Array.from({ length: 3 }, (_, index) => `loading-${index}`);

    const {
        mandatoryVideos,
        optionalVideos,
        watchedVideos,
        mandatoryTotal,
        mandatoryWatched,
    } = useMemo(() => {
        const catalog = videoCatalog ?? [];
        const mandatory = catalog.filter((video) => video.is_mandatory && !video.watched);
        const optional = catalog.filter((video) => !video.is_mandatory && !video.watched);
        const watched = catalog.filter((video) => video.watched);
        const totalMandatory = catalog.filter((video) => video.is_mandatory).length;
        const watchedMandatory = catalog.filter((video) => video.is_mandatory && video.watched).length;

        return {
            mandatoryVideos: mandatory,
            optionalVideos: optional,
            watchedVideos: watched,
            mandatoryTotal: totalMandatory,
            mandatoryWatched: watchedMandatory,
        };
    }, [videoCatalog]);

    const mandatoryProgress = mandatoryTotal > 0 ? Math.round((mandatoryWatched / mandatoryTotal) * 100) : 100;
    const optionalUnlocked = mandatoryTotal === 0 || mandatoryWatched === mandatoryTotal;

    const getVideoStatus = (video: VideoCatalogItem, locked = false): CatalogItemStatus => {
        if (video.watched) {
            return "watched";
        }

        if (locked) {
            return "locked";
        }

        return "unlocked";
    };

    const firstVisibleVideo = mandatoryVideos[0] ?? optionalVideos[0] ?? watchedVideos[0];
    const lcpThumbnailUrl = firstVisibleVideo?.thumbnail_url
        ? getPublicUrl(`${firstVisibleVideo.id}/${firstVisibleVideo.thumbnail_url}`, "videos")
        : undefined;


    return (
        <section className={mainPageStyles.pageGrid}>
            <PageMeta
                title={t('seo.videoCatalog.title')}
                description={t('seo.videoCatalog.description')}
                preloadImageHref={lcpThumbnailUrl}
            />
            {isLoading && <p>{t('videoCatalog.loading')}</p>}
            {error && <p>{t('videoCatalog.loadError', { message: error.message })}</p>}

            <section className={styles.sectionCard}>
                <header className={styles.sectionHeader}>
                    <div>
                        <h2>{t('videoCatalog.mandatoryTitle')}</h2>
                        <p className={styles.sectionHint}>{t('videoCatalog.mandatoryHint')}</p>
                    </div>
                    <span className={styles.counter}>{mandatoryWatched}/{mandatoryTotal}</span>
                </header>

                <div className={styles.progressBarWrapper}>
                    <ProgressBar
                        percentage={mandatoryProgress}
                        label={t('videoCatalog.progress')}
                        counter={`${mandatoryWatched}/${mandatoryTotal}`}
                    />
                </div>

                {mandatoryTotal > 0 && mandatoryWatched === mandatoryTotal && (
                    <button
                        type="button"
                        className="primary"
                        onClick={() => navigate('/endumfrage')}
                    >
                        {t('videoCatalog.proceedToSurvey')}
                    </button>
                )}

                {isLoading ? (
                    <ul className={`${styles.catalogList} ${styles.catalogListLoading}`} aria-hidden="true">
                        {loadingPlaceholders.map((placeholderId) => (
                            <li key={placeholderId} className={`${styles.catalogListItem} ${styles.catalogListItemLoading}`} />
                        ))}
                    </ul>
                ) : (
                    <CatalogVideoList
                        videos={mandatoryVideos}
                        firstVisibleVideoId={firstVisibleVideo?.id}
                        getStatus={(video) => getVideoStatus(video)}
                        listClassName={styles.catalogList}
                        listItemClassName={styles.catalogListItem}
                        emptyMessage={t('videoCatalog.mandatoryEmpty')}
                        emptyClassName={styles.emptyState}
                    />
                )}
            </section>

            <section className={styles.sectionCard}>
                <header className={styles.sectionHeader}>
                    <div>
                        <h2>{t('videoCatalog.optionalTitle')}</h2>
                        {!optionalUnlocked && (
                            <p className={styles.unlockHint}>
                                {t('videoCatalog.optionalLockedHint')}
                            </p>
                        )}
                    </div>
                    <span className={styles.counter}>{optionalVideos.length}</span>
                </header>

                {isLoading ? (
                    <ul className={`${styles.catalogList} ${styles.catalogListLoading}`} aria-hidden="true">
                        {loadingPlaceholders.map((placeholderId) => (
                            <li key={`optional-${placeholderId}`} className={`${styles.catalogListItem} ${styles.catalogListItemLoading}`} />
                        ))}
                    </ul>
                ) : (
                    <CatalogVideoList
                        videos={optionalVideos}
                        firstVisibleVideoId={firstVisibleVideo?.id}
                        getStatus={(video) => getVideoStatus(video, !optionalUnlocked)}
                        listClassName={styles.catalogList}
                        listItemClassName={styles.catalogListItem}
                        emptyMessage={t('videoCatalog.optionalEmpty')}
                        emptyClassName={styles.emptyState}
                    />
                )}
            </section>

            <section className={styles.sectionCard}>
                <header className={styles.sectionHeader}>
                    <div>
                        <h2>{t('videoCatalog.watchedTitle')}</h2>
                        <p className={styles.sectionHint}>{t('videoCatalog.watchedHint')}</p>
                    </div>
                    <span className={styles.counter}>{watchedVideos.length}</span>
                </header>

                {isLoading ? (
                    <div className={styles.watchedLoadingSpacer} aria-hidden="true" />
                ) : (
                    <CatalogVideoList
                        videos={watchedVideos}
                        firstVisibleVideoId={firstVisibleVideo?.id}
                        getStatus={(video) => getVideoStatus(video)}
                        listClassName={styles.catalogList}
                        listItemClassName={styles.catalogListItem}
                        emptyMessage={t('videoCatalog.watchedEmpty')}
                        emptyClassName={styles.emptyState}
                    />
                )}
            </section>
        </section>
    );
}

export default VideoCatalogPage;