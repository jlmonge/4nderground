import styles from '../../styles/Textpage.module.scss';

export default function PrivacyPage() {
    return (
        <div className={styles["textpage"]}>
            <h2 className={styles["h2"]}>Privacy</h2>
            <p>We use cookies for authentication. <a href="mailto:info@4nderground.com">Contact us</a> for further inquiries.</p>
        </div>
    );
}