import styles from '../../styles/Textpage.module.scss';

export default function PrivacyPage() {
    return (
        <div className={styles["textpage"]}>
            <h2 className={styles["h2"]}>Privacy</h2>
            <h3>How We Use Your Personal Data</h3>
            <p className={styles["p"]}>
                Registration requires you to provide your email address and a password.
                Your email address is used to identify you when you sign in and to send user-initiated emails concerning change of account information.
                We do not send marketing or promotional material.
                At your discretion, you may share up to three of your other websites and social media profiles to display on your profile.
            </p>
            <h3>Cookie Policy</h3>
            <p className={styles["p"]}>
                We only use cookies for storing your session information.
                They are set upon logging in and removed upon logging out.
                We do not track activity outside our site.
            </p>
            <p><a href="mailto:info@4nderground.com">Contact us</a> for further inquiries.</p>
        </div>
    );
}