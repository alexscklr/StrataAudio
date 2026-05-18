import { Link } from 'react-router-dom';
import styles from './CatalogItem.module.css';
import waveSVG from '@/assets/audio-curves.svg';
import { getPublicUrl } from '@/shared/utils/storage';
import type { CatalogItemStatus } from '@/shared/types/media';
import { formatDuration } from '@/shared/utils/timeFormating';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';


interface CatalogItemProps {
    thumbnailUrl?: string;
    title: string;
    videoid: string;
    hlsUrl: string;
    genre: string;
    description?: string;
    status?: CatalogItemStatus;
    duration?: number;
    prioritizeImage?: boolean;
}

function CatalogItem({ thumbnailUrl, title, videoid, hlsUrl, genre, description, status = "unlocked", duration, prioritizeImage = false }: CatalogItemProps) {
    const { t } = useTranslation();
    const [thumbnailLoaded, setThumbnailLoaded] = useState(false);
    const isLocked = status === "locked";
    const isWatched = status === "watched";
    const isInactive = isLocked || isWatched;
    const badgeLabel = isLocked ? t('videoCatalog.statusLocked') : isWatched ? t('videoCatalog.statusWatched') : null;

    return (
        <div className={styles.catalogItem + ' ' + (isInactive ? styles.inactive : '') + ' ' + (isLocked ? styles.locked : '')}>
            <Link
                to={isInactive ? "#" : `/videos/${videoid}`}
                state={isInactive ? undefined : { videoUrl: getPublicUrl(`${videoid}/${hlsUrl}`, "videos") }}
                aria-disabled={isInactive}
                className={styles.catalogLink}
            >
                {thumbnailUrl && (
                    <div className={styles.thumbnailContainer}>
                        <div className={styles.thumbnailFrame}>
                            <div
                                className={`${styles.thumbnailPlaceholder} ${thumbnailLoaded ? styles.thumbnailPlaceholderHidden : ''}`}
                                aria-hidden="true"
                            />
                            <img
                                src={getPublicUrl(`${videoid}/${thumbnailUrl}`, "videos")}
                                alt={t('videoCatalog.thumbnailAlt', { title })}
                                className={`${styles.thumbnail} ${isInactive ? styles.inactive : ''} ${thumbnailLoaded ? styles.thumbnailVisible : ''}`}
                                loading={prioritizeImage ? 'eager' : 'lazy'}
                                fetchPriority={prioritizeImage ? 'high' : 'auto'}
                                decoding="async"
                                onLoad={() => setThumbnailLoaded(true)}
                            />
                        </div>
                        {badgeLabel && <span className={styles.statusBadge + ' ' + (isLocked ? styles.lockedBadge : styles.watchedBadge)}>{badgeLabel}</span>}
                        {duration && <span className={styles.durationBadge}>{duration <= 120 ? '2x ' : ''}{formatDuration(duration)}</span>}
                    </div>
                )}
                <h2 className={styles.catalogTitle + ' ' + (isInactive ? styles.inactive : '')}>{title}</h2>
                <span className={styles.genreBadge + ' ' + (isInactive ? styles.inactiveBadge : '')}>{genre}</span>
                {description && (
                    <div className={styles.descriptionWrapper}>
                        <p className={styles.catalogDescription}>
                            {description.length > 103 ? description.substring(0, 100) + "..." : description}
                        </p>
                    </div>
                )}
            </Link>
            <img src={waveSVG} alt={t('videoCatalog.audioWaveAlt')} className={styles.waveBackground} />
        </div>
    );
}

export default CatalogItem;