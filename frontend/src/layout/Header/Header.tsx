
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
        </header>
    );
}

export default Header;