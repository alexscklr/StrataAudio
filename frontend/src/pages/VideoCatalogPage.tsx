import { useVideoCatalog } from "@/shared/hooks/useVideoCatalog";
import styles from "./styles/VideoCatalogPage.module.css";
import mainPageStyles from "./styles/MainPageStyle.module.css";
import CatalogItem from "@/shared/components/CatalogItem/CatalogItem";
import ProgressBar from "@/shared/components/ProgressBar/ProgressBar";
import { useContext, useMemo } from "react";
import { AuthContext } from "@/features/auth/context/AuthContext";
import type { CatalogItemStatus, VideoCatalogItem } from "@/shared/types/media";
import { useTranslation } from 'react-i18next';
import { PageMeta } from "@/shared/components/Seo/PageMeta";


function VideoCatalogPage() {
    const { t } = useTranslation();
    const { participantId } = useContext(AuthContext);
    const { data: videoCatalog, isLoading, error } = useVideoCatalog(participantId);

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


    return (
        <section className={mainPageStyles.pageGrid}>
            <PageMeta title={t('seo.videoCatalog.title')} description={t('seo.videoCatalog.description')} />
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

                {mandatoryVideos.length > 0 ? (
                    <ul className={styles.catalogList}>
                        {mandatoryVideos.map((video) => (
                            <li key={video.id} className={styles.catalogListItem}>
                                <CatalogItem
                                    thumbnailUrl={video.thumbnail_url}
                                    title={video.title}
                                    videoid={video.id}
                                    hlsUrl={video.hls_url}
                                    genre={video.genre}
                                    description={video.description || undefined}
                                    status={getVideoStatus(video)}
                                       duration={video.duration_seconds ?? undefined}
                                />
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className={styles.emptyState}>{t('videoCatalog.mandatoryEmpty')}</p>
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

                {optionalVideos.length > 0 ? (
                    <ul className={styles.catalogList}>
                        {optionalVideos.map((video) => (
                            <li key={video.id} className={styles.catalogListItem}>
                                <CatalogItem
                                    thumbnailUrl={video.thumbnail_url}
                                    title={video.title}
                                    videoid={video.id}
                                    hlsUrl={video.hls_url}
                                    genre={video.genre}
                                    description={video.description || undefined}
                                    status={getVideoStatus(video, !optionalUnlocked)}
                                       duration={video.duration_seconds ?? undefined}
                                />
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className={styles.emptyState}>{t('videoCatalog.optionalEmpty')}</p>
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

                {watchedVideos.length > 0 ? (
                    <ul className={styles.catalogList}>
                        {watchedVideos.map((video) => (
                            <li key={video.id} className={styles.catalogListItem}>
                                <CatalogItem
                                    thumbnailUrl={video.thumbnail_url}
                                    title={video.title}
                                    videoid={video.id}
                                    hlsUrl={video.hls_url}
                                    genre={video.genre}
                                    description={video.description || undefined}
                                    status={getVideoStatus(video)}
                                       duration={video.duration_seconds ?? undefined}
                                />
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className={styles.emptyState}>{t('videoCatalog.watchedEmpty')}</p>
                )}
            </section>
        </section>
    );
}

export default VideoCatalogPage;