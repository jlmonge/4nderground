import styles from '../../styles/Textpage.module.scss';

export default function LegalPage() {
    return (
        <div className={styles["textpage"]}>
            <h2 className={styles["h2"]}>Legal</h2>
            <p>We do not condone the posting of copyrighted material on the site. You must own everything you upload. <a href="mailto:info@4nderground.com">Contact us</a> for further inquiries.</p>
        </div>
    );
}