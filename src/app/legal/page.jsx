import Link from 'next/link';
import styles from '../../styles/Textpage.module.scss';

export const metadata = {
    title: 'Legal',
};

export default function LegalPage() {
    return (
        <div className={styles["textpage"]}>
            <h2 className={styles["h2"]}>Legal</h2>
            <p className={styles["p"]}>
                We do not condone the posting of copyrighted material on the site.
                You must own everything you upload.
                We also reserve the right to suspend or delete your account should you violate any number of 4nderground&apos;s <Link href="/rules" prefetch={false}>rules</Link>.
            </p>
            <p><a href="mailto:info@4nderground.com">Contact us</a> for further inquiries.</p>
        </div>
    );
}