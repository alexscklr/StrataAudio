import styles from './CatalogItem.module.css';
import waveSVG from '@/assets/audio-curves-around-square.svg';

interface CatalogItemProps {
    children: React.ReactNode;
}

function CatalogItem({ children }: CatalogItemProps) {
    return (
        <div className={styles.catalogItem}>
            {waveSVG && <img src={waveSVG} alt="Audio Wave Background" className={styles.waveBackground} />}
            {children}
        </div>
    );
}

export default CatalogItem;