import { Link } from 'react-router-dom';
import styles from './CatalogItem.module.css';
import waveSVG from '@/assets/audio-curves-around-square.svg';
import { getPublicUrl } from '@/shared/utils/storage';

interface CatalogItemProps {
    thumbnailUrl?: string;
    title: string;
    videoid: string;
    hlsUrl: string;
    genre: string;
    description?: string;
    watched?: boolean;
}

function CatalogItem({ thumbnailUrl, title, videoid, hlsUrl, genre, description, watched = false }: CatalogItemProps) {
    return (
        <div className={styles.catalogItem + ' ' + (watched ? styles.watched : '')}>
            <Link to={watched ? "#" : `/videos/${videoid}`} state={{ videoUrl: getPublicUrl(`${videoid}/${hlsUrl}`, "videos") }}>
                {thumbnailUrl && (
                    <div className={styles.thumbnailContainer}>
                        <img src={getPublicUrl(`${videoid}/${thumbnailUrl}`, "videos")} alt={`${title} thumbnail`} className={styles.thumbnail + ' ' + (watched ? styles.watched : '')} />
                        {watched && <span className={styles.watchedBadge}>Angeschaut</span>}
                    </div>
                )}
                <h2 className={styles.catalogTitle + ' ' + (watched ? styles.watched : '')}>{title}</h2>
                <span>{genre}</span>
                {description && (
                    <div className={styles.descriptionWrapper}>
                        <p className={styles.catalogDescription}>
                            {description.length > 103 ? description.substring(0, 100) + "..." : description}
                        </p>
                    </div>
                )}
            </Link>
            <img src={waveSVG} alt="Audio Wave" className={styles.waveBackground} />
        </div>
    );
}

export default CatalogItem;