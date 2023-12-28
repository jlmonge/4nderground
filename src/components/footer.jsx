import Image from 'next/image';
import Link from 'next/link';
import styles from '../styles/Footer.module.scss';

export default function Footer() {
    // TODO: in future, may need other contact usernames like "support" and "sales"
    return (
        <footer className={styles["footer"]}>
            <div className={styles["extlogo"]}>
                <div className={styles["extlogo-l"]}>
                    <Image
                        src="logo1.svg"
                        alt="Left side of extended logo"
                        fill={true}
                    />
                </div>
                <div className={styles["extlogo-r"]}>
                    <Image
                        src="logo1.svg"
                        alt="Right side of extended logo"
                        fill={true}
                    />
                </div>
            </div>

            <a href="mailto:info@4nderground.com" className={styles["footer-link"]}>Contact Us</a>
            <Link href="/rules" className={styles["footer-link"]}>Site Rules</Link>
            <Link href="/legal" className={styles["footer-link"]}>Legal</Link>
            <Link href="/privacy" className={styles["footer-link"]}>Privacy</Link>
        </footer>
    );
}