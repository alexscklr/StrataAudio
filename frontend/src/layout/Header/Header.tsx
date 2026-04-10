
import { useContext } from "react";
import { Link } from "react-router-dom";
import styles from "./Header.module.css";
import { AuthContext } from "@/features/auth/context/AuthContext";
import { useVideoCatalog } from "@/shared/hooks/useVideoCatalog";
import { useTranslation } from 'react-i18next';

function Header() {
    const { t, i18n } = useTranslation();
    const { participantId } = useContext(AuthContext);
    const { data: catalog, isLoading } = useVideoCatalog(participantId);

    const mandatoryVideos = (catalog ?? []).filter((video) => video.is_mandatory);
    const mandatoryTotal = mandatoryVideos.length;
    const mandatoryWatched = mandatoryVideos.filter((video) => video.watched).length;
    const isEndSurveyUnlocked = mandatoryTotal === 0 || mandatoryWatched === mandatoryTotal;
    const endSurveyLabel = isLoading
        ? t('nav.endSurvey')
        : `${t('nav.endSurvey')} (${mandatoryWatched}/${mandatoryTotal})`;

    const activeLanguage = i18n.resolvedLanguage?.startsWith('en') ? 'en' : 'de';
    const setLanguage = (language: 'de' | 'en') => {
        void i18n.changeLanguage(language);
    };


    return (
        <header className={styles.header}>
            <div className={styles.logo}>
                <Link to="/">
                    <span className={styles.brandname}>STRATA</span> 
                    <span className={styles.tagline}>udio</span>
                </Link>
            </div>
            <nav className={styles.nav}>
                <ul>
                    <li><Link to="/videos">{t('nav.videoCatalog')}</Link></li>
                    <li>
                        {isEndSurveyUnlocked ? (
                            <Link to="/endumfrage" className={styles.accentLink}>{endSurveyLabel}</Link>
                        ) : (
                            <span
                                className={`${styles.accentLink} ${styles.lockedLink}`}
                                aria-disabled="true"
                                title={t('nav.endSurveyLockedTitle')}
                            >
                                {endSurveyLabel} · {t('nav.endSurveyLockedSuffix')}
                            </span>
                        )}
                    </li>
                    <li>
                        <div className={styles.languageSwitch} aria-label={t('language.switchLabel')}>
                            <button
                                type="button"
                                className={`${styles.languageButton} ${activeLanguage === 'de' ? styles.languageButtonActive : ''}`}
                                onClick={() => { setLanguage('de'); }}
                            >
                                DE
                            </button>
                            <button
                                type="button"
                                className={`${styles.languageButton} ${activeLanguage === 'en' ? styles.languageButtonActive : ''}`}
                                onClick={() => { setLanguage('en'); }}
                            >
                                EN
                            </button>
                        </div>
                    </li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;