
import { useContext } from "react";
import { Link } from "react-router-dom";
import styles from "./Header.module.css";
import { AuthContext } from "@/features/auth/context/AuthContext";
import { useVideoCatalog } from "@/shared/hooks/useVideoCatalog";

function Header() {
    const { participantId } = useContext(AuthContext);
    const { data: catalog, isLoading } = useVideoCatalog(participantId);

    const mandatoryVideos = (catalog ?? []).filter((video) => video.is_mandatory);
    const mandatoryTotal = mandatoryVideos.length;
    const mandatoryWatched = mandatoryVideos.filter((video) => video.watched).length;
    const isEndSurveyUnlocked = mandatoryTotal === 0 || mandatoryWatched === mandatoryTotal;
    const endSurveyLabel = isLoading
        ? "Endumfrage"
        : `Endumfrage (${mandatoryWatched}/${mandatoryTotal})`;


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
                    <li><Link to="/videos">Videoauswahl</Link></li>
                    <li>
                        {isEndSurveyUnlocked ? (
                            <Link to="/endumfrage" className={styles.accentLink}>{endSurveyLabel}</Link>
                        ) : (
                            <span
                                className={`${styles.accentLink} ${styles.lockedLink}`}
                                aria-disabled="true"
                                title="Die Endumfrage wird freigeschaltet, sobald alle erforderlichen Videos abgeschlossen wurden."
                            >
                                {endSurveyLabel} · gesperrt
                            </span>
                        )}
                    </li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;