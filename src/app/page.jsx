import Link from 'next/link';
import styles from "../styles/Homepage.module.scss";
import { terminalGrotesque } from './fonts';

export const metadata = {
    title: 'Discover the newest ideas in music | 4nderground',
};

export default function HomePage() {

    return (
        <div className={styles["hp"]}>
            <p className={styles["headline"]}>Be a part of the newest music the <span className={`${styles["tg-font-emph"]} ${terminalGrotesque.className}`}>Internet</span> has to offer.</p>
            <ul className={styles["features"]}>
                <li className={styles["features-item"]}>A big ol player that plays newest to oldest</li>
                <li className={styles["features-item"]}>One (1) track daily allowance</li>
                <li className={styles["features-item"]}>Tracks deleted after 24 hours</li>
                <li className={styles["features-item"]}>Comment sections</li>
                <li className={styles["features-item"]}>Random usernames and profile pictures</li>
                <li className={styles["features-item"]}>Share socials on your profile</li>

            </ul>
            <Link href="/register" className={styles["btn"]}><span className={`${styles["tg-font"]} ${terminalGrotesque.className}`}>Please sign me up!!</span></Link>
        </div>
    );
}