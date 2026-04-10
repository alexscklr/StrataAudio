import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

function Footer() {


    return (
        <footer className={styles.footer}>
            <div className={styles.brand}>
                <span className={styles.brandname}>STRATA</span> 
                <span className={styles.tagline}>udio</span>
            </div>
            <ul className={styles.links}>
                    <li><Link to="/impressum">Impressum</Link></li>
                    <li><Link to="/datenschutz">Datenschutz</Link></li>
            </ul>
            <p className={styles.copyright}>&copy; 2026 Alexander Sickler - StrataAudio | Bachelorarbeit HSHL</p>
        </footer>
    );
}

export default Footer;