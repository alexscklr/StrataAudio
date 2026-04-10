import { Link } from 'react-router-dom';
import styles from './Footer.module.css';
import { useTranslation } from 'react-i18next';

function Footer() {
    const { t } = useTranslation();


    return (
        <footer className={styles.footer}>
            <div className={styles.brand}>
                <span className={styles.brandname}>STRATA</span> 
                <span className={styles.tagline}>udio</span>
            </div>
            <ul className={styles.links}>
                    <li><Link to="/impressum">{t('footer.imprint')}</Link></li>
                    <li><Link to="/datenschutz">{t('footer.privacy')}</Link></li>
            </ul>
            <p className={styles.copyright}>{t('footer.copyright')}</p>
        </footer>
    );
}

export default Footer;