import Image from 'next/image';
import Link from 'next/link';
import styles from '../styles/Footer.module.scss';
import colors from '../styles/Colors.module.scss';
import { Logo1, BGBtm } from './svgs';

export default function Footer() {
    // TODO: in future, may need other contact usernames like "support" and "sales"
    return (
        <footer className={`${styles["footer"]} ${colors["gg-text"]}`}>
            <div className={styles["extlogo"]}>
                <div className={styles["extlogo-l"]}>
                    <Logo1 />
                </div>
                <div className={styles["extlogo-r"]}>
                    <Logo1 />
                </div>
            </div>
            <div className={styles["links"]}>
                <a href="mailto:info@4nderground.com" className={styles["footer-link"]}>Contact Us</a>
                <Link href="/rules" className={styles["footer-link"]}>Site Rules</Link>
                <Link href="/legal" className={styles["footer-link"]}>Legal</Link>
                <Link href="/privacy" className={styles["footer-link"]}>Privacy</Link>
            </div>
        </footer>
    );
}