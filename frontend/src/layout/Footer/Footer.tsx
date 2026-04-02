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
                    <li><Link to="/kontakt">Kontakt</Link></li>
            </ul>
            <p className={styles.copyright}>&copy; 2024 StrataAudio. Alle Rechte vorbehalten.</p>
        </footer>
    );
}

export default Footer;