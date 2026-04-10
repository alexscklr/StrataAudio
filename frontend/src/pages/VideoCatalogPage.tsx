import { useVideoCatalog } from "@/shared/hooks/useVideoCatalog";
import styles from "./styles/VideoCatalogPage.module.css";
import mainPageStyles from "./styles/MainPageStyle.module.css";
import CatalogItem from "@/shared/components/CatalogItem/CatalogItem";
import ProgressBar from "@/shared/components/ProgressBar/ProgressBar";
import { useContext, useMemo } from "react";
import { AuthContext } from "@/features/auth/context/AuthContext";
import type { CatalogItemStatus, VideoCatalogItem } from "@/shared/types/media";


function VideoCatalogPage() {
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
            {isLoading && <p>Loading...</p>}
            {error && <p>Error loading video catalog: {error.message}</p>}

            <section className={styles.sectionCard}>
                <header className={styles.sectionHeader}>
                    <div>
                        <h2>Erforderliche Videos</h2>
                        <p className={styles.sectionHint}>Diese Videos müssen zuerst abgeschlossen werden.</p>
                    </div>
                    <span className={styles.counter}>{mandatoryWatched}/{mandatoryTotal}</span>
                </header>

                <ProgressBar
                    percentage={mandatoryProgress}
                    label="Fortschritt"
                    counter={`${mandatoryWatched}/${mandatoryTotal}`}
                />

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
                                />
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className={styles.emptyState}>Alle erforderlichen Videos sind abgeschlossen.</p>
                )}
            </section>

            <section className={styles.sectionCard}>
                <header className={styles.sectionHeader}>
                    <div>
                        <h2>Optionale Videos</h2>
                        {!optionalUnlocked && (
                            <p className={styles.unlockHint}>
                                Optionale Videos werden freigeschaltet, sobald alle erforderlichen Videos angesehen wurden.
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
                                />
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className={styles.emptyState}>Keine optionalen Videos verfügbar.</p>
                )}
            </section>

            <section className={styles.sectionCard}>
                <header className={styles.sectionHeader}>
                    <div>
                        <h2>Gesehene Videos</h2>
                        <p className={styles.sectionHint}>Bereits abgeschlossene Inhalte.</p>
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
                                />
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className={styles.emptyState}>Noch keine Videos angesehen.</p>
                )}
            </section>
        </section>
    );
}

export default VideoCatalogPage;