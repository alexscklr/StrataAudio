
import { Link } from "react-router";
import styles from "./Header.module.css";

function Header() {


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
                    <li><Link to="/endumfrage" className={styles.accentLink}>Endumfrage</Link></li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;